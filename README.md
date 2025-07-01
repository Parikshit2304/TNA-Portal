# Employee Training Portal

A comprehensive web application for managing training needs analysis (TNA) across organizations. This portal enables employees to submit training requests, managers to create surveys, and administrators to analyze training data with powerful reporting capabilities.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization** - Role-based access control (Admin, Manager, Employee)
- **Dynamic Survey Creation** - Customizable survey templates with multiple question types
- **Training Needs Collection** - Streamlined data submission process
- **Real-time Analytics** - Interactive dashboards with data visualization
- **Advanced Reporting** - Comprehensive reports with filtering and segmentation
- **User Management** - Profile management and user administration

### Survey Features
- Multiple question types (Text, Multiple Choice, Rating, Date, etc.)
- Required/optional field configuration
- Drag-and-drop question ordering
- Survey status management (Draft, Active, Completed, Archived)
- Response tracking and analytics

### Analytics & Reporting
- Training needs analysis by department, skill, and priority
- Completion rate tracking
- Trend analysis with historical data
- Export capabilities for reports
- Interactive charts and visualizations

### User Experience
- Modern, responsive design
- Intuitive navigation with sidebar layout
- Real-time updates and notifications
- Mobile-optimized interface
- Smooth animations and micro-interactions

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Recharts** - Data visualization and charts
- **React Router** - Client-side routing
- **React Hook Form** - Form handling and validation
- **Lucide React** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe server development
- **Prisma** - Modern database toolkit and ORM
- **SQLite** - Lightweight database (easily configurable for PostgreSQL/MySQL)
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing

### Development Tools
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and quality
- **Concurrently** - Run multiple commands simultaneously
- **tsx** - TypeScript execution for Node.js

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd training-portal
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# (Optional) Open Prisma Studio to view database
npm run db:studio
```

### 4. Environment Configuration
Create a `.env` file in the root directory:
```env
# Database
DATABASE_URL="file:./dev.db"

# JWT Secret (change in production)
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# Server Configuration
PORT=3001
NODE_ENV=development
```

### 5. Start the Application
```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
npm run client  # Frontend only (port 5173)
npm run server  # Backend only (port 3001)
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Database Studio**: http://localhost:5555 (when running `npm run db:studio`)

## 📁 Project Structure

```
training-portal/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── dev.db                 # SQLite database file
├── server/
│   ├── routes/
│   │   ├── auth.ts           # Authentication routes
│   │   ├── users.ts          # User management routes
│   │   ├── surveys.ts        # Survey CRUD operations
│   │   └── analytics.ts      # Analytics and reporting
│   ├── middleware/
│   │   └── auth.ts           # Authentication middleware
│   └── index.ts              # Express server setup
├── src/
│   ├── components/
│   │   ├── Layout.tsx        # Main application layout
│   │   └── ProtectedRoute.tsx # Route protection
│   ├── contexts/
│   │   └── AuthContext.tsx   # Authentication context
│   ├── pages/
│   │   ├── Dashboard.tsx     # Main dashboard
│   │   ├── LoginPage.tsx     # User authentication
│   │   ├── RegisterPage.tsx  # User registration
│   │   ├── SurveyList.tsx    # Survey management
│   │   ├── SurveyDetail.tsx  # Survey details and analytics
│   │   ├── CreateSurvey.tsx  # Survey creation
│   │   ├── Reports.tsx       # Analytics and reporting
│   │   └── Profile.tsx       # User profile management
│   ├── App.tsx               # Main application component
│   └── main.tsx              # Application entry point
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## 🔐 Authentication & Authorization

The application implements a three-tier role system:

### Roles
- **Employee** - Can view and respond to surveys, manage personal profile
- **Manager** - Employee permissions + create surveys, view department reports
- **Admin** - Full system access including user management and system analytics

### Default Users
After setting up the database, you can create users through the registration page. The first registered user can be manually promoted to Admin role through the database.

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update user profile

### Surveys
- `GET /api/surveys` - Get all surveys
- `POST /api/surveys` - Create new survey
- `GET /api/surveys/:id` - Get survey details
- `POST /api/surveys/:id/responses` - Submit survey response
- `GET /api/surveys/:id/responses` - Get survey responses

### Analytics
- `GET /api/analytics/dashboard` - Dashboard statistics
- `GET /api/analytics/training-needs` - Training needs analysis

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6) - Main actions and navigation
- **Secondary**: Indigo (#8B5CF6) - Secondary actions and accents
- **Accent**: Teal (#14B8A6) - Success states and highlights
- **Warning**: Amber (#F59E0B) - Warning states
- **Error**: Red (#EF4444) - Error states and validation
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Headings**: Bold weights (600-700) with proper hierarchy
- **Body**: Regular weight (400) with 150% line height
- **UI Elements**: Medium weight (500) for buttons and labels

### Spacing
- Consistent 8px grid system
- Generous white space for improved readability
- Proper component spacing and alignment

## 🚀 Deployment

### Production Build
```bash
# Build the frontend
npm run build

# The built files will be in the `dist` directory
```

### Environment Variables for Production
```env
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-secure-production-jwt-secret"
NODE_ENV=production
PORT=3001
```

### Deployment Options
- **Frontend**: Vercel, Netlify, or any static hosting service
- **Backend**: Railway, Heroku, DigitalOcean, or any Node.js hosting
- **Database**: PostgreSQL on Railway, Supabase, or PlanetScale

## 🧪 Development

### Available Scripts
```bash
npm run dev          # Start both frontend and backend
npm run client       # Start frontend development server
npm run server       # Start backend development server
npm run build        # Build frontend for production
npm run lint         # Run ESLint
npm run preview      # Preview production build
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
```

### Database Management
```bash
# Reset database
npx prisma db push --force-reset

# View database in browser
npx prisma studio

# Generate new migration
npx prisma migrate dev --name migration-name
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use meaningful component and variable names
- Implement proper error handling
- Add comments for complex logic
- Ensure responsive design compatibility
- Test thoroughly before submitting

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check existing documentation
- Review the codebase for implementation examples

## 🔮 Future Enhancements

- **Email Notifications** - Automated survey reminders and notifications
- **Advanced Analytics** - Machine learning insights and predictions
- **Integration APIs** - Connect with HR systems and learning platforms
- **Mobile App** - Native mobile application for iOS and Android
- **Multi-language Support** - Internationalization and localization
- **Advanced Permissions** - Granular role-based access control
- **Audit Logging** - Comprehensive activity tracking and logs
- **Data Export** - Advanced export options (PDF, Excel, CSV)

---

Built with ❤️ using modern web technologies for scalable enterprise training management.