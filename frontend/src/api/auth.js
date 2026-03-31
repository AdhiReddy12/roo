

const API_BASE = '/api';
export const SESSION_AUTH = 'session';

// ---- Helper: Get Basic Auth header from credentials ----

function getAuthHeader(credentials) {
    if (!credentials || credentials === SESSION_AUTH) return {};
    return { Authorization: `Basic ${credentials}` };
}

// ---- Auth ----

export async function signupUser({ username, email, password, age, securityQuestion, securityAnswer }) {
    const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, age: parseInt(age), securityQuestion, securityAnswer }),
    });
    let data;
    try {
        data = await res.json();
    } catch {
        throw new Error('Server error — please try again later.');
    }
    if (!res.ok) throw new Error(data.message || 'Signup failed');
    return data;
}

export async function loginUser({ email, password }) {
    const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    let data;
    try {
        data = await res.json();
    } catch {
        throw new Error('Server error — please try again later.');
    }
    if (!res.ok) throw new Error(data.message || 'Login failed');
    const credentials = btoa(`${email}:${password}`);
    return { credentials, user: data };
}

export async function fetchProfile(credentials) {
    const res = await fetch(`${API_BASE}/me`, {
        headers: { ...getAuthHeader(credentials) },
    });
    if (!res.ok) {
        throw new Error('Failed to fetch profile');
    }
    let data;
    try {
        data = await res.json();
    } catch {
        throw new Error('Failed to parse profile data');
    }
    return data;
}

export async function updateProfile(credentials, { username, age, height, weight }) {
    const res = await fetch(`${API_BASE}/me`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(credentials),
        },
        body: JSON.stringify({
            username: username?.trim() || undefined,
            age: age ? parseInt(age) : undefined,
            height: height ? parseFloat(height) : undefined,
            weight: weight ? parseFloat(weight) : undefined,
        }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Update failed');
    return data;
}

// ---- Dashboard ----

export async function fetchDashboard(credentials) {
    const res = await fetch(`${API_BASE}/dashboard`, {
        headers: { ...getAuthHeader(credentials) },
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard');
    return await res.json();
}

// ---- Workouts ----

export async function logWorkout(credentials, { workout_name, duration, calories_burned, date }) {
    const res = await fetch(`${API_BASE}/workouts`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(credentials),
        },
        body: JSON.stringify({ workout_name, duration, calories_burned, date }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to log workout');
    return data;
}

export async function fetchWorkouts(credentials) {
    const res = await fetch(`${API_BASE}/workouts`, {
        headers: { ...getAuthHeader(credentials) },
    });
    if (!res.ok) throw new Error('Failed to fetch workouts');
    return await res.json();
}

export async function generateWorkoutPlan(credentials, { age, weight, height, gender, fitness_level, equipment, goal, days_per_week, duration }) {
    // Workout plan generation is handled server-side in the future.
    // Feature currently disabled. Return empty stub.
    return {
        exercises: [],
        total_duration: 0,
        total_calories: 0,
    };
}

// ---- Food / Meals ----

export async function searchFoods(query, credentials) {
    const res = await fetch(`${API_BASE}/foods/search?q=${encodeURIComponent(query)}`, {
        headers: { ...getAuthHeader(credentials) },
    });
    if (!res.ok) throw new Error('Failed to search foods');
    return await res.json();
}

export async function logMeal(credentials, { food_name, calories, protein, fats, date }) {
    const res = await fetch(`${API_BASE}/meals`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(credentials),
        },
        body: JSON.stringify({ food_name, calories, protein, fats, date }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to log meal');
    return data;
}

export async function fetchMeals(credentials) {
    const res = await fetch(`${API_BASE}/meals`, {
        headers: { ...getAuthHeader(credentials) },
    });
    if (!res.ok) throw new Error('Failed to fetch meals');
    return await res.json();
}

export async function fetchMealSummary(credentials) {
    const res = await fetch(`${API_BASE}/meals/summary`, {
        headers: { ...getAuthHeader(credentials) },
    });
    if (!res.ok) throw new Error('Failed to fetch meal summary');
    return await res.json();
}

// ---- Food Plan Generation ----

export async function generateFoodPlan(credentials, { age, gender, height, weight, goal, meal_type, diet_type }) {
    // Food plan generation is handled server-side in the future.
    // Feature currently disabled. Return empty stub.
    return {
        items: [],
        total_calories: 0,
        total_protein: 0,
        total_fats: 0,
    };
}

// ---- Calorie Burn Prediction (ML Model) ----

export async function predictCalories({ age, gender, weight_kg, height_cm, body_fat_pct, exercise_type, duration_min, heart_rate, intensity }) {
    const res = await fetch(`${API_BASE}/calorie-predictions/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ age, gender, weight_kg, height_cm, body_fat_pct, exercise_type, duration_min, heart_rate, intensity }),
    });
    const data = await res.json();
    if (!data.success) {
        // Handle different error types with specific messages
        let errorMessage = data.message || 'Prediction failed';

        switch (data.errorType) {
            case 'VALIDATION_ERROR':
                errorMessage = `Invalid input: ${data.message}`;
                break;
            case 'ML_SERVICE_UNAVAILABLE':
                errorMessage = 'ML service is temporarily unavailable. Please try again later.';
                break;
            case 'NETWORK_ERROR':
                errorMessage = 'Network connection issue. Please check your internet and try again.';
                break;
            case 'TIMEOUT_ERROR':
                errorMessage = 'Request timed out. Please try again.';
                break;
            case 'ML_SERVICE_ERROR':
                errorMessage = 'ML service error. Please try again later.';
                break;
            default:
                errorMessage = data.message || 'An unexpected error occurred. Please try again.';
        }

        throw new Error(errorMessage);
    }
    return data.data;
}

export async function saveCaloriePrediction(credentials, predictionData) {
    const res = await fetch(`${API_BASE}/calorie-predictions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...getAuthHeader(credentials),
        },
        body: JSON.stringify(predictionData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to save prediction');
    return data;
}

export async function fetchCaloriePredictions(credentials) {
    const res = await fetch(`${API_BASE}/calorie-predictions`, {
        headers: { ...getAuthHeader(credentials) },
    });
    if (!res.ok) throw new Error('Failed to fetch predictions');
    return await res.json();
}
