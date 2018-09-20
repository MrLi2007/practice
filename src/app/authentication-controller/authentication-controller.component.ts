import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
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



@Component({
  selector: 'app-authentication-controller',
  templateUrl: './authentication-controller.component.html',
  styleUrls: ['./authentication-controller.component.css']
})
export class AuthenticationControllerComponent implements OnInit {
  myform;
  private formStatus:String = "Login";
  userDetail:any = {username:"" , password:""}

  constructor(private router: Router , private appService:AppService, private toastr: ToastsManager) { 

    if (this.appService.getLoginStatus()) {
      if (confirm("would you like to invalidate previous login?")) {
        localStorage.clear();

        this.appService.resetSession().subscribe(data => {
          var backlen = history.length;
          history.go(-backlen);
          this.router.navigate([""]);
          this.toastr.dispose();
          this.toastr.info('Logged out successfully');
        }, error => {
          console.log(error);
          this.toastr.dispose();
          this.toastr.error("Error while logout. Error- " + JSON.stringify(error.message));
          this.router.navigate([""]);
        });

      } else {
        router.navigate(['scheduler']);
      }
    }
    this.myform = new FormGroup({
      email: new FormControl('', [ 
        Validators.required
        
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern("^(?=.*?[0-9]).{8,15}$")
    ])
  });

  }

  ngOnInit() {
    
  }
 
 

  authenticateLogin(userdetail){
    this.toastr.dispose();
    this.appService.postLoginAuthentication(this.userDetail).subscribe(data => {
            this.appService.saveInLocal("token",data["token"]);
            this.appService.saveInLocal("userRole",data["role"]);
            this.appService.saveInLocal("userName",data["userFullName"]);
            this.appService.saveInLocal("userId",data["username"]);
            this.appService.saveInLocal("userEmail",data["userEmail"]);
           this.appService.setLoginStatus(true);
           this.toastr.dispose();
           this.toastr.success("Logged In successfully");
            this.router.navigate(['scheduler']);
          }, error => {
            if(userdetail.username == ""){
              
              this.toastr.error("Please fill out EmployeeId");
            }
            else if(userdetail.username.length > 5){
              
              this.toastr.error("The Username length is maximum 5");
            }
            else if(userdetail.password == ""){
              
              this.toastr.error("Please fill out Password");
            }
            else if(userdetail.password.length < 8 || userdetail.password.length > 15){
              
              this.toastr.error("The length of password should between 8 to 15")
            }
            else if(error.status=== 401){
              
              this.toastr.error("Invalid Credentials");
              userdetail.username = "";
              userdetail.password = "";
            }else{
              
              this.toastr.error(error.message)
            }
          });
  }
  formStatusScreen(status){
    status=='Login'?this.formStatus = 'Submit': this.formStatus =  'Login';
}

}
