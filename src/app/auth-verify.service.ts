import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from "@angular/router";
import { AppService } from "./app.service";

@Injectable()
export class AuthVerifyService implements CanActivate {

  private url;
  constructor(private appService: AppService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot) {

    this.url = route.data.url;

    if (this.appService.getLoginStatus()) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }

  }

}
