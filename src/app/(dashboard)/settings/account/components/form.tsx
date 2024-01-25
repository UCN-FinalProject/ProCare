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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import { type User } from "~/server/db/export";
import { useRouter } from "next/navigation";
import { trimOrNull } from "~/lib/trimOrNull";

const formSchema = z.object({
  fullName: z.string().min(1, {
    message: "Full name cannot be empty.",
  }),
  email: z
    .string()
    .email({
      message: "Please enter a valid email.",
    })
    .min(1, {
      message: "Email cannot be empty.",
    }),
  createdAt: z.date(),
  role: z.enum(["admin", "user"]),
  doctorId: z.string(),
});

export default function AccountForm({ data }: { data: User }) {
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: data.name,
      email: data.email,
      createdAt: data.emailVerified!,
      role: data.role,
      doctorId: data.doctorID ?? "",
    },
  });

  const updateAccount = api.user.update.useMutation();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateAccount.mutateAsync(
      {
        id: data.id,
        name: values.fullName.trim(),
        role: values.role,
        doctorID: trimOrNull(values.doctorId) ?? undefined,
      },
      {
        onSuccess: () => {
          toast.success(
            "Account updated. Please log out and log in again to see changes.",
          );
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
                <Input placeholder="Full name" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} disabled />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="createdAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Created at</FormLabel>
              <FormControl>
                {/* @ts-expect-error onChange param displays an error, but this field is disabled anyways  */}
                <Input placeholder="Created at" {...field} disabled />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={data.role !== "admin"}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Role of the user. Some features are limited strictly for users
                with admin role.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="doctorId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor ID</FormLabel>
              <FormControl>
                <Input placeholder="Doctor ID" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" isLoading={updateAccount.isPending}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
