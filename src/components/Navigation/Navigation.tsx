"use client";

import Link from "next/link";
import {
  PersonStanding,
  LayoutDashboard,
  Menu,
  Stethoscope,
  Settings,
  Activity,
  Syringe,
  Heart,
  Shield,
  User,
} from "lucide-react";
import {
  useParams,
  usePathname,
  useSelectedLayoutSegments,
} from "next/navigation";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { cn } from "~/lib/utils";
import Logo from "./Logo";

export default function Nav({ children }: { children: ReactNode }) {
  const segments = useSelectedLayoutSegments();
  const { id } = useParams() as { id?: string };

  const [siteId, setSiteId] = useState<string | null>();

  const tabs = useMemo(() => {
    // TODO: handle additional conditions
    // if (segments[0] === "site" && id) {
    //   return [
    //     {
    //       name: "Back to All Sites",
    //       href: "/sites",
    //       icon: <ArrowLeft width={18} />,
    //     },
    //     {
    //       name: "Posts",
    //       href: `/site/${id}`,
    //       isActive: segments.length === 2,
    //       icon: <Newspaper width={18} />,
    //     },
    //     {
    //       name: "Analytics",
    //       href: `/site/${id}/analytics`,
    //       isActive: segments.includes("analytics"),
    //       icon: <BarChart3 width={18} />,
    //     },
    //     {
    //       name: "Settings",
    //       href: `/site/${id}/settings`,
    //       isActive: segments.includes("settings"),
    //       icon: <Settings width={18} />,
    //     },
    //   ];
    // }
    // else if (segments[0] === "post" && id) {
    //   return [
    //     {
    //       name: "Back to All Posts",
    //       href: siteId ? `/site/${siteId}` : "/sites",
    //       icon: <ArrowLeft width={18} />,
    //     },
    //     {
    //       name: "Editor",
    //       href: `/post/${id}`,
    //       isActive: segments.length === 2,
    //       icon: <Edit3 width={18} />,
    //     },
    //     {
    //       name: "Settings",
    //       href: `/post/${id}/settings`,
    //       isActive: segments.includes("settings"),
    //       icon: <Settings width={18} />,
    //     },
    //   ];
    // }
    return [
      {
        name: "Dashboard",
        href: "/",
        isActive: segments.length === 0,
        icon: <LayoutDashboard width={18} />,
      },
      {
        name: "Patients",
        href: "/patients",
        isActive: segments[0] === "patients",
        icon: <PersonStanding width={18} />,
      },
      {
        name: "Doctors",
        href: "/doctors",
        isActive: segments[0] === "doctors",
        icon: <Stethoscope width={18} />,
      },
      {
        name: "Healthcare providers",
        href: "/healthcare-providers",
        isActive: segments[0] === "healthcare-providers",
        icon: <Heart width={18} />,
      },
      {
        name: "Insurance providers",
        href: "/insurance-providers",
        isActive: segments[0] === "insurance-providers",
        icon: <Shield width={18} />,
      },
      {
        name: "Procedures",
        href: "/procedures",
        isActive: segments[0] === "procedures",
        icon: <Syringe width={18} />,
      },
      {
        name: "Diagnoses",
        href: "/diagnoses",
        isActive: segments[0] === "diagnoses",
        icon: <Activity width={18} />,
      },
      {
        name: "Users",
        href: "/users",
        isActive: segments[0] === "users",
        icon: <User width={18} />,
      },
      {
        name: "Settings",
        href: "/settings/tennant",
        isActive: segments[0] === "settings",
        icon: <Settings width={18} />,
      },
    ];
  }, [segments, id, siteId]);

  const [showSidebar, setShowSidebar] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    // hide sidebar on path change
    setShowSidebar(false);
  }, [pathname]);

  return (
    <>
      <button
        className={cn(
          "fixed z-20",
          // left align for Editor, right align for other pages
          segments[0] === "post" && segments.length === 2 && !showSidebar
            ? "left-5 top-5"
            : "right-5 top-7",
          "sm:hidden",
        )}
        onClick={() => setShowSidebar(!showSidebar)}
      >
        <Menu width={20} />
      </button>
      <div
        className={cn(
          "transform",
          showSidebar ? "w-full translate-x-0" : "-translate-x-full",
          "fixed z-10 flex h-full flex-col justify-between border-r border-stone-200 bg-stone-100 p-4 transition-all dark:border-stone-700 dark:bg-stone-900 sm:w-60 sm:translate-x-0",
        )}
      >
        <div className="grid gap-2">
          <div className="flex items-center space-x-2 rounded-lg px-2 py-1.5">
            <Link
              href="/"
              className="rounded-lg p-2 hover:bg-stone-200 dark:hover:bg-stone-700"
            >
              <Logo />
            </Link>
          </div>
          <div className="grid gap-1">
            {tabs.map(({ name, href, isActive, icon }) => (
              <Link
                key={name}
                href={href}
                className={cn(
                  "flex items-center space-x-3",
                  isActive && "bg-stone-200 text-black dark:bg-stone-700",
                  "rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800",
                )}
              >
                {icon}
                <span className="text-sm font-medium">{name}</span>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <div className="my-2 border-t border-stone-200 dark:border-stone-700" />
          {children}
        </div>
      </div>
    </>
  );
}
