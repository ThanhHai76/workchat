// Angular module
import { Routes } from '@angular/router';

// Services
import { AuthGuardService as AuthGuard } from './services/auth/auth-guard.service';
import { RoleGuardService as RoleGuard } from './services/auth/role-guard.service';

// Components
// import { ProfileComponent } from './components/profile/profile.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';

// Commons
import { Common } from './commons/common';


export const ROUTES: Routes = [
  {
    path: Common.PATHS.login,
    component: LoginComponent
  },
  {
    path: Common.PATHS.register,
    component: RegisterComponent
  },
  {
    path: Common.PATHS.home,
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  // {
  //   path: Common.PATHS.profile,
  //   component: ProfileComponent,
  //   canActivate: [AuthGuard]
  // },
  {
    path: Common.PATHS.resetPassword,
    component: ResetPasswordComponent
  },
  {
    path: '**',
    redirectTo: Common.PATHS.home
  }
];
