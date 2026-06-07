import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/payments';

  constructor(private http: HttpClient) {}

  checkout(bookingId: number, amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout/${bookingId}`, { amount });
  }
}