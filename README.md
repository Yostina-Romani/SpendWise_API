💰 SpendWise

Personal Finance Management Platform

SpendWise is a modern personal finance management platform designed to help users manage their income, expenses, budgets, and financial activities through a simple and responsive web interface.

The project is built using ASP.NET Core Web API on the backend with Entity Framework Core and SQL Server, combined with a responsive HTML, CSS, JavaScript, and Bootstrap frontend.

---

🌐 Live Demo

SpendWise:
https://spendwisly.runasp.net/HTML/home.html

---

✨ Features

🔐 Authentication & Security

- User Registration
- User Login
- JWT Authentication
- Role-Based Authorization
- Google Sign-In
- Forgot Password
- Password Reset
- Secure password management using ASP.NET Core Identity
- Protected API endpoints
- User-specific financial data

📊 User Dashboard

Users can monitor their financial information from a centralized dashboard, including:

- Total Income
- Total Expenses
- Current Balance
- Monthly Budget
- Budget status
- Recent financial activities
- Quick actions for common operations

💵 Income Management

Users can:

- Add income
- Store income amount and date
- Associate income with the authenticated user
- View income information through the dashboard

💸 Expense Management

Users can:

- Add expenses
- Track spending
- Organize expenses using categories
- Monitor total expenses
- View financial activity

🎯 Budget Management

Users can:

- Create monthly budgets
- Edit budgets
- Delete budgets
- Select a specific month and year
- Track spending against their budget
- Receive budget status information

🏷️ Categories

SpendWise supports organizing financial activities using categories such as:

- Food
- Drinks
- Sports
- Cinema
- Shopping
- Education
- Transportation
- Other

Categories can be managed and organized through the application's administrative functionality.

👤 Profile Management

Users can manage their personal profile, including:

- Name
- Email
- Phone number
- Profile picture
- Monthly income
- Monthly budget
- Account security
- Logout

🛠️ Admin Dashboard

Administrators have access to additional administrative functionality.

The Admin Dashboard is protected using role-based authorization and is available only to users with the Admin role.

🌙 Dark Mode

SpendWise includes a modern Dark Mode that allows users to switch between light and dark themes.

The selected theme is saved locally so the preference can be maintained between sessions.

📱 Responsive Design

The frontend is designed to work across different screen sizes, including:

- Desktop
- Laptop
- Tablet
- Mobile

---

🏗️ Architecture

SpendWise follows a layered architecture that separates responsibilities between different parts of the backend.

Frontend
   │
   ▼
Controllers
   │
   ▼
Services
   │
   ▼
Repositories
   │
   ▼
Entity Framework Core
   │
   ▼
SQL Server

Request Flow

For example, when a user adds an income:

User
 ↓
Frontend
 ↓
Income API Controller
 ↓
Income Service
 ↓
Income Repository
 ↓
Entity Framework Core
 ↓
SQL Server

This structure helps keep the application organized and makes the code easier to maintain and extend.

---

🔑 Authentication Flow

SpendWise uses JWT Bearer Authentication to secure API requests.

User Login
    ↓
ASP.NET Core Identity
    ↓
JWT Token Generated
    ↓
Token Stored on Client
    ↓
Token Sent with API Requests
    ↓
JWT Authentication Middleware
    ↓
Authorized Controller

Protected requests include the JWT token in the HTTP Authorization header:

Authorization: Bearer <token>

The backend uses the authenticated user's identity to make sure financial data belongs to the correct user.

---

🔄 Password Recovery

SpendWise provides a password recovery flow for users who forget their passwords.

The general flow is:

Forgot Password
       ↓
Enter Email
       ↓
Password Reset Request
       ↓
Reset Link / Token
       ↓
Create New Password
       ↓
Password Updated

This allows users to regain access to their accounts without needing administrator intervention.

---

🛡️ Security

The project uses several security mechanisms, including:

- ASP.NET Core Identity
- JWT Bearer Authentication
- Role-Based Authorization
- Password hashing through Identity
- Authenticated API requests
- User-specific data access
- Protected administrative endpoints
- Validation of user input
- CORS configuration
- Secure authentication middleware

Administrative functionality is protected using role-based authorization.

For example:

[Authorize(Roles = "Admin")]

---

🧰 Tech Stack

Backend

Technology| Purpose
C#| Main programming language
ASP.NET Core 8| Web API framework
Entity Framework Core| ORM / Data Access
SQL Server| Database
ASP.NET Core Identity| Authentication & User Management
JWT| API Authentication
Google Authentication| Social Login
REST API| Communication between frontend and backend

