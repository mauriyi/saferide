import { Component, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute, Data, RouterModule } from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { CoreService } from 'src/app/services/core.service';

import {
  ChartComponent,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [NgApexchartsModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrls: [],
})
export class AppBreadcrumbComponent {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);

  // @Input() layout;
  pageInfo: Data | any = Object.create(null);

  options = this.settings.getOptions();

  lastData : string = '';

  constructor(
    private settings: CoreService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private dataService: DataService
  ) {

    // for breadcrumb
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .pipe(map(() => this.activatedRoute))
      .pipe(
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        })
      )
      .pipe(filter((route) => route.outlet === 'primary'))
      .pipe(mergeMap((route) => route.data))
      .subscribe((event) => {
        this.titleService.setTitle(event['title']);
        this.pageInfo = event;
      });
  }

  ngOnInit(): void {
    // Suscribirse al observable para obtener los cambios en tiempo real
    this.dataService.lastData$.subscribe((data) => {
      this.lastData = data; // Actualiza el valor cada vez que cambie
    });
  }
}
