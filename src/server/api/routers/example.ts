import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { decryptText, encryptText } from "~/server/encrypt";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  encrypt: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        original: input.text,
        encrypted: encryptText(input.text),
      };
    }),

  decrypt: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        original: input.text,
        decrypted: decryptText(input.text),
      };
    }),
});
