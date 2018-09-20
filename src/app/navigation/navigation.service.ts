import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { AppService } from '../app.service';
@Injectable()
export class NavigationService {
    
  public data: any = [];
  role : String;
  constructor(private appService: AppService) {
    
  }

  getRole():any{
    return this.appService.getFromLocal("userRole");
   // console.log("ROLES2  "+this.role);
  }
  getUserName():any{
    return this.appService.getFromLocal("userName");
  }
  getUserEmail():any{
    return this.appService.getFromLocal("userEmail");
  }
  
}