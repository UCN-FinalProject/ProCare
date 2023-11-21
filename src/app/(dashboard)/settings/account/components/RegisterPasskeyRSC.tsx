import { api } from "~/trpc/server";
import RegisterPasskey from "./RegisterPasskey";

export async function RegisterpasskeyRSC() {
  const registrationData = await api.auth.startPassKeyRegistration.query();
  return <RegisterPasskey webauthnData={registrationData} />;
}
