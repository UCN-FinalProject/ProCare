"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { signIn } from "next-auth/react";
import directApi from "~/trpc/direct";
import { startAuthentication } from "@simplewebauthn/browser";

import Button from "~/components/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Fingerprint } from "lucide-react";
import { env } from "~/env.mjs";
import { toast } from "sonner";

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .min(1, {
      message: "Email cannot be empty.",
    }),
  method: z.enum(["email", "passkeys"]).default("passkeys"),
});

export default function SignInForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      method: "passkeys",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.method === "email") {
      await signInWithEmail({ email: values.email.toLowerCase() });
      return;
    }

    try {
      await signInWithWebauthn({ email: values.email.toLowerCase() });
    } catch (error) {
      toast.error("Error signing in with biometric authentication.");
    }
  }

  async function signInWithEmail({ email }: { email: string }) {
    if (env.NODE_ENV === "development") {
      alert(
        "Email sign in is disabled in development. Please use biometric authentication instead.",
      );
      return;
    }
    try {
      await directApi.auth.allowEmailAuth.query(email);
      await signIn("email", { email });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error signing in with email.",
      );
      return;
    }
  }

  async function signInWithWebauthn({ email }: { email: string }) {
    const options = await directApi.auth.authenticate.query(email);
    if (!options) {
      alert("error getting options");
    }
    const credential = await startAuthentication(options);

    await signIn("webauthn", {
      id: credential.id,
      rawId: credential.rawId,
      type: credential.type,
      clientDataJSON: credential.response.clientDataJSON,
      authenticatorData: credential.response.authenticatorData,
      userHandle: credential.response.userHandle,
      clientExtensionResults: credential.clientExtensionResults,
      signature: credential.response.signature,
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-3 max-w-sm w-full"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-1">
          <Button
            type="submit"
            className="flex gap-2 w-full h-8 justify-between"
            onClick={() => form.setValue("method", "passkeys")}
          >
            <Fingerprint className="w-4 h-4" />
            Sign in
            <div />
          </Button>
          <Button
            variant="secondary"
            type="submit"
            className=" h-8"
            onClick={() => form.setValue("method", "email")}
          >
            Sign in via email
          </Button>
        </div>
      </form>
    </Form>
  );
}
