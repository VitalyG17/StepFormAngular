import {Injectable} from '@angular/core';
import {ServerResponse} from '../types/serverResponse';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, of} from 'rxjs';

@Injectable()
export class HttpService {
  private readonly url: string = 'http://localhost:3000';

  constructor(private readonly http: HttpClient) {}

  public getAddServices(): Observable<ServerResponse[]> {
    return this.http.get<ServerResponse[]>(this.url + '/addServices').pipe(
      catchError((err: unknown) => {
        console.error('Error!', err);
        return of([]);
      }),
    );
  }
}
