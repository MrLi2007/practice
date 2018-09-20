import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'endDatefilter'
})
export class EndDateFilter implements PipeTransform {
    private endDateFormat:string;
    constructor(private datePipe:DatePipe){

    }
    transform(items: any[], endDate: string): any[] {
        if (!items) return [];

        if (endDate == undefined || endDate=="" || endDate=="All") {
            return items;
        }
        this.endDateFormat=this.datePipe.transform(new Date(endDate),'yyyy-MM-dd');
        return items.filter(it => {
            return it.endDate<= this.endDateFormat;
        });
    }


}