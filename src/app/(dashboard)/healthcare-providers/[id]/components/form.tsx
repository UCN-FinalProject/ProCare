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
import { revalidatePathClient } from "~/app/revalidate";
import { Textarea } from "~/components/ui/textarea";
import { trimOrNull } from "~/lib/trimOrNull";
import { useRouter } from "next/navigation";
import { type HealthcareProvider } from "~/server/db/export";
import { type Session } from "next-auth";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name cannot be empty.",
  }),
  healthcareProviderID: z.string().min(1, {
    message: "Healthcare provider ID cannot be empty.",
  }),
  vat: z.string().min(1, {
    message: "VAT cannot be empty.",
  }),
  address1: z.string().min(1, {
    message: "Address 1 cannot be empty.",
  }),
  address2: z.string().nullish(),
  city: z.string().min(1, {
    message: "City cannot be empty.",
  }),
  zip: z.string().min(1, {
    message: "Zip cannot be empty.",
  }),
  note: z.string().optional(),
});

export default function UpdateHealthcareProviderForm({
  healthcareProvider,
  session,
}: {
  healthcareProvider: HealthcareProvider;
  session: Session;
}) {
  const isAdmin = session.user.role === "admin";
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: healthcareProvider.name,
      healthcareProviderID: healthcareProvider.healthcareProviderCode,
      vat: healthcareProvider.VAT,
      address1: healthcareProvider.address1,
      address2: healthcareProvider.address2 ?? "",
      city: healthcareProvider.city,
      zip: healthcareProvider.zip,
      note: healthcareProvider.note ?? "",
    },
  });

  const updateHealthcareProvider = api.healthcareProvider.update.useMutation();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateHealthcareProvider.mutateAsync(
      {
        id: healthcareProvider.id,
        name: values.name,
        healthcareProviderCode: values.healthcareProviderID,
        VAT: values.vat,
        address1: values.address1,
        address2: trimOrNull(values.address2) ?? undefined,
        city: values.city,
        zip: values.zip,
        note: trimOrNull(values.note) ?? undefined,
      },
      {
        // eslint-disable-next-line
        onSuccess: async (res) => {
          toast.success("Healthcare provider successfully updated");
          await revalidatePathClient();
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

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="healthcareProviderID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Healthcare provider ID</FormLabel>
              <FormControl>
                <Input
                  placeholder="Healthcare provider ID"
                  {...field}
                  disabled={!isAdmin}
                />
              </FormControl>
              <FormDescription>
                Healthcare provider ID registered in the national healthcare
                system.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>VAT</FormLabel>
              <FormControl>
                <Input placeholder="VAT" {...field} disabled={!isAdmin} />
              </FormControl>
              <FormDescription>Healthcare provider VAT number.</FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address 1</FormLabel>
              <FormControl>
                <Input placeholder="Address 1" {...field} disabled={!isAdmin} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address 2</FormLabel>
              <FormControl>
                {/* @ts-expect-error type of the value is defiend as stirng or nullish, but the default is set to an empty string */}
                <Input placeholder="Address 2" {...field} disabled={!isAdmin} />
              </FormControl>
              <FormDescription>Secondary address - optional.</FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="City" {...field} disabled={!isAdmin} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="zip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zip</FormLabel>
              <FormControl>
                <Input placeholder="ZIP" {...field} disabled={!isAdmin} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea placeholder="Note" {...field} disabled={!isAdmin} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {isAdmin && (
          <Button type="submit" isLoading={updateHealthcareProvider.isLoading}>
            Submit
          </Button>
        )}
      </form>
    </Form>
  );
}
