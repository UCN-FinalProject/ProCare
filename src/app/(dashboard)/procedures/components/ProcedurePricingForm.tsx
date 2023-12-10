"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

import Button from "~/components/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import { revalidatePathClient } from "~/app/revalidate";
import { type ProcedurePricing } from "~/server/db/export";
import { type CreateProcedurePricingWithoutProcedureID } from "~/server/service/validation/ProcedureValidation";
import { useProcedurePricing } from "../hooks/useProcedurePricing";
import { useEffect } from "react";

const formSchema = z.object({
  credits: z.string(),
  price: z.string(),
});

type Props =
  | {
      variant: "update";
      data: ProcedurePricing;
    }
  | {
      variant: "create";
      data: CreateProcedurePricingWithoutProcedureID;
    };

export default function ProcedurePricingForm(props: Props) {
  const router = useRouter();
  const isUpdate = props.variant === "update";

  const procedurePricing = useProcedurePricing();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      credits: isUpdate ? String(Number(props.data?.credits)) : "0",
      price: isUpdate ? String(Number(props.data?.price)) : "0",
    },
  });

  useEffect(() => {
    if (props.variant === "create") {
      procedurePricing.pushToArray({
        healthInsuranceId: props.data.healthInsuranceId,
        credits: Number(form.getValues("credits")),
        price: form.getValues("price"),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (props.variant === "create") {
      procedurePricing.updateItem({
        healthInsuranceId: props.data.healthInsuranceId,
        credits: Number(form.getValues("credits")),
        price: form.getValues("price"),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.variant === "create", form.watch("credits"), form.watch("price")]);

  const addPricing = api.procedure.addPricing.useMutation();
  async function onSubmit(values: z.infer<typeof formSchema>) {
    isUpdate &&
      (await addPricing.mutateAsync(
        {
          healthInsuranceId: props.data.healthInsuranceId,
          procedureId: props.data.procedureId,
          credits: Number(values.credits),
          price: values.price,
        },
        {
          // eslint-disable-next-line
          onSuccess: async (res) => {
            toast.success("Procedure pricing updated.");
            await revalidatePathClient();
            router.refresh();
          },
          onError: (err) => toast.error(err.message),
        },
      ));
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="credits"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Credits</FormLabel>
              <FormControl>
                <Input placeholder="Credits" type="number" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input placeholder="Price" type="number" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        {props.variant === "update" && (
          <Button type="submit" isLoading={addPricing.isLoading}>
            Update
          </Button>
        )}
      </form>
    </Form>
  );
}
