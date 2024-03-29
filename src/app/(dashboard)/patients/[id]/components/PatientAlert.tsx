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

export default function PatientAlert({
  variant,
  id,
}: Readonly<{
  variant: Variant;
  id: string;
}>) {
  const setActive = api.patient.setActive.useMutation();
  const setInactive = api.patient.setInactive.useMutation();
  const router = useRouter();

  const handleClick = async () => {
    if (variant === "inactive") {
      await setActive.mutateAsync(
        { id },
        {
          onSuccess: () => {
            toast.success(`Patient's status was set to active`);
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
            toast.success(`Patient's status was set to inactive`);
            router.refresh();
          },
          onError: (err) => toast.error(err.message),
        },
      );
    }
  };

  return (
    <AlertDialog>
      {/* @ts-expect-error prop? */}
      <AlertDialogTrigger asChild>
        <Button variant="secondary">
          {variant === "active" ? "Set inactive" : "Set active"}
        </Button>
      </AlertDialogTrigger>
      {/* @ts-expect-error prop? */}
      <AlertDialogContent>
        <AlertDialogHeader>
          {/* @ts-expect-error prop? */}
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          {/* @ts-expect-error prop? */}
          <AlertDialogDescription>
            This will set patient&apos;s status to {""}
            {variant === "active" ? "inactive" : "active"}. You can change the
            status at any time.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* @ts-expect-error prop? */}
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <div onClick={() => handleClick()} onKeyDown={handleClick}>
            {/* @ts-expect-error prop? */}
            <AlertDialogAction>Confirm</AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
