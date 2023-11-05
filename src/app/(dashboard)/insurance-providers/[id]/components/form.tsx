"use client";

// TODO: disable fields and hide button for non admin users
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from "~/components/ui/separator";
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
import { type HealthInsurance } from "~/server/db/export";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import { revalidateHealthProviderPath } from "../../serverAction";

const formSchema = z.object({
  insuranceID: z.number().min(1, {
    message: "Insurance ID cannot be empty.",
  }),
  registeredID: z.number().min(1, {
    message: "Registered ID cannot be empty.",
  }),
  name: z.string().min(1, {
    message: "Name cannot be empty.",
  }),
  pricePerCredit: z.string().min(1, {
    message: "Price per credit cannot be empty.",
  }),
  healthInsuranceAddress1: z.string().min(1, {
    message: "Address cannot be empty.",
  }),
  healthInsuranceAddress2: z.string().optional(),
  healthInsuranceCity: z.string().min(1, {
    message: "City cannot be empty.",
  }),
  healthInsuranceZip: z.string().min(1, {
    message: "Zip cannot be empty.",
  }),
  healthInsurancePhone: z.string().optional(),
  healthInsuranceEmail: z.string().optional(),
  healthInsuranceVAT1: z.string().min(1, {
    message: "VAT1 cannot be empty.",
  }),
  healthInsuranceVAT2: z.string().min(1, {
    message: "VAT2 cannot be empty.",
  }),
  healthInsuranceVAT3: z.string().optional(),
});

export default function UpdateInsuranceProviderForm({
  data,
}: {
  data: HealthInsurance;
}) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      insuranceID: Number(data.insuranceID),
      registeredID: Number(data.registeredID),
      name: data.name,
      pricePerCredit: data.pricePerCredit,
      healthInsuranceAddress1: data.healthInsuranceAddress.address1,
      healthInsuranceAddress2:
        data.healthInsuranceAddress.address2 ?? undefined,
      healthInsuranceCity: data.healthInsuranceAddress.city,
      healthInsuranceZip: data.healthInsuranceAddress.zip,
      healthInsurancePhone:
        data.healthInsuranceAddress.phoneNumber ?? undefined,
      healthInsuranceEmail: data.healthInsuranceAddress.email ?? undefined,
      healthInsuranceVAT1: data.healthInsuranceVAT.vat1,
      healthInsuranceVAT2: data.healthInsuranceVAT.vat2,
      healthInsuranceVAT3: data.healthInsuranceVAT.vat3 ?? undefined,
    },
  });

  const updateHealthInsurance = api.healthInsurance.update.useMutation();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateHealthInsurance.mutateAsync(
      {
        id: data.id,
        insuranceID: values.insuranceID,
        registeredID: values.registeredID,
        name: values.name,
        pricePerCredit: Number(values.pricePerCredit),
        address: {
          address1: values.healthInsuranceAddress1,
          address2: values.healthInsuranceAddress2,
          city: values.healthInsuranceCity,
          zip: values.healthInsuranceZip,
          phoneNumber: values.healthInsurancePhone,
          email: values.healthInsuranceEmail,
        },
        vat: {
          VAT1: values.healthInsuranceVAT1,
          VAT2: values.healthInsuranceVAT2,
          VAT3: values.healthInsuranceVAT3,
        },
      },
      {
        onSuccess: () => {
          toast.success("Health insurance updated");
          async () => await revalidateHealthProviderPath();
          // window.location.reload();
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
          name="insuranceID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Insurance ID</FormLabel>
              <FormControl>
                <Input placeholder="Insurance ID" type="number" {...field} />
              </FormControl>
              <FormDescription>Health insurance&apos;s ID.</FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="registeredID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Registered ID</FormLabel>
              <FormControl>
                <Input placeholder="Registered ID" type="number" {...field} />
              </FormControl>
              <FormDescription>
                ID registered in the National Health Insurance register.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="pricePerCredit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price per credit</FormLabel>
              <FormControl>
                <Input
                  placeholder="Price per credit"
                  type="number"
                  {...field}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="healthInsuranceAddress1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address 1</FormLabel>
              <FormControl>
                <Input placeholder="Address 1" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="healthInsuranceAddress2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address 2</FormLabel>
              <FormControl>
                <Input placeholder="Address 2" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="healthInsuranceCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input placeholder="City" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="healthInsuranceZip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zip</FormLabel>
              <FormControl>
                <Input placeholder="Zip" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="healthInsurancePhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="Phone" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="healthInsuranceEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="healthInsuranceVAT1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>VAT 1</FormLabel>
              <FormControl>
                <Input placeholder="VAT 1" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="healthInsuranceVAT2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>VAT 2</FormLabel>
              <FormControl>
                <Input placeholder="VAT 2" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="healthInsuranceVAT3"
          render={({ field }) => (
            <FormItem>
              <FormLabel>VAT 3</FormLabel>
              <FormControl>
                <Input placeholder="VAT 3" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="sticky bottom-5 left-0"
          isLoading={updateHealthInsurance.isLoading}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
