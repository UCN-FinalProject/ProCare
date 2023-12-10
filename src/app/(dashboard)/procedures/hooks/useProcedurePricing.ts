import { create } from "zustand";
import type { CreateProcedurePricingWithoutProcedureID } from "~/server/service/validation/ProcedureValidation";

// Define the state type
type ProcedurePricingStore = {
  array: CreateProcedurePricingWithoutProcedureID[];
  pushToArray: (item: CreateProcedurePricingWithoutProcedureID) => void;
  updateItem: (item: CreateProcedurePricingWithoutProcedureID) => void;
};

// Create a Zustand store with explicit types
export const useProcedurePricing = create<ProcedurePricingStore>((set) => ({
  array: [],
  pushToArray: (item: CreateProcedurePricingWithoutProcedureID) =>
    set((state) => {
      const newArray = [...state.array];
      if (
        newArray.findIndex(
          (i) => i.healthInsuranceId === item.healthInsuranceId,
        ) === -1
      ) {
        newArray.push(item);
      }
      return { array: newArray };
    }),
  updateItem: (item: CreateProcedurePricingWithoutProcedureID) =>
    set((state) => {
      const newArray = [...state.array];
      const index = newArray.findIndex(
        (i) => i.healthInsuranceId === item.healthInsuranceId,
      );
      newArray[index] = item;
      return { array: newArray };
    }),
}));
