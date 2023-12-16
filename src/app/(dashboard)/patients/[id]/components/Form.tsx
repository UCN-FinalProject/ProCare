"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { api } from "~/trpc/react";
import ButtonReusable from "~/components/Button";
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
import { format } from "date-fns";
import { cn } from "~/lib/utils";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import { revalidatePathClient } from "~/app/revalidate";
import { Textarea } from "~/components/ui/textarea";
import type {
  Doctor,
  HealthInsuranceList,
  HealthcareProvider,
  Patient,
} from "~/server/db/export";
import { type Session } from "next-auth";
import { useRouter } from "next/navigation";
import { Calendar } from "~/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { Separator } from "~/components/ui/separator";

const disabilities = [
  "limited_physical",
  "physical",
  "mental",
  "none",
] as const;

const formSchema = z.object({
  id: z.string(),
  fullName: z.string().min(1, {
    message: "Full name cannot be empty.",
  }),
  biologicalSex: z.enum(["male", "female"]),
  dateOfBirth: z.date(),
  ssn: z.string(),
  recommendationDate: z.date(),
  acceptanceDate: z.date().optional(),
  startDate: z.date(),
  expectedEndOfTreatment: z.date(),
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

export default function UpdatePatientForm({
  patient,
  doctors,
  healthInsurances,
  healthcareProviders,
  session,
}: Readonly<{
  patient: Patient;
  doctors: Doctor[];
  healthInsurances: HealthInsuranceList[];
  healthcareProviders: HealthcareProvider[];
  session: Session;
}>) {
  const isAdmin = session.user.role === "admin";
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: patient.id,
      fullName: patient.fullName,
      ssn: patient.ssn,
      biologicalSex: patient.biologicalSex,
      dateOfBirth: patient.dateOfBirth,
      disability: patient.disability,
      email: patient.email ?? undefined,
      phone: patient.phone ?? undefined,
      healthInsuranceID: patient.healthcareInfo?.healthInsuranceID,
      insuredID: patient.insuredID,
      healthcareProviderID: patient.healthcareInfo?.healthcareProviderID,
      doctorID: patient.healthcareInfo?.doctorID,
      recommendationDate: patient.recommendationDate ?? undefined,
      startDate: patient.startDate,
      acceptanceDate: patient.acceptanceDate ?? undefined,
      expectedEndOfTreatment: patient.expectedEndOfTreatment,
      address1: patient.address?.address1,
      address2: patient.address?.address2 ?? undefined,
      city: patient.address?.city,
      zip: patient.address?.zipCode,
      alergies: patient.alergies ?? undefined,
      note: patient.note ?? undefined,
    },
  });
  const updatePatient = api.patient.update.useMutation();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updatePatient.mutateAsync(
      {
        id: patient.id!,
        fullName: values.fullName,
        disability: values.disability,
        email: values.email,
        phone: values.phone,
        healthInsuranceID: values.healthInsuranceID,
        insuredID: values.insuredID,
        healthcareProviderID: values.healthcareProviderID,
        doctorID: values.doctorID,
        acceptanceDate: values.acceptanceDate,
        recommendationDate: values.recommendationDate,
        expectedEndOfTreatment: values.expectedEndOfTreatment,
        address1: values.address1,
        address2: values.address2,
        city: values.city,
        zip: values.zip,
        alergies: values.alergies,
        note: values.note,
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
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fullName"
          disabled={!isAdmin}
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
          name="ssn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SSN</FormLabel>
              <FormControl>
                <Input {...field} disabled />
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
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled
              >
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
                          disabled
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

                    {/* @ts-expect-error some prop? */}
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
          disabled={!isAdmin}
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
          disabled={!isAdmin}
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
        <FormField
          control={form.control}
          name="phone"
          disabled={!isAdmin}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input placeholder="Phone number" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <FormField
          control={form.control}
          name="healthInsuranceID"
          disabled={!isAdmin}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Health insurance</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={String(field.value)}
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
          name="insuredID"
          disabled={!isAdmin}
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
          disabled={!isAdmin}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Healthcare provider</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={String(field.value)}
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
        <FormField
          control={form.control}
          name="doctorID"
          disabled={!isAdmin}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Doctor</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={String(field.value)}
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

        <Separator />

        <FormField
          control={form.control}
          name="recommendationDate"
          disabled={!isAdmin}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recommendation date</FormLabel>
              <FormControl>
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={!isAdmin}
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
                    {/* @ts-expect-error some prop? */}
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
          disabled
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start date</FormLabel>
              <FormControl>
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled
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

                    {/* @ts-expect-error some prop? */}
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        selected={field.value}
                        onSelect={field.onChange}
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
          disabled={!isAdmin}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Acceptance date</FormLabel>
              <FormControl>
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={!isAdmin}
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

                    {/* @ts-expect-error some prop? */}
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
          disabled={!isAdmin}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expected end of treatment</FormLabel>
              <FormControl>
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          disabled={!isAdmin}
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

                    {/* @ts-expect-error some prop? */}
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
          disabled={!isAdmin}
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
          disabled={!isAdmin}
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
          disabled={!isAdmin}
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
          disabled={!isAdmin}
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
          disabled={!isAdmin}
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
          name="note"
          disabled={!isAdmin}
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

        {isAdmin && (
          <ButtonReusable
            type="submit"
            className="sticky bottom-5 left-0"
            isLoading={updatePatient.isLoading}
          >
            Submit
          </ButtonReusable>
        )}
      </form>
    </Form>
  );
}
