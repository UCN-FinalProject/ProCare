"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { api } from "~/trpc/react";
import Button from "~/components/Button";
import {
  Form,
  FormControl,
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
import type { Doctor } from "~/server/db/export";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  doctorID: z.coerce.number(),
  healthCareProviderID: z.number(),
  assignedByID: z.string(),
});

export default function NewDoctorForm({
  healthCareProviderID,
  doctors,
}: Readonly<{
  healthCareProviderID: number;
  doctors: Doctor[];
}>) {
  const router = useRouter();
  const session = useSession();
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      healthCareProviderID,
      assignedByID: session.data!.user.id,
    },
  });

  const addDoctor = api.healthcareProvider.addDoctor.useMutation();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await addDoctor.mutateAsync(
      {
        doctorID: values.doctorID,
        healthcareProviderID: values.healthCareProviderID,
      },
      {
        onSuccess: () => {
          toast.success("Doctor was added successfully.");
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
          name="doctorID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {doctors.map((doctor) => (
                      <SelectItem key={doctor.id} value={String(doctor.id)}>
                        {doctor.fullName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" isLoading={addDoctor.isLoading}>
              Save
            </Button>
          </SheetClose>
        </SheetFooter>
      </form>
    </Form>
  );
}
