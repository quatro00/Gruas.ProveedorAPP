import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';
import { AppsService } from '../../../shared/services/apps.service';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ProjectList } from '../../../shared/interfaces/project-list.type';
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { ServicioService } from 'src/app/services/servicios.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { GruasService } from 'src/app/services/gruas.service';

@Component({
  styles: [`
    :host ::ng-deep .basic-select .ant-select-selector{
      @apply h-[50px] rounded-4 border-normal px-[20px] flex items-center dark:bg-white/10 dark:border-white/10 dark:text-white/60 dark:hover:text-white/100;
    }
    :host ::ng-deep .basic-select.ant-select-multiple .ant-select-selection-item{
        @apply bg-white dark:bg-white/10 border-normal dark:border-white/10;
      }
      ::ng-deep .ant-upload {
        @apply w-full;
      }
      :host ::ng-deep .basic-select .ant-select-multiple.ant-select-disabled.ant-select:not(.ant-select-customize-input) .ant-select-selector{
        @apply dark:bg-white/10 dark:border-white/10 dark:text-white/60 dark:hover:text-white/100;
      }
    `],
  selector: 'app-servicios-disponibles',
  templateUrl: './servicios-disponibles.component.html',
  styleUrls: ['./servicios-disponibles.component.css']
})
export class ServiciosDisponiblesComponent {

  forms: FormGroup[] = [];
  loadingStates: boolean[] = [];
  view: string = 'cardView';
  mdlTitulo: string = '';
  newProject: boolean = false;
  projectListRaw: ProjectList[];
  projectList: any[] = [];
  gruas: any[] = [];
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

  constructor(
    private projectListSvc: AppsService,
    private modalService: NzModalService,
    private fb: FormBuilder,
    private msg: NzMessageService,
    private serviciosService: ServicioService,
    private GruasService: GruasService) { }

  ngOnInit(): void {

    this.validateForm = this.fb.group({
      tiempoCotizado: [null, [Validators.required]],
      costoCotizado: [null, [Validators.required]],
      grua: [null, [Validators.required]],
    });



    this.GruasService.GetGruasProveedor()
      .subscribe({
        next: (response) => {
          this.gruas = response;

        },
        complete: () => {
          //this.btnLoadingBusqueda = false;


        },
        error: () => {
          //this.btnLoadingBusqueda = false;
          this.msg.error('Ocurrio un error inesperado.');
        }
      })

    //this.filterProjects(); // Filter projects initially

    /*
    this.projectListSvc.getProjectListJson().subscribe(data => {
      this.projectListRaw = data;
      this.projectList = data;

      this.sortProjects(this.selectedSort); // Sort projects based on the selected sort type

      this.loadingStates = this.projectList.map(() => false);

    });
    */


    // Set default selection to "All"
    this.selectedSort = 'Todos';

    // Simulate loading time
    this.loadData();
  }

  // Simulate loading data
  loadData() {
    // Simulate an asynchronous data loading operation
    
    this.serviciosService.GetServiciosDisponibles()
      .subscribe({
        next: (response) => {
          this.isLoading = false;
      this.showContent = true;
          this.projectListRaw = response;
          this.projectList = response;

          this.sortProjects(this.selectedSort); // Sort projects based on the selected sort type

          this.loadingStates = this.projectList.map(() => false);

          this.filteredProjects.forEach(() => {
            this.forms.push(
              this.fb.group({
                costoCotizado: [null, [Validators.required]],
                tiempoCotizado: [null, [Validators.required]],
                grua: [null, [Validators.required]],
              })
            );
          });

        },
        complete: () => {
          //this.btnLoadingBusqueda = false;


        },
        error: () => {
          //this.btnLoadingBusqueda = false;
          this.msg.error('Ocurrio un error inesperado.');
        }
      })

    this.filteredProjects = [...this.projectList];

   
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
      this.filteredProjects = this.projectList.filter(item => item.estatus === sortType);
        this.isLoading = false; // Disable loading effect
        this.showContentShorting = true;
    }
  }

  handleCancel() {
    this.isVisible = false;
  }

  muestraNuevaCotizacion(i, id) {

    const form = this.forms[i];

    if (form.valid) {
      this.loadingStates[i] = true;
      
      let request:any = 
      {
        gruaId: form.value.grua,
        servicioId: id,
        costo: form.value.costoCotizado,
        tiempo: form.value.tiempoCotizado
      }
     
      this.serviciosService.EnviarCotizacionProveedor(request)
      .subscribe({
        next:(response)=>{
          this.msg.success("Cotización enviada con éxito.");
          form.reset();
          this.loadData();
        },
        complete:()=>{
          this.loadingStates[i]= false;
        },
        error:()=>{
          this.loadingStates[i] = false;
        }
      })
      
      
    } else {
      Object.values(form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({
            onlySelf: true
          });
        }
      });
    }
  }

  muestraEditarCotizacion(i, id) {
    const form = this.forms[i];

    if (form.valid) {
      this.loadingStates[i] = true;
      
      let request:any = 
      {
        gruaId: form.value.grua,
        cotizacionId: id,
        costo: form.value.costoCotizado,
        tiempo: form.value.tiempoCotizado
      }
     
      this.serviciosService.ModificarCotizacionProveedor(request)
      .subscribe({
        next:(response)=>{
          this.msg.success("Cotización modificada con éxito.");
          form.reset();
          this.loadData();
        },
        complete:()=>{
          this.loadingStates[i]= false;
        },
        error:()=>{
          this.loadingStates[i] = false;
        }
      })
      
      
    } else {
      Object.values(form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({
            onlySelf: true
          });
        }
      });
    }
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
