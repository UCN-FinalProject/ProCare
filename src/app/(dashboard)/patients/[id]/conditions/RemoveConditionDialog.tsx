"use client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import type { Session } from "next-auth";

export default function RemoveConditionDialog({
  id,
  session,
}: {
  id: number;
  session: Session;
}) {
  const removeCondition = api.patient.removeCondition.useMutation();
  const router = useRouter();

  const handleClick = () => {
    removeCondition.mutate(
      { patientConditionID: id, userID: session.user.id },
      {
        // eslint-disable-next-line
        onSuccess: async () => {
          toast.success("Condition was successfully removed.");
          router.refresh();
        },
        onError: (err) => toast.error(err.message),
      },
    );
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="xs">
          Remove
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the condition from the patient&apos;s
            record. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={() => handleClick()}
            onKeyDown={handleClick}
          >
            <AlertDialogAction className="bg-transparent hover:bg-transparent">
              Remove
            </AlertDialogAction>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
