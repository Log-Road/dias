import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "./role.decorator";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get(Role, context.getHandler());
    if (!role) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const { user } = request.body;
    if (!user) throw new UnauthorizedException();
    return role === user.role;
  }
}
