import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService, ReportSummary } from '../../services/report.service';

@Component({
  selector: 'app-mis-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-report.component.html',
  styleUrl: './mis-report.component.css'
})
export class MisReportComponent implements OnInit {
  report: ReportSummary | null = null;
  loading = true;
  error = '';
  activeTab: 'overview' | 'bookings' | 'revenue' | 'customers' | 'utilization' = 'overview';

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadReport();
  }

  loadReport(): void {
    this.loading = true;
    this.error = '';
    this.reportService.getSummary().subscribe({
      next: (data) => {
        this.report = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load report data. Please ensure the backend is running.';
        console.error('Report load failed:', err);
        this.loading = false;
      }
    });
  }

  setTab(tab: 'overview' | 'bookings' | 'revenue' | 'customers' | 'utilization'): void {
    this.activeTab = tab;
  }

  get bookingCompletionRate(): number {
    if (!this.report || this.report.totalBookings === 0) return 0;
    return Math.round((this.report.approvedBookings / this.report.totalBookings) * 100);
  }

  get fleetUtilizationRate(): number {
    if (!this.report || this.report.totalCars === 0) return 0;
    return Math.round((this.report.rentedCars / this.report.totalCars) * 100);
  }

  get avgRevenuePerBooking(): number {
    if (!this.report || this.report.approvedBookings === 0) return 0;
    return this.report.totalRevenue / this.report.approvedBookings;
  }

  get topCustomer(): string {
    if (!this.report || this.report.customerReports.length === 0) return '—';
    return this.report.customerReports[0].customerName;
  }

  get topCar(): string {
    if (!this.report || this.report.carUtilizationReports.length === 0) return '—';
    return this.report.carUtilizationReports[0].carName;
  }
}
