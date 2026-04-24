# Gauri E-Solutions 

A full-stack e-commerce application built with React, Node.js, Express, MongoDB, and Razorpay payment integration.

## Features

### Customer Features
- **User Authentication**: Register and login to shop
- **Profile Management**: Update personal information and view order history
- Browse products by category
- Add products to cart (requires login)
- Adjust quantities in cart
- Secure checkout with Razorpay payment gateway
- Real-time stock availability
- View past orders and track status
- Responsive design

### Admin Features
- Secure admin login
- Product management (Create, Read, Update, Delete)
- Mark products as available/unavailable
- Manage product inventory
- View and manage orders
- Update order status
- Dashboard with products and orders overview

## Tech Stack

### Frontend
- React 18
- React Router DOM
- Bootstrap 5
- Context API for state management
- Razorpay Checkout

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Razorpay Payment Gateway
- bcryptjs for password hashing

## Project Structure

```
client/
├── src/
│   ├── components/
│   ├── context/
│   │   └── CartContext.jsx
│   ├── layout/
│   │   ├── Footer.jsx
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── AdminLogin.jsx
│   │   ├── About.jsx
│   │   ├── Checkout.jsx
│   │   ├── Contact.jsx
│   │   ├── Features.jsx
│   │   ├── Home.jsx
│   │   └── Products.jsx
│   ├── utils/
│   │   └── api.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
└── package.json

server/
├── config/
│   └── db.js
├── controllers/
│   ├── adminController.js
│   ├── orderController.js
│   └── productController.js
├── middleware/
│   ├── auth.js
|   ├── upload.js
|   └── userAuth.js
├── models/
│   ├── Admin.js
│   ├── Order.js
│   └── Product.js
├── routes/
│   ├── adminRoutes.js
│   ├── orderRoutes.js
│   └── productRoutes.js
├── .env.example
├── package.json
└── server.js

```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Razorpay account (for payment integration)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your credentials:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/gauri-e-solutions
JWT_SECRET=your_strong_jwt_secret_here
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
CLIENT_URL=http://localhost:5173
```

5. Start the backend server:
```bash
npm run dev
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to the project root:
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

4. Update `.env` with your credentials:
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

5. Start the development server:
```bash
npm run dev
```

The frontend will run on http://localhost:5173

## First Time Setup

### Create Admin Account

After starting the backend, create your first admin account:

**Using cURL:**
```bash
curl -X POST http://localhost:5000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "email": "admin@gauriesolutions.com",
    "password": "admin123"
  }'
```

**Using Postman:**
- Method: POST
- URL: http://localhost:5000/api/admin/register
- Body (raw JSON):
```json
{
  "username": "admin",
  "email": "admin@gauriesolutions.com",
  "password": "admin123"
}
```

**Important:** For production, remove or protect the `/register` endpoint!

## Usage

### Customer Flow

1. **Register/Login**
   - Visit http://localhost:5173/login
   - Register a new account or login with existing credentials
   - Fill in required information (name, email, phone, address)

2. **Browse Products**
   - Visit http://localhost:5173/products
   - Filter by category
   - View product details

3. **Add to Cart**
   - Click "Add to Cart" on any product (requires login)
   - View cart by clicking the cart icon
   - Adjust quantities or remove items

4. **Checkout**
   - Click "Proceed to Checkout"
   - Review billing details (pre-filled from profile)
   - Complete payment via Razorpay

5. **Manage Profile**
   - Visit http://localhost:5173/profile
   - Update personal information
   - View order history and status

### Admin Flow

1. **Login**
   - Visit http://localhost:5173/admin/login
   - Use your admin credentials

2. **Manage Products**
   - View all products in the dashboard
   - Add new products with details
   - Edit existing products
   - Toggle product availability
   - Delete products

3. **Manage Orders**
   - View all customer orders
   - Update order status
   - View order details

## API Endpoints

### User Routes
```
POST   /api/users/register      - Register new user
POST   /api/users/login         - User login
GET    /api/users/profile       - Get user profile (Protected)
PUT    /api/users/profile       - Update user profile (Protected)
GET    /api/users/orders        - Get user's orders (Protected)
```

### Admin Routes
```
POST   /api/admin/register      - Register new admin
POST   /api/admin/login         - Admin login
GET    /api/admin/profile       - Get admin profile (Protected)
```

