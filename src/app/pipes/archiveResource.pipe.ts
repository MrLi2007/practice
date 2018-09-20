import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'archiveResourcePipe'
})

@Injectable()
export class ArchiveResourcePipe implements PipeTransform {
    transform(items: any[], showArchive: boolean): any[] {
        if(!items) return [];
        if(showArchive==true){
            return items;
        }else{
             items= items.filter(obj=>{
                 return obj.active;
             });
             if(items==undefined) return [];
             else return items;
        }
    }
       
}