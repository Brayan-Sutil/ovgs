import { render, screen } from "@testing-library/react";
import { StatusBadge } from "./StatusBadge";

describe("StatusBadge", () => {
  it("renders the operational status label", () => {
    render(<StatusBadge status="EM_TRANSPORTE" />);

    expect(screen.getByText("EM TRANSPORTE")).toBeInTheDocument();
  });
});
