import { redirect } from "next/navigation";

export default function page() {
  // redirect to default page, in case someone tries to access this page directly
  // redirect to user, because only admin has access to tennant settings
  redirect("/settings/user");
}
