import { auth } from "../auth";
import { Bell } from "lucide-react";
import { X } from "lucide-react";
import { removeNotification } from "../actions/notification.action";

import {
  getNotificationsByUserId,
  getUnreadNotificationCount,
} from "../repositories/notification.repository";

export async function NotificationBell() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  const notifications = await getNotificationsByUserId(session.user.id);
  const unreadCount = await getUnreadNotificationCount(session.user.id);
  return (
    <div className="fixed right-6 top-10 z-50">
      <details className="relative">
        <summary className="flex h-12 w-12 cursor-pointer list-none items-center justify-center rounded-full border bg-white text-black shadow-sm dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
          <Bell className="h-5 w-5" />
  
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </summary>
  
        <div className="absolute right-0 mt-3 w-80 rounded-2xl border bg-white p-4 text-black shadow-xl dark:border-zinc-800 dark:bg-zinc-950 dark:text-white">
          <h3 className="font-semibold text-black dark:text-white">
            Notifications
          </h3>
  
          <div className="mt-4 space-y-3">
            {notifications.length === 0 && (
              <p className="text-sm text-slate-500 dark:text-zinc-400">
                No notifications yet.
              </p>
            )}
  
  {notifications.map((notification) => (
  <div
    key={notification.id}
    className="rounded-xl bg-slate-50 p-3 dark:bg-zinc-900"
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-medium text-black dark:text-white">
          {notification.title}
        </p>

        <p className="mt-1 text-sm text-slate-600 dark:text-zinc-400">
          {notification.message}
        </p>
      </div>

      <form action={removeNotification.bind(null, notification.id)}>
        <button
          className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-red-600 dark:hover:bg-zinc-800"
        >
          <X className="h-4 w-4" />
        </button>
      </form>
    </div>
  </div>
))}
          </div>
        </div>
      </details>
    </div>
  );
}