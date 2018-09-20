import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'resourceFilterAccDesignation'
})
export class ResourceFilterAccDesignation implements PipeTransform {
    transform(items: any[], searchText: string): any[] {
        if (!items) return [];
        if (searchText == 'All') {
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
                return it.designation.toLowerCase() == searchText.toLowerCase();
            });
        }

    }
}