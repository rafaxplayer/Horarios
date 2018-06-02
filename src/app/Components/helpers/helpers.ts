export function addZeros(time:any):any{
    
        if (time < 10) {
            time = "0" + time;
        }
        return time;
    
}