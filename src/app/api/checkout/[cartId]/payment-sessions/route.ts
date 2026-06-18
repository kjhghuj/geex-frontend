import { NextRequest, NextResponse } from 'next/server';

const MEDUSA_BACKEND_URL =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    (process.env.NODE_ENV === 'development' ? 'http://localhost:9030' : 'https://api.geexfans.com');
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || '';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ cartId: string }> }
) {
    try {
        const { cartId } = await params;
        const body = await request.json();
        const { provider_id } = body;

        // Step 1: Get the cart to check if payment_collection exists
        const cartResponse = await fetch(
            `${MEDUSA_BACKEND_URL}/store/carts/${cartId}?fields=+payment_collection.payment_sessions`,
            {
                headers: {
                    'x-publishable-api-key': PUBLISHABLE_API_KEY,
                },
            }
        );

        if (!cartResponse.ok) {
            const errorData = await cartResponse.json();
            console.error('[API Route] Failed to get cart:', errorData);
            return NextResponse.json(errorData, { status: cartResponse.status });
        }

        const cartData = await cartResponse.json();
        let paymentCollectionId = cartData.cart?.payment_collection?.id;

        // Step 2: Create payment collection if it doesn't exist
        if (!paymentCollectionId) {
            const createCollectionResponse = await fetch(
                `${MEDUSA_BACKEND_URL}/store/payment-collections`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-publishable-api-key': PUBLISHABLE_API_KEY,
                    },
                    body: JSON.stringify({
                        cart_id: cartId,
                    }),
                }
            );

            if (!createCollectionResponse.ok) {
                const errorData = await createCollectionResponse.json();
                console.error('[API Route] Failed to create payment collection:', errorData);
                return NextResponse.json(errorData, { status: createCollectionResponse.status });
            }

            const collectionData = await createCollectionResponse.json();
            paymentCollectionId = collectionData.payment_collection?.id;
        }

        // Step 3: Initialize payment session
        const sessionResponse = await fetch(
            `${MEDUSA_BACKEND_URL}/store/payment-collections/${paymentCollectionId}/payment-sessions`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-publishable-api-key': PUBLISHABLE_API_KEY,
                },
                body: JSON.stringify({
                    provider_id: provider_id || 'pp_stripe_stripe',
                }),
            }
        );

        if (!sessionResponse.ok) {
            const errorData = await sessionResponse.json();
            console.error('[API Route] Failed to create payment session:', errorData);
            return NextResponse.json(errorData, { status: sessionResponse.status });
        }

        const sessionData = await sessionResponse.json();

        // Get client secret from the response (which returns payment_collection)
        // Medusa v2 returns { payment_collection: { ... } }
        const sessions = sessionData.payment_collection?.payment_sessions;
        const targetProvider = provider_id || 'pp_stripe_stripe';

        const session = sessions?.find(
            (s: any) => s.provider_id === targetProvider
        ) || sessions?.[0]; // Fallback to first if not found (should be there)

        const clientSecret = session?.data?.client_secret;

        return NextResponse.json({
            cart: cartData.cart,
            payment_session: session,
            client_secret: clientSecret,
        });

    } catch (error: any) {
        console.error('[API Route] Payment sessions error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
