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

const formSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .min(1, {
      message: "Email cannot be empty.",
    }),
});

export default function SignInForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await signInWithWebauthn({ email: values.email });
    } catch (error) {
      // fallback to email sign in
      // disabled in dev env
      await signInWithEmail({ email: values.email });
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
      alert("User with this email does not exist.");
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
        className="space-y-4 max-w-sm w-full"
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

        <div className="flex gap-1">
          <Button
            type="submit"
            className="flex gap-2 w-full h-8 justify-between"
          >
            <Fingerprint className="w-4 h-4" />
            Sign in
            <div />
          </Button>
        </div>
      </form>
    </Form>
  );
}
