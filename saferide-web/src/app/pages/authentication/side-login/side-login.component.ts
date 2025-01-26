import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/material.module';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './side-login.component.html',
  providers: [LoginService],
})

export class AppSideLoginComponent {
  options = this.settings.getOptions();
  msg = '';
  constructor(private loginService: LoginService, private settings: CoreService, private routes: Router, private service: LoginService) {}

  login(uname: string, password: string): void {
    this.loginService.login(uname, password).subscribe({
      next: (response) => {
        this.showToastSucces('¡Bienvenido!', 'Inicio de sesión exitoso');
        // Redirigir a la página de inicio
        this.routes.navigate(['/starter']);
      },
      error: (error) => {
        this.showToastWarning('Alerta', 'Por favor verifique el usuario y la contraseña ingresados');
      },
    });
  }

  showToastSucces(title:string, text:string): void {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 2000, title: title, text: text, icon: `success` });
      }

  showToastWarning(title:string, text:string): void {
    Swal.fire({ toast: true, position: 'top-end', showConfirmButton: false, timer: 3000, title: title, text: text, icon: 'warning', });
      }
}
