import React from "react";

export default function Welcome({ email }: { email: string }) {
  return (
    <div>
      <h1>Welcome, {email}</h1>
    </div>
  );
}
