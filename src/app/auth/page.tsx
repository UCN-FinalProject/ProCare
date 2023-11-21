import { getServerAuthSession } from "~/server/auth";
import { redirect } from "next/navigation";
import SignIn from "./form";
import Logo from "~/components/Navigation/Logo";

export default async function SignInPage() {
  const session = await getServerAuthSession();
  if (session?.user?.id) {
    return redirect("/");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4">
      <Logo width="130" height="30" />
      <SignIn />
    </main>
  );
}
