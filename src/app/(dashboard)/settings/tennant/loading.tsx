import { Separator } from "~/components/ui/separator";
import PageHeader from "~/components/Headers/PageHeader";
import FormFieldLoader from "~/components/Loaders/FormFieldLoader";

export default function Loading() {
  return (
    <div className="space-y-[22px] lg:max-w-lg">
      <PageHeader>Tennant settings</PageHeader>
      <FormFieldLoader />
      <FormFieldLoader />
      <FormFieldLoader />

      <Separator />

      <FormFieldLoader />
      <FormFieldLoader hasDescription />

      <Separator />

      <FormFieldLoader hasDescription />
      <FormFieldLoader />
      <FormFieldLoader />
      <FormFieldLoader />
      <FormFieldLoader />
    </div>
  );
}
