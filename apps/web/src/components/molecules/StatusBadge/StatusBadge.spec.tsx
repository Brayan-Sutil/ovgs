import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./StatusBadge";

jest.mock("next-intl", () => ({
  useTranslations: () => {
    const labels = {
      EM_TRANSPORTE: "Em transporte"
    } as Record<string, string>;

    return (key: string) => labels[key] ?? key;
  }
}));

describe("StatusBadge", () => {
  it("renders the operational status label", () => {
    render(<StatusBadge status="EM_TRANSPORTE" />);

    expect(screen.getByText("Em transporte")).toBeInTheDocument();
  });
});
