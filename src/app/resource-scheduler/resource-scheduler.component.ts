import { Component, OnInit, Input, DoCheck } from '@angular/core';
import {
  ViewChild,
  TemplateRef
} from '@angular/core';
import { Md5 } from 'ts-md5';
import {
  isSameDay,
  isSameMonth,
  subDays,
   addDays
} from 'date-fns';
import {
  ToastsManager
}
  from 'ng2-toastr';
import * as moment from 'moment';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent } from 'angular-calendar';
import { PopUpComponent } from '../pop-up/pop-up.component';
import { AppService } from '../app.service';
import { colors } from '../color';
import { CalendarWeekViewComponent } from 'angular-calendar/modules/week';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-resource-scheduler',
  templateUrl: './resource-scheduler.component.html',
  styleUrls: ['./resource-scheduler.component.css']
})
export class ResourceSchedulerComponent {
  @ViewChild('popUpComponent') popUpComponent: PopUpComponent;
  @ViewChild('CalanderRefresh') calendarWeekViewComponent: CalendarWeekViewComponent;
  @ViewChild('editEventRes') editEventRes: TemplateRef<any>;
  @ViewChild('delEventRes') delEventRes: TemplateRef<any>;
  @ViewChild('editEventPro') editEventPro: TemplateRef<any>;
  @ViewChild('delEventPro') delEventPro: TemplateRef<any>;
  show: boolean = false;
  seenAllocationWarn: boolean = false;
  dropdownSettings = {};  
  selectedItems = [];
  exp = [
    { Id: 1, value: "Less than 1 year" },
    { Id: 2, value: "1-2 years" },
    { Id: 3, value: "2-5 years" },
    { Id: 4, value: "5-10 years" },
    { Id: 5, value: "Greater than 10 year" },
  ];
  
  minDate: Date = new Date("1900-01-01")
  maxDate: Date = new Date("2099-12-31")
  public isRoleEmployee: Boolean = false;
  locale: string = 'en_IN';
  model = {
    startDate: '',
    endDate: '',
    projectId: '',
    percentAssign: '',
    resourceName: '',
    id: '',
    email: '',
    contact: '',
    deptName: '',
    roleName: '',
    locationName: '',
    managerName: '',
    designation: '',
    skills: '',
    experience: '',
    // FIXME: NEEDS BACKEND
    // comment: ''
  };
  modelPro = {
    startDate: '',
    endDate: '',
    projectName: '',
    projectId: '',
    deptName: '',
    projectManagerName: '',
    // FIXME: NEEDS BACKEND
    // comment: ''
  }
  resourceDetail: Array<
    {
      resourceName: string,
      employeeType: string,
      id: string,
      email: string,
      src: string,
      startDate: Date,
      contact: string,
      deptName: string,
      roleName: string,
      locationName: string,
      managerName: string,
      designation: string,
      experience: any,
      skills: any,
      numProjects: number,
      utilization: any,
      avail: any,
      billable: any,
      nonBillable: any,
      // FIXME: NEEDS BACKEND
      // comment: any,
      eventsRes: Array<{
        name: string,
        color: string,
        start: Date,
        end: Date,
        title: string
      }>
    }> = [];

