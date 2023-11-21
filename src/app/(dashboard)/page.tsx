import { api } from "~/trpc/server";

export default async function Home() {
  const hello = await api.example.hello.query({ text: "from tRPC" });

  return <p className="text-primary">{hello.greeting}</p>;
}
