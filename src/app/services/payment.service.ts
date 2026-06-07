import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Payment {
  id: number;
  amount: number;
  method: string;
  status: string;
  createdAt: string;
  booking?: { id: number };
}

export interface PaymentApiResponse {
  id: number;
  amount: number;
  method: string;
  status: string;
  createdAt: string | number[];
  booking?: { id: number };
}

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080/api/payments';

  constructor(private http: HttpClient) {}

  checkout(bookingId: number, amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout/${bookingId}`, { amount });
  }

  getAllPayments(): Observable<PaymentApiResponse[]> {
    return this.http.get<PaymentApiResponse[]>(this.apiUrl);
  }
}