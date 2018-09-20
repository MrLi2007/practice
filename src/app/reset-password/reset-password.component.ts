import { Component, OnInit } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { HttpClient } from '@angular/common/http';
import { AppService } from '../app.service';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  clearMessage:boolean;
  myform;
  myform2;
  modalRef: BsModalRef;
  model: any = { userEmail: "", randomCode: "", password: "", rePassword: "" };
  modalRef2: BsModalRef;
  modalRef3: BsModalRef;
  templateNested3: TemplateRef<any>;
  // url = "http://localhost:8080/timesheet";
  constructor(private modalService: BsModalService, private appService: AppService, private http: HttpClient,private toastr: ToastsManager) {
    this.myform = new FormGroup({
      userEmail: new FormControl('', [
        Validators.required,
        Validators.pattern("^[A-Za-z0-9._%+-]+@freschesolutions.com$")
      ])

    });

    this.myform2 = new FormGroup({
      randomCode: new FormControl('', [

        Validators.required
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern("^(?=.*?[0-9]).{8,15}$")
      ]),
      rePassword: new FormControl('', [
        Validators.required,
        Validators.pattern("^(?=.*?[0-9]).{8,15}$")
      ])
    });
  }

  closePopup2(){
    this.modalRef2.hide();
    this.myform2.reset();
   }

  openModal3(template: TemplateRef<any>) {
    this.modalRef3 = this.modalService.show(template, { class: 'modal-lg' });
  }


  openModal2(template: TemplateRef<any>) {
    this.model.randomCode="";
    this.model.password="";
    this.model.rePassword="";
    this.modalRef2 = this.modalService.show(template, { class: 'modal-lg' });
  }


  openModal(template: TemplateRef<any>) {
    this.model.userEmail="";
    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
  }

  sendEmail(model,template: TemplateRef<any>,template1: TemplateRef<any>) {
    this.appService.forgotPasswordRetrieval(model).subscribe(data => {
      
      if(data['validEmail']!=false){
      
        console.log(data);
        this.openModal2(template);
      
      }else{
        this.toastr.dispose();
        this.toastr.error("Entered EmailId is not associated with any employee");
        console.log(data);
        this.openModal(template1);
       
      }
     
    });

    // this.http.post(this.url,model);
  }

  // isClear()
  // {
  //   this.clearMessage=true;
  // }

  matchOtpAndUpdatePass(model,template: TemplateRef<any>) {
    this.toastr.dispose();
    if (model.password === model.rePassword) {
      this.appService.validateToken(model).subscribe(data => {
       
        if(data['validToken']!=false){
          if(data['passMatchWithPrev']){
            this.toastr.dispose();
            this.toastr.error("Current Password And Existing Password must not be Same");
            //this.openModal(template);
            //this.modalRef.hide();
          }else{
            this.toastr.dispose();
            this.toastr.success("Passsword Changed Successfully");
            this.modalRef.hide();
            this.closePopup2();
          }
        }else {
          this.toastr.dispose();
          this.openModal2(template);
          this.toastr.error("Invalid OTP Entered");
        }
      });

    }else {
      this.toastr.dispose();
      this.toastr.error("Passwords do not match!");
      this.openModal2(template);
    }
    console.log(model);
  }
}