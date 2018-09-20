import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {DialogModule} from 'primeng/dialog';
import {MenubarModule} from 'primeng/menubar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { AuthenticationControllerComponent } from './authentication-controller/authentication-controller.component';
import { MaintenanceControllerComponent } from './maintenance-controller/maintenance-controller.component';
import {DataTableModule, DataTable} from 'primeng/datatable';
import { routing } from './app-routes';
import {ResourceSchedulerComponent} from './resource-scheduler/resource-scheduler.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { RouterModule, Routes } from '@angular/router';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { HttpClientModule } from '@angular/common/http';
import {DropdownModule} from 'primeng/dropdown';
import {InputTextareaModule} from 'primeng/inputtextarea';
import { MyDatePickerModule } from 'mydatepicker';
import {TableModule, Table} from 'primeng/table';
import { NavigationComponent } from './navigation/navigation.component';
import { NgHttpLoaderModule } from 'ng-http-loader/ng-http-loader.module';
import { BsModalService } from 'ngx-bootstrap/modal';
import {ModalModule} from 'ngx-bootstrap/modal';
import { NavigationService } from './navigation/navigation.service';
import {PopoverModule} from 'ngx-popover';
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgxPaginationModule } from 'ngx-pagination';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { TagsInputModule } from 'ngx-tags-input/dist';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FilterPipe} from './pipes/FilterPipes';
import { ProjectFilterPipe} from './pipes/schedulerProjectFilter';
import { StartDateFilter } from'./pipes/StartDateFilter';
import { EndDateFilter } from'./pipes/EndDateFilter';
import { CalendarModule } from 'angular-calendar';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ProjectComponent } from './project/project.component';
import { ProfileComponent } from './profile/profile.component';
import { FilterBarComponent } from './filter-bar/filter-bar.component';
import { ReportComponent } from './report/report.component';
import { OrderModule } from 'ngx-order-pipe';
import { DatePipe } from '@angular/common';
import { PopUpComponent } from './pop-up/pop-up.component';
import {ResourceFilterExpType} from '../app/pipes/ResourceFilterExpType';
import {ResourceFilterSkillType} from '../app/pipes/ResourceFilterSkillType';
import {ResourceFilterAccDesignation} from '../app/pipes/ResourceFilterAccDesignation';
import {ResourceFilterAccToResTyp} from '../app/pipes/ResourceFilterAccToResTyp';
import {ProjectFilterAccToProTyp} from '../app/pipes/ProjectFilterAccToProTyp';
import { SettingsComponent } from './settings/settings.component';    
import {AuthVerifyService} from './auth-verify.service' 
import { DateSortFilter } from './pipes/dateSortFilter';
import { ArchiveProjectPipe } from './pipes/archiveProject.pipe';
import { ArchiveResourcePipe } from './pipes/archiveResource.pipe';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatTableModule } from '@angular/material/table';

const appRoutes : Routes = [
  {path: '', component: AuthenticationControllerComponent},
  {path: 'changepassword', component: ChangePasswordComponent, canActivate:[AuthVerifyService]},
  {path: 'scheduler', component: ResourceSchedulerComponent, canActivate:[AuthVerifyService]},
  {path: 'project', component: ProjectComponent, canActivate:[AuthVerifyService]},
  {path: '**', component: AuthenticationControllerComponent}
  ];

@NgModule({
  declarations: [
    ProjectFilterPipe,
    AppComponent,
    AuthenticationControllerComponent,
    MaintenanceControllerComponent,
    ChangePasswordComponent,
    NavigationComponent,
    ResetPasswordComponent,
    ResourceSchedulerComponent,
    ProjectComponent,
    ProfileComponent,
    FilterBarComponent,
    ReportComponent,
    FilterPipe,
    EndDateFilter,
    DateSortFilter,
    StartDateFilter,
    PopUpComponent,
    ResourceFilterExpType,
    ResourceFilterSkillType,
    ResourceFilterAccDesignation,
    ResourceFilterAccToResTyp,
    ProjectFilterAccToProTyp,
    SettingsComponent,
    ArchiveProjectPipe,
    ArchiveResourcePipe,
    DashboardComponent
  ],
  imports: [
    NgbModule.forRoot(),
    CalendarModule.forRoot(),
    TagsInputModule.forRoot(),
    NgMultiSelectDropDownModule.forRoot(),
    Ng2SearchPipeModule,
    FilterPipeModule,
    ReactiveFormsModule,
    BrowserModule,
    NgSelectModule,
    MatTableModule,
    HttpClientModule,
    DropdownModule,
    OrderModule,
    DataTableModule,
    routing,
    DialogModule,
    MenubarModule,
    BrowserAnimationsModule,
    FormsModule,
    TableModule,
    MyDatePickerModule,
    InputTextareaModule,
    NgHttpLoaderModule,
    PopoverModule,
    AngularFontAwesomeModule,
    ToastModule.forRoot(),
    ModalModule.forRoot(),
    NgxPaginationModule,
    AngularFontAwesomeModule,
    RouterModule.forRoot( appRoutes,
      { enableTracing: false } )
  ],
  providers: [AppService,BsModalService,NavigationService, ToastsManager,DatePipe,AuthVerifyService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
