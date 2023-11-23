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
import { type Doctor } from "~/server/db/export";
import { type Session } from "next-auth";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  fullName: z.string().min(1, {
    message: "Full name cannot be empty.",
  }),
  doctorID: z.string().min(1, {
    message: "Doctor ID cannot be empty.",
  }),
  note: z.string().optional(),
});

export default function UpdateDoctorForm({
  doctor,
  session,
}: {
  doctor: Doctor;
  session: Session;
}) {
  const router = useRouter();
  const isAdmin = session?.user.role === "admin";
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: doctor.fullName,
      doctorID: doctor.doctorID,
      note: doctor.note ?? undefined,
    },
  });

  const updateDoctor = api.doctor.update.useMutation();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateDoctor.mutateAsync(
      {
        id: doctor.id,
        fullName: values.fullName,
        doctorID: values.doctorID,
        note: values.note,
      },
      {
        // eslint-disable-next-line
        onSuccess: async (res) => {
          toast.success("Doctor info successfully updated");
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
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="Full name" {...field} disabled={!isAdmin} />
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
                <Input
                  placeholder="Description"
                  {...field}
                  disabled={!isAdmin}
                />
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
                <Textarea placeholder="Note" {...field} disabled={!isAdmin} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          isLoading={updateDoctor.isLoading}
          disabled={!isAdmin}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
