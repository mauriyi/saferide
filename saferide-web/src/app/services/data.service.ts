import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private lastDataSubject = new BehaviorSubject<string>(''); // Valor inicial vacío
  lastData$ = this.lastDataSubject.asObservable(); // Observable para suscribirse a los cambios

  constructor() {}

  // Método para actualizar el valor
  updateLastData(newData: string): void {
    this.lastDataSubject.next(newData); // Actualiza el valor
  }
}
