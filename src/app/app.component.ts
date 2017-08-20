import { AppGridComponent } from './appgrid/appgrid.component';
import { DataTable } from 'primeng/primeng';
import { environment } from '../environments/environment';
import { Http } from '@angular/http';
import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { GitService } from './git.service';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
declare var Diff2HtmlUI;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('display', [
      state('show', style({
        right: 0
      })),
      state('hide', style({
        right: '-30%'
      })),
      transition('show => hide', animate('200ms ease-in')),
      transition('hide => show', animate('200ms ease-out'))
    ])
  ]

})
export class AppComponent implements AfterViewInit {
  title = 'app works!';
  logData = [];
  cloneDialog = false;
  untrackedList = [];
  trackedList = [];
  existingFolder: string;
  dataTableHeight = '200px';
  tags = [];
  commitDialog = false;
  commitMsg: string;
  branches = [];
  currentWorkingDir = 'D:/test/gitter';
  currentBranch;
  currentBranchOrgin;
  pushCount = 0;
  pullCount = 0;
  selectedCommit;
  fileDiffText = '';
  growlMsg = [];
  commitPrevFiles = { hash: '', filesList: [], commitBy: '', commitDate: '' };
  commitSideShow = 'hide';
  remotes = [];
  @ViewChild(AppGridComponent) dt: DataTable;
  constructor(private http: Http, private gitServ: GitService, private cdr: ChangeDetectorRef) {

  }

  ngAfterViewInit() {
    this.resizeWindow();
    window.addEventListener('resize', this.resizeWindow.bind(this));
    this.refresh();
  }

  resizeWindow() {
    const ele: any = document.getElementsByClassName('contentArea')[0];
    const headerNav = document.getElementsByClassName('headerContent')[0];
    const style = window.getComputedStyle(headerNav);
    let height: any = parseFloat(style.height) + parseFloat(style.paddingBottom) + parseFloat(style.paddingTop);
    height = 105;
    ele.style.height = window.innerHeight - height + 'px';
    ele.style.width = window.innerWidth + 'px';
    this.dataTableHeight = (window.innerHeight) / 2 - height + 'px';
    this.cdr.detectChanges();
  }
  checkExistFolder() {
    if (this.existingFolder) {
      this.gitServ.checkExistFolder(this.existingFolder).then((data: any) => {
        if (data !== 'error') {
          this.currentWorkingDir = this.existingFolder;
          this.cloneDialog = false;
          this.refresh();
        } else {
          this.displayAlert();
        }
      });
    } else {
      this.displayAlert('please enter the folder');
    }
  }
  cloneClick() {
    this.cloneDialog = true;
  }

