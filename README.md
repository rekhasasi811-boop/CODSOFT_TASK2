# DineDesk – Restaurant Ordering Platform
**CodSoft Full Stack Web Development – Task 2**

DineDesk is a responsive restaurant ordering and table-management web app. Customers can browse a digital menu, add items to a cart, place pickup/delivery/dine-in orders, and request table reservations. Restaurant staff can view orders in a kitchen dashboard and update preparation status.

## Features
- Digital menu with category filters
- Shopping cart, quantity controls and automatic total
- Validated online order form
- Pickup, delivery and dine-in options
- Table reservation requests
- Kitchen dashboard and order status updates
- REST API built with Node.js and Express
- Orders and reservations persist in a local JSON data file

## Technology
HTML, CSS, JavaScript, Node.js, Express and JSON file storage.

## Run the project
1. Install Node.js.
2. Open this folder in a terminal.
3. Run `npm install`.
4. Run `npm start`.
5. Visit `http://localhost:3000`.

The `data/store.json` file is created automatically.

## API endpoints
| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | API health check |
| GET | `/api/menu` | List menu items |
| GET | `/api/orders` | List orders |
| POST | `/api/orders` | Create an order |
| PATCH | `/api/orders/:id/status` | Update order status |
| GET | `/api/reservations` | List reservations |
| POST | `/api/reservations` | Create a reservation |

### Example order body
```json
{
  "customerName": "Priya",
  "phone": "9876543210",
  "orderType": "Pickup",
  "items": [{"menuId": 1, "quantity": 2}],
  "notes": "Please pack carefully"
}
```

### Example reservation body
```json
{
  "customerName": "Priya",
  "phone": "9876543210",
  "date": "2026-12-10",
  "time": "19:00",
  "guests": 4
}
```

## Notes
Payment is shown as pay-at-restaurant / cash-on-delivery; no real payment is collected. This is an internship demo. A production system should add staff authentication, a secure database and a payment gateway.

## Structure
```text
DineDesk_Restaurant_Ordering_Platform/
├── server.js
├── package.json
├── README.md
└── public/
    ├── index.html
    ├── style.css
    └── app.js
```
