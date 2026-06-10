# Car Rental Management System (Frontend)

An Angular single-page app for renting cars. Customers can browse the catalog, book a car, and pay. Admins can manage cars, view bookings and transactions, and read reports. Styled with Bootstrap.

Backend repository: [Car-Rental-Management-System-Backend](https://github.com/WarunaHarshana/Car-Rental-Management-System-Backend)

## Tech stack

- Angular 21 (standalone components, modern `@if` / `@for` control flow)
- TypeScript
- Bootstrap 5.3 and Bootstrap Icons
- Angular Router with route guards
- `HttpClient` for API calls

## Features

### For customers

- Landing page with an overview of the service
- Car catalog with photos, search, and filters
- Car detail page with a booking form and date validation
- My Bookings page to view and cancel reservations
- Checkout with a choice of payment method

### For admins

- Add, edit, and delete cars, with photo upload or an image URL
- Manage car status (available, rented, maintenance)
- View all bookings and update their status
- View all transactions with payment methods
- MIS reports: bookings, revenue, customers, and car utilization

## Screenshots

Save each image in a `docs/screenshots/` folder in the repo using the filename shown. They will render here once the repo is on GitHub.

![Landing page](docs/screenshots/landing.png)
![Landing features](docs/screenshots/landing-features.png)
![Admin panel](docs/screenshots/admin-panel.png)
![Bookings and transactions](docs/screenshots/admin-bookings.png)
![MIS reports](docs/screenshots/mis-reports.png)

## Project structure

```text
src/app
├── components/navbar      Top navigation, shows the logged-in user
├── guards                 authGuard, adminGuard
├── pages
│   ├── landing            Home page
│   ├── car-list           Catalog with search and filters
│   ├── car-detail         Car details and booking
│   ├── login / register   Auth screens
│   ├── my-bookings        Customer bookings and payment
│   ├── admin              Cars, bookings, transactions
│   └── admin-reports      MIS report dashboard
└── services               auth, car, booking, payment, report
```

## Getting started

### Prerequisites

- Node.js and npm
- Angular CLI
- The backend running on `http://localhost:8080`

### Install

```bash
npm install
```

### Run

```bash
ng serve
```

Open `http://localhost:4200`.

## Routes

| Path | Page | Access |
| :--- | :--- | :--- |
| `/` | Landing | Public |
| `/cars` | Car catalog | Public |
| `/cars/:id` | Car detail and booking | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/my-bookings` | My bookings | Logged-in users |
| `/admin` | Admin panel | Admins |
| `/admin/reports` | MIS reports | Admins |

## How auth works

The logged-in user is stored in `localStorage` after login. `authGuard` protects customer pages, and `adminGuard` restricts the admin pages to users with the `ADMIN` role. The navbar shows the current user's name and role.

## Styling

The UI uses Bootstrap components (cards, tables, forms, badges, alerts) and Bootstrap Icons. Car images come from either an uploaded file served by the backend or a pasted image URL.

## Notes for graders

- The frontend expects the backend at `http://localhost:8080`. If you change the backend port, update the `apiUrl` in the service files.
- Log in as an admin to see the admin panel and reports. Customer accounts see the catalog and their own bookings.
