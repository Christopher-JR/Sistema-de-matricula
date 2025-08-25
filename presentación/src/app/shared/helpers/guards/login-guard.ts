import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { inject } from '@angular/core';

export const loginGuard : CanActivateFn = (route, state) => {
  const authSrv = inject(AuthService);
  const router = inject(Router);

  return !authSrv.isLoggedIn();
};
