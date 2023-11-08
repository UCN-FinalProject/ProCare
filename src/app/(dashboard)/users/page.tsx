import { Suspense } from "react";
import AuthShowcase from "~/app/_components/auth";

export default function Home() {
  return (
    <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
      <Suspense fallback={<div>Loading...</div>}>
        <AuthShowcase />
      </Suspense>
    </div>
  );
}
