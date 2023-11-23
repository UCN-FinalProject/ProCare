"use client";
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/YAQkMc5zB9h
 */
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function ErrorPage() {
  const router = useRouter();
  return (
    <section className="flex flex-col items-center justify-center h-[92svh] dark:bg-gray-800">
      <div className="space-y-4">
        <IconError className="w-12 h-12 text-red-500 dark:text-red-400" />
        <h1 className="font-semibold text-3xl text-gray-800 dark:text-white">
          Oops! Something went wrong.
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          We&apos;re sorry, but we&apos;re having some technical issues. Please
          try again later.
        </p>
        <div className="flex gap-2">
          <Button
            className="text-gray-800 dark:text-white border-gray-800 dark:border-white"
            variant="outline"
            onClick={() => router.back()}
          >
            Go Back
          </Button>
          <Button
            className="text-white bg-gray-800 dark:bg-white"
            onClick={() => router.push("/")}
          >
            Go Home
          </Button>
        </div>
      </div>
    </section>
  );
}

function IconError(props?: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 2 1.88 1.88" />
      <path d="M14.12 3.88 16 2" />
      <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
      <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
      <path d="M12 20v-9" />
      <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
      <path d="M6 13H2" />
      <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
      <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
      <path d="M22 13h-4" />
      <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
    </svg>
  );
}
