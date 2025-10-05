# PTFD - Project Timeline and Financial Dashboard

Project Timeline and Financial Dashboard (PTFD) is a comprehensive module for managing construction project timelines, tracking financial data, and providing visualization tools for better project oversight.

## Features

### Project Management
- Create, view, update, and delete construction projects
- Track project details including budget, timeline, and status
- Manage project resources and team assignments

### Timeline Management
- Create detailed project timelines with milestones
- Track daily progress and activities
- Visualize project progression with interactive charts

### Financial Dashboard
- Monitor project costs and budget utilization
- Track expenses across different categories (labor, materials, equipment)
- Generate financial reports and insights

### Project Timeline Details
- Comprehensive view of project activities
- Resource allocation tracking
- Daily expense and material tracking

### Chatbot Assistant
- AI-powered assistant for project queries
- Natural language processing for quick information retrieval
- 24/7 availability for project-related questions

## Technology Stack

### Frontend
- **React.js** - JavaScript library for building user interfaces
- **React Router** - Declarative routing for React applications
- **Bootstrap** - Frontend component library for responsive design
- **Chart.js & Recharts** - Data visualization libraries
- **Axios** - Promise-based HTTP client for API requests

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework for Node.js
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - MongoDB object modeling tool
- **JWT** - JSON Web Token for authentication
- **Multer** - Middleware for handling file uploads
- **Nodemailer** - Module for sending emails
- **Twilio** - Communication APIs for SMS and voice

## Project Structure

```
PTFD/
├── Backend/
│   ├── Controllers/     - Business logic for each entity
│   ├── Middleware/      - Custom middleware functions
│   ├── Model/           - Database models and schemas
│   ├── Route/           - API route definitions
│   ├── uploads/         - Uploaded files storage
│   └── app.js           - Main application entry point
├── frontend/
│   ├── public/          - Static assets
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Auth/              - Authentication components
│   │   │   ├── ChatBot/           - Chatbot assistant components
│   │   │   ├── FinancialDashboard/ - Financial dashboard components
│   │   │   ├── Home/              - Homepage components
│   │   │   ├── Nav/               - Navigation components
│   │   │   ├── Profile/           - User profile components
│   │   │   ├── ProjectTimeline/   - Project timeline components
│   │   │   ├── Projects/          - Project management components
│   │   │   ├── Timelines/         - Timeline management components
│   │   │   └── UserProfile/       - User profile management
│   │   ├── App.js                 - Main application component
│   │   └── index.js               - Entry point
│   └── package.json               - Frontend dependencies
├── package.json                   - Backend dependencies
└── README.md                      - This file
```

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```

2. Navigate to the PTFD module directory:
   ```bash
   cd SCWMS/PTFD
   ```

3. Install backend dependencies:
   ```bash
   cd Backend
   npm install
   ```

4. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

## Configuration

### Environment Variables

Create a `.env` file in the Backend directory with the following variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
```

## Running the Application

### Backend Server

1. Navigate to the Backend directory:
   ```bash
   cd PTFD/Backend
   ```

2. Start the server:
   ```bash
   npm start
   ```
   
   The backend server will run on port 5050.

### Frontend Server

1. Navigate to the frontend directory:
   ```bash
   cd PTFD/frontend
   ```

2. Start the development server:
   ```bash
   npm start
   ```
   
   The frontend will run on port 3000 by default.

## API Endpoints

### Projects
- `GET /projects` - Get all projects
- `POST /projects` - Create a new project
- `GET /projects/:id` - Get a specific project
- `PUT /projects/:id` - Update a project
- `DELETE /projects/:id` - Delete a project

### Timelines
- `GET /timelines` - Get all timelines
- `POST /timelines` - Create a new timeline
- `GET /timelines/:id` - Get a specific timeline
- `PUT /timelines/:id` - Update a timeline
- `DELETE /timelines/:id` - Delete a timeline

### Project Timelines
- `GET /project-timelines` - Get all project timelines
- `POST /project-timelines` - Create a new project timeline
- `GET /project-timelines/:id` - Get a specific project timeline
- `PUT /project-timelines/:id` - Update a project timeline
- `DELETE /project-timelines/:id` - Delete a project timeline

### Financial Dashboard
- `GET /financial-dashboard` - Get financial dashboard data
- `POST /financial-dashboard` - Create financial dashboard entry
- `GET /financial-dashboard/:id` - Get specific financial dashboard data
- `PUT /financial-dashboard/:id` - Update financial dashboard data
- `DELETE /financial-dashboard/:id` - Delete financial dashboard entry

## Key Components

### Projects
Manage construction projects with details like:
- Project name and description
- Budget allocation
- Timeline and milestones
- Team assignments
- Status tracking

### Timelines
Track project progress with:
- Daily activity logs
- Resource utilization
- Milestone tracking
- Progress visualization

### Financial Dashboard
Monitor financial aspects:
- Budget vs. actual costs
- Expense categorization
- Financial forecasting
- Cost analysis reports

### Project Timeline Details
Detailed tracking of:
- Labor hours and costs
- Material usage and expenses
- Equipment utilization
- Daily notes and observations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact the PTFD development team.