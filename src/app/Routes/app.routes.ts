import { Routes, RouterModule } from '@angular/router';
import { CalendarComponent } from '../Components/calendar/calendar.component';
import { ChartsComponent } from '../Components/charts/charts.component';
import { NotloginComponent } from '../Components/notlogin/notlogin.component';

const APP_ROUTES: Routes = [
    
    { path: 'home', component: CalendarComponent },
    { path: 'charts/:date', component: ChartsComponent },
    { path: 'notlogin', component: NotloginComponent },
    { path: '**', component: CalendarComponent }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
