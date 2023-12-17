import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { api } from "~/trpc/server";
import NewProcedureForm from "./NewProcedureForm";

export default async function NewProcedure({
  patientID,
}: Readonly<{
  patientID: string;
}>) {
  const procedures = await api.procedure.getMany.query({
    limit: 100,
    offset: 0,
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">Log new procedure</Button>
      </SheetTrigger>
      {/* @ts-expect-error props? */}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Log a procedure for a patient</SheetTitle>
          <SheetDescription>
            Assign a procedure to a patient. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <NewProcedureForm
          patientID={patientID}
          procedures={procedures.result}
        />
      </SheetContent>
    </Sheet>
  );
}
