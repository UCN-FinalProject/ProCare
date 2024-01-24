"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

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
import { type HealthCondition } from "~/server/db/export";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name cannot be empty.",
  }),
  description: z.string().min(1, {
    message: "Description cannot be empty.",
  }),
});

export default function UpdateHealthConditionForm({
  data,
}: {
  data: HealthCondition;
}) {
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data.name,
      description: data.description,
    },
  });

  const updateHealthCondition = api.healthCondition.update.useMutation();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateHealthCondition.mutateAsync(
      {
        id: data.id,
        name: values.name,
        description: values.description,
      },
      {
        onSuccess: () => {
          toast.success("Health condition updated");
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
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormDescription>Name of the health condition.</FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Description" {...field} />
              </FormControl>
              <FormDescription>
                Description of the health condition.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" isLoading={updateHealthCondition.isPending}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
