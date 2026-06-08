import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CustomerReport {
  customerName: string;
  customerEmail: string;
  bookingCount: number;
  totalSpent: number;
}

export interface CarUtilizationReport {
  carId: number;
  carName: string;
  fuelType: string;
  bookingCount: number;
  totalRevenue: number;
}

export interface ReportSummary {
  // Booking stats
  totalBookings: number;
  pendingBookings: number;
  approvedBookings: number;
  rejectedBookings: number;
  cancelledBookings: number;

  // Revenue stats
  totalRevenue: number;
  totalPayments: number;

  // Car fleet stats
  totalCars: number;
  availableCars: number;
  rentedCars: number;
  maintenanceCars: number;

  // Detailed reports
  customerReports: CustomerReport[];
  carUtilizationReports: CarUtilizationReport[];
}

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  private apiUrl = 'http://localhost:8080/api/reports';

  constructor(private http: HttpClient) {}

  getSummary(): Observable<ReportSummary> {
    return this.http.get<ReportSummary>(`${this.apiUrl}/summary`);
  }
}
