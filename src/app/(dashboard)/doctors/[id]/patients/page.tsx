import { getServerAuthSession } from "~/server/auth";
import TableDoctorPatients from "./table";
import PageHeader from "~/components/Headers/PageHeader";

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
    <>
      <PageHeader className="text-md font-medium text-gray-700">
        Patients assigned to this doctor
      </PageHeader>
      <TableDoctorPatients
        doctorId={parseInt(params.id)}
        page={page}
        session={session!}
      />
    </>
  );
}
