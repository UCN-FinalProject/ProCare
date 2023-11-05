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
import { useState } from "react";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name cannot be empty.",
  }),
  description: z.string().min(1, {
    message: "Description cannot be empty.",
  }),
});

export default function CreateHealthConditionForm() {
  const [healthConditionID, setHealthConditionID] = useState<number | null>(
    null,
  );
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createHealthCondition = api.healthCondition.create.useMutation();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createHealthCondition.mutateAsync(
      {
        name: values.name,
        description: values.description,
      },
      {
        // eslint-disable-next-line
        onSuccess: async (res) => {
          setHealthConditionID(res.id);
          toast.success("Health condition created");
          await revalidatePathClient();
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

        <div className="flex gap-1">
          <Button type="submit" isLoading={createHealthCondition.isLoading}>
            Submit
          </Button>
          {createHealthCondition.isSuccess && (
            <Button variant="outline">
              <Link href={"/diagnoses/" + healthConditionID}>
                View health condition
              </Link>
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
