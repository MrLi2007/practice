import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from "rxjs/Observable";
import {HttpRequest,HttpResponse} from '@angular/common/http';
import {saveAs} from 'file-saver';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { Router } from '@angular/router';
@Injectable()
export class AppService {

  public data: any = [];
  private headers: HttpHeaders;
  private loginStatus: Boolean = false;
  constructor(private http: HttpClient,private toastr: ToastsManager,private router: Router) {

    this.headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') });
  }

  // url = 'http://192.168.170.4:8080/fresche-rss-application';
  url = 'http://localhost:8088';

  saveInLocal(key, val): void {
    localStorage.setItem(key, val);
  }

  getFromLocal(key): any {
    return localStorage.getItem(key);
  }

  getLoginStatus(): Boolean {
    if(localStorage.getItem("token")==null){
      return this.loginStatus=false;
    }
    else{
      return this.loginStatus=true;
    }
  }

  setLoginStatus(loginStatus) {
    this.loginStatus = loginStatus;
  }

  postLoginAuthentication(data) {
    this.headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.url + '/token/generate-token', JSON.stringify(data), { headers: this.headers });
  }

  forgotPasswordRetrieval(email) {
    return this.http.post(this.url + '/token/forgotPassword', email);
  }

  validateToken(model) {
    return this.http.post(this.url + '/token/resetPassword', model);
  }

  
  validateTokenChangePass(model){
    return this.http.post(this.url +"/token/changePassword" , model);
}

 resetSession(){
    return this.http.post(this.url +"/token/resetSession" ,null, { headers: this.headers['headers'] });
  }

  addProject(data) {
    data.status= true;
    this.headers['headers'] = { 'Authorization': 'Bearer ' + localStorage.getItem('token') };
    return this.http.post(this.url + '/projects', data, { headers: this.headers['headers'] });
  }

  addResource(data) {
    this.headers['headers'] = { 'Authorization': 'Bearer ' + localStorage.getItem('token') };
    return this.http.post(this.url + '/resources', data, { headers: this.headers['headers'] });
  }
  getProjects(){
    this.headers['headers'] = { 'Authorization': 'Bearer ' + localStorage.getItem('token') };
    return this.http.get(this.url +"/projects" ,{ headers: this.headers['headers'] });
  }

  getResources(){
    this.headers['headers'] = { 'Authorization': 'Bearer ' + localStorage.getItem('token') };
    return this.http.get(this.url + "/resources?startDate=''&endDate=''", { headers: this.headers['headers'] });
  }
  updateResource(data){
    console.log("url - ", this.url + "/resources/"+data.resourceId)
    console.log("Updating resource - "+ JSON.stringify(data));

    this.headers['headers'] = { 'Authorization': 'Bearer ' + localStorage.getItem('token') };
    return this.http.put(this.url + "/resources/"+data.resourceId,data, { headers: this.headers['headers'] });
  }
  deleteResource(resourceId){
    
    console.log("url - ", this.url + "/resources/"+resourceId)
    console.log("Updating resource - "+ JSON.stringify(resourceId));

    this.headers['headers'] = { 'Authorization': 'Bearer ' + localStorage.getItem('token') };
    return this.http.delete(this.url + "/resources/"+resourceId, { headers: this.headers['headers'] });
  }
