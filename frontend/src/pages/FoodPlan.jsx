import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { searchFoods, logMeal, fetchMeals, fetchMealSummary } from '../api/auth';
import './FoodPlan.css';

export default function FoodPlan() {
    const { token } = useAuth();
    const [macros, setMacros] = useState(null);
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);

    // Search state
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [searching, setSearching] = useState(false);
    const searchTimeout = useRef(null);

    // Messages
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // Load data on mount
    useEffect(() => {
        loadData();
    }, [token]);

    const loadData = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const [summary, mealList] = await Promise.all([
                fetchMealSummary(token),
                fetchMeals(token),
            ]);
            setMacros(summary);
            setMeals(mealList);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Live search with debounce
    const handleSearch = (value) => {
        setQuery(value);
        if (searchTimeout.current) clearTimeout(searchTimeout.current);
        if (value.length < 2) {
            setResults([]);
            return;
        }
        searchTimeout.current = setTimeout(async () => {
            setSearching(true);
            try {
                const data = await searchFoods(value);
                setResults(data);
            } catch {
                setResults([]);
            } finally {
                setSearching(false);
            }
        }, 300);
    };

    // Log a food from search results
    const handleLogFood = async (food) => {
        setSuccessMsg('');
        setErrorMsg('');
        try {
            await logMeal(token, {
                food_name: food.food_name,
                calories: food.calories,
                protein: food.protein,
                fats: food.fats,
            });
            setSuccessMsg(`Logged ${food.food_name}! 🎉`);
            setQuery('');
            setResults([]);
            await loadData(); // Refresh
        } catch (err) {
            setErrorMsg(err.message);
        }
    };

    const cal = macros?.calories || { current: 0, target: 2200 };
    const pro = macros?.protein || { current: 0, target: 150 };
    const fat = macros?.fats || { current: 0, target: 70 };

    return (
        <div className="food-plan-page">
            <h1>Food Plan</h1>
            <p className="subtitle">Track your daily nutrition and macros</p>

            {/* Macro Progress Bars */}
            <div className="macro-cards">
                <div className="glass-card macro-card">
                    <div className="macro-card-header">
                        <span className="macro-label">🔥 Calories</span>
                        <span className="macro-value">{cal.current} / {cal.target}</span>
                    </div>
                    <div className="macro-bar">
                        <div className="macro-bar-fill calories"
                            style={{ width: `${Math.min((cal.current / cal.target) * 100, 100)}%` }} />
                    </div>
                </div>
                <div className="glass-card macro-card">
                    <div className="macro-card-header">
                        <span className="macro-label">💪 Protein (g)</span>
                        <span className="macro-value">{pro.current} / {pro.target}</span>
                    </div>
                    <div className="macro-bar">
                        <div className="macro-bar-fill protein"
                            style={{ width: `${Math.min((pro.current / pro.target) * 100, 100)}%` }} />
                    </div>
                </div>
                <div className="glass-card macro-card">
                    <div className="macro-card-header">
                        <span className="macro-label">🧈 Fats (g)</span>
                        <span className="macro-value">{fat.current} / {fat.target}</span>
                    </div>
                    <div className="macro-bar">
                        <div className="macro-bar-fill fats"
                            style={{ width: `${Math.min((fat.current / fat.target) * 100, 100)}%` }} />
                    </div>
                </div>
            </div>

            {/* Log Food */}
            <div className="glass-card log-food-card">
                <h3>Log Food</h3>
                {successMsg && <div className="food-success">{successMsg}</div>}
                {errorMsg && <div className="food-error">{errorMsg}</div>}
                <div className="log-food-methods">
                    <div className="log-method">
                        <h4>🔍 Search by Name</h4>
                        <div className="input-field">
                            <span className="icon">🔍</span>
                            <input
                                type="text"
                                placeholder="e.g. Chicken Rice, Banana..."
                                value={query}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </div>
                        {searching && <p className="search-hint">Searching...</p>}
                        {results.length > 0 && (
                            <div className="search-results">
                                {results.map((food, i) => (
                                    <div key={i} className="search-result-item" onClick={() => handleLogFood(food)}>
                                        <div className="result-name">{food.food_name}</div>
                                        <div className="result-meta">
                                            <span>{food.calories} cal</span>
                                            <span>P: {food.protein}g</span>
                                            <span>F: {food.fats}g</span>
                                            <span className="result-serving">{food.serving}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {query.length >= 2 && results.length === 0 && !searching && (
                            <p className="search-hint">No results found for "{query}"</p>
                        )}
                    </div>
                    <div className="log-method">
                        <h4>📷 Upload Image</h4>
                        <div className="upload-area">
                            <div className="upload-icon">📷</div>
                            <p>Drag & drop or click to upload</p>
                            <p style={{ fontSize: 'var(--font-xs)', marginTop: '4px' }}>
                                AI will recognize the food automatically
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Today's Meals */}
            <div className="glass-card meals-card">
                <h3>Today's Meals ({meals.length})</h3>
                {meals.length === 0 ? (
                    <div className="meals-empty">
                        <p>No meals logged yet. Start by searching a food above!</p>
                    </div>
                ) : (
                    <div className="meals-list">
                        {meals.map((meal) => (
                            <div key={meal.id} className="meal-item">
                                <div className="meal-name">{meal.food_name}</div>
                                <div className="meal-stats">
                                    <span className="meal-cal">{meal.calories} cal</span>
                                    <span>P: {meal.protein}g</span>
                                    <span>F: {meal.fats}g</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
