import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
// import NewConditionForm from "./NewConditionForm";
import { api } from "~/trpc/server";
import NewDoctorForm from "./NewDoctorForm";

export default async function NewDoctor({
  healthCareProviderID,
}: Readonly<{
  healthCareProviderID: number;
}>) {
  const doctors = await api.doctor.getMany({
    limit: 100,
    offset: 0,
    isActive: true,
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">Add doctor</Button>
      </SheetTrigger>
      {/* @ts-expect-error props? */}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add doctor to a healthcare provider</SheetTitle>
          <SheetDescription>
            Assign a doctor to a healthcare provider. This will allow the doctor
            to see the healthcare provider&apos;s patients.
          </SheetDescription>
        </SheetHeader>
        <NewDoctorForm
          healthCareProviderID={healthCareProviderID}
          doctors={doctors.result}
        />
      </SheetContent>
    </Sheet>
  );
}
