"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { api } from "~/trpc/react";

import Button from "~/components/Button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { type Procedure } from "~/server/db/export";
import { type Session } from "next-auth";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name cannot be empty.",
  }),
});

export default function UpdateProcedureForm({
  procedure,
  session,
}: {
  procedure: Procedure;
  session: Session;
}) {
  const isAdmin = session.user.role === "admin";
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: procedure.name,
    },
  });

  const updateProcedure = api.procedure.update.useMutation();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateProcedure.mutateAsync(
      {
        data: {
          id: procedure.id,
          name: values.name.trim(),
        },
      },
      {
        onSuccess: () => {
          toast.success("Procedure successfully updated.");
          router.refresh();
        },
        onError: (err) => toast.error(err.message),
      },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} disabled={!isAdmin} />
              </FormControl>
              <FormDescription>The name of the procedure</FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        {isAdmin && (
          <Button type="submit" isLoading={updateProcedure.isLoading}>
            Submit
          </Button>
        )}
      </form>
    </Form>
  );
}
