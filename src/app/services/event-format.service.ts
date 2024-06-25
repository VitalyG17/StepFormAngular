import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, of} from 'rxjs';
import {ServerResponse} from '../types/serverResponse';

@Injectable()
export class EventFormatService {
  private readonly eventFormatUrl: string = 'http://localhost:3000/eventFormat';

  constructor(private readonly http: HttpClient) {}

  public getEventFormats(): Observable<ServerResponse[]> {
    return this.http.get<ServerResponse[]>(this.eventFormatUrl).pipe(
      catchError((err: unknown) => {
        console.error('Error!', err);
        return of([]);
      }),
    );
  }
}
