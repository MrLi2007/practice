import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateSortFilter'
})

@Injectable()
export class DateSortFilter implements PipeTransform {
    transform(array: any, arg1: any, arg2: any): Array<any> {
        
        if (typeof arg1 === "undefined" || typeof arg2 === "undefined") {
            return array;
        }

        array.sort((a: any, b: any) => {
            let left = new Date(a[arg1]);
            let right = new Date(b[arg1]);
            if (arg2) {
                return left > right ? -1 : left < right ? 1 : 0;;
            } else {
                return right > left ? -1 : right < left ? 1 : 0;
            }

        });
        return array;
    }
}