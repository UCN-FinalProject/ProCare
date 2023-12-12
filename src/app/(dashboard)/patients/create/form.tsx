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
import { Textarea } from "~/components/ui/textarea";

const disabilities = [
  "limited_physical",
  "physical",
  "mental",
  "none",
] as const; //will add into Patient schema/validation later

const formSchema = z.object({
  fullName: z.string().min(1, {
    message: "Full name cannot be empty.",
  }),
  isActive: z.boolean(),
  biologicalSex: z.enum(["male", "female"]),
  dateOfBirth: z.date(),
  ssn: z.string(),
  recommendationDate: z.date(),
  acceptanceDate: z.date().optional(),
  startDate: z.date(),
  expectedEndOfTreatment: z.date().optional(),
  endDate: z.date().optional(),
  insuredID: z.string().min(1, {
    message: "Patient's insured id is required..",
  }),
  email: z.string().optional(),
  phone: z.string().optional(),
  disability: z.enum(disabilities),
  alergies: z.string().optional(),
  note: z.string().optional(),
  // address
  address1: z.string().min(1, {
    message: "Patient must have main address.",
  }),
  address2: z.string().optional(),
  city: z.string().min(1, {
    message: "Patient must contain city.",
  }),
  zip: z.string().min(1, {
    message: "Zip code is required.",
  }),
  // healthcare info
  healthInsuranceID: z.number().min(1, {
    message: "Patient's health insurance id is required",
  }),
  doctorID: z.number().min(1, {
    message: "Patient's personal doctor's id is required.",
  }),
  healthcareProviderID: z.number().min(1, {
    message: "ID of the health insurance provider is required.",
  }),
  conditions: z
    .array(
      z.object({
        conditionID: z.number(),
      }),
    )
    .optional(),
});

export default function CreatePatientForm() {
  const [setPatientID] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      isActive: true,
      biologicalSex: "male",
      dateOfBirth: new Date(Date.now()),
      recommendationDate: new Date(Date.now()),
      acceptanceDate: new Date(Date.now()),
      startDate: new Date(Date.now()),
      expectedEndOfTreatment: new Date(Date.now()),
      insuredID: "",
      email: "",
      phone: "",
      disability: "none",
      alergies: "",
      note: "",
      address1: "",
      address2: "",
      city: "",
      zip: "",
      healthInsuranceID: 0,
      doctorID: 0,
      healthcareProviderID: 0,
    },
  });

  const createPatient = api.patient.create.useMutation();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createPatient.mutateAsync(
      {
        fullName: values.fullName,
        isActive: values.isActive,
        biologicalSex: values.biologicalSex,
        dateOfBirth: values.dateOfBirth,
        ssn: values.ssn,
        recommendationDate: values.recommendationDate,
        acceptanceDate: values.acceptanceDate,
        startDate: values.startDate,
        expectedEndOfTreatment: values.expectedEndOfTreatment!,
        insuredID: values.insuredID,
        email: values.email,
        phone: values.phone,
        disability: values.disability,
        alergies: values.alergies,
        note: values.note,
        address1: values.address1,
        address2: values.address2,
        city: values.city,
        zip: values.zip ?? undefined,
        healthInsuranceID: values.healthInsuranceID,
        doctorID: values.doctorID,
        healthcareProviderID: values.healthcareProviderID,
        conditions: values.conditions,
      },
      {
        //eslint-disable-next-line
        onSuccess: async () => {
          toast.success("Patient successfully created");
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
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Patient's full name" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currently Active?</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select field" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">True</SelectItem>
                  <SelectItem value="false">False</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="biologicalSex"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bilogical Sex</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select biological sec" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ssn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SSN</FormLabel>
              <FormControl>
                <Input placeholder="SSN" {...field} />
              </FormControl>
              <FormDescription>Social security number</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* <FormField
    control={form.control}
    name="recommendationDate"
    render={({field}) => (
      <FormItem>
        <FormLabel>Recommendation Date</FormLabel>
        <FormControl>
          <Input placeholder="Recommendation Date" {...field} disabled={!isAdmin} />
        </FormControl>

        <FormMessage />
      </FormItem>
  )}/> TODO: Not sure how to handle dates, maybe toString? */}
        <FormField
          control={form.control}
          name="insuredID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>InsuredID</FormLabel>
              <FormControl>
                <Input placeholder="InsuredID" {...field} />
              </FormControl>
              <FormDescription>
                The ID of the patient from their health insurance
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
              <FormLabel>Patient Email</FormLabel>
              <FormControl>
                <Input placeholder="Patient's email" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient phone number</FormLabel>
              <FormControl>
                <Input placeholder="Patient's phone number" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />{" "}
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Any notes regarding the patient</FormLabel>
              <FormControl>
                <Textarea placeholder="Note" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="alergies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alergies</FormLabel>
              <FormControl>
                <Input placeholder="Alergies" {...field} />
              </FormControl>
              <FormDescription>Any alergies the patient has.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="disability"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Disability</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a disabillity" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="limited_physical">
                    Limited Physical
                  </SelectItem>
                  <SelectItem value="physical">Physical</SelectItem>
                  <SelectItem value="mental">Mental</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Main address</FormLabel>
              <FormControl>
                <Input placeholder="Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Secondary address</FormLabel>
              <FormControl>
                <Input placeholder="Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
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
          name="zip"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zipcode</FormLabel>
              <FormControl>
                <Input placeholder="Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="healthInsuranceID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>HealthInsuranceID</FormLabel>
              <FormControl>
                <Input placeholder="ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="doctorID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>DoctorId</FormLabel>
              <FormControl>
                <Input placeholder="ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="healthcareProviderID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>healthCareProviderID</FormLabel>
              <FormControl>
                <Input placeholder="ID" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-1">
          <Button type="submit" isLoading={createPatient.isLoading}>
            Submit
          </Button>
          {createPatient.isSuccess && (
            <Button variant="outline">
              <Link href={"/patients/" + setPatientID}>View Patient</Link>
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}