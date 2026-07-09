import { transportTypeFormSchema } from "./schemas";

describe("transportTypeFormSchema", () => {
  it("requires a name with at least two characters", () => {
    const result = transportTypeFormSchema.safeParse({
      name: "A",
      active: true
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.name).toEqual([
        "Informe ao menos 2 caracteres"
      ]);
    }
  });
});
