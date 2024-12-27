import { Component,Input, OnInit,ElementRef } from '@angular/core';
import tableData  from '../../../../assets/data/pages/table-data.json';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ServicioService } from 'src/app/services/servicios.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  showContent = false;
  upcomingEvent: any;
  serviciosProximos:any[]=[];
  tabData: { key: string; label: string }[];
  sellingTab: string = 'today';

  constructor(private modalService: NzModalService, private elementRef: ElementRef, private serviciosService:ServicioService) {
    this.upcomingEvent = {
      "today": [
        {
          "id": 1,
          "type": "primary",
          "title": "Planning for new dashboard wireframe and prototype design",
          "date": "19",
          "month": "Mar",
          "time": "08:30 AM"
        },
        {
          "id": 2,
          "type": "secondary",
          "title": "International Web Conference 2021",
          "date": "19",
          "month": "Mar",
          "time": "09:30 AM"
        },
        {
          "id": 3,
          "type": "info",
          "title": "Dribble Designer Meetup",
          "date": "19",
          "month": "Mar",
          "time": "10:30 AM"
        },
        {
          "id": 4,
          "type": "warning",
          "title": "Dribble Designer Meetup",
          "date": "19",
          "month": "Mar",
          "time": "11:30 AM"
        }
      ],
      "week": [
        {
          "id": 1,
          "type": "primary",
          "title": "Planning for new dashboard wireframe and prototype design",
          "date": "12",
          "month": "Sep",
          "time": "08:30 AM"
        },
        {
          "id": 2,
          "type": "info",
          "title": "International Web Conference 2021",
          "date": "16",
          "month": "Sep",
          "time": "09:30 AM"
        },
        {
          "id": 3,
          "type": "secondary",
          "title": "Dribble Designer Meetup",
          "date": "15",
          "month": "Sep",
          "time": "10:30 AM"
        },
        {
          "id": 4,
          "type": "warning",
          "title": "Dribble Designer Meetup",
          "date": "13",
          "month": "Sep",
          "time": "11:30 AM"
        }
      ],
      "month": [
        {
          "id": 1,
          "type": "primary",
          "title": "Planning for new dashboard wireframe and prototype design",
          "date": "24",
          "month": "Apr",
          "time": "08:30 AM"
        },
        {
          "id": 2,
          "type": "secondary",
          "title": "International Web Conference 2021",
          "date": "24",
          "month": "Apr",
          "time": "09:30 AM"
        },
        {
          "id": 3,
          "type": "info",
          "title": "Dribble Designer Meetup",
          "date": "24",
          "month": "Apr",
          "time": "10:30 AM"
        },
        {
          "id": 4,
          "type": "warning",
          "title": "Dribble Designer Meetup",
          "date": "28",
          "month": "Apr",
          "time": "11:30 AM"
        }
      ]
    };
    this.tabData = [
      { key: 'today', label: 'Today' },
      { key: 'week', label: 'Week' },
      { key: 'month', label: 'Month' }
    ];
  }

 //Tabs
 @Input() componentId: string;
  //Tabs
  handleClick(tab: string): void {
    this.sellingTab = tab;
  }

  
  ngOnInit(): void {
    this.loadData();
    
  }

  makeCall(phoneNumber: string): void {
    const url = `tel:${phoneNumber}`;
    window.open(url, '_system'); // '_system' para garantizar que se abra la aplicación nativa
  }

  async navigateToDestination(origenLat: number, origenLon: number, destinoLat:number, destinoLon:number): Promise<void> {
    try {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${destinoLat},${destinoLon}&origin=${origenLat},${origenLon}&travelmode=driving`;
      window.open(url, '_system');
    } catch (error) {
      console.error('Error obtaining location:', error);
    }
  }

  async navigateToOrigin(lat: number, lon: number): Promise<void> {
    try {
      const currentLocation = await this.getCurrentLocation();
      const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.lat},${currentLocation.lon}&destination=${lat},${lon}&travelmode=driving`;
      window.open(url, '_system');
    } catch (error) {
      console.error('Error obtaining location:', error);
    }
  }

  getCurrentLocation(): Promise<{ lat: number; lon: number }> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          (error) => reject(error)
        );
      } else {
        reject('Geolocation not supported');
      }
    });
  }

  loadData() {
    
      forkJoin([
        this.serviciosService.GetServiciosProximos()
      ]).subscribe({
        next: ([serviciosProximosResponse]) => {
          this.serviciosProximos = serviciosProximosResponse;
          this.showContent = true;
        },
        complete: () => {
          
        },
        error: () => {
          
        }
      });
    }
    


  // Method to open the edit modal
  openEditModal(product: any): void {
    const modalRef = this.modalService.create({
      nzTitle: 'Update Product Title',
      //nzContent: EditModalComponent,
      nzFooter: [
        {
          label: 'Update Event',
          type: 'primary',
          onClick: () => {
            // Update the product title
            product.title = 'Titulo';
            modalRef.destroy();
          }
        }
      ]
    });
  }

  removeEvent(index: number): void {
    const selectedTab = this.tabData.find(tab => tab.key === this.sellingTab);
    if (selectedTab) {
      const tabKey = selectedTab.key;
      this.upcomingEvent[tabKey].splice(index, 1);

      // Remove the corresponding <tr> element from the DOM
      const trElements = this.elementRef.nativeElement.querySelectorAll('.group');
      if (trElements.length > index) {
        trElements[index].remove();
      }
    }
  }

}
