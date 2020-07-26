// Angular module
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import decode from 'jwt-decode';

// Services
import { AuthService } from './auth.service';

// Commons
import { Common } from './../../commons/common';

@Injectable()
export class RoleGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    // this will be passed from the route config
    // on the data property
    const expectedRole = route.data.expectedRole;
    const token = localStorage.getItem(Common.KEYS.token);

    if (!token) {
      this.router.navigate([Common.PATHS.login]);
      return false;
    }

    // decode the token to get its payload
    const tokenPayload = decode(token);
    if (!this.auth.isAuthenticated() || tokenPayload.role !== expectedRole) {
      this.router.navigate([Common.PATHS.login]);
      return false;
    }
    return true;
  }
}
