# 🔥 Iron Pulse — AI-Powered Fitness Companion

**B.Tech Final Year Project**

Iron Pulse is a full-stack fitness application that helps users track workouts, monitor nutrition, get personalized exercise plans, and maintain workout streaks — all through a premium dark-themed interface.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, Vanilla CSS, React Router v6, Recharts |
| **Backend** | Python, FastAPI, Pydantic |
| **Database** | MongoDB (async via Motor) |
| **Auth** | JWT (python-jose), bcrypt (passlib) |
| **ML Ready** | MediaPipe posture detection (webcam), Scikit-learn (workout recommendations) |

---

## 📦 Project Structure

```
Iron-Pulse/
├── frontend/               # React + Vite
│   ├── src/
│   │   ├── api/auth.js     # API helpers (auth, workouts, meals)
│   │   ├── context/        # AuthContext (JWT state management)
│   │   ├── components/     # Navbar, Layout, ProtectedRoute
│   │   └── pages/          # Landing, Login, Signup, Dashboard,
│   │                       # Workout, FoodPlan, Profile, NotFound
│   ├── index.html
│   └── package.json
│
├── backend/                # FastAPI
│   ├── routes/
│   │   ├── auth.py         # Signup, Login, Profile, Dashboard
│   │   ├── workouts.py     # Log, List, Generate Plan
│   │   └── meals.py        # Search, Log, List, Summary
│   ├── models/schemas.py   # Pydantic models
│   ├── utils/              # JWT + bcrypt helpers
│   ├── database.py         # MongoDB connection
│   ├── config.py           # Environment config
│   ├── main.py             # FastAPI app entry
│   └── requirements.txt
│
└── README.md
```
### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173/** in your browser.

---

## 🔗 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/signup` | Register new user |
| POST | `/api/login` | Login → JWT token |
| GET | `/api/profile` | Get user profile + streak |
| GET | `/api/dashboard` | Weekly stats, charts data |

### Workouts
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/workouts` | Log a workout |
| GET | `/api/workouts` | List user workouts |
| POST | `/api/workouts/plan` | Generate personalized plan |

### Meals
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/foods/search?q=` | Search food database |
| POST | `/api/meals` | Log a meal |
| GET | `/api/meals` | List today's meals |
| GET | `/api/meals/summary` | Daily macro summary |

---

## ✨ Features

- **🔐 Secure Authentication** — bcrypt password hashing + JWT tokens
- **📊 Live Dashboard** — real-time stat cards, bar chart (workouts), line chart (macros)
- **💪 Smart Workout Plans** — personalized exercises based on goal (4 databases: Lose Weight, Build Muscle, Stay Fit, Gain Weight)
- **📷 Live Posture Check** — webcam feed with MediaPipe integration hooks
- **🍽️ Food Tracking** — search 20+ foods, one-click logging, macro progress bars
- **🔥 Streak System** — consecutive workout day tracking
- **🌙 Premium Dark Theme** — glassmorphism, emerald accents, micro-animations

---

## 📄 License

This project was created as a B.Tech final year submission.
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

create plan update 
    remove unnassary option option in equipment and add gym plan

Add option to add his workout
    
goal
    1.Fat Loss
    2.Muscle Gain
    3.Strength    
    4.Endurance
    5.General Fitness

new options 

Gender
Type: Dropdown

Options: Male, Female.

Fitness Level / Experience
Type: Dropdown
Options:
Beginner
Intermediate
Advanced


workout days per week 
 selectiable only one
  1,2,3,4,5,6,7.
  
Workout Duration
Type: selectiable (only one option can be selected)
Options:
20 minutes
30 minutes
45 minutes
60 minutes
90 minutes
120 minutes

profile update 
    1.replace logout options inside profile
    2.remove streak option

create food plan
take data from user
    1.age 
    2.gender
        1.Male
        2.Female
    3.height
    4.weight
    5.goal
    drop down
        1.Fat Loss
        2.Muscle Gain
    6.Mealtype
    drop down
        1.Breakfast
        2.Lunch
        3.Dinner 
    7.veg/nonveg
   type dropdown
        1.veg
        2.nonveg       
        

LOGIN PAGE: 
ADDING FORGOT PASSWORD

ADDING  :
LOGIN WITH GOOGLE
LOGIN WITH APPLE

Password validation(rules for a password)

Remove height , age and weight from signup page

new PAGE 
  BMI calculater
    1.age
    2.gender
    3.height
    4.weight
