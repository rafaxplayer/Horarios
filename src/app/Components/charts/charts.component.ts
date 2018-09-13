import { Component, OnInit, ChangeDetectionStrategy, ViewChildren, QueryList, ChangeDetectorRef} from '@angular/core';
import { isWithinRange, isThisWeek,isSameYear, isSameMonth, subMonths, subYears } from 'date-fns';
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

  allHoursYear:number;

  public barChartDataMonth:Array<any>=[
    {data:[], label:'Horas este mes'},
    {data:[], label:'Horas mes anterior'}
  ];

  allHoursMonth:number;

  public barChartDataWeek:Array<any> = [
    {data:[], label:'Horas esta semana'},
    {data:[], label:'Horas semana anterior'}
  ];

  allHoursWeek:number;

  date:Date;
  
  horarios:CalendarEvent[]=[];
  
  firePromise:any;
  
  chartTypeSelected:ChartType;
  
  constructor(
    private firebaseService:FirebaseService,
    private route: ActivatedRoute,
    private changeRef:ChangeDetectorRef) { 

    this.chartTypes = [{id:'line',value:'Line'},{id:'bar',value:'Bar'},{id:'pie',value:'Pie'},{id:'radar',value:'Radar'},{id:'doughnut',value:'Doughnut'}]

    this.chartTypeSelected = this.chartTypes[1];

    this.chartType= this.chartTypeSelected.id;

    this.allHoursMonth=0;
    this.allHoursWeek=0;
    this.allHoursYear = 0;

    let paramdate = this.route.snapshot.paramMap.get('date');
    
    this.date = paramdate ? new Date(paramdate) : new Date(); 

    console.log('param',this.date);
       
    for(let i = 1;i <= 31;i++){
      this.barChartLabelsMonth.push( i )
    }
    
  }
  
  ngOnInit() {
    
    this.firePromise = this.firebaseService.getHorarios().snapshotChanges().subscribe(item =>{
      item.forEach((data)=> {
        this.horarios.push(data.payload.val() as CalendarEvent) 
      });

      this.updateChartMonthHours( this.barChartDataMonth, this.date );
      this.updateChartYearHours( this.barChartDataYear, this.date );
      this.updateChartWeekHours( this.barChartDataWeek, this.date );
      
      this.updateCharts();
    });
   
  }

  
  ngOnDestroy(): void {
    this.firePromise.unsubscribe();
  }

  updateCharts(){
    this.chartList.forEach((child)=> child.chart.update() );
    this.changeRef.detectChanges();
  }

  updateChartYearHours(dataChartYear:Array<any>,date:Date){
    
    for( let i = 0; i < 12; i++ ){ 
      dataChartYear[0].data.push(this.getMonthHours(this.horarios, i, date)); 
      dataChartYear[1].data.push(this.getMonthHours(this.horarios, i, subYears(date,1)));
    } 
    
    this.allHoursYear = this.countAllHours( dataChartYear[0].data );
    
    
  }

  updateChartMonthHours(dataChartMonth:Array<any>,date:Date){
   
    let datePreviousMonth = subMonths(date,1);
            
    for( let i = 1; i <= 31; i++){
        dataChartMonth[0].data.push(this.getDayHours(this.horarios, i ,date));
        dataChartMonth[1].data.push(this.getDayHours(this.horarios, i ,datePreviousMonth));
      }
      this.allHoursMonth = this.countAllHours( dataChartMonth[0].data );
  }

  updateChartWeekHours(dataChartWeek:Array<any>,date:Date){
   
    for( let i=0; i < 7; i++){ 
      dataChartWeek[0].data.push(this.getDayHoursofTheWeek(this.horarios, i, date, true)); 
      dataChartWeek[1].data.push(this.getDayHoursofTheWeek(this.horarios, i, date, false)); 
    }
    this.allHoursWeek = this.countAllHours( dataChartWeek[0].data );
  }

   // get hours worked with month
  getMonthHours(data:CalendarEvent[],month:number,date:Date):number{

    let minutes = 0;
    let thisMonth = data.filter(item => {
      const itemDate = new Date(item.start);
      return itemDate.getMonth() == month && isSameYear(itemDate,date);
    });
    
    if(thisMonth.length > 0){
      thisMonth.map(data=>{
        minutes = minutes + data.meta.minutes;

      })
    }
    return convertMinutesToHours(minutes);
  }

  // get hours worked with day
  getDayHours(data:CalendarEvent[],day:number,date:Date):number{

    let minutes = 0;
    let daysMonth = data.filter(item => {
      let itemDate = new Date(item.start);
      return (isSameMonth(itemDate,date) && isSameYear(itemDate,date) && itemDate.getDate() == day);
    });
    
    if(daysMonth.length > 0){
      daysMonth.map(data=>{
        minutes = minutes + data.meta.minutes;
      })
    }
    return convertMinutesToHours(minutes);

  }

  // get hours worked with week
  getDayHoursofTheWeek(data:CalendarEvent[],dayofWeek:number,date:Date,thisWeek?:boolean){

    let minutes = 0;
    let daysOfThisWeek = data.filter( item => {

      const itemDate = new Date( item.start );
      let range = this.getRangePreviousWeek( this.date );

      if(thisWeek){

        return itemDate.getDay() == dayofWeek && isThisWeek( itemDate  ) && isSameYear( itemDate, date );

      }else{
        
        return itemDate.getDay() == dayofWeek && isWithinRange( itemDate , range.first, range.last ) && isSameYear( itemDate, date );
      }
      
    });
    
    if(daysOfThisWeek.length > 0 ){
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
  
  countAllHours(dataChar:any[]):number{
    let numHours= 0;
    dataChar.forEach(data => {
      numHours = numHours + data
    });
        
    return numHours;
  }


  chartChange(event){
    if(event.target.value == 'Char type'){
      return;
    }
    this.chartType = event.target.value
    
  }
}

