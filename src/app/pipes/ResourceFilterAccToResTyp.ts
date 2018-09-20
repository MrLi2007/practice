import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'resourceFilterAccToResTyp'
})
export class ResourceFilterAccToResTyp implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if(!items) return [];
    if(searchText=='All'){
        return items;
    }
    if(searchText!=null){
        for(let item of items){
            if(!searchText) return items;
        }
    }else{
        return items;
    }
   
    if(searchText!=null){
        searchText = searchText.toLowerCase();
        return items.filter( it => {
            for(let i of it){
                console.log(i,it[i]);
            }
              return it.employeeType.toLowerCase()==(searchText);
            });
    }

   }
}