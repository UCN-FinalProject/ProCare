import { ReactNode, Suspense } from "react";
import Navigation from "~/components/Navigation/Navigation";
import Profile from "~/components/Navigation/Profile";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navigation>
        <Profile />
      </Navigation>
      <div className="min-h-screen sm:pl-60">{children}</div>
    </>
  );
}
