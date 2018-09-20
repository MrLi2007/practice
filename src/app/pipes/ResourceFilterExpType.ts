import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'resourceFilterExpType'
})
export class ResourceFilterExpType implements PipeTransform {
    transform(items: any[], searchText: any): any[] {
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
                if (it.experience != null) {
                    switch (searchText) {
                        case "Less than 1 year":
                            return it.experience < 1;
                        case "1-2 years":
                            return (it.experience >= 1 && it.experience < 2);
                        case "2-5 years":
                            return (it.experience >= 2 && it.experience < 5);
                        case "5-10 years":
                            return (it.experience >= 5 && it.experience < 10);
                        case "Greater than 10 year":
                            return (it.experience >= 10);
                        default:
                            alert("Error: date range not found")
                    }
                }
            });
        }

    }
}