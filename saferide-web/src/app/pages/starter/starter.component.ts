import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TablerIconsModule } from 'angular-tabler-icons';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexYAxis,
  ApexLegend,
  ApexXAxis,
  ApexTooltip,
  ApexTheme,
  ApexGrid,
  ApexPlotOptions,
  ApexFill,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { BatteryAndBrakesUsageHistoryComponent } from "../battery-and-brakes-usage-history/battery-and-brakes-usage-history.component";
import { ApiService } from 'src/app/services/api.service';

import { ApiRecord } from '../../models/api.record.component';
import { CommonModule } from '@angular/common';
import { DataService } from 'src/app/services/data.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: any;
  theme: ApexTheme;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  colors: string[];
  markers: any;
  grid: ApexGrid;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  labels: string[];
};

@Component({
  selector: 'app-starter',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    NgApexchartsModule,
    TablerIconsModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    BatteryAndBrakesUsageHistoryComponent,
],
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss'],
})
export class StarterComponent implements OnInit {

@ViewChild('chart') chart: ChartComponent = Object.create(null);

  public brakelast24Chart: Partial<ChartOptions> | any;

  lastData: string = '';
  batteryStatusText: string = '';
  batteryPercentageText: string = '';
  brakeStatusText: string = '';

  showHystoryComponent = false;
  showLast24Component = false;

  lastRecord: ApiRecord;
  last24HoursRecord: ApiRecord[] = [];  // Datos ultimas 24 horas
  allDataRecord: ApiRecord[] = [];  // Todos los datos

  // Variables para los gráficos
  public baterylast24Chart: Partial<ChartOptions> | any;

