import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InferService {

  private http: HttpClient;

  private host_url: string = 'https://codeboard.io/api/projects/11587';
  private bearer_token: string = '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';
  private cookie: string = '_ga=GA1.2.1708287776.1683958377; _gid=GA1.2.1211998620.1683958377; ab.storage.deviceId.a9882122-ac6c-486a-bc3b-fab39ef624c5={"g":"0973101a-3ea6-00c6-c87a-adff01d80dee","c":1683958388692,"l":1683958388692}; _gat=1; codeboardio=s:JUbnmmWYe_ce3TdofNN5TLt_HQeXy3C6.1j8DRCB7yKGVjr/0AK7kayi2VXwyJKGW29tDxqq2SkM; codeboardio=s%3A9MOOSKM79wRB8uwC75zoHrBDfwIr60hM.fALjsMSP2r7GQ9JmOr16YVZQwHnJJkkkOMZM5%2B7myY8';

  public constructor(http: HttpClient) {
    this.http = http;
  }

  public scanProject(body: string): Observable<any> {
    return this.http.post(this.host_url, body,
      {
        headers: new HttpHeaders({
          Authorization: 'Bearer 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',
          'Content-Type': 'application/json'
        })
      });

  }
}