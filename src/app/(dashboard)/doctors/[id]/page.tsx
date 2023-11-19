import React from "react";

export default function page({ params }: { params: { id: number } }) {
  return <div>details {params.id}</div>;
}
