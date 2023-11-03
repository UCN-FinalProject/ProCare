// import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "./LogOutButton";

export default async function Profile() {
  // TODO: implement once auth is implemented
  //   const session = await getSession();
  //   if (!session?.user) {
  //     redirect("/login");
  //   }

  return (
    <div className="flex w-full items-center justify-between">
      <Link
        href="/settings/account"
        className="flex w-full flex-1 items-center space-x-3 rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800"
      >
        {/* TODO: replace with doctor image and user details */}
        <Image
          src={`https://avatar.vercel.sh/tomassabol2@gmail.com`}
          width={40}
          height={40}
          alt={"Tomáš's Sabol avatar" ?? "User avatar"}
          className="h-6 w-6 rounded-full"
        />
        {/* TODO: replace with user's name */}
        <span className="truncate text-sm font-medium">Tomáš Sabol</span>
      </Link>
      <LogoutButton />
    </div>
  );
}
