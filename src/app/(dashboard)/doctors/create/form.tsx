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
import { Textarea } from "~/components/ui/textarea";

const formSchema = z.object({
  fullName: z.string().min(1, {
    message: "Full name cannot be empty.",
  }),
  doctorID: z.string().min(1, {
    message: "Doctor ID cannot be empty.",
  }),
  note: z.string().optional(),
});

export default function CreateDoctorForm() {
  const [doctorID, setdoctorID] = useState<number | null>(null);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      doctorID: "",
    },
  });

  const createDoctor = api.doctor.create.useMutation();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createDoctor.mutateAsync(
      {
        fullName: values.fullName,
        doctorID: values.doctorID,
        note: values.note,
      },
      {
        onSuccess: (res) => {
          setdoctorID(res!.id);
          toast.success("Doctor successfully created");
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
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="Full name" {...field} />
              </FormControl>
              <FormDescription>
                Full name of the doctor (including title).
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="doctorID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor ID</FormLabel>
              <FormControl>
                <Input placeholder="Description" {...field} />
              </FormControl>
              <FormDescription>
                ID of the doctor registered in National doctor register.
              </FormDescription>

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

        <div className="flex gap-1">
          <Button type="submit" isLoading={createDoctor.isPending}>
            Submit
          </Button>
          {createDoctor.isSuccess && (
            <Button variant="outline">
              <Link href={`/doctors/"${doctorID}`}>View doctor</Link>
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
