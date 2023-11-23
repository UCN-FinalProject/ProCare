"use client";

import { type PublicKeyCredentialCreationOptionsJSON } from "@simplewebauthn/typescript-types";
import { api } from "~/trpc/react";
import { startRegistration } from "@simplewebauthn/browser";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import { parseErrorMessage } from "~/lib/parseError";

export default function RegisterPasskey({
  webauthnData,
}: {
  webauthnData: PublicKeyCredentialCreationOptionsJSON;
}) {
  const { mutate, isLoading: registrationLoading } =
    api.auth.registerPassKey.useMutation();

  const router = useRouter();

  async function registerWebauthn() {
    if (!webauthnData) return;

    try {
      const registrationResponse = await startRegistration(webauthnData);
      mutate(
        { ...registrationResponse, browserDetails: navigator.userAgent },
        {
          onSuccess: () => {
            toast.success("Passkey Registered!");
            router.refresh();
          },
          onError: () => toast.error("Could not register passkey"),
        },
      );
    } catch (error) {
      toast.error(
        parseErrorMessage({
          error,
          defaultMessage: "Could not register passkey",
        }),
      );
    }
  }

  return (
    <Button
      variant="outline"
      className="flex items-center gap-1"
      onClick={registerWebauthn}
      disabled={registrationLoading}
    >
      <Plus className="w-[18px]" /> Add new
    </Button>
  );
}
