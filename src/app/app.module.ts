import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Routas
import { APP_ROUTING } from './Routes/app.routes';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './Components/shared/header/header.component';
import { CalendarComponent } from './Components/calendar/calendar.component';
import { FooterComponent } from './Components/shared/footer/footer.component';
import { ChartsComponent } from './Components/charts/charts.component';
import { NotloginComponent } from './Components/notlogin/notlogin.component';

//Animations
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Angular-calendar
import { CalendarModule, CalendarNativeDateFormatter, CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { environment } from '../environments/environment';
import { FirebaseService } from './Services/firebase.service';

//Char js
import { ChartsModule } from 'ng2-charts';

//redux
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppReducers } from './store/app.reducers';

class CustomDateFormatter extends CalendarNativeDateFormatter {

  public dayViewHour({date, locale}: DateFormatterParams): string {
    return new Intl.DateTimeFormat('ca', {
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  }

}

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CalendarComponent,
    FooterComponent,
    ChartsComponent,
    NotloginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CalendarModule.forRoot({
      dateFormatter: {
        provide: CalendarDateFormatter, 
        useClass: CustomDateFormatter
      }
    }),
    NgbModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    APP_ROUTING,
    ChartsModule,
    StoreModule.forRoot(AppReducers),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    })
    
    ],
  providers: [FirebaseService],
  bootstrap: [AppComponent]
})
export class AppModule { }
