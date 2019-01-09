import { Component } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Line Chart';

  public fileData: any = [];
  x_coordinates = [];
  rowData = [];
  showChart: boolean = false;
 
  processDataForLineChart:Array<any> = [];
  public lineChartData:Array<any> = [];
  public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  public lineChartOptions:any = {
    responsive: true
  };
  public lineChartColors:Array<any> = [];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }

  resetChartValues() {
    this.fileData = [];
    this.x_coordinates = [];
    this.rowData = [];
    this.showChart = false;
    this.processDataForLineChart = [];
    this.lineChartColors = [];
  }

  onChange(event) {
    this.resetChartValues();
    let eventData = event.target.files || event.srcElement.files;
    if (eventData.length === 0) {
      console.log(event);
    } else if (eventData.length === 1) {
      let file = eventData[0];
      if (file) {
        this.fileData = [];
        let fileExtension = file.name.substr(file.name.lastIndexOf('.') + 1).toLowerCase();
        if (fileExtension === 'csv') {
          if (file.size < 4145728) {
            const reader: FileReader = new FileReader();
            reader.onload = (e: any) => {
              const bstr: string = e.target.result;
              const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
              wb.SheetNames.forEach(obj => {
                const ws: XLSX.WorkSheet = wb.Sheets[obj];
                this.fileData.push(XLSX.utils.sheet_to_json(ws, { header: 1 }));
              });
            };
            reader.readAsText(file, "UTF-8");
          }
        }
      }
    } 
    setTimeout(()=> {
      this.processData(this.fileData);
    }, 500)
    
  }

  processData(fileData) {
    fileData[0].forEach(row => {
      this.processDataForLineChart.push({data:[], label : row[0]})
      let rowData = row.slice(1,row.length);
      let processRow = [];
      rowData.forEach(data => {
        
        let value = data.split('|');
        processRow.push({x:value[0], y: value[1]});
        if(!this.x_coordinates.includes(value[0])){
          this.x_coordinates.push(value[0]);
        }
      });
      this.rowData.push(processRow);
    });

    let rowIndex = 0;
    this.processDataForLineChart.forEach(row => {
      for(let i=0; i< this.x_coordinates.length; i++){
        let index = this.rowData[rowIndex].findIndex(data => data.x == this.x_coordinates[i]);
        if(index != -1){
          row.data.push(this.rowData[rowIndex][index].y);
        } else {
          row.data.push(0);
        }
      }
      rowIndex++;
    })
    this.lineChartLabels = this.x_coordinates;
    this.lineChartData = this.processDataForLineChart;
    this.showChart = true;
  }

}
