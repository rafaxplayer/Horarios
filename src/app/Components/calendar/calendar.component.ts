import { DayTypesSelectAction } from './../../store/daytypes/daytypes.actions';
import { AppState } from '../../store/app.reducers';
import { Component, OnInit, ViewChild, ChangeDetectionStrategy, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { addZeros, formatMinutes, convertMinutesToHours } from '../helpers/helpers';
import { FirebaseService } from '../../Services/firebase.service';
import {
  isBefore,
  isEqual,
  isValid,
  isWithinRange,
  isSameDay,
  isSameWeek,
  isSameMonth,
  differenceInMinutes

} from 'date-fns';
import swal from 'sweetalert2';
import { CalendarEvent, CalendarEventAction, CalendarMonthViewDay } from 'angular-calendar';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { localStroreExists, localStroreSet } from '../helpers/helpers';
import { Store } from '@ngrx/store';
import { dayTypesModel } from '../../models/Calendar.models';
import { Daytype } from '../../interfaces/app.interfaces';



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
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {

  periodMsg: string;
  dateModal: string;
  hourModal: string;
  events: CalendarEvent[] = [];
  view: string = 'month';
  viewDate: Date = new Date();
  hoursWorked: string = "00:00";
  storeSubscription: any;

  @ViewChild('modalContent') modalContent: TemplateRef<any>;

  date: Date;

  startPeriod: boolean = true;

  dayType: Daytype = dayTypesModel[0];

  dayTypes: Daytype[] = [];

  period: CalendarEvent = {
    title: "",
    start: new Date(),
    end: new Date(),
    color: colors.blue,
    meta: {
      id: '',
      minutes: 0
    }

  }

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {

        swal({
          title: 'Eliminar Horario',
          text: '¿Seguro quieres eliminar este horario?',
          type: 'warning',
          showCancelButton: true,
          confirmButtonText: 'SI',
          cancelButtonText: 'CANCELAR',
          reverseButtons: true

        })
          .then((willdelete) => {
            if (willdelete.value) {
              this.firebaseService.deleteHorario(event);
              swal("Ok!", " Horario eliminado con exito!", "success");
            }
          });

      }
    }
  ];

  getPeriodMsg(): string {
    if (this.startPeriod) {
      return 'Inicio del trabajo';
    } else {
      return 'Final del trabajo';
    }

  }

  getFormatDate(date): string {
    return `Dia ${date.getDate()} del ${date.getMonth()} ${date.getFullYear()}`;

  }

  getFormatHour(date): string {

    let outputh: string;

    if (this.startPeriod) {
      outputh = "Empieza ";
    } else {
      outputh = "Acaba ";
    }
    return `${outputh} ${addZeros(date.getHours())}:${addZeros(date.getMinutes())} Horas`;
  }

  refresh: Subject<any> = new Subject();

  constructor(private modal: NgbModal,
    private firebaseService: FirebaseService,
    public store: Store<AppState>
  ) { }

  ngOnInit() {
    this.events = [];
    this.storeSubscription = this.store.subscribe((data: AppState) => {

      this.events = data.horarios;
      this.dayTypes = data.dayTypes.list
      //console.log(data.daytypes_list);

      this.refresh.next();
    })

    if (!localStroreExists('calendar')) {
      swal('Bienbenido a HOURS WORKED', 'Comienza eligiendo un dia para editar tus horarios trabajados', 'success');
      localStroreSet('calendar', 'true');
    }

  }

  // day click on month.... show day view
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (this.view == 'month') {
      this.viewDate = date;
      this.view = 'day';
      this.hoursWorked = this.horasTrabajadas('day');

    }

  }

  // show week view
  showView(view: string) {
    this.view = view;
    this.hoursWorked = this.horasTrabajadas(view);
  }

  // hour click on day view
  hour_clicked(event) {
    this.date = new Date(event.date);
    this.openModal();

  }

  openModal() {
    this.periodMsg = this.getPeriodMsg();
    this.dateModal = this.getFormatDate(this.date);
    this.hourModal = this.getFormatHour(this.date);

    const modalRef = this.modal.open(this.modalContent, { centered: true }).result.then((result) => {
      console.log(`Closed with: ${result}`);
    }, (reason) => {
      if (reason == 'save') {

        if (!isValid(this.date)) {
          swal('Error', 'El horario no es valido', 'error');
          return;
        }

        if (this.startPeriod) {
          this.period.start = this.date;

          this.startPeriod = false;
        } else {

          if (isBefore(this.date, this.period.start) || isEqual(this.date, this.period.start)) {
            swal('Error', 'El fin del horario no puede ser igual o antes del inicio de horario', 'error');

            return;
          }
          this.period.end = this.date;
          let minutes = differenceInMinutes(this.period.end, this.period.start);
          this.period.meta.minutes = minutes;
          this.period.title = `${formatMinutes(minutes)} trabajados`;

          if (this.checkSchedulesOverlap(this.period, this.events)) {
            swal('Error', "Los hoarrios no se pueden solapar", 'error');
            this.startPeriod = true;
            return;
          }
          this.firebaseService.addHorario(this.period);
          this.refresh.next();
          swal('Guardado!', 'Horario añadido', 'success');
          this.startPeriod = true;
          this.horasTrabajadas(this.view);
        }

      }
    });

  }


  horasTrabajadas(view: string): string {
    let ret = "";
    let horariosFilter = this.getEventsWithView(view);
    if (horariosFilter) {
      let minutes = 0;
      horariosFilter.forEach(element => {
        //console.log(element.meta.minutes);
        minutes = minutes + element.meta.minutes;

      });
      ret = formatMinutes(minutes) + " Horas Trabajadas";
    } else {
      ret = 'No hai horas';
    }
    return ret;
  }

  checkSchedulesOverlap(date: CalendarEvent, events: CalendarEvent[]): boolean {

    //get events today
    let eventstoday = events.filter(iEvent => isSameDay(iEvent.start, date.start));

    // get event today isWithinRange new period
    let today = eventstoday.filter(iEvent => isWithinRange(date.start, iEvent.start, iEvent.end) || isWithinRange(date.end, iEvent.start, iEvent.end))

    // if iswithingrange return bolean
    return (today.length > 0);
  }

  getEventsWithView(view: string): CalendarEvent[] {

    let eventsFilter: CalendarEvent[];

    switch (view) {
      case "day":

        eventsFilter = this.events.filter(iEvent => isSameDay(iEvent.start, this.viewDate));
        break;
      case "month":

        eventsFilter = this.events.filter(iEvent => isSameMonth(iEvent.start, this.viewDate));
        break;
      case "week":

        eventsFilter = this.events.filter(iEvent => isSameWeek(iEvent.start, this.viewDate));
        break;
      default:

        eventsFilter = this.events.filter(iEvent => isSameMonth(iEvent.start, this.viewDate));

    }

    return eventsFilter;

  }

  beforeViewRender({ body }: { body: CalendarMonthViewDay[] }): void {
    if (this.view == 'month') {
      body.forEach(day => {

        let minutes: number = 0;
        day.events.forEach(event => {
          minutes = minutes + event.meta.minutes;
        })

        day.badgeTotal = convertMinutesToHours(minutes);
        let filterDay = this.dayTypes.filter(daytype => daytype.date == day.date.toDateString());

        day.cssClass = filterDay.length > 0 ? filterDay[0].color : '';

      });
    }

    if (this.view == 'day') {
      if (!localStroreExists('day')) {
        swal('Muy Bien!', 'Ahora selecciona la hora de comienzo de tu jornada y despues la hora final', 'success');
        localStroreSet('day', 'true');
      }

      let filterDay = this.dayTypes.filter(daytype => daytype.date == this.viewDate.toDateString());

      this.dayType = filterDay.length > 0 ? filterDay[0] : dayTypesModel[0];

    }
  }


  async showDayTypesMenu() {

    const { value: val } = await swal({
      title: 'Selecciona tipo de dia',
      input: 'select',
      inputOptions: {
        'worked': 'Trabajado',
        'free': 'Fiesta',
        'holidays': 'Vacaciones'
      },
      inputPlaceholder: 'Seecciona tipo',
      showCancelButton: true

    })

    if (val) {
      let daytype = dayTypesModel.filter(daytype => daytype.value == val)[0]
      this.dayType = daytype;
      const action = new DayTypesSelectAction(daytype);
      this.store.dispatch(action)

      this.firebaseService.addDayType(daytype, this.viewDate)
    }
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();

  }
}
