import { eq } from "drizzle-orm";
import { db } from "../db";
import { external_healthcare_provider } from "../db/schema/healthcareProviders";

export default {
  async getHealthCareProviderByID({ id }: { id: number }) {
    const res = await db
      .select()
      .from(external_healthcare_provider)
      .where(eq(external_healthcare_provider.id, id))
      .limit(1);

    if (!res[0]) throw new Error("External healthcare provider not Found");
    return res[0];
  },
};
