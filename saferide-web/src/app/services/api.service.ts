import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://ec2-18-222-21-192.us-east-2.compute.amazonaws.com:8000/'; // URL de la API

  constructor(private http: HttpClient) {}

  getLastRecord(): Observable<any> {
    // Obtener el token de localStorage
    const token = localStorage.getItem('authToken');

    // Verificar si hay un token
    if (token) {
      // Configurar las cabeceras con el token JWT
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      // Hacer la solicitud GET con el token en las cabeceras
      return this.http.get(`${this.apiUrl}last-record`, { headers });
    } else {
      throw new Error('No token found');
    }
  }

  getLast24HoursRecords(): Observable<any> {
    // Obtener el token de localStorage
    const token = localStorage.getItem('authToken');

    // Verificar si hay un token
    if (token) {
      // Configurar las cabeceras con el token JWT
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      // Hacer la solicitud GET con el token en las cabeceras
      return this.http.get(`${this.apiUrl}last-24-hours`, { headers });
    } else {
      throw new Error('No token found');
    }
  }

  getAllRecords(): Observable<any> {
    // Obtener el token de localStorage
    const token = localStorage.getItem('authToken');

    // Verificar si hay un token
    if (token) {
      // Configurar las cabeceras con el token JWT
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      // Hacer la solicitud GET con el token en las cabeceras
      return this.http.get(`${this.apiUrl}all-records`, { headers });
    } else {
      throw new Error('No token found');
    }
  }
}
