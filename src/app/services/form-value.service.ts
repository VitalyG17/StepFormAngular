import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, Observable, of, switchMap, throwError} from 'rxjs';
import {FormData} from '../types/eventForm';

@Injectable()
export class FormValueService {
  private readonly databaseUrl: string =
    'https://forms-6abb9-default-rtdb.europe-west1.firebasedatabase.app/bookingInfo';

  constructor(private readonly http: HttpClient) {}

  public submitBooking(formData: FormData): Observable<Object | null> {
    if (formData.date && formData.userName && formData.email) {
      const formattedDate: string = new Date(formData.date).toLocaleDateString('ru-RU');

      return this.checkExistingBooking(formData.userName, formData.email, formattedDate).pipe(
        switchMap((isBooked: boolean) => {
          if (isBooked) {
            return throwError(
              () => new Error(`Вы уже забронировали мероприятие на имя ${formData.userName} на ${formattedDate}`),
            );
          } else {
            return this.createData(formData);
          }
        }),
        catchError((error: unknown) => {
          return throwError(() => error);
        }),
      );
    } else {
      return of(null);
    }
  }

  private createData(data: FormData): Observable<Object> {
    const headers: HttpHeaders = new HttpHeaders({
      'Content-Type': 'application',
    });
    return this.http.post(this.databaseUrl, data, {headers});
  }

  private checkExistingBooking(userName: string, email: string, date: string): Observable<boolean> {
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
