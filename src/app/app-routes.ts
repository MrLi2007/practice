
import { Routes, RouterModule } from '@angular/router';
import {ResourceSchedulerComponent} from './resource-scheduler/resource-scheduler.component'
import{ProfileComponent} from './profile/profile.component'
import { ProjectComponent } from './project/project.component';
import { ReportComponent } from './report/report.component';
import { SettingsComponent } from './settings/settings.component';
import { AuthVerifyService } from './auth-verify.service';
import { DashboardComponent } from './dashboard/dashboard.component';
const appRoutes: Routes = [
    { path: '', redirectTo: 'index', pathMatch: 'full' }, 
    { path: 'scheduler/', component:ResourceSchedulerComponent,canActivate:[AuthVerifyService] }, 
    {path:'projects',component: ProjectComponent,canActivate:[AuthVerifyService]},
    {path:'dashboard',component: DashboardComponent,canActivate:[AuthVerifyService]},
    {path:'profile', component:ProfileComponent,canActivate:[AuthVerifyService]},
    {path:'report',component:ReportComponent,canActivate:[AuthVerifyService]},
    {path:'settings',component:SettingsComponent,canActivate:[AuthVerifyService]}
    //{ path: '**', redirectTo: 'index' }
];

export const routing = RouterModule.forRoot(appRoutes);
