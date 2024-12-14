import { Routes } from '@angular/router';

export const CommonLayout_ROUTES: Routes = [

   
    {
        path: 'proveedor',
        loadChildren: () => import('../../pages/proveedor/proveedor.module').then(m => m.ProveedorModule),
    },
    /*{
        path: 'responsable',
        loadChildren: () => import('../../pages/responsable/responsable.module').then(m => m.ResponsableModule),
    }
    {
        path: 'solicitante',
        loadChildren: () => import('../../pages/solicitante/solicitante.module').then(m => m.SolicitanteModule),
    },
    */
    //Component
   
    
];
