import { Routes } from '@angular/router';
import { StarterComponent } from './starter/starter.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: StarterComponent,
    data: {
      title: 'Página de Inicio',
      urls: [
        { title: 'Home', url: '/starter' },
        { title: 'Starter' },
      ],
    },
  },
];
