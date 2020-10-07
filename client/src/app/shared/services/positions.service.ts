import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Positions, Message} from '../interfaces';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class PositionsService {
  constructor(
    private http: HttpClient
  ) {
  }

  fetch(categoryId: string): Observable<Positions[]> {
    return this.http.get<Positions[]>(`/api/position/${categoryId}`);
  }

  create(position: Positions): Observable<Positions> {
    return this.http.post<Positions>('/api/position', position);
  }

  update(position: Positions): Observable<Positions> {
    return this.http.patch<Positions>(`/api/position/${position._id}`, position);
  }

  delete(position: Positions): Observable<Message> {
    return this.http.delete<Message>(`/api/position/${position._id}`);
  }
}
