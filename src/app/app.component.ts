import { Component, ViewContainerRef, DoCheck } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AppService } from './app.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck {
  items: MenuItem[];
  private isLoggedIn: Boolean = false;
  constructor(private router: Router, public toastr: ToastsManager, vcr: ViewContainerRef, private appService: AppService) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngDoCheck() {
  
    this.isLoggedIn = this.appService.getLoginStatus()
    /* if(this.appService.getFromLocal('token') != null){
      this.isLoggedIn=true;
    } */
  }
/*   setLoginStatus(loginStatus) {
    this.isLoggedIn = this.appService.getLoginStatus()
  } */
}
