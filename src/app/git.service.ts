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
    return this.http.post(environment.serverurl + "clone", { url: path, folder: folderPath }).toPromise()
      .then((data) => { return data; })
      .catch(this.handleError);
  }
  logs(currentWorkingDir): Promise<any> {
    return this.http.post(environment.serverurl + "log ", { folder: currentWorkingDir }).toPromise()
      .then((data) => { return data; })
      .catch(this.handleError);

  }
  untrackedFile(cwd: string): Promise<any> {
    return this.http.post(environment.serverurl + "untracked ", { folder: cwd }).toPromise()
      .then((data: any) => { return JSON.parse(data._body); })
      .catch(this.handleError);
    ;
  }
  trackedFile(cwd: string): Promise<any> {
    return this.http.post(environment.serverurl + "tracked ", { folder: cwd }).toPromise()
      .then((data: any) => { return data._body; })
      .catch(this.handleError);
    ;
  }
  checkExistFolder(existingFolder: string): Promise<any> {
    console.log("check exist")
    return this.http.post(environment.serverurl + "folderCheck", { folder: existingFolder }).toPromise()
      .then((data: any) => { console.log(data); return data._body; })
      .catch(this.handleError);
    ;
  }

}