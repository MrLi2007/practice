import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { NavigationService } from './navigation.service';
import { AppService } from '../app.service';
import {Md5} from 'ts-md5/dist/md5';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  modalRef: BsModalRef;
  roles:string='';
  userName: string='';
  userEmail: string='';
  userEmailLower: string='';
  emailHash: any='';
  src: string='';
  private role:String="";
  constructor(private router: Router, private appService: AppService,private modalService: BsModalService,private navigationService:NavigationService) {
  this.roles=this.navigationService.getRole();
  this.userName = this.navigationService.getUserName();
  this.userEmail = this.navigationService.getUserEmail();
  if(this.userEmail != null){
    this.userEmailLower = this.userEmail.toLowerCase();
    this.emailHash = Md5.hashStr(this.userEmailLower);
    this.src = "https://freschesolutions.bamboohr.com/employees/photos/?h="+this.emailHash;  
  }
  console.log(this.src);
    }

  ngOnInit() {
    this.role =this.appService.getFromLocal("userRole");
  }
  fetchTimesheetSummary():any{
    this.router.navigate(['timesheetSummary']);
}
   signout(){
    localStorage.clear();
    this.appService.setLoginStatus(false);
    this.appService.resetSession().subscribe(data => {
    this.router.navigate([""]);
    });

   }
   
}
