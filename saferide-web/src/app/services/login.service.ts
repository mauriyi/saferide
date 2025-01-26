import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { firebaseConfig } from '../firebase-config'; // Asegúrate de tener tu configuración

@Injectable({
  providedIn: 'root',
})
export class LoginService {

  constructor(private http: HttpClient) {
    // Inicializar Firebase
    initializeApp(firebaseConfig);
  }

  // Método para iniciar sesión
  login(email: string, password: string): Observable<void> {
    const auth = getAuth(); // Obtener la instancia de autenticación de Firebase
    return from(signInWithEmailAndPassword(auth, email, password)).pipe(
      switchMap((userCredential) => {
        // Obtener el ID token del usuario autenticado
        return from(userCredential.user.getIdToken()).pipe(
          switchMap((token) => {
            if (token) {
              // Guardar el token en localStorage
              this.saveToken(token, email);
              // Emitir éxito (login completado)
              return new Observable<void>((observer) => {
                observer.next();
                observer.complete();
              });
            } else {
              // Emitir error si no se obtuvo el token
              return throwError(() => new Error('No se pudo obtener el token de Firebase'));
            }
          })
        );
      }),
      catchError(this.handleError)
    );
  }

  // Método para guardar el token en localStorage
  private saveToken(token: string, email: string): void {
    localStorage.setItem('authToken', token);
    localStorage.setItem('email', email);
  }

  // Método para obtener el token desde localStorage
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Ocurrió un error desconocido.';
    if (error.status === 401) {
      errorMessage = 'Usuario o contraseña incorrectos.';
    } else if (error.status === 500) {
      errorMessage = 'Error en el servidor. Intente nuevamente más tarde.';
    }
    // Emitir error
    return throwError(() => new Error(errorMessage));
  }
}
