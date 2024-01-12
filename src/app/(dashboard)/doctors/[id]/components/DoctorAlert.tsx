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

type Variant = "active" | "inactive";

export default function DoctorAlert({
  variant,
  id,
}: {
  variant: Variant;
  id: number;
}) {
  const setActive = api.doctor.setActive.useMutation();
  const setInactive = api.doctor.setInactive.useMutation();

  const router = useRouter();

  const handleClick = async () => {
    if (variant === "inactive") {
      await setActive.mutateAsync(
        { id },
        {
          onSuccess: () => {
            toast.success(`Doctor's status was set to active`);
            router.refresh();
          },
          onError: (err) => toast.error(err.message),
        },
      );
    } else {
      await setInactive.mutateAsync(
        { id },
        {
          onSuccess: () => {
            toast.success(`Doctor's status was set to inactive`);
            router.refresh();
          },
          onError: (err) => toast.error(err.message),
        },
      );
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary">
          {variant === "active" ? "Set inactive" : "Set active"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will set doctor&apos;s status to{" "}
            {variant === "active" ? "inactive" : "active"}. You can change the
            status at any time.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <div onClick={() => handleClick()} onKeyDown={handleClick}>
            <AlertDialogAction>Confirm</AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
