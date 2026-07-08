import { AccessAction, AccessModule, UserRole } from "./access-control.types";
import { hasPermission } from "./permissions";

describe("permissions", () => {
  it("allows master admin to access every module and action", () => {
    for (const moduleName of Object.values(AccessModule)) {
      for (const action of Object.values(AccessAction)) {
        expect(hasPermission(UserRole.MasterAdmin, { module: moduleName, action })).toBe(true);
      }
    }
  });

  it("prevents viewer from mutating CRUD resources", () => {
    expect(
      hasPermission(UserRole.Viewer, {
        module: AccessModule.Customers,
        action: AccessAction.Create
      })
    ).toBe(false);

    expect(
      hasPermission(UserRole.Viewer, {
        module: AccessModule.SalesOrders,
        action: AccessAction.Read
      })
    ).toBe(true);
  });
});
