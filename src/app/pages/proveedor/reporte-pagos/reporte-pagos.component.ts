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
  selector: 'app-reporte-pagos',
  templateUrl: './reporte-pagos.component.html',
  styleUrls: ['./reporte-pagos.component.css']
})
export class ReportePagosComponent {
  showContent = false;
  btnLoadingBusqueda = false;
  isLoading = true;
  validateForm!: UntypedFormGroup;
  busquedaForm!: UntypedFormGroup;
  data:any[]=[];
  filteredData: any[] = [];

  estatusPago:any[]=[];
  listOfColumn = [
    {
      title: 'Folio',
      key:'folio',
      compare: (a: any, b: any) => a.folio - b.folio
    },
    {
      title: 'Razón social',
      key:'razonSocial',
      compare: (a: any, b: any) => a.razonSocial.localeCompare(b.razonSocial)
    },
    {
      title: 'Concepto',
      key:'concepto',
      compare: (a: any, b: any) => a.concepto.localeCompare(b.concepto)
    },
    {
      title: 'Monto',
      key:'monto',
      compare: (a: any, b: any) => a.monto - b.monto
    },
    {
      title: 'Referencia',
      key:'referencia',
      compare: (a: any, b: any) => a.referencia.localeCompare(b.referencia)
    },
    {
      title: 'Fecha de pago',
      key:'fechaPago',
      compare: (a: any, b: any) => a.fechaPago.localeCompare(b.fechaPago)
    },
    {
      title: 'Fecha de registro',
      key:'fechaRegistro',
      compare: (a: any, b: any) => a.fechaRegistro.localeCompare(b.fechaRegistro)
    }
  ];

  constructor(
    private fb: FormBuilder,
    private catalogosService:CatalogosService,
    private msg: NzMessageService,
    private reportesService:ReportesService,
    private excelService:ExcelService
  ) {

    
  }

  ngOnInit() {

    this.busquedaForm = this.fb.group({
      estatusPago: [null, []],
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

    this.excelService.exportTableToExcel(formattedData,'Pagos');
  }

  loadData() {
    forkJoin([
      this.catalogosService.GetEstatusPago()
    ]).subscribe({
      next: ([estatusPagoResponse]) => {
        this.estatusPago = estatusPagoResponse;

        this.busquedaForm.patchValue({
          estatusPago: 0,
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

  buscar(){
    this.btnLoadingBusqueda = true;

    let proveedor = null;
    let tipoGrua = null;

    if(this.busquedaForm.value.proveedor != 0){
      proveedor = this.busquedaForm.value.proveedor;
    }
    
    if(this.busquedaForm.value.tipoGrua != 0){
      tipoGrua = this.busquedaForm.value.tipoGrua;
    }

    let request:any = {
      periodo:this.busquedaForm.value.periodo,
      estatusPago:this.busquedaForm.value.estatusPago
    }

    
    this.reportesService.GetPagosProveedor(request)
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
}
