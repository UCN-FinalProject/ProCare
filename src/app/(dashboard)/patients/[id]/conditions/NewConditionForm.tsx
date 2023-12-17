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
import { SheetClose, SheetFooter } from "~/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import type { HealthCondition } from "~/server/db/export";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  patientID: z.string(),
  conditionID: z.coerce.number(),
  assignedByID: z.string(),
});

export default function NewConditionForm({
  patientID,
  conditions,
}: {
  patientID: string;
  conditions: HealthCondition[];
}) {
  const router = useRouter();
  const session = useSession();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientID: patientID,
      assignedByID: session.data!.user.id,
    },
  });

  const addCondition = api.patient.addCondition.useMutation();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await addCondition.mutateAsync(
      {
        patientID: values.patientID,
        assignedByID: values.assignedByID,
        conditionID: values.conditionID,
      },
      {
        onSuccess: () => {
          toast.success("Condition assigned successfully.");
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
          name="conditionID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Condition</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a condition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {conditions.map((condition) => (
                      <SelectItem
                        key={condition.id}
                        value={String(condition.id)}
                      >
                        {condition.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>The name of the procedure</FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" isLoading={addCondition.isLoading}>
              Save
            </Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </Form>
  );
}
