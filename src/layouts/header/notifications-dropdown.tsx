"use client";
import { useState } from "react";
import Dropdown from "@/components/ui/dropdown";
import IconBellBing from "@/components/icon/icon-bell-bing";
import IconXCircle from "@/components/icon/icon-x-circle";
import IconInfoCircle from "@/components/icon/icon-info-circle";
import Image from "next/image";

export default function NotificationsDropdown() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      profile: "user-profile.jpeg",
      message:
        '<strong class="text-sm mr-1">John Doe</strong>invite you to <strong>Prototyping</strong>',
      time: "45 min ago",
    },
    {
      id: 2,
      profile: "profile-34.jpeg",
      message:
        '<strong class="text-sm mr-1">Adam Nolan</strong>mentioned you to <strong>UX Basics</strong>',
      time: "9h Ago",
    },
  ]);

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <Dropdown
      offset={[0, 8]}
      placement="bottom-end"
      btnClassName="relative block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
      button={
        <span>
          <IconBellBing />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="absolute -top-[3px] inline-flex h-full w-full animate-ping rounded-full bg-success/50 opacity-75 -left-[3px]"></span>
              <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-success"></span>
            </span>
          )}
        </span>
      }
    >
      <ul className="w-[300px] divide-y !py-0 text-dark dark:divide-white/10 dark:text-white-dark sm:w-[350px]">
        <li>
          <div className="flex items-center justify-between px-4 py-2 font-semibold">
            <h4 className="text-lg">Notifications</h4>
            {notifications.length > 0 && (
              <span className="badge bg-primary/80">
                {notifications.length} New
              </span>
            )}
          </div>
        </li>
        {notifications.length > 0 ? (
          <>
            {notifications.map((notification) => (
              <li key={notification.id} onClick={(e) => e.stopPropagation()}>
                <div className="group flex items-center px-4 py-2">
                  <Image
                    className="h-12 w-12 rounded-full object-cover"
                    src={`/assets/images/${notification.profile}`}
                    alt="profile"
                    width={40}
                    height={40}
                  />
                  <div className="flex flex-auto ltr:pl-3 rtl:pr-3">
                    <div className="ltr:pr-3 rtl:pl-3">
                      <h6
                        dangerouslySetInnerHTML={{
                          __html: notification.message,
                        }}
                      />
                      <span className="block text-xs font-normal dark:text-gray-500">
                        {notification.time}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="text-neutral-300 opacity-0 hover:text-danger group-hover:opacity-100 ltr:ml-auto rtl:mr-auto"
                      onClick={() => removeNotification(notification.id)}
                    >
                      <IconXCircle />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </>
        ) : (
          <li onClick={(e) => e.stopPropagation()}>
            <div className="!grid min-h-[200px] place-content-center text-lg">
              <IconInfoCircle fill={true} className="h-10 w-10 text-primary" />
              No data available.
            </div>
          </li>
        )}
      </ul>
    </Dropdown>
  );
}
