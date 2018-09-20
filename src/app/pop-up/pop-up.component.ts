import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})
export class PopUpComponent implements OnInit {
  @ViewChild('modalContent') modalContent: TemplateRef<any>;
  public projectType: string[];
  public resourcePopupDAO: ResourcePopupDAO;

  constructor(private modal: NgbModal, private http: HttpClient) { }

  showPopup() {
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  ngOnInit() {
    this.projectType = ['All', 'Billable', 'Non-Billable'];
    this.resourcePopupDAO = new ResourcePopupDAO(new Date(), new Date(), '', 0, this.projectType[0]);
  }

  public update() {
    console.log('popup');

    const url = `scheduler/update`;
    this.http.post(url, {'resourcePopupDAO' : this.resourcePopupDAO

    })
      .toPromise()
      .then(
        res => console.log(JSON.stringify(res)),
        msg => console.error(`Error: ${msg.status} ${msg.statusText}`)
      );
  }
}

  export class ResourcePopupDAO {
    public startDate: Date;
    public endDate: Date;
    public name: String;
    public allocation: Number;
    public selectedProjectType: String;

    constructor(startDate: Date, endDate: Date, name: String, allocation: Number, selectedProjectType: String) {
      this.startDate = startDate;
      this.endDate = endDate;
      this.name = name;
      this.allocation = allocation;
      this.selectedProjectType = selectedProjectType;
    }


}
