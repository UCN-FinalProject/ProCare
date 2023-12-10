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
import { useState } from "react";
import Link from "next/link";
import { useProcedurePricing } from "../hooks/useProcedurePricing";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name cannot be empty.",
  }),
});

export default function CreateProcedureForm() {
  const [procedureID, setProcedureID] = useState<number | null>(null);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const { array } = useProcedurePricing();

  const createProcedure = api.procedure.create.useMutation();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createProcedure.mutateAsync(
      {
        data: {
          name: values.name.trim(),
        },
        pricingInput: array,
      },
      {
        onSuccess: (res) => {
          setProcedureID(res.id);
          toast.success("Procedure successfully created.");
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
              <FormDescription>The name of the procedure</FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-1">
          <Button type="submit" isLoading={createProcedure.isLoading}>
            Submit
          </Button>
          {createProcedure.isSuccess && (
            <Button variant="outline">
              {/* @ts-expect-error type defs a bit broken  */}
              <Link href={`/procedures/${procedureID}`}>View procedure</Link>
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
