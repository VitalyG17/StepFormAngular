import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class SubmittingFormDataService {
  private readonly databaseUrl: string =
    'https://forms-6abb9-default-rtdb.europe-west1.firebasedatabase.app/formValue.json';

  constructor(private readonly http: HttpClient) {}

  public postData(data: Object): Observable<Object> {
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post(this.databaseUrl, data, {headers});
  }
}
