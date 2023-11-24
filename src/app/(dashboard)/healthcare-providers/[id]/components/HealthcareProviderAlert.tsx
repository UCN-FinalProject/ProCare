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
import { revalidatePathClient } from "~/app/revalidate";
import { useRouter } from "next/navigation";

type Variant = "active" | "inactive";

export default function HealthcareProviderAlert({
  variant,
  id,
}: {
  variant: Variant;
  id: number;
}) {
  const setActive = api.healthcareProvider.setActive.useMutation();
  const setInactive = api.healthcareProvider.setInactive.useMutation();

  const router = useRouter();

  const handleClick = async () => {
    if (variant === "inactive") {
      await setActive.mutateAsync(
        { id },
        {
          // eslint-disable-next-line
          onSuccess: async () => {
            toast.success("Healthcare provider's status was set to active");
            await revalidatePathClient().then(() => router.refresh());
          },
          onError: (err) => toast.error(err.message),
        },
      );
    } else {
      await setInactive.mutateAsync(
        { id },
        {
          // eslint-disable-next-line
          onSuccess: async () => {
            toast.success("Healthcare provider's status was set to inactive");
            await revalidatePathClient().then(() => router.refresh());
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
            This will set healthcare provider&apos;s status to{" "}
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
