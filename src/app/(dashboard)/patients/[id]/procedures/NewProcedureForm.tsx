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
import type { Procedure } from "~/server/db/export";
import { useRouter } from "next/navigation";
import { Textarea } from "~/components/ui/textarea";
import { useRef } from "react";

const formSchema = z.object({
  patientID: z.string(),
  procedureID: z.coerce.number(),
  note: z.string().optional(),
});

export default function NewProcedureForm({
  patientID,
  procedures,
}: Readonly<{
  patientID: string;
  procedures: Procedure[];
}>) {
  const router = useRouter();
  const sheetClose = useRef<HTMLButtonElement>(null);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientID: patientID,
      note: "",
    },
  });

  const addProcedure = api.patient.addProcedure.useMutation();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await addProcedure.mutateAsync(
      {
        patientID: values.patientID,
        procedureID: values.procedureID,
        note: values.note ? values.note.trim() : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Procedure was logged successfully.");
          router.refresh();
          sheetClose.current?.click();
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
          name="procedureID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Procedure</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a procedure" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {procedures.map((procedure) => (
                      <SelectItem
                        key={procedure.id}
                        value={String(procedure.id)}
                      >
                        {procedure.name}
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
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea placeholder="Note" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <SheetFooter>
          <Button type="submit" isLoading={addProcedure.isPending}>
            Save
          </Button>
          <SheetClose hidden ref={sheetClose} />
        </SheetFooter>
      </form>
    </Form>
  );
}
