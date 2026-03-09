from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Header
from bson import ObjectId

from database import meals_collection, daily_logs_collection
from models.schemas import MealLog
from routes.auth import get_current_user

router = APIRouter(prefix="/api", tags=["meals"])


# ---- Common food database for quick lookup ----
FOOD_DB = {
    "rice": {"calories": 130, "protein": 2.7, "fats": 0.3, "serving": "100g"},
    "chicken breast": {"calories": 165, "protein": 31, "fats": 3.6, "serving": "100g"},
    "chicken rice": {"calories": 295, "protein": 33, "fats": 4, "serving": "1 plate"},
    "banana": {"calories": 89, "protein": 1.1, "fats": 0.3, "serving": "1 medium"},
    "apple": {"calories": 52, "protein": 0.3, "fats": 0.2, "serving": "1 medium"},
    "egg": {"calories": 155, "protein": 13, "fats": 11, "serving": "2 eggs"},
    "oats": {"calories": 389, "protein": 17, "fats": 7, "serving": "100g"},
    "milk": {"calories": 42, "protein": 3.4, "fats": 1, "serving": "1 cup"},
    "bread": {"calories": 265, "protein": 9, "fats": 3, "serving": "2 slices"},
    "pasta": {"calories": 131, "protein": 5, "fats": 1.1, "serving": "100g"},
    "salmon": {"calories": 208, "protein": 20, "fats": 13, "serving": "100g"},
    "broccoli": {"calories": 34, "protein": 2.8, "fats": 0.4, "serving": "100g"},
    "almonds": {"calories": 579, "protein": 21, "fats": 50, "serving": "100g"},
    "yogurt": {"calories": 59, "protein": 10, "fats": 0.7, "serving": "1 cup"},
    "protein shake": {"calories": 120, "protein": 24, "fats": 2, "serving": "1 scoop"},
    "paneer": {"calories": 265, "protein": 18, "fats": 20, "serving": "100g"},
    "dal": {"calories": 116, "protein": 9, "fats": 0.4, "serving": "1 bowl"},
    "roti": {"calories": 120, "protein": 3, "fats": 3.7, "serving": "1 piece"},
    "idli": {"calories": 39, "protein": 2, "fats": 0.2, "serving": "1 piece"},
    "dosa": {"calories": 168, "protein": 4, "fats": 3, "serving": "1 piece"},
}


@router.get("/foods/search")
async def search_foods(q: str = ""):
    """Search the built-in food database."""
    if not q or len(q) < 2:
        return []
    q_lower = q.lower()
    results = []
    for name, info in FOOD_DB.items():
        if q_lower in name:
            results.append({"food_name": name, **info})
    return results


@router.post("/meals")
async def log_meal(meal: MealLog, authorization: str = Header(...)):
    """Log a food/meal entry."""
    user = await get_current_user(authorization)
    user_id = str(user["_id"])
    today = meal.date or datetime.now(timezone.utc).date().isoformat()

    doc = {
        "user_id": user_id,
        "food_name": meal.food_name,
        "calories": meal.calories,
        "protein": meal.protein,
        "fats": meal.fats,
        "date": today,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await meals_collection.insert_one(doc)

    # Update daily log aggregates
    await _update_daily_log(user_id, today)

    return {"message": f"Logged {meal.food_name} successfully!"}


@router.get("/meals")
async def get_meals(authorization: str = Header(...), date: str = ""):
    """Get meals for a specific date (defaults to today)."""
    user = await get_current_user(authorization)
    user_id = str(user["_id"])
    target_date = date or datetime.now(timezone.utc).date().isoformat()

    cursor = meals_collection.find({"user_id": user_id, "date": target_date}).sort("created_at", -1)
    meals = await cursor.to_list(length=100)

    result = []
    for m in meals:
        result.append({
            "id": str(m["_id"]),
            "food_name": m["food_name"],
            "calories": m["calories"],
            "protein": m["protein"],
            "fats": m["fats"],
            "date": m["date"],
        })
    return result


@router.get("/meals/summary")
async def get_meal_summary(authorization: str = Header(...), date: str = ""):
    """Get daily macro summary for a specific date."""
    user = await get_current_user(authorization)
    user_id = str(user["_id"])
    target_date = date or datetime.now(timezone.utc).date().isoformat()

    cursor = meals_collection.find({"user_id": user_id, "date": target_date})
    meals = await cursor.to_list(length=100)

    total_cal = sum(m.get("calories", 0) for m in meals)
    total_protein = sum(m.get("protein", 0) for m in meals)
    total_fats = sum(m.get("fats", 0) for m in meals)

    # Target macros based on user profile
    weight = user.get("weight", 70)
    goal = user.get("goal", "stay_fit")

    if goal == "lose_weight":
        cal_target = int(weight * 28)
        protein_target = int(weight * 1.8)
        fat_target = int(weight * 0.8)
    elif goal == "build_muscle":
        cal_target = int(weight * 35)
        protein_target = int(weight * 2.2)
        fat_target = int(weight * 1.0)
    elif goal == "gain_weight":
        cal_target = int(weight * 40)
        protein_target = int(weight * 2.0)
        fat_target = int(weight * 1.2)
    else:
        cal_target = int(weight * 30)
        protein_target = int(weight * 1.5)
        fat_target = int(weight * 0.9)

    return {
        "calories": {"current": total_cal, "target": cal_target},
        "protein": {"current": round(total_protein, 1), "target": protein_target},
        "fats": {"current": round(total_fats, 1), "target": fat_target},
        "meal_count": len(meals),
    }


async def _update_daily_log(user_id: str, date: str):
    """Recalculate and update the daily log for a given date."""
    cursor = meals_collection.find({"user_id": user_id, "date": date})
    meals = await cursor.to_list(length=100)

    total_cal = sum(m.get("calories", 0) for m in meals)
    total_protein = sum(m.get("protein", 0) for m in meals)
    total_fats = sum(m.get("fats", 0) for m in meals)

    await daily_logs_collection.update_one(
        {"user_id": user_id, "date": date},
        {"$set": {
            "total_calories_eaten": total_cal,
            "total_protein": total_protein,
            "total_fats": total_fats,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }},
        upsert=True,
    )
