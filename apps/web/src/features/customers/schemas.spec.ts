import { customerFormSchema } from "./schemas";

const validCustomer = {
  name: "Acme Distribuidora",
  document: "12345678000199",
  email: "financeiro@acme.com",
  authorizedTransportTypeIds: []
};

describe("customerFormSchema", () => {
  it("accepts an empty optional email", () => {
    expect(
      customerFormSchema.safeParse({
        ...validCustomer,
        email: ""
      }).success
    ).toBe(true);
  });

  it("rejects an invalid email with an inline field message", () => {
    const result = customerFormSchema.safeParse({
      ...validCustomer,
      email: "$"
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.flatten().fieldErrors.email).toEqual(["Informe um e-mail valido"]);
    }
  });
});
