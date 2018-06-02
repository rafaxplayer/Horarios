import { Component,  ViewChild,ChangeDetectionStrategy, TemplateRef, Input } from '@angular/core';
import {addZeros} from '../helpers/helpers'
import {
  isBefore,
  isEqual
  
} from 'date-fns';

import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';

import { Subject } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
};

@Component({
  selector: 'app-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css']
})
export class ContentComponent  {

  @Input() periodMsg:string;
  @Input() dateModal:string;
  @Input() hourModal:string;

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  view: string = 'month';

  viewDate: Date = new Date();

  date:Date;

  startPeriod:boolean = true;

  period:CalendarEvent ={

    title:"",
    start: new Date(),
    end: new Date()
    
  }


  getPeriodMsg():string{
    if(this.startPeriod){
      return 'Inicio del trabajo';
    }else{
      return 'Final del trabajo';
    }
  }

  getFormatDate(date):string{
    return `Dia ${date.getDate()} del ${date.getMonth()} ${date.getFullYear()}`;

  }

  getFormatHour(date):string{

   let outputh:string;

    if(this.startPeriod){
      outputh= "Empieza ";
    }else{
      outputh= "Acaba ";
    }
    return `${outputh} ${addZeros(date.getHours())}:${addZeros(date.getMinutes())} Horas`;
  }

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
    /* {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow,
      
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: new Date(),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      
      resizable: {
        beforeStart: true,
        afterEnd: true
      },
      draggable: true
    } */
  ]; 
  
  constructor(private modal: NgbModal) {}

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log(date);
    console.log(events);
    if(this.view == 'month'){
      this.viewDate=date;
      this.view = 'day';
    } 
    
  }

  hour_clicked(event){
    this.date = new Date(event.date);
    console.log(this.date);
    this.openModal();
  }

  openModal() {
    this.periodMsg= this.getPeriodMsg();
    this.dateModal= this.getFormatDate(this.date);
    this.hourModal= this.getFormatHour(this.date);
    
    const modalRef = this.modal.open(this.modalContent,{ centered: true }).result.then((result) => {
      console.log( `Closed with: ${result}`);
    }, (reason) => {
      if(reason=='save'){

        if(this.startPeriod){

          this.period.start = this.date;
          console.log('Start period',this.period);
        }else{
          let start = this.period.start;
          if(isBefore(this.date,start) || isEqual(this.date,start)){
            alert('El fin del horario no puede ser igual o antes del inicio de horario');
            return;
          }
          console.log('Start and End period',this.period);

        }

        console.log('Saved period',this.period);
        this.events.push(this.period);
        console.log('Periods',this.events);
        this.startPeriod = !this.startPeriod;
        alert('saved');
      }
    });
    
  }
  

  

  addEvent(): void {
    /* this.events.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    }); */
    this.refresh.next();
  }

}
