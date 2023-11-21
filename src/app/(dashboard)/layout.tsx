import Navigation from "~/components/Navigation/Navigation";
import Profile from "~/components/Navigation/Profile";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navigation>
        <Profile />
      </Navigation>
      <div className="min-h-screen sm:pl-60">
        <main className="bg-background py-6 px-4 lg:gap-10 lg:py-8 lg:px-6 grid">
          {children}
        </main>
      </div>
    </>
  );
}