### Product Routes
```
GET    /api/products            - Get all products (filters: category, available)
GET    /api/products/:id        - Get single product
POST   /api/products            - Create product (Protected)
PUT    /api/products/:id        - Update product (Protected)
DELETE /api/products/:id        - Delete product (Protected)
PATCH  /api/products/:id/availability - Toggle availability (Protected)
```

### Order Routes
```
POST   /api/orders/create-razorpay-order - Create Razorpay order
POST   /api/orders/verify-payment        - Verify payment
POST   /api/orders                        - Create order
GET    /api/orders                        - Get all orders (Protected)
GET    /api/orders/:id                    - Get order by ID
PUT    /api/orders/:id/status             - Update order status (Protected)
```

## Razorpay Integration

### Test Mode

For testing, use Razorpay test mode credentials:

**Test Card Details:**
- Card Number: 4111 1111 1111 1111
- Expiry: Any future date
- CVV: Any 3 digits
- Name: Any name

**Test UPI:**
- VPA: success@razorpay

### Live Mode

1. Sign up at https://razorpay.com
2. Complete KYC verification
3. Generate API keys from Dashboard
4. Update `.env` with live keys
5. Remove test mode references

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: {
    street, city, state, pincode,
    country: String (default: India)
  },
  isActive: Boolean,
  timestamps: true
}
```

### Admin
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  role: String (enum: admin, superadmin),
  timestamps: true
}
```

### Product
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: String (enum),
  image: String,
  stock: Number,
  isAvailable: Boolean,
  features: Map,
  specifications: Map,
  timestamps: true
}
```

### Order
```javascript
{
  orderId: String (unique),
  customerInfo: {
    name, email, phone,
    address: { street, city, state, pincode, country }
  },
  items: [{
    product: ObjectId (ref: Product),
    name, quantity, price
  }],
  totalAmount: Number,
  paymentInfo: {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    paymentStatus: enum
  },
  orderStatus: enum,
  timestamps: true
}
```

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `RAZORPAY_KEY_ID` - Razorpay API key
- `RAZORPAY_KEY_SECRET` - Razorpay secret key
- `CLIENT_URL` - Frontend URL for CORS

### Frontend (.env)
- `VITE_API_URL` - Backend API URL
- `VITE_RAZORPAY_KEY_ID` - Razorpay key for checkout

## Security Notes

1. **Never commit `.env` files** - They contain sensitive credentials
2. **Use strong JWT secrets** - Generate random strings for production
3. **Protect admin routes** - Remove public registration in production
4. **Enable HTTPS** - Always use HTTPS in production
5. **Validate inputs** - Add additional validation for user inputs
6. **Rate limiting** - Implement rate limiting for API endpoints
7. **Secure MongoDB** - Use authentication and network security

## Production Deployment

### Backend Deployment (e.g., Heroku, Railway, Render)
1. Set environment variables in hosting platform
2. Update `CLIENT_URL` to production frontend URL
3. Use production MongoDB URI (MongoDB Atlas recommended)
4. Remove or protect admin registration endpoint

### Frontend Deployment (e.g., Vercel, Netlify)
1. Set `VITE_API_URL` to production backend URL
2. Set `VITE_RAZORPAY_KEY_ID` to production key
3. Build the project: `npm run build`
4. Deploy the `dist` folder

## Troubleshooting

### Backend Issues
- **MongoDB connection failed**: Check if MongoDB is running and URI is correct
- **Authentication errors**: Verify JWT_SECRET is set
- **CORS errors**: Ensure CLIENT_URL matches frontend URL

### Frontend Issues
- **API calls failing**: Verify VITE_API_URL is correct
- **Payment not working**: Check VITE_RAZORPAY_KEY_ID
- **Cart not persisting**: Check browser localStorage

### Common Errors
- **Port already in use**: Change PORT in `.env` or kill the process
- **Module not found**: Run `npm install` in respective directory
- **Payment verification failed**: Verify Razorpay keys match between frontend and backend

## Future Enhancements

- [ ] User authentication for customers
- [ ] Order tracking for customers
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Advanced search and filters
- [ ] Wishlist functionality
- [ ] Multiple payment options
- [ ] Admin analytics dashboard
- [ ] Image upload for products
- [ ] Export orders to CSV/PDF

## Support

For issues or questions:
- Create an issue in the repository
- Contact: shivam062.soi@gmail.com

