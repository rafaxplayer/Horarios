import { Component, OnInit, ChangeDetectionStrategy, ViewChildren, QueryList, OnDestroy} from '@angular/core';
import { isWithinRange, isThisWeek } from 'date-fns';
import { FirebaseService } from '../../Services/firebase.service';
import { CalendarEvent } from 'calendar-utils';
import { convertMinutesToHours } from '../helpers/helpers';
import { BaseChartDirective }  from 'ng2-charts/ng2-charts';

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
  
  public chartTypes:ChartType[];

  public barChartDataYear:Array<any> = [
    {data:[], label:'Horas este año'},
    {data:[], label:'Horas año anterior'}
  ];

  public barChartDataWeek:Array<any> = [
    {data:[], label:'Horas esta semana'},
    {data:[], label:'Horas semana anterior'}
  ];

  date:Date = new Date();
  
  horarios:CalendarEvent[]=[];
  
  firePromise:any;

  chartTypeSelected:ChartType;
  
  constructor(private firebaseService:FirebaseService) { 

    this.chartTypes = [{id:'line',value:'Line'},{id:'pie',value:'Pie'},{id:'radar',value:'Radar'},{id:'doughnut',value:'Doughnut'}]

    this.chartTypeSelected = this.chartTypes[0];

    this.chartType= this.chartTypeSelected.id;
  }
  
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
    for( let i = 0; i < 12; i++ ){ 
      dataChartYear[0].data.push(this.getMonthHours(this.horarios, i, this.date.getFullYear())); 
      dataChartYear[1].data.push(this.getMonthHours(this.horarios, i, this.date.getFullYear()-1));
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
    //console.log(date);
    dummy = dummy + 6;
    prevDatesWeek.first=date.setDate(date.getDate() - dummy );
    //console.log("previous week first day : "+ date);
     prevDatesWeek.last=date.setDate(date.getDate() + 6);
    //console.log("previous week lastday : "+ date);
    return prevDatesWeek;

  }

  chartChange(event){
    if(event.target.value == 'Char type'){
      return;
    }
    this.chartType= event.target.value
    
  }
}

