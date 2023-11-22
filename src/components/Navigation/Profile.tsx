import Link from "next/link";
import Image from "next/image";
import LogoutButton from "./LogOutButton";
import { getServerAuthSession } from "~/server/auth";

export default async function Profile() {
  const session = await getServerAuthSession();

  return (
    <div className="flex w-full items-center justify-between">
      <Link
        href="/settings/account"
        className="flex w-full flex-1 items-center space-x-3 rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800"
      >
        <Image
          src="/doctor.png"
          width={70}
          height={70}
          alt={`${session?.user.name ?? "User"}'s avatar`}
          className="h-6 w-6 rounded-full"
        />
        <span className="truncate text-sm font-medium">
          {session?.user.name}
        </span>
      </Link>
      <LogoutButton />
    </div>
  );
}
