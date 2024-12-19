import { Component } from '@angular/core';
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { forkJoin } from 'rxjs';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { ExcelService } from 'src/app/services/excel.service';
import { ReportesService } from 'src/app/services/reportes.service';

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
  selector: 'app-reporte-servicios',
  templateUrl: './reporte-servicios.component.html',
  styleUrls: ['./reporte-servicios.component.css']
})
export class ReporteServiciosComponent {
  showContent = false;

  validateForm!: UntypedFormGroup;
  busquedaForm!: UntypedFormGroup;

  estatusServicio: any[] = [];
  tipoServicio: any[] = [];
  isLoading = true;
  data:any[]=[];
  filteredData: any[] = [];
  btnLoadingBusqueda = false;
  listOfColumn = [
    {
      title: 'Folio',
      key: 'folio',
      compare: (a: any, b: any) => a.folio - b.folio
    },
    {
      title: 'Fecha',
      key: 'fecha',
      compare: (a: any, b: any) => a.fecha.localeCompare(b.fecha)
    },
    {
      title: 'Origen',
      key: 'origen',
      compare: (a: any, b: any) => a.origen.localeCompare(b.origen)
    },
    {
      title: 'Destino',
      key: 'destino',
      compare: (a: any, b: any) => a.destino.localeCompare(b.destino)
    },
    {
      title: 'Distancia (Kms)',
      key: 'distancia',
      compare: (a: any, b: any) => a.distancia - b.distancia
    },
    {
      title: 'Cuota km',
      key: 'cuotaKm',
      compare: (a: any, b: any) => a.cuotaKm - b.cuotaKm
    },
    {
      title: 'Banderazo',
      key: 'banderazo',
      compare: (a: any, b: any) => a.banderazo - b.banderazo
    },
    {
      title: 'Total',
      key: 'total',
      compare: (a: any, b: any) => a.total - b.total
    },
    {
      title: 'Comisión',
      key: 'comision',
      compare: (a: any, b: any) => a.comision - b.comision
    },
    {
      title: 'Grua',
      key: 'placas',
      compare: (a: any, b: any) => a.grua.localeCompare(b.grua)
    },
    {
      title: 'Estatus',
      key: 'estatus',
      compare: (a: any, b: any) => a.estatus.localeCompare(b.estatus)
    }
  ];
  constructor(
    private fb: FormBuilder,
    private catalogosService: CatalogosService,
    private msg: NzMessageService,
    private reportesService: ReportesService,
    private excelService: ExcelService
  ) {


  }

  ngOnInit() {

    this.busquedaForm = this.fb.group({
      estatusServicio: [null, []],
      tipoServicio: [null, []],
      periodo: [null, []]
    });


    this.validateForm = this.fb.group({
      proveedor: [null, [Validators.required]],
      placas: [null, [Validators.required]],
      marca: [null, [Validators.required]],
      modelo: [null, [Validators.required]],
      anio: [null, [Validators.required]],
      tipoGrua: [null, [Validators.required]],
      activo: [null, [Validators.required]],
    });
    this.loadData();
  }

  exportToExcel(){
    const formattedData = this.filteredData.map(item => {
      const formattedItem = {};
      this.listOfColumn.forEach(column => {
        // Usa la propiedad `key` para acceder al valor en `item`
        formattedItem[column.title] = item[column.key];
      });
      return formattedItem;
    });

    this.excelService.exportTableToExcel(formattedData,'Servicios');
  }

  buscar(){
    this.btnLoadingBusqueda = true;

    let tipo = 0;
    let estatus = 0;

    if(this.busquedaForm.value.tipoServicio != 0){
      tipo = this.busquedaForm.value.tipoServicio;
    }
    
    if(this.busquedaForm.value.estatusServicio != 0){
      estatus = this.busquedaForm.value.estatusServicio;
    }

    console.log(this.busquedaForm.value.tipoServicio);
    console.log(this.busquedaForm.value.estatusServicio);

    let request:any = {
      estatusServicioId:estatus,
      tipoServicioId:tipo,
      periodo:this.busquedaForm.value.periodo
    }

    
    this.reportesService.GetServiciosProveedor(request)
    .subscribe({
      next: (response) => {
        this.data = response;
        this.filteredData = response;
        this.btnLoadingBusqueda = false;
      },
      complete:()=>{
        this.btnLoadingBusqueda = false;
      },
      error:()=>{
        this.btnLoadingBusqueda = false;
        this.msg.error('Ocurrio un error inesperado.');
      }
    })
    
  }

  loadData() {
    forkJoin([
      this.catalogosService.GetEstatusServicio(),
      this.catalogosService.GetTipoServicio()
    ]).subscribe({
      next: ([estatusServicioResponse, tipoServicioResponse]) => {
        this.estatusServicio = estatusServicioResponse;
        this.tipoServicio = tipoServicioResponse;

        this.busquedaForm.patchValue({
          estatusServicio: 0,
          tipoServicio: 0,
          periodo: this.getCurrentMonth()
        });
      },
      complete: () => {
        this.isLoading = false;
        this.showContent = true;
      },
      error: () => {
        this.isLoading = false;
        // Maneja el error si es necesario
        this.msg.error("Ocurrio un error inesperado.");
      }
    });
  }

  getCurrentMonth(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    //const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Asegura dos dígitos para el mes
    const month = (currentDate.getMonth()).toString().padStart(2, '0'); // Asegura dos dígitos para el mes
    return `${year}-${month}`;
  }
}
