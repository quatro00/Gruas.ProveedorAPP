import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { AppsService } from '../../../shared/services/apps.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ProjectList } from '../../../shared/interfaces/project-list.type';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-servicios-disponibles',
  templateUrl: './servicios-disponibles.component.html',
  styleUrls: ['./servicios-disponibles.component.css']
})
export class ServiciosDisponiblesComponent {

  loadingStates: boolean[] = []; 
  view: string = 'cardView';
  mdlTitulo:string = '';
  newProject: boolean = false;
  projectListRaw: ProjectList[];
  projectList: any[] = [];
  searchQuery: string = '';
  isLoading = true;
  showContent = false;
  showContentShorting = false;
  startValue: Date | null = null;
  endValue: Date | null = null;
  selectedSort: string = 'Todos';
  filteredProjects: any[] = [];
  isVisible = false;
  validateForm!: UntypedFormGroup;

  constructor(private projectListSvc: AppsService, private modalService: NzModalService,  private fb: FormBuilder,  ) {}

  ngOnInit(): void {

    this.validateForm = this.fb.group({
      tiempoCotizado: [null, [Validators.required]],
      costoCotizado: [null, [Validators.required]]
    });

    this.filteredProjects = [...this.projectList];
    //this.filterProjects(); // Filter projects initially

    this.projectListSvc.getProjectListJson().subscribe(data => {
      this.projectListRaw = data;
      this.projectList = data;

      this.sortProjects(this.selectedSort); // Sort projects based on the selected sort type

      this.loadingStates = this.projectList.map(() => false);

    });

  
    // Set default selection to "All"
    this.selectedSort = 'Todos';

    // Simulate loading time
    this.loadData();
  }

    // Simulate loading data
    loadData() {
      // Simulate an asynchronous data loading operation
      setTimeout(() => {
        this.isLoading = false;
        this.showContent = true;
      }, 500);
    }
  // Filter the projects based on the search query
  
  // Sort the projects based on the selected sort type
  sortProjects(sortType: string) {
    this.selectedSort = sortType;
    this.isLoading = true; // Enable loading effect
    this.showContentShorting = false;

    if (sortType === 'Todos') {
      // Show all projects
      this.filteredProjects = [...this.projectList];
      this.isLoading = false; // Disable loading effect
      this.showContentShorting = true;
    } else {
      // Filter projects based on sortType
      setTimeout(() => {
        this.filteredProjects = this.projectList.filter(item => item.estatus === sortType);
        this.isLoading = false; // Disable loading effect
        this.showContentShorting = true;
      }, 500); // Simulate a delay for sorting
    }
  }

  handleCancel(){
    this.isVisible = false;
  }

  muestraNuevaCotizacion(i){
    this.mdlTitulo = 'Cotización';
    //this.isVisible = true;
    this.loadingStates[i] = true;
    setTimeout(() => {
      this.loadingStates[i] = false; // Restablece el estado de carga
      console.log(`Proyecto ${this.projectList[i].name} procesado`);
    }, 2000);
  }

  muestraEditarCotizacion(i){
    this.mdlTitulo = 'Editar cotización';
    //this.isVisible = true;
    this.loadingStates[i] = true;
    setTimeout(() => {
      this.loadingStates[i] = false; // Restablece el estado de carga
      console.log(`Proyecto ${this.projectList[i].name} procesado`);
    }, 2000);
  }
  // Checkbox event handler
  log(value: string[]): void {
  }

  // Calendar
  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  disabledStartDate = (startValue: Date): boolean => {
    if (!startValue || !this.endValue) {
      return false;
    }
    return startValue.getTime() > this.endValue.getTime();
  };

  disabledEndDate = (endValue: Date): boolean => {
    if (!endValue || !this.startValue) {
      return false;
    }
    return endValue.getTime() <= this.startValue.getTime();
  };

  handleStartOpenChange(open: boolean): void {
    if (!open) {
      this.endDatePicker.open();
    }
  }

  handleEndOpenChange(open: boolean): void {
  }
}
