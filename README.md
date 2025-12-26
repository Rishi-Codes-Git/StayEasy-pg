# StayEasy - PG & Hostel Booking Platform

A full-stack web application for browsing, booking, and managing PG accommodations and hostels. Built with the MERN stack and deployed on Vercel (frontend) and Render (backend).

## 🌐 Live Demo

- **Frontend:** [https://stay-easy-pg.vercel.app](https://stay-easy-pg.vercel.app)
- **Backend API:** [https://stayeasy-api-twk2.onrender.com](https://stayeasy-api-twk2.onrender.com)

## ✨ Features

### User Features

- 🔍 Browse and search available hostels
- 🖼️ View detailed hostel information with image galleries
- 📱 Responsive design for mobile and desktop
- 👤 User authentication (signup/login with JWT)
- 📝 Update user profile
- 📧 Contact hostel owners directly
- 🏠 Advanced filtering by location, price, and amenities

### Owner Features

- ➕ Create and manage hostel listings
- ✏️ Edit hostel details and images
- 🗑️ Delete hostel listings
- 📊 Owner dashboard to view all listings
- 📸 Multi-image upload with Cloudinary integration

### Admin Features

- 👥 Manage all users and hostels
- 📈 Admin dashboard with complete oversight
- 🔐 Role-based access control

## 🛠️ Tech Stack

### Frontend

- **React** 18.3.1 - UI framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **React Image Gallery** - Image carousel component
- **CSS3** - Custom styling

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (MongoDB Atlas)
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Cloudinary** - Image storage and CDN
- **Multer** - File upload handling
- **Helmet** - Security headers
- **Express Rate Limit** - API rate limiting

### Deployment

- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Database hosting
- **Cloudinary** - Image CDN

## 🚀 Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Cloudinary account

### Clone the Repository

```bash
git clone https://github.com/Rishi-Codes-Git/StayEasy-pg.git
cd stay-easy-pg
```

### Backend Setup

```bash
cd stayeasy-backend
npm install
```

Create a `.env` file in `stayeasy-backend/`:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend server:

```bash
npm start
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd stayeasy-frontend
npm install
```

Create a `.env` file in `stayeasy-frontend/`:

```env
REACT_APP_API_URL=http://localhost:5000
```

Start the frontend development server:

```bash
npm start
```

Frontend runs on `http://localhost:3000`

## 📁 Project Structure

```
stay-easy-pg/
├── stayeasy-backend/
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Auth & validation middleware
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── utils/             # Helper functions
│   ├── server.js          # Entry point
│   └── package.json
│
├── stayeasy-frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── config.js      # API configuration
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json
│
└── README.md
```

## 🔐 Environment Variables

### Backend (.env)

| Variable                | Description               |
| ----------------------- | ------------------------- |
| `MONGO_URI`             | MongoDB connection string |
| `JWT_SECRET`            | Secret key for JWT tokens |
| `FRONTEND_URL`          | Frontend URL for CORS     |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name     |
| `CLOUDINARY_API_KEY`    | Cloudinary API key        |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret     |

### Frontend (.env)

| Variable            | Description     |
| ------------------- | --------------- |
| `REACT_APP_API_URL` | Backend API URL |

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password encryption
- **Rate Limiting** - Protection against brute force attacks
- **Input Validation** - express-validator for data sanitization
- **Helmet.js** - Security headers
- **CORS** - Configured for specific origins
- **Role-Based Access Control** - Separate permissions for users, owners, and admins

## 📸 Features in Detail

### Image Management

- **Multi-image upload** with drag-and-drop support
- **Cloudinary integration** for persistent cloud storage
- **Image optimization** and CDN delivery
- **Responsive image galleries** with thumbnails

### Authentication System

- User registration with validation
- Secure login with JWT tokens
- Separate owner and admin registration
- Token refresh mechanism
- Protected routes

### Hostel Management

- Create hostels with detailed information
- Upload multiple images per hostel
- Edit hostel details and images
- Delete hostel listings
- Filter by price, location, amenities
- Real-time search functionality

## 🌟 Deployment

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd stayeasy-frontend
vercel --prod
```

### Backend (Render)

1. Connect GitHub repository to Render
2. Set environment variables in Render dashboard
3. Deploy automatically on git push

## 📝 API Endpoints

### Authentication

- `POST /api/signup` - User registration
- `POST /api/login` - User login
- `POST /api/owner-signup` - Owner registration

### Hostels

- `GET /api/hostels` - Get all hostels
- `GET /api/hostels/:id` - Get hostel by ID
- `POST /api/hostels` - Create hostel (owner only)
- `PUT /api/hostels/:id` - Update hostel (owner only)
- `DELETE /api/hostels/:id` - Delete hostel (owner only)

### User

- `GET /api/dashboard` - Get user data
- `PUT /api/update-profile` - Update user profile

## 🐛 Known Issues & Solutions

- **Render Free Tier**: Backend may sleep after inactivity (15-30 second cold start)
- **Image Upload**: Requires Cloudinary configuration for persistent storage
- **CORS**: Ensure frontend URL is whitelisted in backend

## 🔮 Future Enhancements

- [ ] Payment integration for bookings
- [ ] Email notifications for booking confirmations
- [ ] Review and rating system
- [ ] Advanced search with filters
- [ ] Booking calendar with availability
- [ ] Chat system between users and owners
- [ ] Map integration for location
- [ ] Mobile app (React Native)

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Rishi**

- GitHub: [@Rishi-Codes-Git](https://github.com/Rishi-Codes-Git)

## 🙏 Acknowledgments

- MongoDB Atlas for database hosting
- Cloudinary for image storage
- Vercel for frontend hosting
- Render for backend hosting
- React community for excellent documentation

---

Made with ❤️ by Rishi

- Owner dashboard to add/manage hostels
- Secure login/signup with JWT

---

## 🧱 Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js + Express.js
- **Database:** MongoDB
- **Authentication:** JWT + bcrypt
