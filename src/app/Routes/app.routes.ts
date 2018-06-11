import { Routes, RouterModule } from '@angular/router';
import { ContentComponent } from '../Components/content/content.component';
import { GlosarioComponent } from '../Components/glosario/glosario.component';

const APP_ROUTES: Routes = [
    
    { path: 'home', component: ContentComponent },
    { path: 'glosario', component:  GlosarioComponent },
    { path: '**', component: ContentComponent }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
