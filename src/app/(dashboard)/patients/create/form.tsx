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
import { useEffect, useState } from "react";
import Link from "next/link";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import { format } from "date-fns";
import type {
  HealthInsuranceList,
  HealthcareProvider,
} from "~/server/db/export";
import { Separator } from "~/components/ui/separator";
import { patientFormSchema } from "../PatientFormSchema";
import { usePathname, useRouter } from "next/navigation";

const formSchema = z.object({
  ...patientFormSchema.shape,
});

export default function CreatePatientForm({
  doctors,
  healthcareProviders,
  healthInsurances,
}: Readonly<{
  doctors: { id: number; fullName: string }[];
  healthcareProviders: HealthcareProvider[];
  healthInsurances: HealthInsuranceList[];
}>) {
  const [patientID, setPatientID] = useState<string | null>(null);
  const { replace } = useRouter(); // eslint-disable-line @typescript-eslint/unbound-method
  const pathname = usePathname();

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

  useEffect(() => {
    const params = new URLSearchParams();
    params.set(
      "healthcareproviderid",
      String(form.watch("healthcareProviderID")),
    );
    replace(`${pathname}?${params.toString()}`);
  }, [form, form.watch("healthcareProviderID")]);

  const createPatient = api.patient.create.useMutation();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createPatient.mutateAsync(
      {
        fullName: values.fullName.trim(),
        isActive: true,
        biologicalSex: values.biologicalSex,
        dateOfBirth: values.dateOfBirth,
        ssn: values.ssn.trim(),
        recommendationDate: values.recommendationDate,
        acceptanceDate: values.acceptanceDate ?? undefined,
        startDate: values.startDate,
        expectedEndOfTreatment: values.expectedEndOfTreatment,
        insuredID: values.insuredID,
        email: values.email ?? undefined,
        phone: values.phone ?? undefined,
        disability: values.disability,
        alergies: values.alergies ?? undefined,
        note: values.note ?? undefined,
        address1: values.address1,
        address2: values.address2 ?? undefined,
        city: values.city,
        zip: values.zip ?? undefined,
        healthInsuranceID: values.healthInsuranceID,
        doctorID: values.doctorID,
        healthcareProviderID: values.healthcareProviderID,
      },
      {
        onSuccess: (res) => {
          setPatientID(res.id);
          toast.success("Patient successfully created.");
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
          name="biologicalSex"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bilogical sex</FormLabel>
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
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of birth </FormLabel>
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

        <Separator />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Patient email</FormLabel>
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
        />

        <Separator />

        <FormField
          control={form.control}
          name="healthInsuranceID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Health insurance</FormLabel>
              <Select onValueChange={field.onChange}>
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
          name="insuredID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Insured ID</FormLabel>
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

        <Separator />

        <FormField
          control={form.control}
          name="healthcareProviderID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Healthcare provider</FormLabel>
              <Select onValueChange={field.onChange}>
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
        <FormField
          control={form.control}
          name="doctorID"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor</FormLabel>
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
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <FormField
          control={form.control}
          name="recommendationDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recommendation date</FormLabel>
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
              <FormLabel>Start date</FormLabel>
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
              <FormLabel>Acceptance date</FormLabel>
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
          name="expectedEndOfTreatment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expected end of treatment</FormLabel>
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

        <Separator />

        <FormField
          control={form.control}
          name="address1"
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
          name="address2"
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
              <FormLabel>Zip code</FormLabel>
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
          name="alergies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alergies</FormLabel>
              <FormControl>
                <Input placeholder="Alergies" {...field} />
              </FormControl>
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
                <Textarea placeholder="Note" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <div className="flex gap-1">
          <SubmitButton type="submit" isLoading={createPatient.isPending}>
            Submit
          </SubmitButton>
          {createPatient.isSuccess && (
            <SubmitButton variant="outline">
              <Link href={`/patients/${patientID}`}>View Patient</Link>
            </SubmitButton>
          )}
        </div>
      </form>
    </Form>
  );
}
