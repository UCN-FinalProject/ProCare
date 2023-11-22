import React from "react";

export default function NullOrUndefined({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <p className="text-slate-400 font-normal italic p-0">
      {children ? children : "Unknown"}
    </p>
  );
}
