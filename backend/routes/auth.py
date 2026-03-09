from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, HTTPException, Header
from bson import ObjectId

from database import users_collection, workouts_collection, meals_collection
from models.schemas import SignupRequest, LoginRequest, LoginResponse, UserResponse
from utils.hashing import hash_password, verify_password
from utils.jwt_handler import create_token, decode_token

router = APIRouter(prefix="/api", tags=["auth"])


# -------- Helpers --------
async def get_current_user(authorization: str = Header(...)):
    """Extract and verify JWT from Authorization header."""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token = authorization.split(" ")[1]
    user_id = decode_token(token)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


def user_to_response(user: dict) -> UserResponse:
    return UserResponse(
        id=str(user["_id"]),
        name=user["name"],
        email=user["email"],
        height=user.get("height", 0),
        weight=user.get("weight", 0),
        goal=user.get("goal", ""),
        current_streak=user.get("current_streak", 0),
        created_at=user.get("created_at", ""),
    )


async def calculate_streak(user_id: str) -> int:
    """Calculate consecutive workout days ending at today or yesterday."""
    today = datetime.now(timezone.utc).date()
    streak = 0
    check_date = today

    for _ in range(365):  # max 1 year
        date_str = check_date.isoformat()
        workout = await workouts_collection.find_one({
            "user_id": user_id,
            "date": date_str,
        })
        if workout:
            streak += 1
            check_date -= timedelta(days=1)
        elif check_date == today:
            # Today hasn't been worked out yet, check from yesterday
            check_date -= timedelta(days=1)
        else:
            break

    return streak


# -------- Endpoints --------
@router.post("/signup")
async def signup(req: SignupRequest):
    # Check if email already exists
    existing = await users_collection.find_one({"email": req.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Validate password strength
    pw = req.password
    if len(pw) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters")
    if not any(c.isupper() for c in pw):
        raise HTTPException(status_code=400, detail="Password must contain an uppercase letter")
    if not any(c.isdigit() for c in pw):
        raise HTTPException(status_code=400, detail="Password must contain a number")
    if not any(c in '!@#$%^&*(),.?":{}|<>' for c in pw):
        raise HTTPException(status_code=400, detail="Password must contain a special character")

    user_doc = {
        "name": req.name,
        "email": req.email,
        "hashed_password": hash_password(req.password),
        "height": req.height,
        "weight": req.weight,
        "goal": req.goal,
        "current_streak": 0,
        "last_workout_date": None,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    result = await users_collection.insert_one(user_doc)
    return {"message": "Account created successfully", "id": str(result.inserted_id)}


@router.post("/login", response_model=LoginResponse)
async def login(req: LoginRequest):
    user = await users_collection.find_one({"email": req.email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    if not verify_password(req.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    # Update streak
    user_id = str(user["_id"])
    streak = await calculate_streak(user_id)
    await users_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"current_streak": streak}}
    )
    user["current_streak"] = streak

    token = create_token(user_id)
    return LoginResponse(
        token=token,
        user=user_to_response(user),
    )


@router.get("/profile", response_model=UserResponse)
async def get_profile(authorization: str = Header(...)):
    user = await get_current_user(authorization)
    user_id = str(user["_id"])

    # Recalculate streak
    streak = await calculate_streak(user_id)
    if streak != user.get("current_streak", 0):
        await users_collection.update_one(
            {"_id": user["_id"]},
            {"$set": {"current_streak": streak}}
        )
    user["current_streak"] = streak

    return user_to_response(user)


@router.get("/dashboard")
async def get_dashboard(authorization: str = Header(...)):
    """Return dashboard summary data."""
    user = await get_current_user(authorization)
    user_id = str(user["_id"])

    # Calculate suggested daily calories based on goal
    weight = user.get("weight", 70)
    goal = user.get("goal", "stay_fit")
    if goal == "lose_weight":
        daily_suggested = int(weight * 6)
    elif goal == "build_muscle":
        daily_suggested = int(weight * 8)
    elif goal == "gain_weight":
        daily_suggested = int(weight * 9)
    else:
        daily_suggested = int(weight * 7)

    # Get this week's workout data
    today = datetime.now(timezone.utc).date()
    week_start = today - timedelta(days=today.weekday())  # Monday

    weekly_workouts = []
    weekly_macros = []
    total_calories_burned = 0
    workout_count = 0
    total_calories_eaten = 0

    for i in range(7):
        day = week_start + timedelta(days=i)
        day_str = day.isoformat()
        day_label = day.strftime("%a")

        # Workouts for the day
        cursor = workouts_collection.find({"user_id": user_id, "date": day_str})
        day_workouts = await cursor.to_list(length=100)
        day_calories = sum(w.get("calories_burned", 0) for w in day_workouts)
        total_calories_burned += day_calories
        workout_count += len(day_workouts)

        weekly_workouts.append({
            "day": day_label,
            "Suggested": daily_suggested,
            "Actual": day_calories,
        })

        # Meals for the day
        cursor = meals_collection.find({"user_id": user_id, "date": day_str})
        day_meals = await cursor.to_list(length=100)
        day_cal = sum(m.get("calories", 0) for m in day_meals)
        day_protein = round(sum(m.get("protein", 0) for m in day_meals), 1)
        day_fats = round(sum(m.get("fats", 0) for m in day_meals), 1)
        total_calories_eaten += day_cal

        weekly_macros.append({
            "day": day_label,
            "Calories": day_cal,
            "Protein": day_protein,
            "Fats": day_fats,
        })

    streak = await calculate_streak(user_id)

    return {
        "greeting_name": user["name"].split(" ")[0],
        "current_streak": streak,
        "total_calories_burned": total_calories_burned,
        "workout_count": workout_count,
        "total_calories_eaten": total_calories_eaten,
        "weekly_workouts": weekly_workouts,
        "weekly_macros": weekly_macros,
    }
