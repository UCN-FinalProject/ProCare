import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import NewConditionForm from "./NewConditionForm";
import { api } from "~/trpc/server";

export default async function NewCondition({
  patientID,
}: {
  patientID: string;
}) {
  const conditions = await api.healthCondition.getMany.query({
    limit: 100,
    offset: 0,
  });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">Add condition</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add condition to a patient</SheetTitle>
          <SheetDescription>
            Assign a condition to a patient. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <NewConditionForm
          patientID={patientID}
          conditions={conditions.result}
        />
      </SheetContent>
    </Sheet>
  );
}
