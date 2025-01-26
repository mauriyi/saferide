import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { CoreService } from 'src/app/services/core.service';
import { MatDialog } from '@angular/material/dialog';
import { navItems } from '../sidebar/sidebar-data';
import { TranslateService } from '@ngx-translate/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { BrandingComponent } from '../sidebar/branding.component';

interface profiledd {
  id: number;
  title: string;
  link: string;
  new?: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, NgScrollbarModule, TablerIconsModule, MaterialModule, BrandingComponent],
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  [x: string]: any;
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  showFiller = false;
  userEmail = '';

  constructor(
    private settings: CoreService,
    public dialog: MatDialog,
    private translate: TranslateService
  ) {
    translate.setDefaultLang('en');
    this.userEmail = this.getUserEmail() || '';
  }

  getUserEmail(): string | null {
    return localStorage.getItem('email');
  }

  options = this.settings.getOptions();

  setDark() {
    this.settings.toggleTheme();
  }

  changeLanguage(lang: any): void {
    this.translate.use(lang.code);
  }

   // Método para borrar todo el localStorage
   clearLocalStorage(): void {
    localStorage.clear();
  }

  profiledd: profiledd[] = [
    {
      id: 6,
      title: 'Cerrar Sesión',
      link: '/authentication/login',
    },
  ];
}

