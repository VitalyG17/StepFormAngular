import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';
import {ServerResponse} from '../types/serverResponse';

@Injectable()
export class EventFormatService {
  private readonly url: string = 'https://forms-6abb9-default-rtdb.europe-west1.firebasedatabase.app';

  constructor(private readonly http: HttpClient) {}

  public getEventFormats(): Observable<ServerResponse[]> {
    return this.http.get<{[p: string]: ServerResponse}>(this.url + '/eventFormat.json').pipe(
      catchError((err: unknown) => {
        console.error('Error!', err);
        return of([]);
      }),
      map((data: {[p: string]: ServerResponse} | never[]) => Object.values(data)),
    );
  }
}
