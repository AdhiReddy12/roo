from pydantic import BaseModel, EmailStr
from typing import Optional


# ---------- Auth ----------
class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    height: float
    weight: float
    goal: str  # lose_weight, build_muscle, stay_fit, gain_weight


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    height: float
    weight: float
    goal: str
    current_streak: int
    created_at: str


class LoginResponse(BaseModel):
    token: str
    user: UserResponse


# ---------- Workouts ----------
class WorkoutLog(BaseModel):
    workout_name: str
    duration: int  # minutes
    calories_burned: int
    date: Optional[str] = None


# ---------- Meals ----------
class MealLog(BaseModel):
    food_name: str
    calories: int
    protein: float
    fats: float
    date: Optional[str] = None
