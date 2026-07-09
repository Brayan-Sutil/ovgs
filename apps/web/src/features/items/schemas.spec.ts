import { itemFormSchema } from "./schemas";

describe("itemFormSchema", () => {
  it("requires sku and name with at least two characters", () => {
    const result = itemFormSchema.safeParse({
      sku: "A",
      name: "",
      description: ""
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.sku).toEqual(["Informe ao menos 2 caracteres"]);
      expect(errors.name).toEqual(["Informe ao menos 2 caracteres"]);
    }
  });
});
