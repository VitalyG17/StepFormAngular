import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, Observable, of} from 'rxjs';
import {ServerResponse} from '../types/serverResponse';

@Injectable()
export class EventFormatService {
  private readonly baseURL: string = 'http://localhost:3000/';

  constructor(private readonly http: HttpClient) {}

  public getEventFormats(addURL: string): Observable<ServerResponse[]> {
    const fullURL: string = `${this.baseURL}${addURL}`;
    return this.http.get<ServerResponse[]>(fullURL).pipe(
      catchError((err: unknown) => {
        console.error('Error!', err);
        return of([]);
      }),
    );
  }
}
