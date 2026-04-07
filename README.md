# MJ Electricals E-commerce Platform

A full-stack e-commerce platform for electrical products built with Node.js, Express, MongoDB, React, and Tailwind CSS.

## Features

### User Features
- Browse products without authentication
- Guest checkout support
- User registration and authentication
- Product search, filtering, and sorting
- Shopping cart with localStorage persistence
- Order tracking and history
- Newsletter subscription
- Contact form

### Admin Features
- Product management (CRUD operations)
- Order management and status updates
- Admin user management (Super Admin only)
- Audit logging for all admin actions
- Dashboard with statistics and alerts

### Security Features
- JWT authentication
- bcrypt password hashing (10 salt rounds)
- Per-user rate limiting (100 requests per 60 seconds)
- Upstash Redis for rate limiting
- Environment variable protection
- CORS configuration

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB Atlas (Database)
- Mongoose (ODM)
- JWT (Authentication)
- bcrypt (Password Hashing)
- Upstash Redis (Rate Limiting)

### Frontend
- React 18
- Vite (Build Tool)
- Tailwind CSS (Styling)
- React Router (Routing)
- Axios (HTTP Client)
- React Hot Toast (Notifications)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Upstash Redis account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ymikenzy55/MJ-Ecormerce-Project.git
   cd MJ-Ecormerce-Project
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   ```

   The `.env` file is already configured with your credentials. If you need to modify:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Secret key for JWT tokens
   - `UPSTASH_REDIS_REST_URL`: Your Upstash Redis URL
   - `UPSTASH_REDIS_REST_TOKEN`: Your Upstash Redis token
   - `PORT`: Server port (default: 5000)

3. **Frontend Setup**
   ```bash
   cd ../Frontend
   npm install
   ```

   The `.env` file is already configured. The API base URL is set to `http://localhost:5000`.

### Running the Application

1. **Create Super Admin (First Time Only)**
   ```bash
   cd Backend
   npm run setup-admin
   ```
   This creates the super admin account with credentials from `.env`:
   - Email: admin@mjelectricals.com
   - Password: SuperAdmin@2024

2. **Start Backend Server**
   ```bash
   cd Backend
   npm start
   ```
   Backend will run on http://localhost:5000

3. **Start Frontend Development Server**
   ```bash
   cd Frontend
   npm run dev
   ```
   Frontend will run on http://localhost:5173

4. **Access the Application**
   - User Site: http://localhost:5173
   - Admin Dashboard: http://localhost:5173/admin
   - API: http://localhost:5000/api

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/request-password-reset` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Products
- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get product by ID (public)
- `GET /api/products/search` - Search products (public)
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `POST /api/orders` - Create order (authenticated or guest)
- `GET /api/orders/:id` - Get order by ID (authenticated)
- `GET /api/orders/user/:userId` - Get user orders (authenticated)
- `GET /api/orders` - Get all orders (admin only)
- `PUT /api/orders/:id/status` - Update order status (admin only)

### Admin
- `POST /api/admin/add` - Add admin (super admin only)
- `DELETE /api/admin/:id` - Remove admin (super admin only)
- `PUT /api/admin/:id/role` - Update admin role (super admin only)
- `GET /api/admin/audit-logs` - Get audit logs (super admin only)

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter (public)
- `POST /api/newsletter/unsubscribe` - Unsubscribe (public)
- `GET /api/newsletter/subscribers` - Get subscribers (admin only)

### Contact
- `POST /api/contact` - Submit contact message (public)
- `GET /api/contact/messages` - Get messages (admin only)

## Testing with Postman

1. Import the API endpoints into Postman
2. For authenticated endpoints, add the JWT token to the Authorization header:
   ```
   Authorization: Bearer <your_jwt_token>
   ```
3. Test rate limiting by making more than 100 requests in 60 seconds

## Key Features

### Circular Preloader
- Shows only on first load of the website
- Uses localStorage to track if user has visited before
- Beautiful circular spinning animation
- Applies to both user and admin pages

### Redirect After Authentication
- When users click login/signup from any page, they're redirected back to that page after authentication
- Example: User on checkout page → clicks login → logs in → returns to checkout page
- Improves user experience and reduces friction

### Guest Checkout
- Users can purchase without creating an account
- Only requires shipping and billing information
- Order is associated with guest email

### Rate Limiting
- Per-user rate limiting (not global)
- 100 requests per 60 seconds per user
- Uses Upstash Redis for tracking
- Returns 429 status when limit exceeded

## Project Structure

```
MJ-Ecormerce-Project/
├── Backend/
│   ├── config/          # Database and Redis configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── scripts/         # Utility scripts
│   ├── services/        # Business logic services
│   ├── server.js        # Entry point
│   └── .env             # Environment variables
├── Frontend/
│   ├── src/
│   │   ├── api/         # API client configuration
│   │   ├── components/  # Reusable components
│   │   ├── context/     # React context providers
│   │   ├── pages/       # Page components
│   │   ├── utils/       # Utility functions
│   │   ├── App.jsx      # Main app component
│   │   └── main.jsx     # Entry point
│   └── .env             # Environment variables
└── README.md
```

## Security Notes

- Never commit `.env` files to version control
- Change default admin password after first login
- Use strong JWT secrets in production
- Configure MongoDB Atlas IP whitelist for production
- Use HTTPS in production
- Regularly update dependencies

## MongoDB Atlas IP Whitelist

To secure your database:
1. Go to MongoDB Atlas dashboard
2. Navigate to Network Access
3. Add your server's IP address
4. For development, you can use `0.0.0.0/0` (allow all), but restrict in production

## Upstash Redis Free Tier Limitations

The free tier includes:
- 10,000 commands per day
- 256 MB storage
- 1 database

**Potential Issues:**
- If you exceed 10,000 requests per day, rate limiting will fail
- Consider upgrading for production use
- Monitor usage in Upstash dashboard

## Contributing

This is a private project for MJ Electricals.

## License

Proprietary - All rights reserved
