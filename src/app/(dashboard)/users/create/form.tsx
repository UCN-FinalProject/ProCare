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
import { revalidatePathClient } from "~/app/revalidate";
import { useState } from "react";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name cannot be empty.",
  }),
  email: z
    .string()
    .min(1, {
      message: "Email cannot be empty.",
    })
    .email({ message: "Email must be a valid email." }),
  role: z.enum(["admin", "user"]),
  doctorID: z.string().optional(),
});

export default function CreateUserForm() {
  const [userID, setuserID] = useState<string | null>(null);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      doctorID: "",
      role: "user",
    },
  });

  const createUser = api.user.create.useMutation();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createUser.mutateAsync(
      {
        name: values.name,
        email: values.email,
        role: values.role,
        doctorID: values.doctorID ?? undefined,
      },
      {
        // eslint-disable-next-line
        onSuccess: async (res) => {
          setuserID(res!);
          toast.success("User was created successfully created");
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
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="Full name" {...field} />
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
                <Input placeholder="Email" {...field} />
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
                <Input placeholder="Doctor ID" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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

        <div className="flex gap-1">
          <Button type="submit" isLoading={createUser.isLoading}>
            Submit
          </Button>
          {createUser.isSuccess && (
            <Button variant="outline">
              <Link href={"/users/" + userID}>View user</Link>
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
