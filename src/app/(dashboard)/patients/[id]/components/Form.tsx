"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import * as z from "zod";
import {api} from "~/trpc/react";
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
  import {type Patient} from "~/server/db/export";
  import { type Session } from "next-auth";
  import { useRouter } from "next/navigation";

  const disabilities = [
    "limited_physical",
    "physical",
    "mental",
    "none",
  ] as const;

  const formSchema = z.object({
    patientID: z.string().min(1, {
      message: "Patient ID cannot be empty.",
    }),
    fullName: z.string().min(1, {
        message: "Full name cannot be empty.",
    }),
    recommendationDate: z.date(),
    acceptanceDate: z.date().optional(),
    expectedEndOfTreatment: z.date().optional(),
    insuredID: z.string().min(1, {
        message: "Patient's insured id is required.."
    }),
    email: z.string().optional(),
    phone: z.string().optional(),
    disability: z.enum(disabilities),
    alergies: z.string().optional(),
    note: z.string().optional(),
    // address
    address1: z.string().min(1, {
      message: "Patient must have main address."
    }),
    address2: z.string().optional(),
    city: z.string().min(1, {
      message: "Patient must contain city."
    }),
    zip: z.string().min(1, {
      message: "Zip code is required."
    }),
    // healthcare info
    healthInsuranceID: z.number().min(1, {
      message: "Patient's health insurance id is required"
    }),
    doctorID: z.number().min(1, {
      message: "Patient's personal doctor's id is required."
    }),
    healthcareProviderID: z.number().min(1, {
      message: "ID of the health insurance provider is required."
    }),
  });

export default function UpdatePatientForm({
  patient,
  session,
}: {
  patient: Patient;
  session: Session;
}) {
  const router = useRouter();
  const isAdmin = session?.user.role === "admin";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: patient.fullName,
      recommendationDate: patient.recommendationDate ?? undefined,
      acceptanceDate: patient.acceptanceDate ?? undefined,
      expectedEndOfTreatment: patient.expectedEndOfTreatment,
      insuredID: patient.insuredID,
      email: patient.email ?? undefined,
      phone: patient.phone ?? undefined,
      disability: patient.disability,
      alergies: patient.alergies ?? undefined,
      note: patient.note ?? undefined,
      address1: patient.patientAddress.address1,
      address2: patient.patientAddress.address2 ?? undefined,
      city: patient.patientAddress.city,
      zip: patient.patientAddress.zipCode,
      healthInsuranceID: patient.patientHealthcareInfo.healthInsuranceID,
      doctorID: patient.patientHealthcareInfo.doctorID,
      healthcareProviderID: patient.patientHealthcareInfo.healthcareProviderID,
    }
  })
  const updatePatient = api.patient.update.useMutation();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updatePatient.mutateAsync(
      {
      id: patient.id,
      fullName: values.fullName,
      recommendationDate: values.recommendationDate,
      acceptanceDate: values.acceptanceDate,
      expectedEndOfTreatment: values.expectedEndOfTreatment,
      insuredID: values.insuredID,
      email: values.email,
      phone: values.phone,
      disability: values.disability,
      alergies: values.alergies,
      note: values.note,
      address: {
        address1: values.address1,
        address2: values.address2,
        city: values.city,
        zip: values.zipCode ?? undefined,
      },
      healthcareInfo: {
        healthInsuranceID: values.healthInsuranceID,
        doctorID: values.doctorID,
        healthcareProviderID: values.healthcareProviderID,
      },
    },
    {
      //eslint-disable-next-line
      onSuccess: async () => {
        toast.success("Patient updated");
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
    name="patientID"
    render={({field}) => (
      <FormItem>
        <FormLabel>PatientID</FormLabel>
        <FormControl>
          <Input placeholder="PatientID" {...field} disabled={!isAdmin} />
        </FormControl>

        <FormMessage />
      </FormItem>
  )}/>
      <FormField
    control={form.control}
    name="fullName"
    render={({field}) => (
      <FormItem>
        <FormLabel>Full Name</FormLabel>
        <FormControl>
          <Input placeholder="Patient's full name" {...field} disabled={!isAdmin} />
        </FormControl>

        <FormMessage />
      </FormItem>
  )}/>
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
  )}/> Not sure how to handle dates, maybe toString?*/}
      <FormField
    control={form.control}
    name="insuredID"
    render={({field}) => (
      <FormItem>
        <FormLabel>InsuredID</FormLabel>
        <FormControl>
          <Input placeholder="InsuredID" {...field} disabled={!isAdmin} />
        </FormControl>
        <FormDescription>The ID of the patient from their health insurance</FormDescription>
        <FormMessage />
      </FormItem>
  )}/>
      <FormField
    control={form.control}
    name="email"
    render={({field}) => (
      <FormItem>
        <FormLabel>Patient Email</FormLabel>
        <FormControl>
          <Input placeholder="Patient's email" {...field} disabled={!isAdmin} />
        </FormControl>

        <FormMessage />
      </FormItem>
  )}/>
      <FormField
    control={form.control}
    name="phone"
    render={({field}) => (
      <FormItem>
        <FormLabel>Patient phone number</FormLabel>
        <FormControl>
          <Input placeholder="Patient's phone number" {...field} disabled={!isAdmin} />
        </FormControl>

        <FormMessage />
      </FormItem>
  )}/>    <FormField
  control={form.control}
  name="note"
  render={({field}) => (
    <FormItem>
      <FormLabel>Any notes regarding the patient</FormLabel>
      <FormControl>
        <Textarea placeholder="Note" {...field} disabled={!isAdmin} />
      </FormControl>

      <FormMessage />
    </FormItem>
)}/>
    {isAdmin && (
      <Button
        type="submit"
        className="sticky bottom-5 left-0"
        isLoading={updatePatient.isLoading}
      >
        Submit
      </Button>
    )}
  </form>
</Form>
)
}