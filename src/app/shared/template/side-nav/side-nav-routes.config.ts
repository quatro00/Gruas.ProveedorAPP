import {
  SideNavInterface
} from '../../interfaces/side-nav.type';

export const AdminRoutes: SideNavInterface[] = [
  
  {
    path: 'proveedor/dashboard',
    title: 'Dashboard',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: '',
    submenu:[]
  },
  {
    path: 'proveedor/servicios-disponibles',
    title: 'Servicios disponibles',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: '',
    submenu:[]
  },
  {
    path: 'proveedor/perfil',
    title: 'Perfil',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: '',
    submenu:[]
  },
  {
    path: 'proveedor/reporte-pagos',
    title: 'Reporte de pagos',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: '',
    submenu:[]
  },
  {
    path: 'proveedor/reporte-servicios',
    title: 'Reporte de servicios',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: '',
    submenu:[]
  }
]

export const MercaderiaRoutes: SideNavInterface[] = [
  
  {
    path: 'mercaderia/dashboard',
    title: 'Dashboard',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: '',
    submenu:[]
},
{
  path: 'mercaderia/ordenes-compra',
  title: 'Ordenes de compra',
  iconType: 'nzIcon',
  iconTheme: 'outline',
  icon: '',
  submenu:[]
},
{
  path: 'mercaderia/citas',
  title: 'Citas',
  iconType: 'nzIcon',
  iconTheme: 'outline',
  icon: '',
  submenu:[
    {
      path: 'mercaderia/citas',
      title: 'Agenda',
      iconType: 'nzIcon',
      iconTheme: 'outline',
      icon: '',
      submenu:[]
    },
    {
    path: 'mercaderia/citas/nueva-cita',
    title: 'Registrar cita',
    iconType: 'nzIcon',
    iconTheme: 'outline',
    icon: '',
    submenu:[]
  },]
}
]

  export const ClienteRoutes: SideNavInterface[] = [
  
    {
      path: 'cliente/dashboard',
      title: 'Dashboard',
      iconType: 'nzIcon',
      iconTheme: 'outline',
      icon: 'home',
      submenu:[]
    },
   
]

  export const SupervisorRoutes: SideNavInterface[] = [

    {
      path: 'supervisor/dashboard',
      title: 'Dashboard',
      iconType: 'nzIcon',
      iconTheme: 'outline',
      icon: 'appstore-add',
      submenu:[]
    },
]
