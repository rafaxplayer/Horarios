import { BrowserModule } from '@angular/platform-browser';
import { NgModule ,LOCALE_ID} from '@angular/core';

// Routas
import { APP_ROUTING } from './Routes/app.routes';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './Components/header/header.component';
import { ContentComponent } from './Components/content/content.component';
import { FooterComponent } from './Components/footer/footer.component';
import { ChartsComponent } from './Components/charts/charts.component';

//Animations
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Angular-calendar
import { CalendarModule } from 'angular-calendar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { FirebaseService } from './Services/firebase.service';


//Char js
import { ChartsModule } from 'ng2-charts';
import { NotloginComponent } from './Components/notlogin/notlogin.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ContentComponent,
    FooterComponent,
    ChartsComponent,
    NotloginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot(),
    NgbModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    APP_ROUTING,
    ChartsModule
  ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
