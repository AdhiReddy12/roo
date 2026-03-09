from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Header
from bson import ObjectId

from database import workouts_collection
from models.schemas import WorkoutLog
from routes.auth import get_current_user

router = APIRouter(prefix="/api", tags=["workouts"])


@router.post("/workouts")
async def log_workout(workout: WorkoutLog, authorization: str = Header(...)):
    """Log a completed workout."""
    user = await get_current_user(authorization)
    user_id = str(user["_id"])

    doc = {
        "user_id": user_id,
        "workout_name": workout.workout_name,
        "duration": workout.duration,
        "calories_burned": workout.calories_burned,
        "date": workout.date or datetime.now(timezone.utc).date().isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    result = await workouts_collection.insert_one(doc)
    return {"message": "Workout logged!", "id": str(result.inserted_id)}


@router.get("/workouts")
async def get_workouts(authorization: str = Header(...)):
    """Get all workouts for the current user (most recent first, limit 50)."""
    user = await get_current_user(authorization)
    user_id = str(user["_id"])

    cursor = workouts_collection.find({"user_id": user_id}).sort("date", -1).limit(50)
    workouts = await cursor.to_list(length=50)

    result = []
    for w in workouts:
        result.append({
            "id": str(w["_id"]),
            "workout_name": w["workout_name"],
            "duration": w["duration"],
            "calories_burned": w["calories_burned"],
            "date": w["date"],
        })
    return result


# ---- Suggested Workout Plans ----
# These are rule-based plans generated from user profile.
# In Phase 2, this replaces the ML model placeholder.

EXERCISE_DB = {
    "lose_weight": [
        {"name": "Jumping Jacks", "duration": 10, "calories": 100, "type": "Cardio"},
        {"name": "Burpees", "duration": 10, "calories": 120, "type": "HIIT"},
        {"name": "Mountain Climbers", "duration": 8, "calories": 90, "type": "Cardio"},
        {"name": "High Knees", "duration": 10, "calories": 110, "type": "Cardio"},
        {"name": "Jump Rope", "duration": 15, "calories": 150, "type": "Cardio"},
        {"name": "Cycling", "duration": 20, "calories": 180, "type": "Cardio"},
    ],
    "build_muscle": [
        {"name": "Push-ups", "duration": 10, "calories": 80, "type": "Strength"},
        {"name": "Pull-ups", "duration": 10, "calories": 90, "type": "Strength"},
        {"name": "Squats", "duration": 12, "calories": 100, "type": "Strength"},
        {"name": "Lunges", "duration": 10, "calories": 85, "type": "Strength"},
        {"name": "Plank", "duration": 5, "calories": 40, "type": "Core"},
        {"name": "Dumbbell Curls", "duration": 10, "calories": 70, "type": "Strength"},
        {"name": "Bench Press", "duration": 12, "calories": 110, "type": "Strength"},
        {"name": "Deadlifts", "duration": 12, "calories": 120, "type": "Strength"},
    ],
    "stay_fit": [
        {"name": "Yoga Flow", "duration": 20, "calories": 100, "type": "Flexibility"},
        {"name": "Brisk Walk", "duration": 30, "calories": 150, "type": "Cardio"},
        {"name": "Push-ups", "duration": 8, "calories": 60, "type": "Strength"},
        {"name": "Squats", "duration": 10, "calories": 80, "type": "Strength"},
        {"name": "Stretching", "duration": 15, "calories": 50, "type": "Flexibility"},
        {"name": "Swimming", "duration": 20, "calories": 200, "type": "Cardio"},
    ],
    "gain_weight": [
        {"name": "Bench Press", "duration": 15, "calories": 130, "type": "Strength"},
        {"name": "Squats", "duration": 15, "calories": 120, "type": "Strength"},
        {"name": "Deadlifts", "duration": 15, "calories": 140, "type": "Strength"},
        {"name": "Overhead Press", "duration": 12, "calories": 100, "type": "Strength"},
        {"name": "Barbell Rows", "duration": 12, "calories": 110, "type": "Strength"},
        {"name": "Dumbbell Curls", "duration": 10, "calories": 70, "type": "Strength"},
        {"name": "Tricep Dips", "duration": 10, "calories": 80, "type": "Strength"},
    ],
}


def generate_plan(goal: str, weight: float):
    """Generate a workout plan based on user's goal and weight."""
    exercises = EXERCISE_DB.get(goal, EXERCISE_DB["stay_fit"])

    # Scale calories by weight ratio (baseline 70kg)
    weight_factor = weight / 70.0

    plan = []
    total_duration = 0
    total_calories = 0

    for ex in exercises:
        adjusted_cal = round(ex["calories"] * weight_factor)
        plan.append({
            "name": ex["name"],
            "duration": ex["duration"],
            "calories": adjusted_cal,
            "type": ex["type"],
        })
        total_duration += ex["duration"]
        total_calories += adjusted_cal

    return {
        "exercises": plan,
        "total_duration": total_duration,
        "total_calories": total_calories,
        "goal": goal,
    }


@router.post("/workouts/plan")
async def create_workout_plan(authorization: str = Header(...)):
    """Generate a personalized workout plan from user's goal and stats."""
    user = await get_current_user(authorization)
    goal = user.get("goal", "stay_fit")
    weight = user.get("weight", 70)

    plan = generate_plan(goal, weight)
    return plan
