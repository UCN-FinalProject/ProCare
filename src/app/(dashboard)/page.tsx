// import { getServerAuthSession } from "~/server/auth";
import Main from "~/components/Main";
import { api } from "~/trpc/server";

export default async function Home() {
  const hello = await api.post.hello.query({ text: "from tRPC" });
  // const session = await getServerAuthSession();

  return (
    <Main>
      <p className="text-primary">{hello.greeting}</p>
    </Main>
  );
}
