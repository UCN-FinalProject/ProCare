"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { api } from "~/trpc/react";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "~/components/ui/calendar";
import SubmitButton from "~/components/Button";
import { Button } from "~/components/ui/button";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import { revalidatePathClient } from "~/app/revalidate";
import { useState } from "react";
import Link from "next/link";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { format } from "date-fns";
import type {
  Doctor,
  HealthInsuranceList,
  HealthcareProvider,
} from "~/server/db/export";

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
  healthInsuranceID: z.coerce.number().min(1, {
    message: "Patient's health insurance id is required",
  }),
  doctorID: z.coerce.number().min(1, {
    message: "Patient's personal doctor's id is required.",
  }),
  healthcareProviderID: z.coerce.number().min(1, {
    message: "ID of the health insurance provider is required.",
  }),
});

export default function CreatePatientForm({
  doctors,
  healthcareProviders,
  healthInsurances,
}: {
  doctors: Doctor[];
  healthcareProviders: HealthcareProvider[];
  healthInsurances: HealthInsuranceList[];
}) {
  const [setPatientID] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      ssn: "",
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
        isActive: true,
        biologicalSex: values.biologicalSex,
        dateOfBirth: values.dateOfBirth,
        ssn: values.ssn,
        recommendationDate: values.recommendationDate,
        acceptanceDate: values.acceptanceDate,
        startDate: values.startDate,
        expectedEndOfTreatment: new Date(),
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
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="Patient's full name" {...field} />
              </FormControl>

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
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select biological sex" />
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
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Birth </FormLabel>
              <FormControl>
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    {/* @ts-expect-error some prop error? */}
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        mode="single"
                        captionLayout="dropdown-buttons"
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                        className="rounded-md border"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="recommendationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recommendation Date</FormLabel>
              <FormControl>
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    {/* @ts-expect-error some prop error? */}
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        mode="single"
                        captionLayout="dropdown-buttons"
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                        className="rounded-md border"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    {/* @ts-expect-error some prop error? */}
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        mode="single"
                        captionLayout="dropdown-buttons"
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                        className="rounded-md border"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="acceptanceDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Acceptance Date</FormLabel>
              <FormControl>
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    {/* @ts-expect-error some prop error? */}
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                        mode="single"
                        captionLayout="dropdown-buttons"
                        fromYear={1900}
                        toYear={new Date().getFullYear()}
                        className="rounded-md border"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
              <FormLabel>Health insurance</FormLabel>
              <Select
                onValueChange={field.onChange}
                // defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a health insurance" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {healthInsurances.map((healthInsurance) => (
                    <SelectItem
                      key={healthInsurance.id}
                      value={String(healthInsurance.id)}
                    >
                      {healthInsurance.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="doctorID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor</FormLabel>
              <Select
                onValueChange={field.onChange}
                // defaultValue={field.value.toString()}
              >
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="healthcareProviderID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Healthcare provider</FormLabel>
              <Select
                onValueChange={field.onChange}
                // defaultValue={field.value.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select healthcare Provider" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {healthcareProviders.map((healthcareProvider) => (
                    <SelectItem
                      key={healthcareProvider.id}
                      value={String(healthcareProvider.id)}
                    >
                      {healthcareProvider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-1">
          <SubmitButton type="submit" isLoading={createPatient.isLoading}>
            Submit
          </SubmitButton>
          {createPatient.isSuccess && (
            <SubmitButton variant="outline">
              <Link href={"/patients/" + setPatientID}>View Patient</Link>
            </SubmitButton>
          )}
        </div>
      </form>
    </Form>
  );
}
