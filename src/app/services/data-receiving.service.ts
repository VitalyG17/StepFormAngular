import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {ServerResponse} from 'src/app/types/serverResponse';

@Injectable({
  providedIn: 'root',
})
export class DataReceivingService {
  private readonly eventFormatUrl: string = 'http://localhost:3000/eventFormat';
  constructor(private http: HttpClient) {}

  public getServerData(): Observable<ServerResponse[]> {
    return this.http.get<ServerResponse[]>(this.eventFormatUrl);
  }
}
