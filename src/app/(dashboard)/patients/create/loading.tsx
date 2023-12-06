import FormFieldLoader from "~/components/Loaders/FormFieldLoader";
import PageHeader from "~/components/Headers/PageHeader";
import TextAreaLoader from "~/components/Loaders/TextAreaLoader";

export default function Loading() {
  return (
    <div className="space-y-[28px] lg:max-w-lg">
      <PageHeader>New Patient</PageHeader>
      <FormFieldLoader/>
      <FormFieldLoader/>
      <FormFieldLoader/>
      <FormFieldLoader/>
      <FormFieldLoader hasDescription />
      <TextAreaLoader />
    </div>
  );
}