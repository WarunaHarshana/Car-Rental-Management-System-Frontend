import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/** Normalized payment — createdAt is always a string (ISO). Used in components. */
export interface Payment {
  id: number;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
  bookingId?: number;
  booking?: { id: number };
}

/** Raw shape returned by the backend — createdAt may be a LocalDateTime array. */
export interface PaymentApiResponse extends Omit<Payment, 'createdAt'> {
  createdAt: string | number[];
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/payments';

  constructor(private http: HttpClient) {}

  // Send amount + selected payment method to the backend
  checkout(bookingId: number, amount: number, method: string = 'Card'): Observable<Payment> {
    return this.http.post<Payment>(`${this.apiUrl}/checkout/${bookingId}`, {
      amount,
      method
    });
  }

  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }
}