Frontend

Technology| Purpose
HTML5| Page structure
CSS3| Styling
JavaScript| Frontend logic & API integration
Bootstrap 5.3.3| Responsive UI
Bootstrap Icons| Interface icons

Development Tools

- Visual Studio
- Visual Studio Code
- Git
- GitHub
- SQL Server
- SQL Server LocalDB
- Swagger for API development and testing

Deployment

- RunASP.net

---

📂 Project Structure

A simplified structure of the project:

SpendWise
│
├── Controllers
│   ├── AuthController.cs
│   ├── IncomeController.cs
│   ├── BudgetController.cs
│   ├── ProfileController.cs
│   └── ...
│
├── Services
│   ├── Interfaces
│   └── Implementations
│
├── Repositories
│   ├── Interfaces
│   └── Implementations
│
├── Models
│
├── DTOS
│
├── Data
│   └── ApplicationDbContext.cs
│
├── Migrations
│
├── Images
│
├── Program.cs
│
└── appsettings.json

The frontend contains separate files for:

Frontend
│
├── HTML
│   ├── Home.html
│   ├── Login.html
│   ├── Register.html
│   ├── Profile.html
│   ├── UserDashboard.html
│   ├── AdminDashboard.html
│   └── ...
│
├── CSS
│
├── JS
│   ├── config.js
│   ├── profile.js
│   ├── income.js
│   ├── budget.js
│   └── ...
│
└── Images

---

🗄️ Database

SpendWise uses SQL Server with Entity Framework Core.

The database stores application data related to:

- Users
- Roles
- Income
- Expenses
- Budgets
- Categories
- User financial information
- Profile information

Entity Framework Core is used to communicate with the database and manage migrations.

---

🔗 API Integration

The frontend communicates with the ASP.NET Core Web API using JavaScript "fetch()" requests.

Example:

const response = await fetch(API_URL, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data)
});

This allows the frontend to communicate with protected backend endpoints while passing the authenticated user's JWT token.

---

⚙️ Running the Project Locally

1. Clone the Repository

git clone https://github.com/Yostina-Romani/SpendWIse_api_project.git

2. Navigate to the Project

cd SpendWIse_api_project

3. Restore Dependencies

dotnet restore

4. Configure the Database

Update the connection string in:

appsettings.json

Example:

{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=SpendWiseDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}

5. Apply Database Migrations

dotnet ef database update

6. Build the Project

dotnet build

7. Run the API

dotnet run

The API will start locally according to the configured application URL.

8. Run the Frontend

Open the frontend using a local development server such as:

- Visual Studio Code Live Server
- Another local HTTP server

Then open the appropriate HTML page from the "HTML" folder.

---

🖼️ Screenshots

🏠 Home Page

Add your homepage screenshot here:

![SpendWise Home Page](screenshots/home.png)

📊 User Dashboard

![SpendWise Dashboard](screenshots/dashboard.png)

👤 Profile

![SpendWise Profile](screenshots/profile.png)

🔐 Login

![SpendWise Login](screenshots/login.png)

«You can replace these placeholders with your actual screenshots after adding them to a "screenshots" folder in the repository.»

---

🚀 Future Improvements

Planned improvements may include:

- Advanced financial analytics
- Interactive charts
- Monthly and yearly reports
- Export financial reports
- More detailed spending insights
- Recurring transactions
- Notifications and reminders
- Improved admin management
- Automated testing
- Docker support
- CI/CD pipeline
- Improved production monitoring
- More advanced financial recommendations

---

🎯 Project Goals

SpendWise was developed to provide a practical financial management experience while applying real-world software development concepts.

The project focuses on:

- RESTful API development
- Authentication and authorization
- Layered architecture
- Repository and service patterns
- Entity Framework Core
- SQL Server database management
- Frontend and backend integration
- Secure API communication
- Responsive UI development
- Role-based access control
- Deployment of a full-stack application

---

👩‍💻 Developer

Yostina Romani

Computer Science Student at the Faculty of Computers & Information, Assiut University.

Interested in:

- .NET Backend Development
- Full-Stack Development
- ASP.NET Core
- Web API Development
- Database Design
- Software Engineering

Profiles

GitHub:
https://github.com/Yostina-Romani

LinkedIn:
https://linkedin.com/in/yostina-romani-9100a737a

Portfolio:
https://yostina-romani.github.io/portfolio/

---

📄 License

This project is developed for educational, portfolio, and software development purposes.

---

⭐ Support

If you find this project useful or interesting, consider giving the repository a ⭐ on GitHub.
