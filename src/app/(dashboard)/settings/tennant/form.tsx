"use client";

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
import { Input } from "~/components/ui/input";
import { type Tennant } from "./page";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name cannot be empty.",
  }),
  basis: z.string().min(1, {
    message: "Basis cannot be empty.",
  }),
  regionalAuthority: z.string().min(1, {
    message: "Regional Authority cannot be empty.",
  }),
  headDoctorName: z.string().min(1, {
    message: "Head doctor's name cannot be empty.",
  }),
  headDoctorID: z.string().min(1, {
    message: "Head doctor's ID cannot be empty.",
  }),
  healthCareProviderName: z.string().min(1, {
    message: "Health care provider's name cannot be empty.",
  }),
  healthCareProviderAddress1: z.string().min(1, {
    message: "Health care provider's address cannot be empty.",
  }),
  healthCareProviderAddress2: z.string().min(1, {
    message: "Health care provider's address cannot be empty.",
  }),
  healthCareProviderCity: z.string().min(1, {
    message: "Health care provider's city cannot be empty.",
  }),
  healthCareProviderZip: z.string().min(1, {
    message: "Health care provider's postal code cannot be empty.",
  }),
  bankAccountBankName: z.string().min(1, {
    message: "Bank name cannot be empty.",
  }),
  bankAccountSWIFT: z.string().min(1, {
    message: "SWIFT cannot be empty.",
  }),
  bankAccountIBAN: z.string().min(1, {
    message: "IBAN cannot be empty.",
  }),
  VAT1: z.string().min(1, {
    message: "VAT cannot be empty.",
  }),
  VAT2: z.string().min(1, {
    message: "VAT cannot be empty.",
  }),
  VAT3: z.string().optional(),
});

export default function TennantForm({ tennant }: { tennant: Tennant }) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: tennant.name,
      basis: tennant.basis,
      regionalAuthority: tennant.regionalAuthority,
      headDoctorName: tennant.headDoctor.headDoctor,
      headDoctorID: tennant.headDoctor.headDoctorID,
      healthCareProviderName: tennant.healthCareProvider.name,
      healthCareProviderAddress1: tennant.healthCareProvider.address1,
      healthCareProviderAddress2: tennant.healthCareProvider.address2 ?? "",
      healthCareProviderCity: tennant.healthCareProvider.city,
      healthCareProviderZip: tennant.healthCareProvider.zip,
      bankAccountBankName: tennant.tennantBankDetails.bankName,
      bankAccountSWIFT: tennant.tennantBankDetails.SWIFT,
      bankAccountIBAN: tennant.tennantBankDetails.IBAN,
      VAT1: tennant.tennantVAT.VAT1,
      VAT2: tennant.tennantVAT.VAT2,
      VAT3: tennant.tennantVAT.VAT3 ?? "",
    },
  });

  const updateTennant = api.tennant.updateTenant.useMutation();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateTennant.mutateAsync(
      {
        name: values.name,
        basis: values.basis,
        regionalAuthority: values.regionalAuthority,
        headDoctor: {
          headDoctor: values.headDoctorName,
          headDoctorID: values.headDoctorID,
        },
        healthCareProvider: {
          name: values.healthCareProviderName,
          address1: values.healthCareProviderAddress1,
          address2: values.healthCareProviderAddress2,
          city: values.healthCareProviderCity,
          zip: values.healthCareProviderZip,
        },
        tennantBankDetails: {
          bankName: values.bankAccountBankName,
          SWIFT: values.bankAccountSWIFT,
          IBAN: values.bankAccountIBAN,
        },
        tennantVAT: {
          VAT1: values.VAT1,
          VAT2: values.VAT2,
          VAT3: values.VAT3,
        },
      },
      {
        onSuccess: () => toast.success("Tennant updated"),
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

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="basis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Basis</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Basis" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="regionalAuthority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Regional authority</FormLabel>
              <FormControl>
                <Input placeholder="Regional authority" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="headDoctorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Head doctor&apos;s full name</FormLabel>
              <FormControl>
                <Input placeholder="Head doctor's full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="headDoctorID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Head doctor&apos;s ID</FormLabel>
              <FormControl>
                <Input placeholder="Head doctor's ID" {...field} />
              </FormControl>
              <FormDescription>
                Doctor&apos;s ID registered in the National Healthcare provider
                register.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="healthCareProviderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Health care provider&apos;s name</FormLabel>
              <FormControl>
                <Input placeholder="Health care provider's name" {...field} />
              </FormControl>
              <FormDescription>
                Name registered in the National Healthcare provider register.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="healthCareProviderAddress1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Health care provider&apos;s address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Health care provider's address"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="healthCareProviderAddress2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Health care provider&apos;s address 2</FormLabel>
              <FormControl>
                <Input
                  placeholder="Health care provider's address 2"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="healthCareProviderCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Health care provider&apos;s city</FormLabel>
              <FormControl>
                <Input placeholder="Health care provider's city" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="healthCareProviderZip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Health care provider&apos;s postal code</FormLabel>
              <FormControl>
                <Input
                  placeholder="Health care provider's postal code"
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
          name="bankAccountBankName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bank name</FormLabel>
              <FormControl>
                <Input placeholder="Bank name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bankAccountSWIFT"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SWIFT</FormLabel>
              <FormControl>
                <Input placeholder="SWIFT" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bankAccountIBAN"
          render={({ field }) => (
            <FormItem>
              <FormLabel>IBAN</FormLabel>
              <FormControl>
                <Input placeholder="IBAN" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="VAT1"
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
          name="VAT2"
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
          name="VAT3"
          render={({ field }) => (
            <FormItem>
              <FormLabel>VAT3</FormLabel>
              <FormControl>
                <Input placeholder="VAT3" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="sticky bottom-5 left-0"
          isLoading={updateTennant.isLoading}
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
