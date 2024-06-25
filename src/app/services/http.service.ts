import {Injectable} from '@angular/core';
import {ServerResponse} from '../types/serverResponse';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, of} from 'rxjs';

@Injectable()
export class HttpService {
  private readonly addServicesUrl: string = 'http://localhost:3000/addServices';

  constructor(private readonly http: HttpClient) {}

  public getAddServices(): Observable<ServerResponse[]> {
    return this.http.get<ServerResponse[]>(this.addServicesUrl).pipe(
      catchError((err: unknown) => {
        console.error('Error!', err);
        return of([]);
      }),
    );
  }
}
