import { Component, OnInit } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../app.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  myform;
  model: any = {
    currentPassword: "",
    newPassword: "",
    confirm_password: "",
    userEmail: "",
    username: ""
  };

  modalRef: BsModalRef;
  templateNested3: TemplateRef<any>;

  constructor(private modalService: BsModalService, private appService: AppService, private http: HttpClient, private toastr: ToastsManager,private router: Router) {

    this.myform = new FormGroup({
      currentPassword: new FormControl('', [

        Validators.required
      ]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.pattern("^(?=.*?[0-9]).{8,15}$")
      ]),
      confirm_password: new FormControl('', [
        Validators.required,
        Validators.pattern("^(?=.*?[0-9]).{8,15}$")
      ])
    });
  }
  
  closePopup(){
   this.modalRef.hide();
   this.myform.reset();
  }

  ngOnInit() {

  }

   

  openModal(template: TemplateRef<any>) {
    this.model.currentPassword="";
    this.model.newPassword="";
    this.model.confirm_password="";
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  logout()
  {
    this.router.navigate(['']);
    localStorage.clear();
    //this.toastr.success('Password Changed Successfully');
    history.pushState(null, null, location.href);
    window.onpopstate = function(event) {
     history.go(1);
    };
    this.modalRef.hide();
  }
  matchAndChangePassword(model,template: TemplateRef<any>){
    this.model.username = this.appService.getFromLocal('userId');
    this.model.userEmail = this.appService.getFromLocal('email');
    
    if (model.newPassword == model.confirm_password && (model.newPassword != "" || model.confirm_password != ""))  
    {
      this.appService.validateTokenChangePass(model).subscribe(data => {
        if(data['passwordReset']!=false){
          this.toastr.dispose();
          this.toastr.success("Password Changed Successfully");
          this.modalRef.hide();
          this.logout();
        }
        if(data['passwordReset']==false){
          if(data['passMatchWithPrev']){
            this.toastr.dispose();
            this.toastr.error("Current Password And Existing Password must not be Same");
            //this.openModal(template);
            this.modalRef.hide();
          }
          else if(data['validPassword']=false){
            this.toastr.dispose();
            this.toastr.error("The ");
          }
          else{
            this.toastr.dispose();
            this.toastr.error("Invalid Current Password");
            // this.openModal(template);
          }
        }

        // console.log(data);
      });
    }
    else if(model.newPassword != model.confirm_password){
      this.toastr.dispose();
      this.toastr.error('Password do not match');
      // this.openModal(template);
    }
    console.log(model);

  }
}
