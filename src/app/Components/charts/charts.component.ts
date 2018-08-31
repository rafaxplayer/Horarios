import { Component, OnInit, ChangeDetectionStrategy, ViewChildren, QueryList, OnDestroy} from '@angular/core';
import { isWithinRange, isThisWeek, getDaysInMonth, isSameDay,subMonths } from 'date-fns';
import { FirebaseService } from '../../Services/firebase.service';
import { CalendarEvent } from 'calendar-utils';
import { convertMinutesToHours } from '../helpers/helpers';
import { BaseChartDirective }  from 'ng2-charts/ng2-charts';
import { ActivatedRoute } from '@angular/router';

interface ChartType {
  id:string;
  value:string;
}

@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./charts.component.css']
})
export class ChartsComponent implements OnInit {

  @ViewChildren(BaseChartDirective) chartList: QueryList<BaseChartDirective>;
  
  chart: Array<any> = [];

  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public chartType:string;
  
  public barChartLegend:boolean = true;

  public barChartLabelsYear:string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  public barChartLabelsWeek:string[] = ['Domingo', 'Lunes','Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
  
  public barChartLabelsMonth:number[] = [];
  
  public chartTypes:ChartType[];

  public barChartDataYear:Array<any> = [
    {data:[], label:'Horas este año'},
    {data:[], label:'Horas año anterior'}
  ];

  public barChartDataMonth:Array<any>=[
    {data:[], label:'Horas este mes'},
    {data:[], label:'Horas mes anterior'}
  ];

  public barChartDataWeek:Array<any> = [
    {data:[], label:'Horas esta semana'},
    {data:[], label:'Horas semana anterior'}
  ];

  date:Date;
  
  horarios:CalendarEvent[]=[];
  
  firePromise:any;

  chartTypeSelected:ChartType;
  
  constructor(
    private firebaseService:FirebaseService,
    private route: ActivatedRoute) { 

    this.chartTypes = [{id:'line',value:'Line'},{id:'bar',value:'Bar'},{id:'pie',value:'Pie'},{id:'radar',value:'Radar'},{id:'doughnut',value:'Doughnut'}]

    this.chartTypeSelected = this.chartTypes[1];

    this.chartType= this.chartTypeSelected.id;

    let paramdate = this.route.snapshot.paramMap.get('date');

    this.date= new Date(paramdate);

    let numbersMonth = getDaysInMonth(this.date);

    let arrayNumbers=[];

    for(let i=0;i<numbersMonth;i++){
      arrayNumbers.push( i + 1 )
    }

    this.barChartLabelsMonth = arrayNumbers;
    
  }
  
  ngOnInit() {

    this.firePromise = this.firebaseService.getHorarios().snapshotChanges().subscribe(item =>{
      item.forEach((data)=> {
        this.horarios.push(data.payload.val() as CalendarEvent) 
      });
      this.updateChartYearHours( this.barChartDataYear );
      this.updateChartWeekHours( this.barChartDataWeek );
      this.updateChartMonthHours(this.barChartDataMonth );
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
    for( let i = 0; i < 12; i++ ){ 
      dataChartYear[0].data.push(this.getMonthHours(this.horarios, i, this.date.getFullYear())); 
      dataChartYear[1].data.push(this.getMonthHours(this.horarios, i, this.date.getFullYear()-1));
    } 

  }

  updateChartMonthHours(dataChartMonth:Array<any>){
    let nDays = getDaysInMonth(this.date);
    let datePreviousMonth= subMonths(this.date,1);
    let nDayPreviousMonth = getDaysInMonth(datePreviousMonth);

    for( let i = 0; i < nDays; i++){
        dataChartMonth[0].data.push(this.getDayHours(this.horarios, i+1 ,this.date.getMonth(), this.date.getFullYear()));
    }

    for( let i = 0; i < nDayPreviousMonth; i++){
      dataChartMonth[1].data.push(this.getDayHours(this.horarios, i+1 ,datePreviousMonth.getMonth(), datePreviousMonth.getFullYear()));
    }

  }

  updateChartWeekHours(dataChartWeek:Array<any>){
    for( let i=0; i<7; i++){ 
      dataChartWeek[0].data.push(this.getDayHoursofThisWeek(this.horarios, i, this.date.getFullYear(), true)); 
      dataChartWeek[1].data.push(this.getDayHoursofThisWeek(this.horarios, i, this.date.getFullYear(), false)); 
    }
  
  }
 
  getMonthHours(data:CalendarEvent[],month:number,year:number):number{

    let minutes=0;
    let thisMonth = data.filter(item => {
      const itemDate = new Date(item.start);
      return itemDate.getMonth() == month && itemDate.getFullYear() == year;
    });
    
    if(thisMonth.length){
      thisMonth.map(data=>{
        minutes = minutes + data.meta.minutes;

      })
    }
    return convertMinutesToHours(minutes);
  }

  getDayHours(data:CalendarEvent[],day:number, month:number, year:number):number{
    let minutes=0;
    let dayMonth = data.filter(item => {
      let itemDate = new Date(item.start);
      return itemDate.getMonth() == month && itemDate.getFullYear() == year && itemDate.getDate() == day;
     
    });
    
    if(dayMonth.length){
     
      dayMonth.map(data=>{
        minutes = minutes + data.meta.minutes;

      })
    }
    return convertMinutesToHours(minutes);

  }


  getDayHoursofThisWeek(data:CalendarEvent[],dayofWeek:number,year:number,isThis:boolean){

    let minutes = 0;
    let daysOfThisWeek = data.filter( item => {

      const itemDate = new Date( item.start );
      let range = this.getRangePreviousWeek( this.date );

      if(isThis){

        return itemDate.getDay() == dayofWeek && isThisWeek( itemDate  ) && itemDate.getFullYear() == year;

      }else{
        
        return itemDate.getDay() == dayofWeek && isWithinRange( itemDate , range.first, range.last ) && itemDate.getFullYear() == year;
      }
      
    });
    
    if(daysOfThisWeek){
      daysOfThisWeek.map( data =>{
        minutes = minutes + data.meta.minutes;
      })
    }
    return convertMinutesToHours(minutes);
  }
 
  getRangePreviousWeek(date:Date):any{
    let prevDatesWeek={
      first:0,
      last:0
    };
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    let dummy =  date.getDay();
    dummy = dummy + 6;
    prevDatesWeek.first = date.setDate(date.getDate() - dummy );
    
    prevDatesWeek.last = date.setDate(date.getDate() + 6);
   
    return prevDatesWeek;

  }

  chartChange(event){
    if(event.target.value == 'Char type'){
      return;
    }
    this.chartType = event.target.value
    
  }
}

