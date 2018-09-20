import {
  Component,
  OnInit,
  TemplateRef

}

  from '@angular/core';
import {
  PROFILEDUMMY
}
  from '../DummyData/ProfileDummy';
import { Md5 } from 'ts-md5/dist/md5';
import {
  HttpClient
}
  from '@angular/common/http';
import { DatePipe } from '@angular/common';
import {
  FormsModule
}
  from '@angular/forms';
import {
  BsModalService
}
  from 'ngx-bootstrap/modal';
import {
  BsModalRef
}
  from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {
  ToastsManager
}
  from 'ng2-toastr/ng2-toastr';
import {
  AppService
}
  from '../app.service';
import { ArrayObservable } from 'rxjs/observable/ArrayObservable';
import { _ } from 'underscore';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { SKILLS } from '../DummyData/SkillDummy';



@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  date: string = new Date().toISOString().slice(0, 10);
  dept;
  desig;
  locationss;
  manager;
  designation;
  dropdownSettings = {};
  isAllocationManager: boolean;
  closeResult: string;
  profileList: any[] = [];
  tags = [];
  skillsList: any[]= [];
  userDetail: any = {
    resourceId: "",
    name: "",
    email: "",
    startDate: "",
    endDate: "",
    contactNumber: "",
    deptId: "",
    deptName: "",
    resourceTypeId: "",
    roleId: "",
    locationId: "",
    isActive: "",
    managerId: "",
    designation: "",
    skills: [] = [],
    experience: "",
    managers: [{
      index: "",
      detail: ""
    }]
  };
  tfilter;
  profileFilter: any = "";
  resourceId: any;
  departments: any;
  selectedDepartment: any = "";
  selectedManager: any = "";
  selectedResourceType: any = "";
  selectedDesignation: any = "";
  selectedLocation: any = "";
  selectedRole: any = "";
  designations: any;
  locations: any;
  managers: any;
  resourceType: any;
  type: any;
  roles;
  modalRef: BsModalRef;
  isActive: boolean;
  date3: Date;
  ftemp;
  isInvalidStart: boolean;
  chkStart: any;
  config = {
    animated: true
  };
  message: string;
  private model: any = {};
  private temp = new Array<any>();
  private stemp = new Array<any>();
  private filters = { resourceType: "All", departmentType: "All", locationType: "All", sortBy: "None" };
  private showArchive: boolean = false;



  constructor(private datePipe: DatePipe, private modalService: BsModalService, private http: HttpClient, private toastr: ToastsManager, private appService: AppService) {
    this.getResourceTypes();
    this.getLocations();
    this.getDepartments();
    this.getRoles();
    this.getDesignations();
    this.getManagers();
    this.getResources();
    // this.selectedDepartment = this.departments[0];
    // this.selectedManager = this.managers[0];
    // this.selectedDesignation = this.designations[0];
    // this.selectedResourceType = this.resourceType[0];
    // this.selectedLocation = this.locations[0];
    // this.selectedRole = this.roles[0];
    this.isActive = true;
    if (this.appService.getFromLocal('userRole') == 102) {

      this.isAllocationManager = true;
    }
    else {
      this.isAllocationManager = false;
    }

  }


  openModal(profile, template: TemplateRef<any>) {

    this.resetUser();
    if (profile == "") {
      this.userDetail = {}
    }
    else {
      profile.startDate = this.datePipe.transform(profile.startDate, "yyyy-MM-dd");

      this.userDetail = Object.assign({}, profile);
    }

    const config = {
      class: 'modal-lg'
    }
    this.modalRef = this.modalService.show(template, this.config);
  }

  // openModal1(template: TemplateRef<any>) {
  //   this.modalRef = this.modalService.show(template, {class: 'modal-'});
  // }

  // confirm(): void {
  //   this.message = 'Confirmed!';
  //   this.modalRef.hide();
  // }

  // decline(): void {
  //   this.message = 'Declined!';
  //   this.modalRef.hide();
  // }


  ngOnInit() { 
    
    //this.skillsList = SKILLS;
    this.getSkills();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'skillId',
      textField: 'skillName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      limitSelection: 10,
      allowSearchFilter: true
    };
    
  }

  saveUser() {
    this.userDetail.deptId = this.selectedDepartment;
    this.userDetail.managerId = this.selectedManager;
    this.userDetail.locationId = this.selectedLocation;
    this.userDetail.resourceTypeId = this.selectedResourceType;
    this.userDetail.designation = this.selectedDesignation;
    this.userDetail.roleId = this.selectedRole;
    this.userDetail.endDate = moment(this.userDetail.endDate).toDate().toISOString();

    this.appService.addResource(this.userDetail).subscribe(data => {
      if (data != undefined && data.hasOwnProperty("success") && data["success"] == "true") {
        this.toastr.success("Resource has been added successfully.");
        this.userDetail = {};
        this.getResources(); // Reload the resource. TODO: create a function to update the updated Employee only instead of loading all resources
        this.resetUser();
        this.modalRef.hide();
      } else if (data != undefined && data.hasOwnProperty("success") && data["success"] == "false") {
        this.toastr.error(data["description"]);
      } else {
        this.toastr.error(data["description"])
      }
    })

  }
  resetUser() {
    this.isInvalidStart = false;
    this.userDetail = {};
    this.selectedDepartment = "";
    this.selectedManager = "";
    this.selectedLocation = "";
    this.selectedResourceType = "";
    this.selectedDesignation = "";
    this.selectedRole = "";
  }

  // onTagsChanged(event) {

  //   let data = event.tag.displayValue;
  //   if (event.change == "add") {
  //     this.skills.push(data);
  //   }
  //   else if (event.change == "remove") {
  //     this.skills.pop();
  //   }

  // }




  updateResource() {

    console.log(this.userDetail.skills);
    this.userDetail.endDate = moment(this.userDetail.endDate).toDate().toISOString();

    this.appService.updateResource(this.userDetail).subscribe(data => {

      if (data != undefined && data.hasOwnProperty("success") && data["success"] == "true") {
        this.toastr.success("Resource has been updated successfully.");
        this.getResources(); // Reload the resource. TODO: create a function to update the updated Employee only instead of loading all resources
        this.modalRef.hide();
      } else if (data != undefined && data.hasOwnProperty("success") && data["success"] == "false") {
        this.toastr.error(data["description"]);
      } else {
        this.toastr.error(data["description"])
      }
    }, (error) => {
      this.processError(error);
    })
  }
  deleteResource(resourceId: any) {

    this.appService.deleteResource(resourceId).subscribe(data => {
      if (data != undefined && data.hasOwnProperty("success") && data["success"] == "true") {
        this.toastr.success("Resource has been deactivated successfully.");
        this.getResources(); // Reload the resource. TODO: create a function to update the updated Employee only instead of loading all resources
        this.modalRef.hide();
      } else if (data != undefined && data.hasOwnProperty("success") && data["success"] == "false") {
        this.toastr.error(data["description"]);
      } else {
        this.toastr.error(data["description"])
      }
    }, (error) => {
      this.processError(error);
    })
  }
  filterResourceType(value, list) {
    this.profileList = list;
    if (value == "All") {
      return this.profileList;
    } else {
      this.model = [];
      for (var i = 0; i < this.profileList.length; i++) {
        if (value == this.profileList[i].resourceTypeDesc) {
          this.model.push(this.profileList[i]);
        }
      }
      this.profileList = [];
      Object.assign(this.profileList, this.model);
      return this.profileList;
    }
  }

  filterLocation(value, list) {
    this.profileList = list;
    if (value == "All") {
      return this.profileList;
    } else {
      this.model = [];
      for (var i = 0; i < this.profileList.length; i++) {
        if (value == this.profileList[i].locationName) {
          this.model.push(this.profileList[i]);
        }
      }
      this.profileList = [];
      Object.assign(this.profileList, this.model);
      return this.profileList;
    }
  }

  filterDepartment(value, list) {
    this.profileList = list;
    if (value == "All") {
      return this.profileList;
    } else {
      this.model = [];
      for (var i = 0; i < this.profileList.length; i++) {
        if (value == this.profileList[i].deptName) {
          this.model.push(this.profileList[i]);
        }
      }
      this.profileList = [];
      Object.assign(this.profileList, this.model);
      return this.profileList;
    }
  }

  sortBy(value) {
    if (value == 'None') {
      this.profileList = this.stemp;
    }
    else if (value == 'Name') {

      this.profileList = _.sortBy(this.profileList, 'name');

    } else if (value == 'Joining Date') {
      this.profileList = _.sortBy(this.profileList, 'startDate');

    }
  }
  selectDept(deptId) {

    this.userDetail.deptId = deptId;
  }
  getResources() {
    this.appService.getResources().subscribe((data) => {

      this.temp = data["results"];
      this.profileList = [];
      for (let profile of this.temp) {
        profile.emailHash = Md5.hashStr(profile.email.toLowerCase());
        profile.src = "https://freschesolutions.bamboohr.com/employees/photos/?h=" + profile.emailHash;
        this.profileList.push(profile);
        this.stemp = this.profileList;
      }
    }, error => {
      this.processError(error);
    });
  }
  getResourceTypes() {
    this.appService.getResourceTypes().subscribe((data) => {
      // const mapped = Object.entries(data).map(([index, detail]) => ({index, detail}));
      // this.type=mapped;
      const mapped = Object.entries(data).map(([index, detail]) => ({ index, detail }));
      this.type = mapped;
    },
      (error) => { this.processError(error); },
      () => { });
  }
  getLocations() {
    this.appService.getLocations().subscribe((data) => {
      const mapped = Object.entries(data).map(([index, detail]) => ({ index, detail }));
      this.locationss = mapped;
    },
      (error) => { this.processError(error); },
      () => { });
  }
  getDepartments() {
    this.appService.getDepartments().subscribe((data) => {
      const mapped = Object.entries(data).map(([index, detail]) => ({ index, detail }));
      this.dept = mapped;
    },
      (error) => {
        this.processError(error);
      },
      () => { });
  }
  getRoles() {
    this.appService.getRoles().subscribe((data) => {
      const mapped = Object.entries(data).map(([index, detail]) => ({ index, detail }));
      this.roles = mapped;

    },
      (error) => {
        this.processError(error);
      },
      () => { });
  }
  getManagers() {
    this.appService.getManagers().subscribe((data) => {


      const mapped = Object.entries(data).map(([id, value]) => ({ id, value }));
      this.managers = mapped;

    },
      (error) => {

        this.managers = [{ id: "17498", value: "Garry Ciambella" }, { id: "31176", value: "Jennifer Fisher" }, { id: "43246", value: "Chris Koppe" }];

        this.processError(error)

      },
      () => { });
  }
  getDesignations() {
    this.appService.getDesignations().subscribe((data) => {

      this.designations = data;

    },
      (error) => { this.processError(error) },
      () => { });
  }

  getSkills() {
    this.appService.getSkills().subscribe((data : any) => {
      this.skillsList = data.skillList;
    },
      (error) => {
        this.processError(error);
      },
      () => { });
  }

  processError(error: any) {
    if (error.status === 401) {
      this.toastr.dispose();
      this.appService.logout();
    } else {
      this.toastr.error(error.message);
    }
  }
  getDate(): string {
    return new Date().toISOString().slice(0, 10);
  }

  method1() {

    this.ftemp = this.temp;
    if (this.filters.resourceType != undefined && this.filters.resourceType.trim() != "") {
      this.ftemp = this.filterResourceType(this.filters.resourceType, this.ftemp);
    }
    // Object.assign(this.profileList,this.ftemp)
    if (this.filters.locationType != undefined && this.filters.locationType.trim() != "") {
      this.ftemp = this.filterLocation(this.filters.locationType, this.ftemp);
    }
    //Object.assign(this.profileList,this.ftemp)
    if (this.filters.departmentType != undefined && this.filters.departmentType.trim() != "") {
      this.ftemp = this.filterDepartment(this.filters.departmentType, this.ftemp);
    }
    Object.assign(this.profileList, this.ftemp)
  }

  validateJoiningDate(start) {
    this.chkStart = (new Date(start).getFullYear())

    if (this.chkStart > 1899 && this.chkStart < 2100)
      this.isInvalidStart = false;
    else
      this.isInvalidStart = true;
    //var startDate= new Date(start)
  }
}