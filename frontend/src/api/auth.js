const API_BASE = '/api';

// ---- Auth ----
export async function signupUser({ name, email, password, height, weight, goal }) {
    const res = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, height, weight, goal }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Signup failed');
    return data;
}

export async function loginUser({ email, password }) {
    const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Login failed');
    return data;
}

export async function fetchProfile(token) {
    const res = await fetch(`${API_BASE}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Failed to fetch profile');
    return data;
}

export async function fetchDashboard(token) {
    const res = await fetch(`${API_BASE}/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Failed to fetch dashboard');
    return data;
}

// ---- Workouts ----
export async function logWorkout(token, { workout_name, duration, calories_burned, date }) {
    const res = await fetch(`${API_BASE}/workouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ workout_name, duration, calories_burned, date }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Failed to log workout');
    return data;
}

export async function fetchWorkouts(token) {
    const res = await fetch(`${API_BASE}/workouts`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Failed to fetch workouts');
    return data;
}

export async function generateWorkoutPlan(token) {
    const res = await fetch(`${API_BASE}/workouts/plan`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Failed to generate plan');
    return data;
}

// ---- Food / Meals ----
export async function searchFoods(query) {
    const res = await fetch(`${API_BASE}/foods/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Search failed');
    return data;
}

export async function logMeal(token, { food_name, calories, protein, fats, date }) {
    const res = await fetch(`${API_BASE}/meals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ food_name, calories, protein, fats, date }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Failed to log meal');
    return data;
}

export async function fetchMeals(token, date) {
    const url = date ? `${API_BASE}/meals?date=${date}` : `${API_BASE}/meals`;
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Failed to fetch meals');
    return data;
}

export async function fetchMealSummary(token, date) {
    const url = date ? `${API_BASE}/meals/summary?date=${date}` : `${API_BASE}/meals/summary`;
    const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || 'Failed to fetch meal summary');
    return data;
}
