// =============================================
// API Layer
// TODO: Change API_BASE to your actual backend URL and
//       uncomment the fetch() calls when backend is ready.
// =============================================

// const API_BASE = 'https://your-backend-api.example.com/api';

// =============================================
// RAW DATA — used while backend is not connected
// =============================================

const DEMO_USER = {
    id: 1,
    name: 'Adhi Reddy',
    email: 'adhi@ironpulse.com',
    height: 175,
    weight: 72,
    goal: 'build_muscle',
    current_streak: 7,
    created_at: '2025-09-15T10:30:00Z',
};

const DEMO_WORKOUTS = [
    { id: 1, workout_name: 'Morning Run', duration: 30, calories_burned: 320, date: '2026-03-09' },
    { id: 2, workout_name: 'Chest & Triceps', duration: 45, calories_burned: 410, date: '2026-03-08' },
    { id: 3, workout_name: 'Leg Day', duration: 50, calories_burned: 480, date: '2026-03-07' },
    { id: 4, workout_name: 'HIIT Cardio', duration: 25, calories_burned: 350, date: '2026-03-06' },
    { id: 5, workout_name: 'Back & Biceps', duration: 40, calories_burned: 390, date: '2026-03-05' },
];

const DEMO_PLAN = {
    exercises: [
        { name: 'Barbell Bench Press', type: 'Strength', duration: 12, calories: 95 },
        { name: 'Incline Dumbbell Press', type: 'Strength', duration: 10, calories: 80 },
        { name: 'Cable Crossovers', type: 'Isolation', duration: 8, calories: 55 },
        { name: 'Overhead Triceps Extension', type: 'Isolation', duration: 8, calories: 50 },
        { name: 'Treadmill Intervals', type: 'Cardio', duration: 15, calories: 180 },
    ],
    total_duration: 53,
    total_calories: 460,
};

const DEMO_DASHBOARD = {
    greeting_name: 'Adhi',
    current_streak: 7,
    total_calories_burned: 3480,
    workout_count: 12,
    total_calories_eaten: 14200,
    weekly_workouts: [
        { day: 'Mon', Suggested: 400, Actual: 320 },
        { day: 'Tue', Suggested: 350, Actual: 410 },
        { day: 'Wed', Suggested: 400, Actual: 480 },
        { day: 'Thu', Suggested: 300, Actual: 350 },
        { day: 'Fri', Suggested: 400, Actual: 390 },
        { day: 'Sat', Suggested: 450, Actual: 420 },
        { day: 'Sun', Suggested: 200, Actual: 310 },
    ],
    weekly_macros: [
        { day: 'Mon', Calories: 2100, Protein: 140, Fats: 65 },
        { day: 'Tue', Calories: 2250, Protein: 155, Fats: 72 },
        { day: 'Wed', Calories: 1950, Protein: 130, Fats: 58 },
        { day: 'Thu', Calories: 2300, Protein: 160, Fats: 75 },
        { day: 'Fri', Calories: 2050, Protein: 145, Fats: 63 },
        { day: 'Sat', Calories: 2400, Protein: 165, Fats: 80 },
        { day: 'Sun', Calories: 1800, Protein: 120, Fats: 55 },
    ],
};

const FOOD_DATABASE = [
    { food_name: 'Chicken Breast', calories: 165, protein: 31, fats: 3.6, serving: '100g' },
    { food_name: 'Brown Rice', calories: 216, protein: 5, fats: 1.8, serving: '1 cup cooked' },
    { food_name: 'Banana', calories: 105, protein: 1.3, fats: 0.4, serving: '1 medium' },
    { food_name: 'Eggs (2 whole)', calories: 143, protein: 12.6, fats: 9.5, serving: '2 eggs' },
    { food_name: 'Greek Yogurt', calories: 100, protein: 17, fats: 0.7, serving: '170g' },
    { food_name: 'Oatmeal', calories: 154, protein: 5.3, fats: 2.6, serving: '1 cup cooked' },
    { food_name: 'Salmon Fillet', calories: 208, protein: 20, fats: 13, serving: '100g' },
    { food_name: 'Sweet Potato', calories: 103, protein: 2.3, fats: 0.1, serving: '1 medium' },
    { food_name: 'Almonds', calories: 164, protein: 6, fats: 14, serving: '28g' },
    { food_name: 'Avocado', calories: 240, protein: 3, fats: 22, serving: '1 whole' },
    { food_name: 'Paneer Tikka', calories: 260, protein: 18, fats: 20, serving: '100g' },
    { food_name: 'Dal Tadka', calories: 150, protein: 9, fats: 5, serving: '1 bowl' },
    { food_name: 'Chapati', calories: 120, protein: 3.5, fats: 3.7, serving: '1 piece' },
    { food_name: 'Chicken Biryani', calories: 350, protein: 15, fats: 12, serving: '1 plate' },
    { food_name: 'Protein Shake', calories: 180, protein: 30, fats: 3, serving: '1 scoop + milk' },
];

