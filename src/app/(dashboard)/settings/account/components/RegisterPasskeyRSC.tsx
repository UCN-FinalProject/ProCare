import { api } from "~/trpc/server";
import RegisterPasskey from "./RegisterPasskey";

export async function RegisterpasskeyRSC() {
  const registrationData = await api.auth.startPassKeyRegistration();
  return <RegisterPasskey webauthnData={registrationData} />;
}
