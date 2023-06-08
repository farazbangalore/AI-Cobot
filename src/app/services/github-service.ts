import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, map, Observable } from 'rxjs';
import { GithubReference } from '../modules/models/github-repo';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private http: HttpClient;

  private host: string = 'https://api.github.com/';
  private access_token: string = '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';
  private user: string = 'farazbangalore';

  public constructor(http: HttpClient) {
    this.http = http;
  }

  public getAllRepos(): Observable<GithubReference[]> {
    const url = this.host + 'users/' + this.user + '/repos';
    return this.http.get<GithubReference[]>(url, {
      headers: new HttpHeaders({
        'Authorization': this.access_token
      })
    });
  }

  public getPrsForRepo(repo: string, state: string): Observable<GithubReference[]> {
    const url = this.host + 'repos/' + this.user + '/' + repo + '/pulls?state=' + state;
    return this.http.get<GithubReference[]>(url, {
      headers: new HttpHeaders({
        'Authorization': this.access_token
      })
    });
  }

  public commentForPr(repo: string, pr: string, body: any): Observable<any[]> {
    const url = this.host + 'repos/' + this.user + '/' + repo + '/issues/' + pr + '/comments';
    return this.http.post<GithubReference[]>(url, body, {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.access_token,
        'Accept': 'application/vnd.github+json'
      }),
    });
  }

  public getFilesForPr(repo: string, prNumber: string): Observable<GithubReference[]> {
    const url = this.host + 'repos/' + this.user + '/' + repo + '/pulls/' + prNumber + '/files';
    return this.http.get<GithubReference[]>(url, {
      headers: new HttpHeaders({
        'Authorization': this.access_token
      })
    });
  }

  public getFileContentFromUrl(contents_url: string): Observable<string> {
    const headers = {
      'Accept': 'application/vnd.github.raw',
    };
    return this.http.get(contents_url, { headers, responseType: 'text' })
  }

}