import { getServerAuthSession } from "~/server/auth";
import TableDoctorPatients from "./table";

export default async function Page({
  params,
  searchParams,
}: Readonly<{
  params: { id: string };
  searchParams?: { page?: string };
}>) {
  const session = await getServerAuthSession();
  const page = Number(searchParams?.page) > 0 ? Number(searchParams?.page) : 1;

  return (
    <TableDoctorPatients
      doctorId={parseInt(params.id)}
      page={page}
      session={session!}
    />
  );
}