/* 
*
* For scheduler screeen.
*
*/
  getSchedulerProjects() {
    let startDate = new Date();
    let endDate = new Date();
    let userId = this.getFromLocal('userId');
    this.headers['headers'] = { 'Authorization': 'Bearer ' + localStorage.getItem('token') };
    if(this.getFromLocal('userRole')==103){
      return this.http.get(this.url + "/schedules/project?empId=" + userId , { headers: this.headers['headers'] });
    } else {
      return this.http.get(this.url + "/schedules/project", { headers: this.headers['headers'] });
    }
  }

  getSchedulerResources() {
    let userId = this.getFromLocal('userId');
    this.headers['headers'] = { 'Authorization': 'Bearer ' + localStorage.getItem('token') };
    if(this.getFromLocal('userRole')==103){
      return this.http.get(this.url + "/schedules/resource?empId=" + userId, { headers: this.headers['headers'] });
    } else {
      return this.http.get(this.url + "/schedules/resource", { headers: this.headers['headers'] });
    }
    
  }
  updateProject(data){
    this.headers['headers'] = { 'Authorization': 'Bearer ' + localStorage.getItem('token') };
    let projectId=data.projectId;
    return this.http.put(this.url + "/projects/" + projectId , data, { headers: this.headers['headers'] });
  }
  deleteProject(projectId){
    this.headers['headers'] = { 'Authorization': 'Bearer ' + localStorage.getItem('token') };
    return this.http.delete(this.url + "/projects/" + projectId,{ headers: this.headers['headers'] });
  }
 
  generateAndDownloadReport = ( resourceTypeId ,projectTypeId, locationId,roleId,deptId,startDate,endDate,skillIds,experience ,designation,formatValue) =>{
           let userId = this.getFromLocal('userId');
           const req = new HttpRequest('GET',this.url+'/reports/allocations'+ '?resourceTypeId=' + resourceTypeId+
           '&projectTypeId=' + projectTypeId+
           '&locationId=' + locationId+
           '&roleId=' + roleId+
           '&deptId=' + deptId+
           '&startDate=' + startDate+
           '&endDate=' + endDate+ 
           '&skillIds=' + skillIds +
           '&experience=' + experience +
           '&designation=' + designation +
           '&formatValue=' + formatValue +
           '&userId=' + userId  , {
        reportProgress: true,
        responseType: 'blob',       
      });
  
    this.http.request(req).subscribe(event => {
        if (event instanceof HttpResponse) {
          this.downloadFile(event.body, 'resource-allocation-report'+'.'+formatValue,formatValue);
          this.toastr.success('Report generated successfully.');
        }
      }, error => {
        const reader = new FileReader();
        reader.addEventListener('loadend', (e) => {
          //var error = JSON.parse(e.srcElement['result']);
         // this.toastr.error(error['message']);
         
        });
        //reader.readAsText(error.error);
        this.toastr.error('Some error occurred , Please contact administrator !');
      });
    }
    
    private  downloadFile = (blobContent: any, fileName: string,formatValue:string) => {
          let blob = new Blob([blobContent]);
          if(formatValue=='pdf'){
             blob = new Blob([blobContent], { type: 'application/pdf' });
          } else {
             blob = new Blob([blobContent], { type: 'application/octet-stream' });
          }
          saveAs(blob, fileName);
    }
    getDepartments(){
      this.headers['headers'] = { 'Authorization': 'Bearer ' + localStorage.getItem('token') };
      return this.http.get(this.url + "/configurations/departments" ,{ headers: this.headers['headers'] });
    }
    getRoles(){
      this.headers['headers'] = { 'Authorization': 'Bearer ' + localStorage.getItem('token') };
      return this.http.get(this.url + "/configurations/roles" ,{ headers: this.headers['headers'] });
    }
    getProjectTypes(){
      this.headers['headers'] = { 'Authorization': 'Bearer ' + localStorage.getItem('token') };
      return this.http.get(this.url + "/configurations/projectTypes" ,{ headers: this.headers['headers'] });
    }
    getLocations(){
      this.headers['headers'] = { 'Authorization': 'Bearer ' + localStorage.getItem('token') };
      return this.http.get(this.url + "/configurations/locations" ,{ headers: this.headers['headers'] });
    }
    getResourceTypes(){
      this.headers['headers'] = { 'Authorization': 'Bearer ' + localStorage.getItem('token') };
      return this.http.get(this.url + "/configurations/resorcetypes" ,{ headers: this.headers['headers'] });
    }
    getDesignations(){
      this.headers['headers'] = { 'Authorization': 'Bearer ' + localStorage.getItem('token') };
      return this.http.get(this.url + "/configurations/designations" ,{ headers: this.headers['headers'] });
    }
    getManagers(){
      this.headers['headers'] = { 'Authorization': 'Bearer ' + localStorage.getItem('token') };
      return this.http.get(this.url + "/configurations/managers" ,{ headers: this.headers['headers'] });
    }

    setProjectorResourceEvent(model){
      this.headers['headers'] = { 'Authorization': 'Bearer ' + localStorage.getItem('token') };
      return this.http.post(this.url +"/schedules",model,{headers:this.headers['headers']})
    }
    updateProjectorResourceEvent(model){
      console.log(model)
      this.headers['headers'] = { 'Authorization': 'Bearer ' + localStorage.getItem('token') };
      return this.http.put(this.url +"/schedules/"+model.assignmentId ,model,{headers:this.headers['headers']})
    }
    delProjectorResourceEvent(model){
      console.log(model)
      this.headers['headers'] = { 'Authorization': 'Bearer ' + localStorage.getItem('token') };
      return this.http.delete(this.url +"/schedules/"+model ,{headers:this.headers['headers']})
    }
    logout()
    {
      this.toastr.error("Invalid authentication/ Token Expired")
      this.router.navigate(['']);
      localStorage.clear();
    }
    getSkills(){
      this.headers['headers'] = { 'Authorization': 'Bearer ' + localStorage.getItem('token') };
      return this.http.get(this.url + "/configurations/skills" ,{ headers: this.headers['headers'] });
    }
  }
