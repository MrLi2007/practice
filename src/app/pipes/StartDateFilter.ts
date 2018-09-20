import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
@Pipe({
    name: 'startDatefilter'
})
export class StartDateFilter implements PipeTransform {

    private filterDate:string;
    constructor(private datePipe:DatePipe){

    }
    transform(items: any[], startDate: string): any[] {
        if (items==undefined|| items.length==0){
            return [];
        } 
        if (startDate==undefined || startDate=="" || startDate == 'All') {
            return items;
        }
        
        this.filterDate = this.datePipe.transform(new Date(startDate),'yyyy-MM-dd')
        
        return items.filter(it => {
            return it.startDate >= this.filterDate;
        });


    }
}