const DEMO_MEALS = [
    { id: 1, food_name: 'Eggs (2 whole)', calories: 143, protein: 12.6, fats: 9.5, date: '2026-03-09' },
    { id: 2, food_name: 'Chicken Breast', calories: 165, protein: 31, fats: 3.6, date: '2026-03-09' },
    { id: 3, food_name: 'Brown Rice', calories: 216, protein: 5, fats: 1.8, date: '2026-03-09' },
];

const DEMO_MEAL_SUMMARY = {
    calories: { current: 524, target: 2200 },
    protein: { current: 48.6, target: 150 },
    fats: { current: 14.9, target: 70 },
};

// ---- Auth ----

export async function signupUser(/* { name, email, password, height, weight, goal } */) {
    // const res = await fetch(`${API_BASE}/signup`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ name, email, password, height, weight, goal }),
    // });
    // const data = await res.json();
    // if (!res.ok) throw new Error(data.detail || 'Signup failed');
    // return data;
    return { message: 'Account created successfully!' };
}

export async function loginUser(/* { email, password } */) {
    // const res = await fetch(`${API_BASE}/login`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ email, password }),
    // });
    // const data = await res.json();
    // if (!res.ok) throw new Error(data.detail || 'Login failed');
    // return data;
    return { token: 'demo-token-ironpulse-2026', user: { ...DEMO_USER } };
}

export async function fetchProfile(/* token */) {
    // const res = await fetch(`${API_BASE}/profile`, {
    //     headers: { Authorization: `Bearer ${token}` },
    // });
    // const data = await res.json();
    // if (!res.ok) throw new Error(data.detail || 'Failed to fetch profile');
    // return data;
    return { ...DEMO_USER };
}

export async function fetchDashboard(/* token */) {
    // const res = await fetch(`${API_BASE}/dashboard`, {
    //     headers: { Authorization: `Bearer ${token}` },
    // });
    // const data = await res.json();
    // if (!res.ok) throw new Error(data.detail || 'Failed to fetch dashboard');
    // return data;
    return { ...DEMO_DASHBOARD };
}

// ---- Workouts ----

export async function logWorkout(_token, { workout_name, duration, calories_burned, date }) {
    // const res = await fetch(`${API_BASE}/workouts`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${_token}` },
    //     body: JSON.stringify({ workout_name, duration, calories_burned, date }),
    // });
    // const data = await res.json();
    // if (!res.ok) throw new Error(data.detail || 'Failed to log workout');
    // return data;
    DEMO_WORKOUTS.unshift({
        id: Date.now(),
        workout_name,
        duration,
        calories_burned,
        date: date || new Date().toISOString().split('T')[0],
    });
    return { message: 'Workout logged successfully!' };
}

export async function fetchWorkouts(/* token */) {
    // const res = await fetch(`${API_BASE}/workouts`, {
    //     headers: { Authorization: `Bearer ${token}` },
    // });
    // const data = await res.json();
    // if (!res.ok) throw new Error(data.detail || 'Failed to fetch workouts');
    // return data;
    return [...DEMO_WORKOUTS];
}

export async function generateWorkoutPlan(_token, { age, weight, height, equipment, goal }) {
    // const res = await fetch(`${API_BASE}/workouts/plan`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${_token}` },
    //     body: JSON.stringify({ age, weight, height, equipment, goal }),
    // });
    // const data = await res.json();
    // if (!res.ok) throw new Error(data.detail || 'Failed to generate plan');
    // return data;
    console.log('Wizard data sent:', { age, weight, height, equipment, goal });
    return { ...DEMO_PLAN, exercises: [...DEMO_PLAN.exercises] };
}

// ---- Food / Meals ----

export async function searchFoods(query) {
    // const res = await fetch(`${API_BASE}/foods/search?q=${encodeURIComponent(query)}`);
    // const data = await res.json();
    // if (!res.ok) throw new Error(data.detail || 'Search failed');
    // return data;
    const q = query.toLowerCase();
    return FOOD_DATABASE.filter((f) => f.food_name.toLowerCase().includes(q));
}

export async function logMeal(_token, { food_name, calories, protein, fats, date }) {
    // const res = await fetch(`${API_BASE}/meals`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${_token}` },
    //     body: JSON.stringify({ food_name, calories, protein, fats, date }),
    // });
    // const data = await res.json();
    // if (!res.ok) throw new Error(data.detail || 'Failed to log meal');
    // return data;
    DEMO_MEALS.unshift({
        id: Date.now(),
        food_name,
        calories,
        protein,
        fats,
        date: date || new Date().toISOString().split('T')[0],
    });
    DEMO_MEAL_SUMMARY.calories.current += calories;
    DEMO_MEAL_SUMMARY.protein.current += protein;
    DEMO_MEAL_SUMMARY.fats.current += fats;
    return { message: 'Meal logged successfully!' };
}

export async function fetchMeals(/* token, date */) {
    // const url = date ? `${API_BASE}/meals?date=${date}` : `${API_BASE}/meals`;
    // const res = await fetch(url, {
    //     headers: { Authorization: `Bearer ${token}` },
    // });
    // const data = await res.json();
    // if (!res.ok) throw new Error(data.detail || 'Failed to fetch meals');
    // return data;
    return [...DEMO_MEALS];
}

