import {Injectable} from '@angular/core';
import {ServerResponse} from '../types/serverResponse';
import {HttpClient} from '@angular/common/http';
import {catchError, map, Observable, of} from 'rxjs';

@Injectable()
export class HttpService {
  private readonly url: string = 'https://forms-6abb9-default-rtdb.europe-west1.firebasedatabase.app';

  constructor(private readonly http: HttpClient) {}

  public getAddServices(): Observable<ServerResponse[]> {
    return this.http.get<{[key: string]: ServerResponse}>(this.url + '/addServices.json').pipe(
      catchError((err: unknown) => {
        console.error('Error!', err);
        return of([]);
      }),
      map((data: {[p: string]: ServerResponse} | never[]) => Object.values(data)),
    );
  }
}