  constructor(private apiService: ApiService, private dataService: DataService) {
     // baterylast24 chart
     this.baterylast24Chart = {
      series: [
        {
          name: 'Batería Usada',
          data: [],
        },
      ],
      chart: {
        type: 'area',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 90,
        sparkline: {
          enabled: true,
        },
      },
      colors: ['#6610f2'],
      stroke: {
        curve: 'straight',
        width: 2,
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      grid: {
        show: false,
      },
      xaxis: {
        categories: [],
        axisBorder: {
          show: true,
        },
        axisTicks: {
          show: false,
        },
      },
      tooltip: {
        theme: 'dark',
      },
    };

     // brakelast24 chart
     this.brakelast24Chart = {
      series: [
        {
          name: 'Desgaste Pastilla de Freno',
          data: [], // Los datos de la pastilla
        },
      ],
      chart: {
        type: 'area',
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        foreColor: '#adb0bb',
        toolbar: {
          show: false,
        },
        height: 90,
        sparkline: {
          enabled: true,
        },
      },
      colors: ['#43CED7'],
      stroke: {
        curve: 'straight',
        width: 2,
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      grid: {
        show: false,
      },
      xaxis: {
        categories: [],
        axisBorder: {
          show: true,
        },
        axisTicks: {
          show: false,
        },
      },
      tooltip: {
        theme: 'dark',
      },
    };

  }

  ngOnInit(): void {
    this.setLastRecordData();
    this.setLast24HoursRecordsData();
    this.setAllDataRecordsData();
  }

  getLastRecord(): Promise<ApiRecord> {
    return new Promise((resolve, reject) => {
      this.apiService.getLastRecord().subscribe(
        (data) => {
          // Resolvemos la promesa con los datos obtenidos
          resolve(data as ApiRecord);
        },
        (error) => {
          // En caso de error, rechazamos la promesa
          console.error('Error al obtener el registro:', error);
          reject(error);
        }
      );
    });
  }

  getLast24HoursRecords(): Promise<ApiRecord[]> {
    return new Promise((resolve, reject) => {
      this.apiService.getLast24HoursRecords().subscribe(
        (data) => {
          // Resolvemos la promesa con los datos obtenidos
          resolve(data as ApiRecord[]);
        },
        (error) => {
          // En caso de error, rechazamos la promesa
          console.error('Error al obtener el registro:', error);
          reject(error);
        }
      );
    });
  }

  getAllRecords(): Promise<ApiRecord[]> {
    return new Promise((resolve, reject) => {
      this.apiService.getAllRecords().subscribe(
        (data) => {
          // Resolvemos la promesa con los datos obtenidos
          resolve(data as ApiRecord[]);
        },
        (error) => {
          // En caso de error, rechazamos la promesa
          console.error('Error al obtener el registro:', error);
          reject(error);
        }
      );
    });
  }

  setLastRecordData(): void {
    this.getLastRecord()
      .then((data) => {
        // Configurar la variable `lastRecord`
        this.lastRecord = data;

        // Convertir la fecha a la zona horaria local
        const localDate = new Date(this.lastRecord.date);

        // Formatear la fecha al formato deseado: 21 enero 2025 12:50 pm
        const formattedDate = localDate.toLocaleString('es-ES', {
          weekday: 'long', // Día de la semana
          year: 'numeric', // Año
          month: 'long', // Mes completo
          day: 'numeric', // Día del mes
          hour: '2-digit', // Hora
          minute: '2-digit', // Minutos
          hour12: true // Usar formato 12 horas
        });

        // Actualizas el valor a través del servicio
        this.dataService.updateLastData(formattedDate);
      })
      .catch((error) => {
        console.error('Hubo un error al procesar el registro setLastRecordData:', error);
      });
  }

  setLast24HoursRecordsData(): void {
    this.getLast24HoursRecords()
      .then((data) => {
        // Ordenar los datos por la fecha (de más antigua a más reciente)
        this.last24HoursRecord = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Prepara los datos para el gráfico
        const batteryPercentages = this.last24HoursRecord.map((record) => record.battery_percentage);
        const datesBatery = this.last24HoursRecord.map((record) => new Date(record.date).toLocaleString());

         // Configura el gráfico batery
        this.baterylast24Chart = {
          series: [
            {
              name: 'Batería Usada',
              data: batteryPercentages, // Los datos de la batería mostrar con %
            },
          ],
          chart: {
            type: 'area',
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            toolbar: {
              show: false,
            },
            height: 90,
            sparkline: {
              enabled: true,
            },
          },
          colors: ['#6610f2'],
          stroke: {
            curve: 'smooth',
            width: 2,
          },
          dataLabels: {
            enabled: false,
          },
          legend: {
            show: false,
          },
          grid: {
            show: false,
          },
          xaxis: {
            categories: datesBatery, // Formato de fecha y hora
            axisBorder: {
              show: true,
            },
            axisTicks: {
              show: false,
            },
          },
          tooltip: {
            theme: 'dark',
            x: {
              format: 'dd MMM yyyy HH:mm:ss', // Formato de fechas
            },
          },
        };

        // Prepara los datos para el gráfico
        const brakePercentages = this.last24HoursRecord.map((record) => record.brake_status === "En Buen Estado" ? 5 : 4.5); // Asumiendo que "En Buen Estado" es el máximo valor de 5
        const datesBrake = this.last24HoursRecord.map((record) => new Date(record.date).toLocaleString());

        // Configura el gráfico de los frenos
        this.brakelast24Chart = {
          series: [
            {
              name: 'Desgaste Pastilla de Freno',
              data: brakePercentages, // Los datos de la pastilla
            },
          ],
          chart: {
            type: 'area',
            fontFamily: "'Plus Jakarta Sans', sans-serif;",
            foreColor: '#adb0bb',
            toolbar: {
              show: false,
            },
            height: 90,
            sparkline: {
              enabled: true,
            },
          },
          colors: ['#43CED7'],
          stroke: {
            curve: 'straight',
            width: 2,
          },
          dataLabels: {
            enabled: false,
          },
          legend: {
            show: false,
          },
          grid: {
            show: false,
          },
          xaxis: {
            categories: datesBrake, // Fechas de los registros
            axisBorder: {
              show: true,
            },
            axisTicks: {
              show: false,
            },
          },
          tooltip: {
            theme: 'dark',
          },
        };

        this.getBatteryStatusText();
        this.getBrakeStatusText();

        this.showLast24Component = true;
      })
      .catch((error) => {
        console.error('Hubo un error al procesar los registros setLast24HoursRecordsData:', error);
      });
  }

  setAllDataRecordsData(): void {
    this.getLast24HoursRecords()
      .then((data) => {
         // Ordenar los datos por la fecha (de más antigua a más reciente)
         this.allDataRecord = data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
         this.showHystoryComponent = true;
      })
      .catch((error) => {
        console.error('Hubo un error al procesar los registros setAllDataRecordsData:', error);
      });
  }

  getBatteryStatusText() {
    if (this.last24HoursRecord && this.last24HoursRecord.length > 0) {
      this.batteryStatusText = this.last24HoursRecord[this.last24HoursRecord.length - 1].battery_status;
      this.batteryPercentageText = `Estado de carga ${this.last24HoursRecord[this.last24HoursRecord.length - 1].battery_percentage.toFixed(2)} %`;
    }
    else {
      this.batteryStatusText = '';
      this.batteryPercentageText = '';
    }
  }

  getBrakeStatusText() {
    if (this.last24HoursRecord && this.last24HoursRecord.length > 0) {
      this.brakeStatusText = this.last24HoursRecord[this.last24HoursRecord.length - 1].brake_status;
    }
    else {
      this.brakeStatusText = '';
    }
  }

}



