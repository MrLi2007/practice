import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'archiveProjectPipe'
})

@Injectable()
export class ArchiveProjectPipe implements PipeTransform {
    transform(items: any[], showArchive: boolean): any[] {
        if(!items) return [];
        if(showArchive==true){
            return items;
        }else{
            return items.filter(obj=>{
                return obj.status;
            })
        }
    }
       
}