import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'resourceFilterSkillType'
})
export class ResourceFilterSkillType implements PipeTransform {
    transform(items: any[], searchText: any, hasSkills: any = 0): any[] {

        if (!items) return [];
        if (searchText == 'Any') {
            return items;
        }
        if (searchText != null) {
            for (let item of items) {
                if (!searchText) return items;
            }
        } else {
            return items;
        }
        if (searchText != null) {
            return items.filter(it => {
                hasSkills = 0;
                for(let i = 0; i<searchText.length; i++){
                   if(it.skills.includes(searchText[i].skillName)){
                       hasSkills++;
                   }
                }
                return (hasSkills >= searchText.length);
            });
        }
    }
}