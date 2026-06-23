"use client"

type OrderLookupFormProps = {
  orderId: string
  email: string
  loading: boolean
  error: string | null
  onOrderIdChange: (value: string) => void
  onEmailChange: (value: string) => void
  onSubmit: (event: React.FormEvent) => void
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  )
}

export function OrderLookupForm({
  orderId,
  email,
  loading,
  error,
  onOrderIdChange,
  onEmailChange,
  onSubmit,
}: OrderLookupFormProps) {
  return (
    <div className="border border-line-gray bg-white p-6 shadow-sm sm:p-8">
      <form onSubmit={onSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-near-black">Order ID</label>
          <input
            type="text"
            value={orderId}
            onChange={(event) => onOrderIdChange(event.target.value.trim())}
            placeholder="e.g. 01JMHK7X8Y..."
            className="w-full border border-line-gray bg-white px-4 py-3 text-sm text-near-black transition-colors placeholder:text-gray-400 focus:border-orbit-blue focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-near-black">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(event) => onEmailChange(event.target.value.trim())}
            placeholder="email@example.com"
            className="w-full border border-line-gray bg-white px-4 py-3 text-sm text-near-black transition-colors placeholder:text-gray-400 focus:border-orbit-blue focus:outline-none"
            required
          />
        </div>

        {error && (
          <div className="border border-red-100 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 bg-near-black py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-blue-hover disabled:opacity-70"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <SearchIcon />
              <span>Track Order</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
