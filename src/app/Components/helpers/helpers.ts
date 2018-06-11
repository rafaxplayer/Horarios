export function addZeros(time:any):any{
    
        if (time < 10) {
            time = "0" + time;
        }
        return time;
    
}

export function formatMinutes(m:number):string{
    
        var minutes = m%60
        var hours = (m - minutes) / 60
        return addZeros(hours) + ":" + addZeros(minutes);
      

}

export function convertMinutesToHours(m:number):number{
    
        var minutes = m % 60
        var hours =  hours = (m - minutes) / 60
        return parseFloat(hours + '.'+ minutes);

}