  firstDay;
  lastDay;
  projectDetail: Array<
    {
      projectId: string
      projectName: string,
      startDate: Date,
      endDate: Date,
      projectType: string,
      deptName: string,
      projectManagerName: string,
      noOfEmp: number,
      // FIXME: NEEDS BACKEND
      // comment: any,
      events: Array<{
        color: string,
        name: string,
        start: Date,
        end: Date,
        title: string
      }>
    }> = [];
  tfilter;
  modalRef: BsModalRef;
  resourceView: boolean = true;
  projectView: boolean = false;
  view: string = 'week';
  projectColor;
  viewDate: Date = new Date();
  currentWeek: any;
  today: Date = new Date();
  myform: FormGroup;
  skillRes = 'Any';
  designRes = 'All';
  expRes = 'All';
  resourceType = 'All'
  userFilter2 = 'All'
  projectType2 = 'All'
  projectType = 'All'
  config = {
    //if objects array passed which key to be displayed defaults to description
    search: true, //true/false for the search functionlity defaults to false,
    //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder: 'Select' // text to be displayed when no item is selected defaults to Select.
  }
  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil event-options-edit"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        if (event.meta.type == "project") {
          this.handelProEvents('Edited', event)
        } else {
          this.handleEvent('Edited', event)
        }

      }
    },
    {
      label: '<i class="fa fa-fw fa-times event-options-delete"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {

        this.events = this.events.filter(iEvent => iEvent !== event);
        if (event.meta.type == "project") {
          this.handelProEvents('Deleted', event)
        } else {
          this.handleEvent('Deleted', event);
        }

      }
    }
  ];

  onlySunday: number[] = [1,2,3,4,5,6]
  onlySaturday: number[] = [0,1,2,3,4,5]
  excludeDays: number[] = [0, 6];
  skipWeekends(direction: 'back' | 'forward'): void {
    if (this.view === 'day') {
      if (direction === 'back') {
        while (this.excludeDays.indexOf(this.viewDate.getDay()) > -1) {
          this.viewDate = subDays(this.viewDate, 1);
        }
        while (this.onlySunday.indexOf(this.viewDate.getDay()) > -1) {
          this.viewDate = subDays(this.viewDate, 1);
        }
        while (this.onlySaturday.indexOf(this.viewDate.getDay()) > -1) {
          this.viewDate = subDays(this.viewDate, 1);
        }
      } else if (direction === 'forward') {
        while (this.excludeDays.indexOf(this.viewDate.getDay()) > -1) {
          this.viewDate = addDays(this.viewDate, 1);
        }
        while (this.onlySunday.indexOf(this.viewDate.getDay()) > -1) {
          this.viewDate = addDays(this.viewDate, 1);
        }
        while (this.onlySaturday.indexOf(this.viewDate.getDay()) > -1) {
          this.viewDate = addDays(this.viewDate, 1);
        }
      }
    }
  }
  openModal0(value, template: TemplateRef<any>) {
    this.model = {
      startDate: '',
      endDate: '',
      projectId: null,
      percentAssign: '',
      resourceName: value.resourceName,
      id: value.id,
      email: value.email,
      contact: value.contact,
      deptName: value.deptName,
      roleName: value.roleName,
      locationName: value.locationName,
      managerName: value.managerName,
      designation: value.designation,
      skills: value.skills,
      experience: value.experience,
      // FIXME: NEEDS BACKEND
      // comment: value.comment
    };
    const config = {
      class: 'modal-dialog-centered'
    }
    this.modalRef = this.modalService.show(template, config);
  }
  openModal1(value, template: TemplateRef<any>) {
    this.model = {
      startDate: this.datePipe.transform(new Date(value.startDate), "yyyy-MM-dd"),
      endDate: '',
      projectId: null,
      percentAssign: '',
      resourceName: value.resourceName,
      id: value.id,
      email: value.email,  
      contact: value.contact,
      deptName: value.deptName,
      roleName: value.roleName,
      locationName: value.locationName,
      managerName: value.managerName,
      designation: value.designation,
      skills: value.skills,
      experience: value.experience,
      // FIXME: NEEDS BACKEND
      // comment: value.comment
    };
    const config = {
      class: 'modal-dialog-centered'
    }
    this.modalRef = this.modalService.show(template, config);
  }
  openModal2(value, template: TemplateRef<any>) {
    this.modelPro = {
      startDate: this.datePipe.transform(new Date(value.startDate), "yyyy-MM-dd"),
      endDate: this.datePipe.transform(new Date(value.endDate), "yyyy-MM-dd"),
      projectName: value.projectName,
      projectId: value.projectId,
      deptName: value.deptName,
      projectManagerName: value.projectManagerName,
      // FIXME: NEEDS BACKEND
      // comment: value.comment
    };
    const config = {
      class: 'modal-dialog-centered'
    }
    this.modalRef = this.modalService.show(template, config);
  }
  handelProEvents(action: string, event: CalendarEvent) {
    this.model1 = {}
    const config = {
      class: 'modal-dialog-centered'
    }
    if (!this.isRoleEmployee) {
      this.model1 = {
        end: this.datePipe.transform(new Date(event.end), "yyyy-MM-dd"),
        start: this.datePipe.transform(new Date(event.start), "yyyy-MM-dd"),
        allocation: event.meta.percent,
        name: event.meta.name,
        projectId: event.meta.projId,
        projName: event.meta.projName,
        resId: event.meta.resId,
        assignmentId: event.meta.assignmentId
      }
      if (action == "Edited") {
        this.modalRef = this.modalService.show(this.editEventPro, config);
      } else {
        this.modalRef = this.modalService.show(this.delEventPro, config);

      }
    }
  }
  model1: any = {
    end: '',
    start: '',
    allocation: '',
    name: '',
    projectId: '',
    resourceName: '',
    resId: '',
    assignmentId: ''
  };
  handleEvent(action: string, event: CalendarEvent): void {
    this.model1 = {}
    const config = {
      class: 'modal-dialog-centered'
    }
    if (!this.isRoleEmployee) {
      this.model1 = {
        end: this.datePipe.transform(new Date(event.end), "yyyy-MM-dd"),
        start: this.datePipe.transform(new Date(event.start), "yyyy-MM-dd"),
        allocation: event.meta.percent,
        name: event.meta.name,
        projectId: event.meta.projId,
        resourceName: event.meta.resourceName,
        resId: event.meta.resId,
        assignmentId: event.meta.assignmentId
      }
      if (action == "Edited") {
        this.modalRef = this.modalService.show(this.editEventRes, config);
      } else {
        this.modalRef = this.modalService.show(this.delEventRes, config);
      }
    }

  }
  viewResource() {
    this.resourceView = true;
    this.projectView = false;
  }
  viewProject() {
    this.resourceView = false;
    this.projectView = true;
  }
  makeType(value) {
    this.tfilter = value;
  }
  type;


  refresh: Subject<any> = new Subject();

  resources: any[] = [];
  projects: any[] = [];
  events: CalendarEvent[] = [];
  eventsRes: CalendarEvent[] = [];
  activeDayIsOpen = true;
  viewDatenew
  constructor(private toastr: ToastsManager, private datePipe: DatePipe, private modal: NgbModal, private appService: AppService, private modalService: BsModalService) {
    this.getProjects();
    this.getResources();
    this.getProjectTypes();
    this.getResourceTypes();
    this.getDesignations();

    this.calculateUtilization(this.viewDate, '');
    let y = this.viewDate.getFullYear();
    this.viewDatenew = y + '-W' + moment(this.viewDate).isoWeek()
    this.show = false;
    this.load();
    this.myform = new FormGroup({
      projectIdd: new FormControl('', [
        Validators.required
      ])
    });
  }
  ngOnInit() {    
    this.getSkills();
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'skillId',
      textField: 'skillName',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 1,
      allowSearchFilter: true
    };
    if (this.appService.getFromLocal('userRole') == 103) {
      this.isRoleEmployee = true;
    }
  }

  fillResources(data) {
    this.resources = data['results'];
    this.fillEventResource(this.resources);
  }

  fillProjects(data) {
    this.projects = data['results'];
    this.fillEventProject(this.projects);
  }

  fillEventResource(resources) {

    this.resourceDetail = [];
    for (let i = 0; i < resources.length; i++) {
      const resource = resources[i];
      resource.emailHash = Md5.hashStr(resource.email.toLowerCase())
      resource.src = "https://freschesolutions.bamboohr.com/employees/photos/?h=" + resource.emailHash;
      const eventsRes = resources[i].nameofProjects;
      const arr = [];
      let s = 0;
      let sum = 0;
      let util = 0;
      let avail = 0;
      let sumBill = 0;
      let utilBill = 0;
      let ss = 0;
      let sumNonBill = 0;
      let utilNonBill = 0;
      let nss = 0;
      for (let j = 0; j < eventsRes.length; j++) {
        const start = moment(eventsRes[j].startDate).toDate();
        const end = moment(eventsRes[j].endDate).toDate();
        if (start > this.firstDay && end > this.lastDay && start < this.lastDay) {
          s = moment(this.lastDay).diff(moment(start), 'days') + 1
          sum = sum + (s * 8) * (eventsRes[j].percentage / 100)
          util = (sum / 40) * 100;
        }
        if (start < this.firstDay && end < this.lastDay && (moment(end).diff(moment(this.firstDay), 'days')) >= 0) {
          if (moment(end).diff(moment(this.firstDay), 'days') == 0) {
            s = moment(end).diff(moment(this.firstDay), 'days') + 1
            sum = sum + (s * 8) * (eventsRes[j].percentage / 100)
            util = (sum / 40) * 100;
          } else {
            s = moment(end).diff(moment(this.firstDay), 'days') + 2
            sum = sum + (s * 8) * (eventsRes[j].percentage / 100)
            util = (sum / 40) * 100;
          }
        }
        if (start > this.firstDay && end < this.lastDay) {
          s = moment(end).diff(moment(start), 'days') + 1
          sum = sum + (s * 8) * (eventsRes[j].percentage / 100)
          util = (sum / 40) * 100;
        }
        if (start < this.firstDay && end > this.lastDay) {
          s = moment(this.lastDay).diff(moment(this.firstDay), 'days') + 1
          sum = sum + (s * 8) * (eventsRes[j].percentage / 100)
          util = (sum / 40) * 100;
        }

        let color;
        if (eventsRes[j].projectType == 'Billable') {
          color = colors.billableProject;

          if (start > this.firstDay && end > this.lastDay && start < this.lastDay) {
            ss = moment(this.lastDay).diff(moment(start), 'days') + 1
            sumBill = sumBill + (s * 8) * (eventsRes[j].percentage / 100)
            utilBill = (sumBill / 40) * 100;
          }
          if (start < this.firstDay && end < this.lastDay && (moment(end).diff(moment(this.firstDay), 'days')) >= 0) {
            if (moment(end).diff(moment(this.firstDay), 'days') == 0) {
              ss = moment(end).diff(moment(this.firstDay), 'days') + 1
              sumBill = sumBill + (s * 8) * (eventsRes[j].percentage / 100)
              utilBill = (sumBill / 40) * 100;
            } else {
              ss = moment(end).diff(moment(this.firstDay), 'days') + 2
              sumBill = sumBill + (s * 8) * (eventsRes[j].percentage / 100)
              utilBill = (sumBill / 40) * 100;
            }
          }
          if (start > this.firstDay && end < this.lastDay) {
            ss = moment(end).diff(moment(start), 'days') + 1
            sumBill = sumBill + (s * 8) * (eventsRes[j].percentage / 100)
            utilBill = (sumBill / 40) * 100;
          }
          if (start < this.firstDay && end > this.lastDay) {
            ss = moment(this.lastDay).diff(moment(this.firstDay), 'days') + 1
            sumBill = sumBill + (s * 8) * (eventsRes[j].percentage / 100)
            utilBill = (sumBill / 40) * 100;
          }
        }
        else {
          color = colors.nonBillableProject;

          if (start > this.firstDay && end > this.lastDay && start < this.lastDay) {
            nss = moment(this.lastDay).diff(moment(start), 'days') + 1
            sumNonBill = sumNonBill + (s * 8) * (eventsRes[j].percentage / 100)
            utilNonBill = (sumNonBill / 40) * 100;
          }
          if (start < this.firstDay && end < this.lastDay && (moment(end).diff(moment(this.firstDay), 'days')) >= 0) {
            if (moment(end).diff(moment(this.firstDay), 'days') == 0) {
              nss = moment(end).diff(moment(this.firstDay), 'days') + 1
              sumNonBill = sumNonBill + (s * 8) * (eventsRes[j].percentage / 100)
              utilNonBill = (sumNonBill / 40) * 100;
            } else {
              nss = moment(end).diff(moment(this.firstDay), 'days') + 2
              sumNonBill = sumNonBill + (s * 8) * (eventsRes[j].percentage / 100)
              utilNonBill = (sumNonBill / 40) * 100;
            }
          }
          if (start > this.firstDay && end < this.lastDay) {
            nss = moment(end).diff(moment(start), 'days') + 1
            sumNonBill = sumNonBill + (s * 8) * (eventsRes[j].percentage / 100)
            utilNonBill = (sumNonBill / 40) * 100;
          }
          if (start < this.firstDay && end > this.lastDay) {
            nss = moment(this.lastDay).diff(moment(this.firstDay), 'days') + 1

            sumNonBill = sumNonBill + (s * 8) * (eventsRes[j].percentage / 100)
            utilNonBill = (sumNonBill / 40) * 100;
          }
        }

        const title = eventsRes[j].name + ' &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspFrom&nbsp ' + moment(start).format('YYYY/MM/DD') + '&nbsp&nbsp To &nbsp&nbsp' + moment(end).format('YYYY/MM/DD') + '<span class="float-right">' + eventsRes[j].percentage + ' %</span>';
        if (this.isRoleEmployee) {
          const obj = {
            color: color, start: start, end: end, title: title,
            meta: {
              name: eventsRes[j].name,
              percent: eventsRes[j].percentage,
              resourceName: resource.name,
              resId: resource.resourceId,
              projId: eventsRes[j].projectId,
              assignmentId: eventsRes[j].assignmentId
            }
          };
          arr.push(obj);
        } else {
          const obj = {
            color: color, start: start, end: end, title: title,
            actions: this.actions, meta: {
              name: eventsRes[j].name,
              percent: eventsRes[j].percentage,
              resourceName: resource.name,
              resId: resource.resourceId,
              projId: eventsRes[j].projectId,
              assignmentId: eventsRes[j].assignmentId
            }
          };
          arr.push(obj);
        }

      }
      if (resource.employeeType == "Permanent") {
        resource.employeeType = "Permanent";
      } else {
        resource.employeeType = "Consultant";
      }
      if (util > 100) {
        avail = 0
      } else {
        avail = 100 - Math.floor(util)
      }
      this.resourceDetail.push(
        {
          resourceName: resource.name,
          employeeType: resource.employeeType,
          email: resource.email,
          src: resource.src,
          startDate: resource.startDate,
          contact: resource.contact,
          deptName: resource.deptName,
          roleName: resource.roleName,
          locationName: resource.locationName,
          managerName: resource.managerName,
          designation: resource.designation,
          skills:resource.skills,
          experience: resource.experience,
          eventsRes: arr,
          id: resource.resourceId,
          // FIXME: NEEDS BACKEND
          // comment: resource.comment,
          numProjects: resource.uniqueProjects,
          utilization: Math.floor(util),
          avail: Math.floor(avail),
          billable: Math.floor(utilBill),
          nonBillable: Math.floor(utilNonBill)
        });

    }
    this.calendarWeekViewComponent;
  }

  fillEventProject(projects) {
    this.projectDetail = [];
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      const events = projects[i].nameofEmployees;
      const arr = [];
      for (let j = 0; j < events.length; j++) {
        const start = moment(events[j].startDate).toDate();
        const end = moment(events[j].endDate).toDate();
        let color;
        if (events[j].employeeType == 100) {
          color = colors.permanentEmployee;
        }
        else {
          color = colors.consultantEmployee;
        }

        const title = events[j].name + ' &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbspFrom&nbsp ' + moment(start).format('YYYY/MM/DD') + '&nbsp&nbsp To &nbsp&nbsp' + moment(end).format('YYYY/MM/DD') + ' <span class="float-right"> ' + events[j].percentage + ' %</span>';
        if (this.isRoleEmployee) {
          const obj = {
            color: color, start: start, end: end, title: title, meta: {
              assignmentId: events[j].assignmentId,
              name: events[j].name,
              percent: events[j].percentage,
              projName: project.name,
              projId: project.projectId,
              resId: events[j].resourceId,
              type: "project"
            }
          };
          arr.push(obj);
        } else {
          const obj = {
            color: color, start: start, end: end, title: title, actions: this.actions, meta: {
              assignmentId: events[j].assignmentId,
              name: events[j].name,
              percent: events[j].percentage,
              projName: project.name,
              projId: project.projectId,
              resId: events[j].resourceId,
              type: "project"
            }
          };
          arr.push(obj);
        }

      }

      if (project.projectType.toLowerCase() == "Billable".toLowerCase()) {
        project.projectType = "billable";
      } else {
        project.projectType = "non-billable"
      }
      this.projectDetail.push(
        {
          projectId: project.projectId,
          projectName: project.name,
          startDate: moment(project.startDate).toDate(),
          endDate: moment(project.endDate).toDate(),
          deptName: project.deptName,
          projectManagerName: project.projectManagerName,
          projectType: project.projectType,
          noOfEmp: project.uniqueEmployees,
          events: arr,
          // FIXME: NEEDS BACKEND
          // comment: project.comment
        });
    }
    this.calendarWeekViewComponent;
  }


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }
  projectFilter;
  fillFilter(value) {
    this.projectFilter = value;
  }

  method;
  filterArray;
  ptype;
  filterResourceEventsByProjectType(projectType) {
    this.ptype = projectType;
    this.show = true;
    if (projectType == "All" || projectType == null) {
      this.method = false;

      return this.fillEventResource(this.resources)
    }
    let data = this.resources;
    this.filterArray = [];
    for (let i = 0; i < data.length; i++) {
      let arr = [];
      let projects = data[i]['nameofProjects'];
      for (let project of projects) {
        if (project.projectTypeId == projectType) {
          arr.push(project)
        }

      }
      if (arr.length > 0) {
        this.filterArray.push({
          employeeType: data[i].employeeType,
          employeeTypeId: data[i].employeeTypeId,
          endDate: data[i].endDate,
          name: data[i].name,
          email: data[i].email,
          resourceId: data[i].resourceId,
          nameofProjects: arr,
          startDate: data[i].startDate,
          uniqueProjects: data[i].uniqueProjects
        })
      }

    }
    this.calculateUtilization(this.viewDate, "filterMethod");
    this.method = true;
    this.fillEventResource(this.filterArray)
  }
  
  filterArray2;
  rType;
  filterProjectEventsByResourceType(resourceType) {
    this.show = true;
    this.rType = resourceType;
    if (resourceType == "All" || resourceType == null) {
      return this.fillEventProject(this.projects)
    }
    let data = this.projects;
    this.filterArray2 = [];
    for (let i = 0; i < data.length; i++) {
      let arr = [];
      let projects = data[i]['nameofEmployees'];
      for (let project of projects) {
        if (project.employeeType == resourceType) {
          arr.push(project)
        }

      }
      if (arr.length > 0) {
        this.filterArray2.push({
          projectType: data[i].projectType,
          projectTypeId: data[i].projectTypeId,
          endDate: data[i].endDate,
          name: data[i].name,
          projectId: data[i].projectId,
          nameofEmployees: arr,
          startDate: data[i].startDate,
          uniqueEmployees: data[i].uniqueEmployees
        })
      }
    }

    this.fillEventProject(this.filterArray2)
  }
  showClear() {
    this.show = true;
  }
  projectList = [];

  getProjects() {
    this.appService.getProjects().subscribe((data) => {
      for (let project of data["results"]) {
        if (project.status) {
          this.projectList.push(project);
        }
      }
    }, error => {
      this.processError(error);
    });
  }

  resourceList = [];
  getResources() {
    this.appService.getResources().subscribe((data) => {
      for (let resource of data["results"]) {
        if (resource.active) {
          this.resourceList.push(resource);
        }
      }
    }, error => {
      this.processError(error);
    });
  }

  skillsList: any[]= [];
  getSkills() {
    this.appService.getSkills().subscribe((data : any) => {
      this.skillsList = data.skillList;
    },
      (error) => {
        this.processError(error);
      },
      () => { });
  }

  projectTypes;
  getProjectTypes() {
    this.appService.getProjectTypes().subscribe((data) => {
      const mapped = Object.entries(data).map(([index, detail]) => ({ index, detail }));
      this.projectTypes = mapped;
    }, (error) => {
      this.processError(error);
    }, () => { });
  }

  resourceTypes;
  getResourceTypes() {
    this.appService.getResourceTypes().subscribe((data) => {
      const mapped = Object.entries(data).map(([index, detail]) => ({ index, detail }));
      this.resourceTypes = mapped;
    }, (error) => {
      this.processError(error);
    }, () => { });
  }
 
  designations: any;
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
  // Allocating a project to a resource validation
  add(model) {
    if (model.projectId == null || model.projectId == '') {
      this.toastr.error("Please select a project")
      return;
    }
    for (let project of this.projectDetail) {
      if (model.projectId == project.projectId) {
        if (new Date(model.startDate) > project.endDate || new Date(model.endDate) < project.startDate || new Date(model.endDate) > project.endDate || new Date(model.startDate) < project.startDate) {
          this.toastr.error("Please enter a date between the project's start date and end date")
          return;
        }
      }
    }
    if (new Date(model.startDate) < this.minDate || new Date(model.endDate) > this.maxDate || new Date(model.endDate) < this.minDate || new Date(model.startDate) > this.maxDate) {
      this.toastr.error("A project cannot be assigned before 1900-01-01 and after 2099-06-31")
      return;
    }
    if (new Date(model.startDate) > new Date(model.endDate)) {
      this.toastr.error("A project's start date should not be after the end date")
      return;
    }
    if (model.startDate == null || model.startDate == '') {
      this.toastr.error("Please enter start date")
      return;
    }
    if (model.endDate == null || model.endDate == '') {
      this.toastr.error("Please enter end date")
      return;
    }
    if (model.percentAssign === null || model.percentAssign === '') {
      this.toastr.error("Please enter percentage allocation")
      return;
    }
    if (model.percentAssign < 1) {
      this.toastr.error("Percentage allocation can not be 0 or less")
      return;
    }
    if (model.percentAssign > 100) {
      this.toastr.error("Percentage allocation can not be greater than 100")
      return;
    }

    let s = 0;
    let sum = 0;
    let util = 0;
    let pp = 0
    for (let i = 0; i < this.resourceDetail.length; i++) {
      if (this.resourceDetail[i].id == model.id) {
        s = moment(model.endDate).diff(moment(model.startDate), 'days') + 1
        sum = sum + (s * 8) * (model.percentAssign / 100);
        util = (sum / 40) * 100;
        pp = this.resourceDetail[i].utilization + util;
        if(pp > 100 && !this.seenAllocationWarn){
          this.toastr.warning("Resource utilization is over 100%. Press create to continue");
          this.seenAllocationWarn = true;
          return;
        }else if(this.seenAllocationWarn){
          this.seenAllocationWarn = false;
        }
      }
    }

    model.startDate = moment(model.startDate).toDate().toISOString();
    model.endDate = moment(model.endDate).toDate().toISOString();
    let schedule = {
      resourceId: model.id,
      projectId: model.projectId,
      startDate: model.startDate,
      endDate: model.endDate,
      percentage: model.percentAssign,
      // FIXME: NEEDS BACKEND
      // comment : model.comment
    }

    this.appService.setProjectorResourceEvent(schedule).subscribe(data => {
      if (data != undefined && data.hasOwnProperty("success") && data["success"] == "true") {
        this.toastr.success("Project allocated successfully.");
        this.load()// Reload the resource. TODO: create a function to update the updated Employee only instead of loading all resources
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
  // Updating an event validation for both project and resource
  update(model) {
    if (model.projectId == null || model.projectId == '') {
      this.toastr.error("Please select a project")
      return;
    }
    for (let project of this.projectDetail) {
      if (model.projectId == project.projectId) {
        if (new Date(model.start) > project.endDate || new Date(model.end) < project.startDate || new Date(model.end) > project.endDate || new Date(model.start) < project.startDate) {
          this.toastr.error("Please enter a date between the project's start date and end date")
          return;
        }
      }
    }
    if (new Date(model.start) < this.minDate || new Date(model.end) > this.maxDate || new Date(model.end) < this.minDate || new Date(model.start) > this.maxDate) {
      this.toastr.error("A project cannot be assigned before 1900-01-01 and after 2099-06-31")
      return;
    }
    if (new Date(model.start) > new Date(model.end)) {
      this.toastr.error("A project's start date should not be after the end date")
      return;
    }
    if (model.start == null || model.start == '') {
      this.toastr.error("Please enter start date")
      return;
    }
    if (model.end == null || model.end == '') {
      this.toastr.error("Please enter end date")
      return;
    }
    if (model.allocation === null) {
      this.toastr.error("Please enter percentage allocation")
      return;
    }
    if (model.allocation < 1) {
      this.toastr.error("Percentage allocation can not be 0 or less")
      return;
    }
    if (model.allocation > 100) {
      this.toastr.error("Percentage allocation can not be greater than 100")
      return;
    }
    model.start = moment(model.start).toDate().toISOString();
    model.end = moment(model.end).toDate().toISOString();
    let schedule = {
      assignmentId: model.assignmentId,
      resourceId: model.resId,
      projectId: model.projectId,
      startDate: model.start,
      endDate: model.end,
      percentage: model.allocation,
      // FIXME: NEEDS BACKEND
      // comment: model.comment
    }
    this.appService.updateProjectorResourceEvent(schedule).subscribe(data => {
      if (data != undefined && data.hasOwnProperty("success") && data["success"] == "true") {
        this.toastr.success("Project updated successfully.");
        this.load()// Reload the resource. TODO: create a function to update the updated Employee only instead of loading all resources
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
  delete(model) {

    this.appService.delProjectorResourceEvent(model.assignmentId).subscribe(data => {
      if (data != undefined && data.hasOwnProperty("success") && data["success"] == "true") {
        this.toastr.success("Resource dealocate from the project.");
        this.load()// Reload the resource. TODO: create a function to update the updated Employee only instead of loading all resources
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

  processError(error: any) {
    if (error.status === 401) {
      this.toastr.dispose();
      this.appService.logout();
    } else {
      this.toastr.error("Oops, something went wrong!");
    }
  }
  load() {
    this.appService.getSchedulerProjects().subscribe(data => {
      this.fillProjects(data)
    },
      err => {

      }
    );
    this.appService.getSchedulerResources().subscribe(data => {
      this.fillResources(data)
    },
      err => {

      }
    );
  }
  // Allocating a resource to a project validation
  addResinPro(model) {
    if (model.projectId == null || model.projectId == '') {
      this.toastr.error("Please select a project")
      return;
    }
    for (let project of this.projectDetail) {
      if (model.projectId == project.projectId) {
        if (new Date(model.startDate) > project.endDate || new Date(model.endDate) < project.startDate || new Date(model.endDate) > project.endDate || new Date(model.startDate) < project.startDate) {
          this.toastr.error("Please enter a date between the project's start date and end date")
          return;
        }
      }
    }
    if (new Date(model.startDate) < this.minDate || new Date(model.endDate) > this.maxDate || new Date(model.endDate) < this.minDate || new Date(model.startDate) > this.maxDate) {
      this.toastr.error("A project cannot be assigned before 1900-01-01 and after 2099-06-31")
      return;
    }
    if (new Date(model.startDate) > new Date(model.endDate)) {
      this.toastr.error("A project's start date should not be after the end date")
      return;
    }
    if (model.startDate == null || model.startDate == '') {
      this.toastr.error("Please enter start date")
      return;
    }
    if (model.endDate == null || model.endDate == '') {
      this.toastr.error("Please enter end date")
      return;
    }
    if (model.percentAssign === null || model.percentAssign === '') {
      this.toastr.error("Please enter percentage allocation")
      return;
    }
    if (model.percentAssign < 1 || model.percentAssign == 0) {
      this.toastr.error("Percentage allocation can not be 0 or less")
      return;
    }
    if (model.percentAssign > 100) {
      this.toastr.error("Percentage allocation can not be greater than 100")
      return;
    }
    console.log(model)
    let s = 0;
    let sum = 0;
    let util = 0;
    let pp = 0
    for (let i = 0; i < this.resourceDetail.length; i++) {
      if (this.resourceDetail[i].id == model.resourceId) {
        s = moment(model.endDate).diff(moment(model.startDate), 'days') + 1
        sum = sum + (s * 8) * (model.percentAssign / 100);
        util = (sum / 40) * 100;
        pp = this.resourceDetail[i].utilization + util;
        if(pp > 100 && !this.seenAllocationWarn){
          this.toastr.warning("Resource utilization is over 100%. Press create again to continue");
          this.seenAllocationWarn = true;
          return;
        }else if(this.seenAllocationWarn){
          this.seenAllocationWarn = false;
        }
      }
    }
    model.startDate = moment(model.startDate).toDate().toISOString();
    model.endDate = moment(model.endDate).toDate().toISOString();
    let schedule = {
      resourceId: model.resourceId,
      projectId: model.projectId,
      startDate: model.startDate,
      endDate: model.endDate,
      percentage: model.percentAssign,
      // FIXME: NEEDS BACKEND
      // comment : model.comment
    }
    this.appService.setProjectorResourceEvent(schedule).subscribe(data => {
      if (data != undefined && data.hasOwnProperty("success") && data["success"] == "true") {
        this.toastr.success("Resource allocated successfully.");
        this.load()// Reload the resource. TODO: create a function to update the updated Employee only instead of loading all resources
        this.modalRef.hide();
      } else if (data != undefined && data.hasOwnProperty("success") && data["success"] == "false") {
        this.toastr.error(data["description"]);
      } else {
        this.toastr.error(data["description"])
      }
    }, (error) => {

    })
  }
  validateEnd(start) {

    if (new Date(start) > new Date(this.model1.end)) {
      this.model1.end = ''
    }
    if (new Date(start) > new Date(this.model.endDate)) {
      this.model.endDate = ''
    }
    if (new Date(start) > new Date(this.modelPro.endDate)) {
      this.modelPro.endDate = ''
    }
    document.getElementById('end').setAttribute('min', start);
  }
  trueShow() {
    this.show = false;
  }

  calculateUtilization(viewDate, methodCall) {
    this.viewDate = viewDate
    let y = this.viewDate.getFullYear();
    this.currentWeek = moment(this.viewDate).week();
    if (this.currentWeek < 10) {
      this.currentWeek = '0' + this.currentWeek;
    }
    this.viewDatenew = y + "-W" + this.currentWeek
    let weekNumber = moment(viewDate).week();
    this.firstDay = (moment().day("Monday").week(weekNumber)).toDate();
    this.lastDay = (moment().day("Sunday").week(weekNumber + 1)).toDate();
    if (methodCall == "filterMethod") {
      this.method = true;
      return;
    } else if (this.resourceView) {
      this.filterResourceEventsByProjectType(this.ptype);
      this.filterProjectEventsByResourceType(this.rType);
      return;
    } else if (this.projectView) {
      this.filterResourceEventsByProjectType(this.ptype);
      this.filterProjectEventsByResourceType(this.rType);
      return;
    }

    this.method = false;
    this.load();

  }
  changeWeek(newView) {
    if (newView == null || newView == "") {
      this.viewDate = new Date();
      this.currentWeek = moment(this.viewDate).week();
      let y = this.viewDate.getFullYear();
      this.viewDatenew = moment(this.viewDate).isoWeek()
      this.calculateUtilization(this.viewDate, '');
      return
    }
    let d = (moment(newView).day("Monday").week(newView)).toDate()
    this.viewDate = new Date(d)
    this.calculateUtilization(this.viewDate, '');

  }
}