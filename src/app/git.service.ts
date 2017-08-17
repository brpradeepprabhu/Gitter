import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { environment } from '../environments/environment';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class GitService {
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
  constructor(private http: Http) {

  }
  clone(path: string, folderPath: string): Promise<any> {
    return this.http.post(environment.serverurl + 'clone', { url: path, folder: folderPath }).toPromise()
      .then((data) => { return data; })
      .catch(this.handleError);
  }
  commit(message: string, folderPath: string): Promise<any> {
    return this.http.post(environment.serverurl + 'commit', { message: message, folder: folderPath }).toPromise()
      .then((data) => { return data; })
      .catch(this.handleError);
  }
  checkExistFolder(existingFolder: string): Promise<any> {
    return this.http.post(environment.serverurl + 'folderCheck', { folder: existingFolder }).toPromise()
      .then((data: any) => { return data._body; })
      .catch(this.handleError);
  }
  logs(currentWorkingDir): Promise<any> {
    return this.http.post(environment.serverurl + 'log ', { folder: currentWorkingDir }).toPromise()
      .then((data) => { return data; })
      .catch(this.handleError);

  }
  getTags(currentWorkingDir): Promise<any> {
    return this.http.post(environment.serverurl + 'getTags ', { folder: currentWorkingDir }).toPromise()
      .then((data: any) => { return this.parseData(data._body); })
      .catch(this.handleError);

  }
  getBranches(currentWorkingDir): Promise<any> {
    return this.http.post(environment.serverurl + 'getBranches ', { folder: currentWorkingDir }).toPromise()
      .then((data: any) => { return this.parseData(data._body); })
      .catch(this.handleError);

  }
  getDiffFile(fileName, currentWorkingDir): Promise<any> {
    return this.http.post(environment.serverurl + 'getDiffFile ', { fileName: fileName, folder: currentWorkingDir }).toPromise()
      .then((data: any) => { return this.parseData(data._body); })
      .catch(this.handleError);

  }
  getCurrentBranchOrgin(currentWorkingDir: string): Promise<any> {
    return this.http.post(environment.serverurl + 'getCurrentBranchOrgin ', { folder: currentWorkingDir }).toPromise()
      .then((data: any) => { return (data._body); })
      .catch(this.handleError);

  }
  getPushCount(branch: string, orginBranch: string, folderPath: string): Promise<any> {
    console.log(branch, folderPath)
    return this.http.post(environment.serverurl + 'getPushCount', {
      folder: folderPath, branch: branch,
      orginBranch: orginBranch
    }).toPromise()
      .then((data: any) => { return this.parseData(data._body); })
      .catch(this.handleError);
  };
  push(currentWorkingDir: string): Promise<any> {
    console.log("p", currentWorkingDir);
    return this.http.post(environment.serverurl + 'push ', { folder: currentWorkingDir }).toPromise()
      .then((data: any) => { return (data._body); })
      .catch(this.handleError);

  }
  stageAll(currentWorkingDir: string): Promise<any> {
    return this.http.post(environment.serverurl + 'stageAll ', { folder: currentWorkingDir }).toPromise()
      .then((data: any) => { return (data._body); })
      .catch(this.handleError);

  }
  unStageAll(currentWorkingDir: string): Promise<any> {
    return this.http.post(environment.serverurl + 'unStageAll ', { folder: currentWorkingDir }).toPromise()
      .then((data: any) => { return (data._body); })
      .catch(this.handleError);
  }
  untrackedFile(cwd: string): Promise<any> {
    return this.http.post(environment.serverurl + 'untracked ', { folder: cwd }).toPromise()
      .then((data: any) => { return this.parseData(data._body); })
      .catch(this.handleError);
  }
  trackedFile(cwd: string): Promise<any> {
    return this.http.post(environment.serverurl + 'tracked ', { folder: cwd }).toPromise()
      .then((data: any) => { return this.parseData(data._body); })
      .catch(this.handleError);
  }

  parseData(data) {
    if (data === 'error') {
      return data;
    } else {
      return JSON.parse(data);
    }
  }

}