  clone() {
    this.gitServ.clone('https://brpradeepprabhu@bitbucket.org/brpradeepprabhu/gitter.git', 'D:/bitbucket').then((data: any) => {
      const response = data;
      if (response !== 'error') {
        this.logs();
        this.cloneDialog = false;
      } else {
        this.displayAlert();
      }
    });
  }
  commitBtnClick() {
    this.commitDialog = true;
  }
  commitSelected(e) {
    const hash = e.data.hash.trim();
    console.log(e.data)
    this.gitServ.getListOfFilesCommit(hash, this.currentWorkingDir).then((data: any) => {
      this.commitDialog = false;
      this.commitSideShow = 'show';
      if (data !== 'error') {
        this.commitPrevFiles.filesList = data.split('\n');
        for (let i = 0; i < this.commitPrevFiles.filesList.length; i++) {
          if (this.commitPrevFiles.filesList[i].trim() === '') {
            this.commitPrevFiles.filesList.splice(i, 1);
          }
        }
        this.commitPrevFiles.hash = hash;
        this.commitPrevFiles.commitBy = e.data.name;
        this.commitPrevFiles.commitDate = e.data.date;
      } else {
        this.displayAlert();
      }
    });
  }
  commitClicked() {
    this.gitServ.commit(this.commitMsg, this.currentWorkingDir).then((data: any) => {
      this.commitDialog = false;
      if (data !== 'error') {
        this.refresh();
        this.growlMsg = [];
        this.growlMsg.push({ severity: 'success', summary: 'Commited  Successfully', sticky: false, life: 1000 });
      } else {
        this.displayAlert();
      }
    });
  }
  discardAll() {
    this.gitServ.discardAll(this.currentWorkingDir).then((data: any) => {
      this.commitDialog = false;
      if (data !== 'error') {
        this.refresh();
        this.growlMsg = [];
        this.growlMsg.push({ severity: 'success', summary: 'Discarded files Successfully', sticky: false, life: 1000 });
      } else {
        this.displayAlert();
      }
    });
  }
  displayAlert(msg?: any) {
    const message = (msg !== undefined) ? msg : 'error';
    alert(message);
  }
  getBranches() {
    this.gitServ.getBranches(this.currentWorkingDir).then((data: any) => {
      this.branches = [
        {
          label: 'Branches',
          icon: 'fa-tree',
          items: [],
          expanded: true,
        }];
      if (data !== 'error') {
        const branchArray = data.split('\n');
        for (let i = 0; i < branchArray.length; i++) {
          if (branchArray[i].trim() !== '') {
            const splitBranch = branchArray[i].split(' ');

            const fontClass = (splitBranch[0] === '*') ? 'boldClass' : '';
            if (splitBranch[0] === '*') {
              this.currentBranch = splitBranch[1];
            }
            const branchText = branchArray[i].replace('*', '');
            this.branches[0].items.push({
              label: branchText, styleClass: fontClass, command: (event) => {
                this.gitServ.checkout(event.item.label, this.currentWorkingDir).then(() => {
                  this.refresh();
                });
              }
            });

          }
        }
        this.getCurrentBranchOrgin();
      } else {
        this.displayAlert();
      }
    });
  }
  getRemoteBranches() {
    this.gitServ.getRemoteBranches(this.currentWorkingDir).then((data: any) => {
      this.remotes = [
        {
          label: 'remote',
          icon: 'fa-tree',
          items: [],
          expanded: true,
        }];
      if (data !== 'error') {
        const branchArray = data.split('\n');
        for (let i = 1; i < branchArray.length; i++) {
          if (branchArray[i].trim() !== '') {
            const splitBranch = branchArray[i].split(' ');
            const fontClass = (splitBranch[0] === '*') ? 'boldClass' : '';
            if (splitBranch[0] === '*') {
              this.currentBranch = splitBranch[1];
            }
            const branchText = branchArray[i].replace('*', '');
            this.remotes[0].items.push({
              label: branchText, styleClass: fontClass, command: (event) => {
                console.log(event.item.label)
                const branchArray = event.item.label.split('/');
                this.gitServ.checkout(branchArray[branchArray.length - 1], this.currentWorkingDir).then(() => {
                  this.refresh();
                  this.growlMsg = [];
                  this.growlMsg.push({ severity: 'success', summary: 'Branch checkout Successfully' });
                });
              }
            });

          }
        }
      } else {
        this.displayAlert();
      }
    });
  }
  getCurrentBranchOrgin() {
    this.gitServ.getCurrentBranchOrgin(this.currentWorkingDir).then((data: any) => {
      this.currentBranchOrgin = data;
      this.getPushCount();  
    });
  }
  getDiffFile(fileName, staged: boolean = false) {
    this.gitServ.getDiffFile(fileName, this.currentWorkingDir, staged).then((data: any) => {
      this.fileDiffText = data;
      if (data) {
        const diff2htmlUi = new Diff2HtmlUI({
          diff: this.fileDiffText
        });
        const container = '#codeContainer';
        this.removeCodeContainer();
        diff2htmlUi.fileListCloseable(container, !1);
        diff2htmlUi.highlightCode(container);
        diff2htmlUi.draw(container, {
          matching: 'lines'
        });
      }
    });
  }
  removeCodeContainer() {
    const node = document.getElementById('codeContainer');
    while (node.firstChild) {
      node.removeChild(node.firstChild);
    }
  }
  getPushCount() {
    if (this.currentBranchOrgin) {
      this.gitServ.getPushCount(this.currentBranch, this.currentBranchOrgin, this.currentWorkingDir).then((data: any) => {
        const pushPullArray = data.split('	');
        this.pushCount = pushPullArray[0];
        this.pullCount = pushPullArray[1];
      });
    }
  }
  getTags() {
    this.gitServ.getTags(this.currentWorkingDir).then((data: any) => {
      this.tags = [
        {
          label: 'Tags',
          icon: 'fa-tags',
          items: [],
          expanded: true,
        }];
      if (data !== 'error') {
        const tagArray = data.split('\n');
        for (let i = 0; i < tagArray.length; i++) {
          if (tagArray[i].trim() !== '') {
            this.tags[0].items.push({ label: tagArray[i] });
          }
        }
      } else {
        this.displayAlert();
      }
    });
  }
  logs() {
    let logFullArray = [];
    this.logData = [];
    this.gitServ.logs(this.currentWorkingDir).then((res: any) => {
      const response = res._body;
      if (response !== 'error') {
        logFullArray = response.split('$$$');
        for (let i = 0; i < logFullArray.length; i++) {
          const values = logFullArray[i].split('		');
          const data = {
            hash: values[0],
            name: values[1],
            date: new Date(values[2]).toLocaleString(),
            commit: values[3]
          };
          if (data.hash !== '') {
            this.logData.push(data);
          }

        }
      } else {
        this.displayAlert();
      }
      this.dt.value = this.logData;
    });
  }
  push() {
    this.gitServ.push(this.currentWorkingDir).then(data => {
      this.refresh();
      this.growlMsg = [];
      this.growlMsg.push({ severity: 'success', summary: 'Pushed Successfully' });
    });
  }
  pull() {
    this.gitServ.pull(this.currentWorkingDir).then(data => {
      this.refresh();
      this.growlMsg = [];
      this.growlMsg.push({ severity: 'success', summary: 'pull Successfully' });
    });
  }
  refresh() {
    this.logs();
    this.unTrackedFiles();
    this.trackedFiles();
    this.getTags();
    this.getBranches();
    this.getRemoteBranches();
    this.removeCodeContainer();

  }
  stageAllClicked() {
    this.gitServ.stageAll(this.currentWorkingDir).then((data: any) => {
      if (data !== 'error') {
        this.refresh();
        this.growlMsg = [];
        this.growlMsg.push({ severity: 'success', summary: 'Stage All Files  Successfully' });
        //  this.growlMsg.push({ severity: 'success', summary: 'Success Message', detail: 'Order submitted' });
      } else {
        this.displayAlert();
      }
    });
  }
  trackedFiles() {
    this.gitServ.trackedFile(this.currentWorkingDir).then((data: any) => {
      this.trackedList = [];
      if (data !== 'error') {
        const filesList = data.split('\n');
        for (let i = 0; i < filesList.length; i++) {
          const fileNames = filesList[i].split('	');
          for (let m = 0; m < fileNames.length; m++) {
            if (fileNames[m].trim() === '') {
              fileNames.splice(m, 1);
            }
          }
          if (fileNames.length > 0) {
            this.trackedList.push({ status: fileNames[0], fileName: fileNames[1] });

          }
        }
      } else {
        this.displayAlert();
      }
    });
  }
  unStageAllClicked() {
    this.gitServ.unStageAll(this.currentWorkingDir).then((data: any) => {
      if (data !== 'error') {
        this.refresh();
        this.growlMsg = [];
        //  this.growlMsg.push({ severity: 'success', summary: 'Success Message', detail: 'Order submitted' });
        this.growlMsg.push({ severity: 'success', summary: 'UnStage All Files  Successfully', sticky: false, life: 1000 });
      } else {
        this.displayAlert();
      }
    });
  }
  unTrackedFiles() {
    this.gitServ.untrackedFile(this.currentWorkingDir).then((data: any) => {
      this.untrackedList = [];
      if (data !== 'error') {
        const filesList = data.split('\n');

        for (let i = 0; i < filesList.length; i++) {
          const fileNames = filesList[i].split(' ');
          if (fileNames.length > 0) {
            if ((fileNames[0] === 'MM') || (fileNames[0] === '??')) {
              this.untrackedList.push({ status: fileNames[0], fileName: fileNames[1] });
            }
            if ((fileNames[1] === 'M') || ((fileNames[1] === 'D'))) {
              this.untrackedList.push({ status: fileNames[1], fileName: fileNames[2] });
            }
          }
        }
      } else {
        this.displayAlert();
      }
    });
  }


}
