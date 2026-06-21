type HeatmapDay = {
    date: string;
    total: number;
  };
  
  export function SpendingHeatmap({
    data,
  }: {
    data: HeatmapDay[];
  }) {
    const days = getLast90Days();
  
    const map = new Map(
      data.map((item) => [
        new Date(item.date).toISOString().slice(0, 10),
        item.total,
      ])
    );
  
    function getLevel(amount: number) {
      if (amount === 0) return "bg-slate-100 dark:bg-zinc-900";
      if (amount < 500) return "bg-green-200 dark:bg-green-950";
      if (amount < 1500) return "bg-green-400 dark:bg-green-800";
      if (amount < 3000) return "bg-green-600 dark:bg-green-600";
      return "bg-green-900 dark:bg-green-400";
    }
  
    return (
      <div className="rounded-3xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-xl font-semibold text-black dark:text-white">
          Spending Heatmap
        </h2>
  
        <p className="mt-1 text-sm text-slate-500 dark:text-zinc-400">
          Daily spending pattern for the last 90 days.
        </p>
  
        <div className="mt-6 grid grid-cols-15 gap-2">
          {days.map((day) => {
            const key = day.toISOString().slice(0, 10);
            const amount = map.get(key) || 0;
  
            return (
              <div
                key={key}
                className="group relative h-5 w-5"
              >
                <div
                  className={`h-5 w-5 rounded transition hover:scale-125 ${getLevel(
                    amount
                  )}`}
                />
  
                <div className="pointer-events-none absolute bottom-7 left-1/2 z-50 hidden w-max -translate-x-1/2 rounded-lg bg-black px-3 py-2 text-xs text-white shadow-lg group-hover:block dark:bg-white dark:text-black">
                  <p>{key}</p>
                  <p>₹{amount.toLocaleString("en-IN")} spent</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  
  function getLast90Days() {
    const days: Date[] = [];
  
    for (let i = 89; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      days.push(date);
    }
  
    return days;
  }