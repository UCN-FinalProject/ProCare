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
import { type Session } from "next-auth";
import { trimOrNull } from "~/lib/trimOrNull";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name cannot be empty.",
  }),
  email: z.string().email(),
  role: z.enum(["admin", "user"]),
  doctorID: z.string().optional(),
});

export default function UpdateUserForm({
  data,
  session,
}: {
  data: User;
  session: Session;
}) {
  const router = useRouter();
  const isAdmin = session.user.role === "admin";

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: data.email,
      name: data.name,
      doctorID: trimOrNull(data.doctorID) ?? undefined,
      role: data.role,
    },
  });

  const createUser = api.user.update.useMutation();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isAdmin) {
      toast.error("Only administrators are able to perform this action.");
      return;
    }
    await createUser.mutateAsync(
      {
        id: data.id,
        name: values.name,
        role: values.role,
        doctorID: values.doctorID ?? undefined,
      },
      {
        onSuccess: () => {
          toast.success("User was updated successfully updated");
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
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="Full name" {...field} disabled={!isAdmin} />
              </FormControl>
              <FormDescription>
                Full name of the user (including titles).
              </FormDescription>

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
              <FormDescription>
                Email of the user. This will be used to log in.
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
                <Input placeholder="Doctor ID" {...field} disabled={!isAdmin} />
              </FormControl>
              <FormDescription>
                ID of the doctor registered in the National Health Service.
              </FormDescription>

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
                disabled={!isAdmin}
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

        {isAdmin && (
          <Button type="submit" isLoading={createUser.isLoading}>
            Submit
          </Button>
        )}
      </form>
    </Form>
  );
}
