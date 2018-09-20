import { Component, OnInit } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Router } from '@angular/router';
import { HttpModule, Response, RequestOptions, Headers } from '@angular/http';
import { AppService } from '../app.service';
import { SKILLS } from '../DummyData/SkillDummy';

import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastsManager } from 'ng2-toastr';
import { min } from 'rxjs/operator/min';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  locations
  roles
  dept
  projectType
  type
  designations: any;
  dropdownSettings = {};
  exp = [
    { value: "Less than 1 year" },
    { value: "1-2 years" },
    { value: "2-5 years" },
    { value: "5-10 years" },
    { value: "Greater than 10 year" },
  ];
  public formats = [
    { value: 'pdf', display: 'PDF' },
    { value: 'xls', display: 'EXCEL' }
];
  public resourceType: string[];
  skillIds: any[]= [];
  // public projectType: string[];
  skillsList: any[] = [];
  public experience: string[];
  // public skill=[];
  public location: string[];
  public role: string[];
  public department: string[];
  public designation: string[];
  public startDate: Date;
  public isGreaterThen: boolean;
  public endDate: Date;
  public selectedDesignation: String;
  public selectedResource: String;
  public selectedLocation: String;
  public selectedRole: String;
  public selectedDepartment: String;
  public selectedProject: String;
  public selectedSkills: any[] = [];
  public roleId: string[];
  public selectedFormat:String;
  public selectedResourceVal: String;
  public selectedLocationVal: String;
  public selectedDepartmentVal: String;
  public selectedDesignationVal: String;
  public selectedExperienceVal: String;
  public selectedProjectVal: String;
  public selectedExperience: String;
  public selectedSkillVal: String;
  public isRoleEmployee: Boolean = false;
  chkStart: any;
  chkEnd: any;
  isInvalidStart: boolean;
  isInvalidEnd: boolean;
  tags = [];
  constructor(private appService: AppService, public router: Router, private http: HttpClient, private toastr: ToastsManager) {
    this.getResourceTypes();
    this.getProjectTypes();
    this.getLocations();
    this.getRoles();
    this.getDepartments();
    this.getDesignations();

  }

  ngOnInit() {
    this.getSkills();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'skillId',
      textField: 'skillName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
    };
    this.resourceType = ['All', 'Permanent', 'Contract'];
    this.projectType = ['All', 'Billable', 'Non-Billable'];
    this.location = ['All', 'Montreal', 'Lucknow'];
    this.role = ['All', 'Admin', 'Resource Allocation Manager', 'Employee'];
    this.department = ['All', 'Digital Development', 'PSO'];
    this.designation = ['All'];
    this.experience = ['All'];
    this.startDate = null;
    this.endDate = null;
    this.selectedFormat = this.selectedFormat;
    this.selectedResource = this.resourceType[0];
    this.selectedProject = this.projectType[0];
    this.selectedLocation = this.location[0];
    this.selectedRole = this.role[0];
    this.selectedDepartment = this.department[0];
    this.selectedDesignation = this.designation[0];
    this.selectedExperience = this.experience[0];
    if (this.appService.getFromLocal('userRole') == 103) {
      this.isRoleEmployee = true;
    }

  }

  selectDate(event: any) {
    this.chkStart = (new Date(this.startDate).getFullYear())
    this.chkEnd = (new Date(this.endDate).getFullYear())
    if (this.endDate < this.startDate) {
      this.isGreaterThen = true;
    } else {
      this.isGreaterThen = false;
    }
    if (this.chkStart > 1899 && this.chkStart < 2100) {
      this.isInvalidStart = false;
    }
    else {
      this.isGreaterThen = false;
      this.isInvalidStart = true;
    }

    if (this.chkEnd > 1899 && this.chkEnd < 2100) {
      this.isInvalidEnd = false;
    }
    else {
      this.isGreaterThen = false;
      this.isInvalidEnd = true;
    }
  }

  
  generateReport() {

    if (this.selectedResource == 'All') {
      this.selectedResourceVal = "-1";
    } else {
      this.selectedResourceVal = this.selectedResource;
    }
    if (this.selectedProject == 'All') {
      this.selectedProjectVal = "-1";
    } else {
      this.selectedProjectVal = this.selectedProject;
    }
    if (this.selectedLocation == 'All') {
      this.selectedLocationVal = "-1";
    } else {
      this.selectedLocationVal = this.selectedLocation;
    }
    if (this.selectedDepartment == 'All') {
      this.selectedDepartmentVal = "-1";
    }
    else {
      this.selectedDepartmentVal = this.selectedDepartment;
    }
    if (this.selectedDesignation == 'All') {
      this.selectedDesignationVal = "-1";
    } else {
      this.selectedDesignationVal = this.selectedDesignation;
    }
    if (this.selectedExperience == 'All') {
      this.selectedExperienceVal = "-1";
    } else {
      this.selectedExperienceVal = this.selectedExperience;
    }
   

    for (let index = 0; index < this.selectedSkills.length; index++) {
      this.skillIds.push(this.selectedSkills[index]['skillId']);
      
    }
    if(this.selectedFormat!= null){
    this.roleId = this.appService.getFromLocal('userRole');
    this.appService.generateAndDownloadReport(this.selectedResourceVal, this.selectedProjectVal, this.selectedLocationVal, this.roleId,
      this.selectedDepartmentVal, this.startDate, this.endDate, this.skillIds, this.selectedExperience, this.selectedDesignationVal,this.selectedFormat);
  }else{
    this.toastr.error("Select a Report Format")
  }
  }
  getResourceTypes() {
    this.appService.getResourceTypes().subscribe((data) => {
      // const mapped = Object.entries(data).map(([index, detail]) => ({index, detail}));
      // this.type=mapped;
      const mapped = Object.entries(data).map(([index, detail]) => ({ index, detail }));
      this.type = mapped;
    },
      (error) => {
        this.processError(error);
      },
      () => { });
  }
  getProjectTypes() {
    this.appService.getProjectTypes().subscribe((data) => {
      const mapped = Object.entries(data).map(([index, detail]) => ({ index, detail }));
      this.projectType = mapped;
    },
      (error) => {
        this.processError(error);
      },
      () => { });
  }
  getLocations() {
    this.appService.getLocations().subscribe((data) => {
      const mapped = Object.entries(data).map(([index, detail]) => ({ index, detail }));
      this.locations = mapped;
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
  processError(error: any) {
    if (error.status === 401) {
      this.toastr.dispose();
      this.appService.logout();
    } else {
      this.toastr.error(error.message);
    }
  }

  getDesignations() {
    this.appService.getDesignations().subscribe((data) => {
      const mapped = Object.entries(data).map(([index, detail]) => ({
        index, detail
      }));
      this.designations = mapped;
    },
      (error) => { this.processError(error) },
      () => { });
  }

  getSkills() {
    this.appService.getSkills().subscribe((data: any) => {
      this.skillsList = data.skillList;
    },
      (error) => {
        this.processError(error);
      },
      () => { });
  }
}