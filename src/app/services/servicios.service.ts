import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  service:string = 'Servicio';


  constructor(private http:HttpClient, private cookieService: CookieService) { }

  Get(request:any):Observable<any>{
    return this.http.post<any>(`${environment.apiBaseUrl}/api/${this.service}/RegistraServicio`,request);
  }

  GetServiciosDisponibles():Observable<any>{
    return this.http.get<any>(`${environment.apiBaseUrl}/api/${this.service}/GetServiciosDisponibles`);
  }

  GetServiciosProximos():Observable<any>{
    return this.http.get<any>(`${environment.apiBaseUrl}/api/${this.service}/GetServiciosProximos`);
  }

  EnviarCotizacionProveedor(request:any):Observable<any>{
    return this.http.post<any>(`${environment.apiBaseUrl}/api/${this.service}/EnviarCotizacionProveedor`,request);
  }

  ModificarCotizacionProveedor(request:any):Observable<any>{
    return this.http.post<any>(`${environment.apiBaseUrl}/api/${this.service}/ModificarCotizacionProveedor`,request);
  }
}