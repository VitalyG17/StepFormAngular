import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {FormData} from '../types/eventForm';

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

  public checkExistingBooking(userName: string, email: string, date: string): Observable<boolean> {
    return this.http.get(this.databaseUrl).pipe(
      map((data: Object) => {
        return Object.values(data).some((item: FormData): boolean => {
          if (item.date) {
            return (
              item.userName === userName &&
              item.email === email &&
              new Date(item.date).toLocaleDateString('ru-RU') === date
            );
          }
          return false;
        });
      }),
    );
  }
}
