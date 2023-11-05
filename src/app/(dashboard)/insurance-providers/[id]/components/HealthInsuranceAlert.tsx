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
import { revalidateHealthProviderPath } from "../../serverAction";
type Variant = "active" | "inactive";

export default function HealthInsuranceAlert({
  variant,
  id,
}: {
  variant: Variant;
  id: number;
}) {
  const setActive = api.healthInsurance.setActive.useMutation();
  const setInactive = api.healthInsurance.setInactive.useMutation();

  const handleClick = async () => {
    if (variant === "inactive") {
      await setActive.mutateAsync(
        { id },
        {
          onSuccess: () => {
            toast.success("Health insurance provider disabled");
            async () => await revalidateHealthProviderPath();
            window.location.reload();
          },
          onError: (err) => toast.error(err.message),
        },
      );
    } else {
      await setInactive.mutateAsync(
        { id },
        {
          onSuccess: () => {
            toast.success("Health insurance provider enabled");
            async () => await revalidateHealthProviderPath();
            window.location.reload();
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
          {variant === "active" ? "Disable" : "Enable"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will {variant === "active" ? "disable" : "enable"} this health
            insurance provider. You can change the status at any time.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <div onClick={() => handleClick()}>
            <AlertDialogAction>Confirm</AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
