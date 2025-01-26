import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import {
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexLegend,
  ApexTooltip,
  ApexPlotOptions,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexGrid,
  ApexFill,
  NgApexchartsModule,
} from 'ng-apexcharts';
import { MaterialModule } from 'src/app/material.module';
import { ApiRecord } from 'src/app/models/api.record.component';

export interface batterybrakesusagehistorychartOptions {
  series: ApexAxisChartSeries | any;
  chart: ApexChart | any;
  xaxis: ApexXAxis | any;
  yaxis: ApexYAxis | any;
  stroke: any | any;
  plotOptions: ApexPlotOptions | any;
  tooltip: ApexTooltip | any;
  dataLabels: ApexDataLabels | any;
  legend: ApexLegend | any;
  colors: string[] | any;
  markers: any;
  grid: ApexGrid | any;
  fill: ApexFill | any;
}

@Component({
  selector: 'app-battery-and-brakes-usage-history',
  standalone: true,
  imports: [NgApexchartsModule, MaterialModule, TablerIconsModule],
  templateUrl: './battery-and-brakes-usage-history.component.html',
  styleUrl: './battery-and-brakes-usage-history.component.scss'
})
export class BatteryAndBrakesUsageHistoryComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent = Object.create(null);
  @Input() allDataRecord: ApiRecord[];  // Aquí recibimos el array de registros

  batteryStatusText: string = '';
  batteryPercentageText: string = '';
  brakeStatusText: string = '';

  public batterybrakesusagehistorychartOptions!: Partial<batterybrakesusagehistorychartOptions> | any;

  constructor() {
    this.batterybrakesusagehistorychartOptions = {
      series: [
        {
          name: "",
          data: [],
        },
        {
          name: "",
          data: [],
        },
      ],
      chart: {
        height: 350,
        type: "area",
        stacked: false,
        fontFamily: "inherit",
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ["rgba(38, 198, 218, 0.5)", "rgba(38, 198, 218, 0.5)"], // colores con 50% de transparencia
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true, // Mostrar las líneas
        width: 2, // Ajusta el grosor de la línea
        colors: ["rgba(116, 96, 238, 0.5)", "rgba(67, 206, 215, 0.5)"], // Mismo color de las líneas
      },
      markers: {
        size: 2,
        strokeColors: "transparent",
        colors: "#26c6da",
      },
      fill: {
        type: "none",
        colors: [], // colores con 50% de transparencia
        opacity: 0,
      },
      grid: {
        strokeDashArray: 3,
        borderColor: "rgba(0,0,0,0.2)",
      },
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        categories: [],
        labels: {
          style: {
            colors: "#a1aab2",
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: "#a1aab2",
          },
        },
      },
      legend: {
        show: false,
      },
      tooltip: {
        theme: "dark",
        marker: {
          show: true,
        },
      },
    };

  }

  ngOnInit(): void {

    this.allDataRecord = this.allDataRecord.slice(-10);

    this.batterybrakesusagehistorychartOptions = {
      series: [
        {
          name: "Porcentaje de carga",
          // Convertimos cada dato de batería a porcentaje con 2 decimales
          data: this.allDataRecord.map(record => parseFloat(record.battery_percentage.toFixed(2))),
        },
        {
          name: "Desgaste frenos en Milímetros",
          // Datos del desgaste de los frenos (puedes usar la propiedad 'distance' o la que desees)
          data: this.allDataRecord.map(record => record.distance),
        },
      ],
      chart: {
        height: 350,
        type: "area",
        stacked: false,
        fontFamily: "inherit",
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ["rgba(38, 198, 218, 0.5)", "rgba(38, 198, 218, 0.5)"],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        show: true,
        width: 2,
        colors: [
          "rgba(116, 96, 238, 0.5)", // Color de la línea de batería
          "rgba(67, 206, 215, 0.5)", // Color de la línea de desgaste de frenos
        ],
      },
      markers: {
        size: 2,
        strokeColors: "transparent",
        colors: [
          "rgba(116, 96, 238, 1)", // Color de los puntos de la batería
          "rgba(67, 206, 215, 1)", // Color de los puntos del desgaste de frenos
        ],
      },
      fill: {
        type: "none",
        colors: [], // colores con 50% de transparencia
        opacity: 0,
      },
      grid: {
        strokeDashArray: 3,
        borderColor: "rgba(0,0,0,0.2)",
      },
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        categories: this.allDataRecord.map(record =>
          new Date(record.date).toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            month: "2-digit",
            day: "2-digit",
          })
        ),
        labels: {
          style: {
            colors: "#a1aab2",
          },
        },
      },
      yaxis: [
        {
          title: {
            text: "Porcentaje de Batería (%)",
          },
          min: 0,
          max: 100,
          labels: {
            style: {
              colors: "#a1aab2",
            },
          },
        },
        {
          opposite: true,
          title: {
            text: "Desgaste de Frenos (mm)",
          },
          min: 2,
          max: 7,
          labels: {
            style: {
              colors: "#a1aab2",
            },
          },
        },
      ],
      legend: {
        show: false,
      },
      tooltip: {
        theme: "dark",
        marker: {
          show: true,
          fillColors: [
            "rgba(116, 96, 238, 1)", // Color de los puntos de la batería
            "rgba(67, 206, 215, 1)", // Color de los puntos del desgaste de frenos
          ],
        },
        style: {
          fontSize: '14px',
          fontWeight: 'bold',
          colors: [
            "rgba(116, 96, 238, 1)", // Color de los puntos de la batería
            "rgba(67, 206, 215, 1)", // Color de los puntos del desgaste de frenos
          ]
        },
      },
    };

    this.getBatteryStatusText();
    this.getBrakeStatusText();
  }

  getBatteryStatusText() {
    if (this.allDataRecord && this.allDataRecord.length > 0) {
      this.batteryStatusText = this.allDataRecord[this.allDataRecord.length - 1].battery_status;
      this.batteryPercentageText = `${this.allDataRecord[this.allDataRecord.length - 1].battery_percentage.toFixed(2)} %`;
    }
    else {
      this.batteryStatusText = '';
      this.batteryPercentageText = '';
    }
  }

  getBrakeStatusText() {
    if (this.allDataRecord && this.allDataRecord.length > 0) {
      this.brakeStatusText = this.allDataRecord[this.allDataRecord.length - 1].brake_status;
    }
    else {
      this.brakeStatusText = '';
    }
  }
}
