import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, of} from 'rxjs';
import {ServerResponse} from '../types/serverResponse';

@Injectable()
export class EventFormatService {
  private readonly url: string = 'http://localhost:3000';

  constructor(private readonly http: HttpClient) {}

  public getEventFormats(): Observable<ServerResponse[]> {
    return this.http.get<ServerResponse[]>(this.url + '/event').pipe(
      catchError((err: unknown) => {
        console.error('Error!', err);
        return of([]);
      }),
    );
  }
}
