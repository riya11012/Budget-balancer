import Link from "next/link";
import {
  LayoutDashboard,
  User,
  Receipt,
  WalletCards,
  Target,
  Bot,
  Settings,
  Heart
} from "lucide-react";
import { signOut } from "../auth";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/transactions", label: "Transactions", icon: Receipt },
  { href: "/budgets", label: "Budgets", icon: WalletCards },
  { href: "/affordability", label: "Can I Afford This?", icon: Target },
  { href: "/affordability-rules", label: "Rules", icon: Settings },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
];

export function AppSidebar() {
  return (
    <aside className="fixed left-0 top-0 hidden h-screen w-64 border-r bg-white p-6 md:block dark:border-zinc-800 dark:bg-zinc-950">
      <h1 className="text-2xl font-bold">Budget Balancer</h1>
      <p className="mt-1 text-sm text-white-600">
        Spend smarter, not harder.
      </p>

      <nav className="mt-8 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium dark:text-white dark:hover:bg-gray-800 text-black hover:bg-slate-100 hover:text-black"
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
            
          );
          
        })}
      </nav>
      <form
  action={async () => {
    "use server";
    await signOut({ redirectTo: "/login" });
  }}
  className="mt-10"
>
  <button className="w-full rounded-xl bg-black px-4 py-3 text-sm font-medium text-white dark:bg-white dark:text-black">
    Logout
  </button>
</form>
    </aside>
  );
}