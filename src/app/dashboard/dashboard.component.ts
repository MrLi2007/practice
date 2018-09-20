import { Component, OnInit, ViewChild, AfterViewInit, DoCheck, Input } from '@angular/core';
import { NavigationService } from '../navigation/navigation.service';
import { AppService } from '../app.service';
import { Md5 } from 'ts-md5/dist/md5';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dept:any;
  roles: string = '';
  userName: string = '';
  userEmail: string = '';
  userEmailLower: string = '';
  emailHash: any = '';
  src: string = '';
  chart: boolean = false;
  graph: boolean = false;
  tableResource = true;
  tableProject = false;
  resources: any[] = [];
  projects: any[] = [];
  projectDetail: any[] = [];
  profileDetail: any[] = [];
  projectList = [];
  resourceList = [];

 
  constructor(private appService: AppService, private navigationService: NavigationService) {
    this.roles = this.navigationService.getRole();
    this.roles = this.navigationService.getRole();
    this.userName = this.navigationService.getUserName();
    this.userEmail = this.navigationService.getUserEmail();
    this.getSchedulerResources();
    this.getSchedulerProjects();
    if (this.userEmail != null) {
      this.userEmailLower = this.userEmail.toLowerCase();
      this.emailHash = Md5.hashStr(this.userEmailLower);
      this.src = "https://freschesolutions.bamboohr.com/employees/photos/?h=" + this.emailHash;
    }
    this.getDepartments();
  }

  ngOnInit() {


  }


  getSchedulerProjects() {
    this.appService.getSchedulerProjects().subscribe((data) => {
      this.projects = data["results"];
      console.log(this.projects);
      for (let project of this.projects) {
        this.projectDetail.push();
      }
      console.log(this.projectDetail);
    }, error => {
      console.log(error);
    });
  }

  getSchedulerResources() {
    this.appService.getSchedulerResources().subscribe((data) => {
      this.resources = data["results"];
      console.log(this.resources);
      for (let resource of this.resources) {
        resource.emailHash = Md5.hashStr(resource.email.toLowerCase());
        resource.src = "https://freschesolutions.bamboohr.com/employees/photos/?h=" + resource.emailHash;
        this.profileDetail.push();
      }
      console.log(this.profileDetail);
    }, error => {
      console.log(error);
    });
  }

  getDepartments() {
    this.appService.getDepartments().subscribe((data) => {
      const mapped = Object.entries(data).map(([index, detail]) => ({ index, detail }));
      this.dept = mapped;
    },
      (error) => {
        
      },
      () => { });
  }



  resourcesOnProjects() {
    this.tableResource = true;
    this.tableProject = false;
  }

  projectAllocatios() {
    this.tableResource = false;
    this.tableProject = true;
  }

  chartView() {

  }

  graphView() {

  }


}
