import { cn } from "~/lib/utils";

type Props = React.ComponentPropsWithoutRef<"p"> & {
  children: React.ReactNode;
};
export default function ID(props: Props) {
  return (
    <p
      className={cn(
        "font-mono italic font-normal text-slate-400",
        props.className,
      )}
      {...props}
    >
      {props.children}
    </p>
  );
}
