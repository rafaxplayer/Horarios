import { Component, OnInit, ChangeDetectionStrategy, ViewChildren, QueryList, OnDestroy} from '@angular/core';
import { isSameDay, isSameWeek, isSameMonth } from 'date-fns';
import { FirebaseService } from '../../Services/firebase.service';
import { CalendarEvent } from 'calendar-utils';
import { convertMinutesToHours } from '../helpers/helpers';
import { BaseChartDirective }  from 'ng2-charts/ng2-charts';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-glosario',
  templateUrl: './glosario.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./glosario.component.css']
})
export class GlosarioComponent implements OnInit {

  @ViewChildren(BaseChartDirective) chartList: QueryList<BaseChartDirective>;
  
  chart: Array<any> = [];

  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public charType ='bar';
  
  public barChartLegend:boolean = true;

  public barChartLabelsYear:string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  public barChartLabelsWeek:string[] = ['Domingo','Lunes','Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
      
  public barChartDataYear:Array<any> = [
    {data:[], label:'Horas Mensuales'},
    {data:[], label:'Horas Mes anterior'}
  ];

  public barChartDataWeek:Array<any> = [
    {data:[], label:'Horas Diarias'},
    {data:[], label:'Horas Semana anterior'}
  ];

  date:Date= new Date();
  
  horarios:CalendarEvent[]=[];
  
  firePromise:any;

  constructor(private firebaseService:FirebaseService) { }
  
  ngOnInit() {
    this.firePromise = this.firebaseService.getHorarios().snapshotChanges().subscribe(item =>{
      item.forEach((data)=> {
        this.horarios.push(data.payload.val() as CalendarEvent) 
      });
      this.updateChartYearHours( this.barChartDataYear );
      this.updateChartWeekHours( this.barChartDataWeek );
      this.updateCharts();
    });
  }

  
  ngOnDestroy(): void {
    
    this.firePromise.unsubscribe();
  }

  updateCharts(){
    this.chartList.forEach((child)=> child.chart.update() );
  }

  updateChartYearHours(dataChartYear:Array<any>){
    for( let i=0; i<12; i++ ){ dataChartYear[0].data.push(this.getMonthHours(this.horarios,i,this.date.getFullYear())); } 
  }

  updateChartWeekHours(dataChartWeek:Array<any>){
    for( let i=0; i<7; i++){ dataChartWeek[0].data.push(this.getDayHoursofThisWeek(this.horarios,i,this.date.getFullYear())); }
  }
 

  getMonthHours(data:CalendarEvent[],month:number,year:number):number{

    let minutes=0;
    let thisMonth = data.filter(item => {
      const itemDate= new Date(item.start);
      return itemDate.getMonth() == month && itemDate.getFullYear() == year;
    });
    
    if(thisMonth){
      thisMonth.map(data=>{
        minutes = minutes + data.meta.minutes;

      })
    }
    return convertMinutesToHours(minutes);

  }


  getDayHoursofThisWeek(data:CalendarEvent[],dayofWeek:number,year:number){

    let minutes = 0;
    let daysOfThisWeek = data.filter(item => {
      const itemDate = new Date(item.start);
      return itemDate.getDay() == dayofWeek && isSameWeek(item.start, this.date) && itemDate.getFullYear() == year;
    });
    
    if(daysOfThisWeek){
      daysOfThisWeek.map(data=>{
        minutes = minutes + data.meta.minutes;
      })
    }
    return convertMinutesToHours(minutes);
  }

}

