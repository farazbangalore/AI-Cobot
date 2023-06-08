import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GithubReference } from '../modules/models/github-repo';

@Injectable({
  providedIn: 'root'
})
export class GptService {
  private http: HttpClient;

  private host_url: string = 'https://chatgpt-4-bing-ai-chat-api.p.rapidapi.com/chatgpt-4-bing-ai-chat-api/0.2/send-message/';
  private bing_u_cookie: string = '1Q0n2DgUoc2Tq1mMkMT1tWKBCI4BF4mSB90FfmHFmSPIyyrSbqnV553KTj_7BgXCm7aWSJ4ZYD4xlUCYYE5iuNOsaSCWFra9euOPLwGyhcnTRr3zy-g21R0wjEDkERXD_NxuPCNrWzHA53dcLYorJ-b3lqB1JiERIpsbgYqhVpOOWsz9Pj-IJT-Vea7A4SUDV1JYgpLNvR3C3lgQd5-FmMsGhK9a9pUM15nMBuSn-PbQ';
  private x_rapidapi_host: string = "chatgpt-4-bing-ai-chat-api.p.rapidapi.com";
  private X_RapidAPI_Key: string = "f018f0a0fcmshd1c4b32ca94ac3dp17222ajsn1c7bacfaea9a";

  public constructor(http: HttpClient) {
    this.http = http;
  }

  public performQuery(query: string): Observable<any> {
    var urlencoded = new URLSearchParams();
    urlencoded.append("bing_u_cookie", this.bing_u_cookie);
    urlencoded.append("question", JSON.stringify(query));
    return this.http.post<any>(this.host_url, urlencoded,
      {
        headers: new HttpHeaders({
          'x-rapidapi-host': this.x_rapidapi_host,
          'X-RapidAPI-Key': this.X_RapidAPI_Key,
          'content-type': 'application/x-www-form-urlencoded'
        })
      });
  }


}