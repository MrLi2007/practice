import {
    Component, OnInit, OnDestroy
  }
  from '@angular/core';
  import {
    DUMMY
  }
  from '../DummyData/Dummy'
  import * as moment from 'moment';
  import {
    BsModalService
  }
  from 'ngx-bootstrap/modal';
  import {
    BsModalRef
  }
  from 'ngx-bootstrap/modal/bs-modal-ref.service';
  import {
    AppService
  }
  from '../app.service';
  import {
    MatDialog, MatDialogRef, MAT_DIALOG_DATA
  }
  from '@angular/material';
  import {
    TemplateRef
  }
  from '@angular/core';
  import {
    Routes, RouterModule, Router
  }
  from '@angular/router';
  import {
    ToastsManager
  }
  from 'ng2-toastr/ng2-toastr';
  import {
    DatePipe
  }
  from '@angular/common';
  import {
    ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, FormBuilder
  }
  from '@angular/forms';
  
  @Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.css']
  })
  export class ProjectComponent implements OnInit {
    myform;
    projectType;
    manager;
    dept;
    start: Date;
    end: Date;
    model: any = {
        projectName: "",
        projectTypeId: "",
        startDate: "",
        endDate: "",
        deptId: "",
        totalHrs: "",
        projectManagerId: "",
        comment: ""
    }
    userFilter: any = "";
    projectList: any;
    startDate: any;
    endDate: any;
    class: any;
    isInvalidStart: boolean = false;
    tfilter:string='';
    isInvalidEnd: boolean =false;
    endLessThanStart : boolean;
    chkStart: any;
    chkEnd:any;
    isAllocationManager: boolean;
    private token: String;
    modalRef: BsModalRef;
    display: boolean = false;
    private showArchive:boolean=false;
    private filter="All";

    constructor(private datePipe: DatePipe, private router: Router, private appService: AppService, private modalService: BsModalService, private toastr: ToastsManager) {
        // this.projectList = DUMMY;
        this.getProjects();
        this.getProjectTypes();
        this.getDepartments();
        this.getManagers();
        if(this.appService.getFromLocal('userRole')==102)
        {
          
          this.isAllocationManager=true;
        }
        else
        {
          this.isAllocationManager=false;
        }
      //   this.myform = new FormGroup({
      //       projectName: new FormControl('', [Validators.required ,Validators.minLength(3), Validators.maxLength(15)]),
      //       deptName: new FormControl('', [Validators.required]),
      //       startDate: new FormControl('', [Validators.required]),
      //       endDate: new FormControl('', [Validators.required]),
      //       projectManagerName: new FormControl('', [Validators.required]),
      //       projectTypeDesc: new FormControl('', [Validators.required]),
           
      //   });
  
    }
  
    get projectName() {
      return this.myform.get('projectName');
  } 
    ngOnInit() {
    }
    // ngOnDestroy() {}
    openModal(value, template: TemplateRef < any > ) {

        if(this.startDate!=null || this.startDate!=""){
          this.validStartDate(value.startDate)
        }
        if(this.endDate!=null || this.endDate!=""){
          this.validEndDate(value.endDate)
        }
        this.isInvalidStart=false;
        this.isInvalidEnd=false;
        if (value == "") {
            this.model = {}
        } 
        else{
            value.startDate = this.datePipe.transform(value.startDate, "yyyy-MM-dd");
            value.endDate = this.datePipe.transform(value.endDate, "yyyy-MM-dd");
            this.model = Object.assign({},value);
        }
        const config = {
            class: 'modal-dialog-centered'
        }
        this.modalRef = this.modalService.show(template, config);
        
    }
      
//     hideModal()
//   {
//     window.open("project", "_self");
//   }
  add(model){
    if( model.projectName==null || model.projectName.trim() == "" ){
        this.toastr.error("Project name required");
    }
   
      if(new Date(model.startDate) > new Date(model.endDate)){
        this.toastr.error("A project's start date should not be after the end date")
        return;
      }
    else{
        //model.startDate= moment(model.startDate).toDate().toISOString();
        //model.endDate= moment(model.endDate).toDate().toISOString();
        this.appService.addProject(model).subscribe(data =>{
            if (data != undefined && data.hasOwnProperty("success") && data["success"] == "true") {
                this.toastr.success("Project added successfully.");
                this.getProjects(); // Reload the projects.
                this.modalRef.hide();
              } else if (data != undefined && data.hasOwnProperty("success") && data["success"] == "false") {
                this.toastr.error(data["description"]);
              } else {
                this.toastr.error(data["description"])
              } 
           },error =>{
               this.processError(error);
           });
    }
   
    

    
  }
    getProjects() {
        this.appService.getProjects().subscribe((data) => {
            this.projectList = data["results"];
        }, error => {
           this.processError(error);
        });
    }
    makeFilterArray(value) {
        this.startDate = this.datePipe.transform(value, "yyyy-MM-dd"); 
    }
    makeFilter(value) {
        this.endDate = this.datePipe.transform(value, "yyyy-MM-dd");
    }
  
    makeType(value) {
        this.tfilter = value;
    }
  
    key1: string = 'startDate'; //set default
    key2: string = 'endDate';
    reverse1: boolean = false;
    reverse2: boolean = false;
    sortstart(key) {   
        this.key1 = key;
        this.reverse1 = !this.reverse1;
    }
    sortend(key) {
        this.key2 = key;
        this.reverse2 = !this.reverse2;
    }

    sortstartend(key3,key4){
        this.key1=key3;
        this.key2=key4;
        this.reverse1 = !this.reverse1;
        this.reverse2 = !this.reverse2;   
    }
  
    public update(value) {

        if( value.projectName==null || value.projectName.trim() == "" ){
            this.toastr.error("Project name required");
        }
        
      if(new Date(value.startDate) > new Date(value.endDate)){
        this.toastr.error("A project's start date should not be after the end date")
        return;
      }else{
        let projectId = value.projectId
        let projectName = value.projectName
        let deptId = value.deptId
        //let startDate = moment(value.startDate).toDate().toISOString();
        //let endDate = moment(value.endDate).toDate().toISOString();
        let startDate = value.startDate;
        let endDate = value.endDate;
        let totalHrs = value.totalHrs
        let projectTypeId = value.projectTypeId
        let projectManagerId = value.projectManagerId
        let status = value.status;
        let comment = value.comment
        let data1 = {
            projectId: projectId,
            projectName: projectName,
            deptId: deptId,
            startDate: startDate,
            endDate: endDate,
            totalHrs: totalHrs,
            projectTypeId: projectTypeId,
            projectManagerId: projectManagerId,
            status: status,
            comment:comment
        }
        this.appService.updateProject(data1).subscribe((data) => {
            if (data != undefined && data.hasOwnProperty("success") && data["success"] == "true") {
                this.toastr.success("Project updated successfully.");
                this.getProjects(); // Reload the projects.
                this.modalRef.hide();
              } else if (data != undefined && data.hasOwnProperty("success") && data["success"] == "false") {
                this.toastr.error(data["description"]);
              } else {
                this.toastr.error(data["description"])
              } 
        }, error => {
            this.processError(error);
        });
    }}
    delete(value) {
        let id = value.projectId;
        this.appService.deleteProject(id).subscribe((data) => {
            if (data != undefined && data.hasOwnProperty("success") && data["success"] == "true") {
                this.toastr.success("Project disabled successfully.");
                this.getProjects(); // Reload the projects.
                this.modalRef.hide();
              } else if (data != undefined && data.hasOwnProperty("success") && data["success"] == "false") {
                this.toastr.error(data["description"]);
              } else {
                this.toastr.error(data["description"])
              } 
        },(error) =>{
            this.processError(error);
        })
    }
    getProjectTypes() {
        this.appService.getProjectTypes().subscribe((data) => {
            const mapped = Object.entries(data).map(([index, detail]) => ({
                index, detail
            }));
            this.projectType = mapped;
        }, (error) => {
            this.processError(error);
        }, () => {});
    }
    getDepartments() {
        this.appService.getDepartments().subscribe((data) => {
            const mapped = Object.entries(data).map(([index, detail]) => ({
                index, detail
            }));
            this.dept = mapped;
        }, (error) => {
            this.processError(error);
        }, () => {});
    }
    getManagers() {
        this.appService.getManagers().subscribe((data) => {
            const mapped = Object.entries(data).map(([id, value]) => ({
                id, value
            }));
            this.manager = mapped;
           
        }, (error) => {
            this.processError(error);
            this.manager = [{
                "index": "0",
                detail: {
                    "managerId": "A2334",
                    "managerName": "Rajesh Jaiswal"
                }
            }, {
                "index": "1",
                detail: {
                    "managerId": "A2226",
                    "managerName": "Pankaj Kumar"
                }
            }]
  
        }, () => {});
    }
    validateEnd(start){
   
        if(new Date(start) >new Date(this.model.endDate))
        {
          this.model.endDate=''
        }
        document.getElementById('end').setAttribute('min',start);
      }

    validStartDate(start)
    {
    this.chkStart=(new Date(start).getFullYear())

    if(this.chkStart>1899 && this.chkStart<2100 )
      this.isInvalidStart=false;
    else
      this.isInvalidStart=true;
    }

    validEndDate(end){
        this.chkEnd=(new Date(end).getFullYear())
        // if(new Date(this.model.startDate) >new Date(this.model.endDate))
        // {
        //  this.model.endDate=''
        // }
       if(this.chkEnd>1899 && this.chkEnd<2100 )
         this.isInvalidEnd=false;
       else
         this.isInvalidEnd=true;


    
        //  if(new Date(this.model.startDate) >new Date(end))
        // {
        //     this.endLessThanStart=true;
        //    }  
        //    else
        //    this.endLessThanStart=false;
       // document.getElementById('end').setAttribute('min',start);
    }

      processError(error: any) {
        if (error.status === 401) {
            this.toastr.dispose();
            this.appService.logout();
        } else {
          this.toastr.error(error.message);
        }
      }
  }