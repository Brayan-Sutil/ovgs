import { SetMetadata } from "@nestjs/common";
import { AccessAction, AccessModule, AccessPolicy } from "./access-control.types";

export const ACCESS_POLICY_KEY = "access-policy";

export function RequirePermission(module: AccessModule, action: AccessAction) {
  return SetMetadata(ACCESS_POLICY_KEY, { module, action } satisfies AccessPolicy);
}
