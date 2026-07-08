import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ACCESS_POLICY_KEY } from "./require-permission.decorator";
import { AccessPolicy, AuthenticatedUser } from "./access-control.types";
import { hasPermission, parseUserRole } from "./permissions";

type RequestLike = {
  headers: Record<string, string | string[] | undefined>;
  user?: AuthenticatedUser;
};

@Injectable()
export class AccessControlGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const policy = this.reflector.getAllAndOverride<AccessPolicy>(ACCESS_POLICY_KEY, [
      context.getHandler(),
      context.getClass()
    ]);

    if (!policy) {
      return true;
    }

    const request = context.switchToHttp().getRequest<RequestLike>();
    const role = parseUserRole(request.headers["x-user-role"]);

    if (!role) {
      throw new UnauthorizedException("Perfil de acesso nao informado ou invalido");
    }

    request.user = {
      id: resolveUserId(request.headers["x-user-id"]),
      role
    };

    if (!hasPermission(role, policy)) {
      throw new ForbiddenException("Perfil sem permissao para executar esta acao");
    }

    return true;
  }
}

const resolveUserId = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0] ?? "anonymous";
  }

  return value ?? "anonymous";
};
