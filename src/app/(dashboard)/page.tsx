// import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export default async function Home() {
  const hello = await api.post.hello.query({ text: "from tRPC" });
  // const session = await getServerAuthSession();

  return <p className="text-primary">{hello.greeting}</p>;
}
