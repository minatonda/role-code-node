import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import { JwtGuard } from './jwt.guard';
 
const RoleGuard = (role: string): Type<CanActivate> => {
  class RoleGuardMixin extends JwtGuard implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest();
      const user = request.user;
 
      return user?.role===role;
    }
  }
 
  return mixin(RoleGuardMixin);
}
 
export default RoleGuard;