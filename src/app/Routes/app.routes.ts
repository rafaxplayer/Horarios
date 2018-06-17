import { Routes, RouterModule } from '@angular/router';
import { ContentComponent } from '../Components/content/content.component';
import { ChartsComponent } from '../Components/charts/charts.component';
import { NotloginComponent } from '../Components/notlogin/notlogin.component';

const APP_ROUTES: Routes = [
    
    { path: 'home', component: ContentComponent },
    { path: 'charts', component: ChartsComponent },
    { path: 'notlogin', component: NotloginComponent },
    { path: '**', component: ContentComponent }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