export async function fetchMealSummary(/* token, date */) {
    // const url = date ? `${API_BASE}/meals/summary?date=${date}` : `${API_BASE}/meals/summary`;
    // const res = await fetch(url, {
    //     headers: { Authorization: `Bearer ${token}` },
    // });
    // const data = await res.json();
    // if (!res.ok) throw new Error(data.detail || 'Failed to fetch meal summary');
    // return data;
    return {
        calories: { ...DEMO_MEAL_SUMMARY.calories },
        protein: { ...DEMO_MEAL_SUMMARY.protein },
        fats: { ...DEMO_MEAL_SUMMARY.fats },
    };
}

// ---- Food Plan Generation ----

const VEG_FOODS = {
    breakfast: [
        { food_name: 'Oatmeal with Banana', calories: 260, protein: 8, fats: 4, serving: '1 bowl' },
        { food_name: 'Paneer Paratha', calories: 320, protein: 12, fats: 14, serving: '2 pieces' },
        { food_name: 'Idli with Sambar', calories: 220, protein: 7, fats: 3, serving: '3 idlis' },
        { food_name: 'Greek Yogurt Bowl', calories: 180, protein: 17, fats: 2, serving: '1 cup' },
    ],
    lunch: [
        { food_name: 'Dal Tadka + Rice', calories: 380, protein: 14, fats: 8, serving: '1 plate' },
        { food_name: 'Rajma Chawal', calories: 420, protein: 16, fats: 7, serving: '1 plate' },
        { food_name: 'Paneer Butter Masala + Roti', calories: 450, protein: 20, fats: 22, serving: '1 plate' },
        { food_name: 'Vegetable Biryani', calories: 360, protein: 10, fats: 12, serving: '1 plate' },
    ],
    dinner: [
        { food_name: 'Mixed Vegetable Curry + Chapati', calories: 310, protein: 10, fats: 9, serving: '1 plate' },
        { food_name: 'Palak Paneer + Rice', calories: 400, protein: 18, fats: 16, serving: '1 plate' },
        { food_name: 'Moong Dal Khichdi', calories: 280, protein: 12, fats: 5, serving: '1 bowl' },
        { food_name: 'Curd Rice', calories: 240, protein: 8, fats: 4, serving: '1 bowl' },
    ],
};

const NONVEG_FOODS = {
    breakfast: [
        { food_name: 'Egg Omelette + Toast', calories: 310, protein: 18, fats: 14, serving: '2 eggs' },
        { food_name: 'Boiled Eggs + Avocado', calories: 280, protein: 16, fats: 18, serving: '2 eggs' },
        { food_name: 'Chicken Sausage Wrap', calories: 350, protein: 22, fats: 15, serving: '1 wrap' },
        { food_name: 'Protein Pancakes', calories: 300, protein: 25, fats: 8, serving: '3 pieces' },
    ],
    lunch: [
        { food_name: 'Grilled Chicken Breast + Rice', calories: 450, protein: 38, fats: 8, serving: '1 plate' },
        { food_name: 'Chicken Biryani', calories: 500, protein: 25, fats: 16, serving: '1 plate' },
        { food_name: 'Fish Curry + Roti', calories: 380, protein: 30, fats: 12, serving: '1 plate' },
        { food_name: 'Egg Fried Rice', calories: 420, protein: 15, fats: 14, serving: '1 plate' },
    ],
    dinner: [
        { food_name: 'Salmon Fillet + Salad', calories: 350, protein: 32, fats: 16, serving: '200g' },
        { food_name: 'Chicken Tikka + Naan', calories: 460, protein: 28, fats: 18, serving: '1 plate' },
        { food_name: 'Mutton Keema + Chapati', calories: 480, protein: 26, fats: 22, serving: '1 plate' },
        { food_name: 'Grilled Fish + Veggies', calories: 300, protein: 28, fats: 10, serving: '1 plate' },
    ],
};

export async function generateFoodPlan(_token, { age, gender, height, weight, goal, meal_type, diet_type }) {
    // const res = await fetch(`${API_BASE}/food-plan`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${_token}` },
    //     body: JSON.stringify({ age, gender, height, weight, goal, meal_type, diet_type }),
    // });
    // const data = await res.json();
    // if (!res.ok) throw new Error(data.detail || 'Failed to generate food plan');
    // return data;
    console.log('Food plan request:', { age, gender, height, weight, goal, meal_type, diet_type });

    const db = diet_type === 'veg' ? VEG_FOODS : NONVEG_FOODS;
    const items = db[meal_type] || db.lunch;

    const totalCalories = items.reduce((sum, i) => sum + i.calories, 0);
    const totalProtein = items.reduce((sum, i) => sum + i.protein, 0);
    const totalFats = items.reduce((sum, i) => sum + i.fats, 0);

    return {
        items: [...items],
        total_calories: totalCalories,
        total_protein: totalProtein,
        total_fats: totalFats,
    };
}

