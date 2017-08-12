import { DataTable } from 'primeng/primeng';
import { environment } from '../environments/environment';
import { Http } from '@angular/http';
import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { GitService } from "./git.service";
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'app works!';
  logData = [];
  cloneDialog = false;
  untrackedList = [];
  existingFolder: string;
  dataTableHeight: string;
  @ViewChild(DataTable) dt: DataTable;
  constructor(private http: Http, private gitServ: GitService, private cdr: ChangeDetectorRef) {

  }
  currentWorkingDir = "D:/gitter";
  ngAfterViewInit() {
    this.resizeWindow();
    window.addEventListener('resize', this.resizeWindow.bind(this))
    this.refresh();

  }
  resizeWindow() {
    const ele: any = document.getElementsByClassName('contentArea')[0];
    ele.style.height = window.innerHeight - 65 + "px";
    ele.style.width = window.innerWidth + "px";

    this.cdr.detectChanges();
  }
  cloneClick() {
    this.cloneDialog = true;
  }
  refresh() {
    this.logs();
    this.untrackedfiles();
    this.trackedFiles();
  }
  clone() {
    this.gitServ.clone("https://brpradeepprabhu@bitbucket.org/brpradeepprabhu/gitter.git", "D:/bitbucket").then((data: any) => {
      const response = data;
      console.log('clone', response)
      if (response !== "error") {
        this.logs();
        this.cloneDialog = false;
      }
      else {
        this.displayAlert();
      }
    })
  }
  displayAlert(msg?: any) {
    const message = (msg !== undefined) ? msg : "error";   
    alert(message)
  }
  logs() {
    let logFullArray = []
    this.logData = [];
    this.gitServ.logs(this.currentWorkingDir).then((data: any) => {
      const response = data._body;
      if (response !== "error") {
        logFullArray = response.split('$$$');
        for (let i = 0; i < logFullArray.length; i++) {
          let values = logFullArray[i].split("		");
          let data = {
            hash: values[0],
            name: values[1],
            date: new Date(values[2]).toLocaleString(),
            commit: values[3]
          }
          if (data.hash !== "") {
            this.logData.push(data);
          }

        }
      }
      else {
        this.displayAlert();
      }
      this.dt.value = this.logData;
    })
    this.untrackedfiles();
  }
  untrackedfiles() {
    this.gitServ.untrackedFile(this.currentWorkingDir).then((data: any) => {
      let prop;
      if (data !== "error") {
        for (var i = 0; i < data.length; i++) {
          for (var files in data[i]) {
            if (prop !== files) {
              this.untrackedList.push(files);
              prop = files;
            }
            this.untrackedList.push(data[i][files])
          }
        }
      } else {
        this.displayAlert();
      }
    });
  }
  trackedFiles() {
    this.gitServ.trackedFile(this.currentWorkingDir).then((data: any) => {
      let prop;
      if (data !== "error") {
        for (var i = 0; i < data.length; i++) {
          for (var files in data[i]) {
            if (prop !== files) {
              this.untrackedList.push(files);
              prop = files;
            }
            this.untrackedList.push(data[i][files])
          }
        }
      } else {
        this.displayAlert();
      }
    });
  }
  checkExistFolder() {
    if (this.existingFolder) {
      this.gitServ.checkExistFolder(this.existingFolder).then((data: any) => {
        if (data !== "error") {
          this.currentWorkingDir = this.existingFolder;
          this.cloneDialog = false;
          this.refresh();
        }
        else {
          this.displayAlert();
        }
      });
    } else {
      this.displayAlert("please enter the folder")
    }
  }

}
