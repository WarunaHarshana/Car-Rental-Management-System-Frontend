import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { MisReportComponent } from './mis-report.component';
import { ReportService, ReportSummary } from '../../services/report.service';

describe('MisReportComponent', () => {
  let component: MisReportComponent;
  let fixture: ComponentFixture<MisReportComponent>;
  let reportService: ReportService;

  const mockReport: ReportSummary = {
    totalBookings: 10,
    pendingBookings: 2,
    approvedBookings: 6,
    rejectedBookings: 1,
    cancelledBookings: 1,
    totalRevenue: 50000,
    totalPayments: 5,
    totalCars: 5,
    availableCars: 3,
    rentedCars: 2,
    maintenanceCars: 0,
    customerReports: [
      { customerName: 'John Doe', customerEmail: 'john@example.com', bookingCount: 4, totalSpent: 30000 }
    ],
    carUtilizationReports: [
      { carId: 1, carName: 'Toyota Prius', fuelType: 'Hybrid', bookingCount: 5, totalRevenue: 25000 }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisReportComponent],
      providers: [
        provideHttpClient(),
        {
          provide: ReportService,
          useValue: {
            getSummary: () => of(mockReport)
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MisReportComponent);
    component = fixture.componentInstance;
    reportService = TestBed.inject(ReportService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load report on init', () => {
    fixture.detectChanges();
    expect(component.loading).toBe(false);
    expect(component.report).toEqual(mockReport);
  });

  it('should calculate rate getters correctly', () => {
    fixture.detectChanges();
    expect(component.bookingCompletionRate).toBe(60);
    expect(component.fleetUtilizationRate).toBe(40);
    expect(component.avgRevenuePerBooking).toBe(50000 / 6);
    expect(component.topCustomer).toBe('John Doe');
    expect(component.topCar).toBe('Toyota Prius');
  });

  it('should change activeTab when setTab is called', () => {
    fixture.detectChanges();
    expect(component.activeTab).toBe('overview');
    component.setTab('bookings');
    expect(component.activeTab).toBe('bookings');
  });

  it('should handle error when loading reports fails', () => {
    // Reset/Mock getSummary returning error
    reportService.getSummary = () => throwError(() => new Error('API Error'));
    component.loadReport();
    expect(component.loading).toBe(false);
    expect(component.error).toContain('Failed to load report data');
  });
});
