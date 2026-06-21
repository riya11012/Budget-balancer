import { auth } from "../../auth";

import {
  addWishlistItem,
  removeWishlistItem,
  refreshWishlistItem,
} from "../../actions/wishlist.action";

import { getWishlistItemsWithProgress } from "../../repositories/wishlist.repository";

export default async function WishlistPage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-slate-50 p-10 text-black dark:bg-black dark:text-white">
        Unauthorized
      </div>
    );
  }

  const items = await getWishlistItemsWithProgress(session.user.id);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 dark:bg-black">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Wishlist
          </h1>

          <p className="mt-2 text-slate-600 dark:text-zinc-400">
            Save products and track how close you are to buying them.
          </p>
        </div>

        <form
          action={addWishlistItem}
          className="grid gap-4 rounded-2xl border bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 md:grid-cols-2"
        >
          <input
            name="productName"
            placeholder="Product name e.g. MacBook Air"
            className="w-full rounded-xl border px-4 py-3 text-black dark:border-zinc-800 dark:bg-black dark:text-white dark:placeholder:text-zinc-500"
            required
          />

          <input
            name="productUrl"
            placeholder="Product URL"
            className="w-full rounded-xl border px-4 py-3 text-black dark:border-zinc-800 dark:bg-black dark:text-white dark:placeholder:text-zinc-500"
          />

          <input
            name="category"
            placeholder="Category e.g. Electronics"
            className="w-full rounded-xl border px-4 py-3 text-black dark:border-zinc-800 dark:bg-black dark:text-white dark:placeholder:text-zinc-500"
            required
          />

          <input
            name="targetPrice"
            type="number"
            placeholder="Price e.g. 85000"
            className="w-full rounded-xl border px-4 py-3 text-black dark:border-zinc-800 dark:bg-black dark:text-white dark:placeholder:text-zinc-500"
            required
          />

          <select
            name="priority"
            defaultValue="medium"
            className="w-full rounded-xl border px-4 py-3 text-black dark:border-zinc-800 dark:bg-black dark:text-white"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <button className="w-full rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
            Add to Wishlist
          </button>
        </form>

        <div className="grid gap-5 md:grid-cols-2">
          {items.length === 0 && (
            <div className="rounded-2xl border bg-white p-8 text-slate-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
              No wishlist items yet.
            </div>
          )}

          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-black dark:text-white">
                    {item.product_name}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
                    {item.category} • {item.priority} priority
                  </p>
                </div>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700 dark:bg-zinc-900 dark:text-zinc-300">
                  {item.status}
                </span>
              </div>

              <p className="mt-6 text-3xl font-bold text-black dark:text-white">
                ₹{Number(item.target_price).toLocaleString("en-IN")}
              </p>

              <div className="mt-6">
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-zinc-400">
                    {item.affordabilityPercentage}% affordable
                  </span>

                  <span className="font-medium text-black dark:text-white">
                    ₹{Number(item.amountToGo).toLocaleString("en-IN")} to go
                  </span>
                </div>

                <div className="h-3 rounded-full bg-slate-200 dark:bg-zinc-800">
                  <div
                    className="h-3 rounded-full bg-black dark:bg-white"
                    style={{
                      width: `${item.affordabilityPercentage}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-sm text-slate-500 dark:text-zinc-400">
                  {item.estimatedWeeks === 0
                    ? "You can afford this now."
                    : item.estimatedWeeks !== null
                    ? `At current savings rate, in ~${item.estimatedWeeks} weeks`
                    : "Add salary and rules to estimate time."}
                </p>
              </div>

              <div className="mt-6 grid gap-3 text-sm">
                <Info
                  label="Live Stock"
                  value={
                    item.stock_quantity === null ||
                    item.stock_quantity === undefined
                      ? "Not entered"
                      : `${item.stock_quantity} left`
                  }
                />
              </div>

              {item.stock_quantity !== null &&
                item.stock_quantity !== undefined &&
                item.stock_quantity > 0 &&
                item.stock_quantity <= 3 && (
                  <div className="mt-5 rounded-xl bg-red-50 p-4 text-orange-700 dark:bg-red-900  dark:text-red-300">
                    Low stock alert: only {item.stock_quantity} left.
                  </div>
                )}

              {item.stock_quantity === 0 && (
                <div className="mt-5 rounded-xl bg-red-50 p-4 text-red-700 dark:bg-red-950 dark:text-red-300">
                  This item is currently out of stock.
                </div>
              )}

              <form
                action={async (formData) => {
                  "use server";

                  await refreshWishlistItem(
                    item.id,
                    item.product_name,
                    item.category,
                    Number(item.target_price),
                    "",
                    formData.get("stockQuantity")
                      ? Number(formData.get("stockQuantity"))
                      : null
                  );
                }}
                className="mt-6 space-y-3"
              >
                <input
                  name="stockQuantity"
                  type="number"
                  placeholder="Stock quantity e.g. 2"
                  className="w-full rounded-xl border px-4 py-3 text-black dark:border-zinc-800 dark:bg-black dark:text-white dark:placeholder:text-zinc-500"
                />

                <button className="w-full rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200">
                  Check Affordability & Stock
                </button>
              </form>

              <div className="mt-6 flex gap-3">
                {item.product_url && (
                  <a
                    href={item.product_url}
                    target="_blank"
                    className="flex-1 rounded-xl bg-black p-3 text-center font-medium text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                  >
                    Open Product
                  </a>
                )}

                <form action={removeWishlistItem.bind(null, item.id)}>
                  <button className="rounded-xl border border-red-200 px-4 py-3 text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950">
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between rounded-xl bg-slate-50 p-3 dark:bg-black">
      <span className="text-slate-500 dark:text-zinc-400">{label}</span>
      <span className="font-medium text-black dark:text-white">{value}</span>
    </div>
  );
}