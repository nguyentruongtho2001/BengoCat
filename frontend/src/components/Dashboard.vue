<template>
    <div class="dashboard-page">
        <!-- Welcome Section -->
        <section class="welcome-section">
            <div class="welcome-content">
                <div class="welcome-text">
                    <h1 class="welcome-title">
                        Good {{ timeOfDay }}, Friend! 👋
                    </h1>
                    <p class="welcome-subtitle">
                        Ready to make today productive with Bangocat?
                    </p>
                </div>
                <div class="welcome-mascot">
                    <div class="mascot-animation">🐱</div>
                    <p class="mascot-message">Let's study together!</p>
                </div>
            </div>

            <div class="quick-stats">
                <div class="stat-bubble">
                    <span class="stat-icon">🎯</span>
                    <div class="stat-info">
                        <div class="stat-value">3/8</div>
                        <div class="stat-label">Today's Sessions</div>
                    </div>
                </div>
                <div class="stat-bubble">
                    <span class="stat-icon">⏱️</span>
                    <div class="stat-info">
                        <div class="stat-value">75m</div>
                        <div class="stat-label">Focus Time</div>
                    </div>
                </div>
                <div class="stat-bubble">
                    <span class="stat-icon">🔥</span>
                    <div class="stat-info">
                        <div class="stat-value">5</div>
                        <div class="stat-label">Day Streak</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Quick Actions -->
        <section class="quick-actions-section">
            <h2 class="section-title">Quick Actions</h2>
            <div class="actions-grid">
                <button class="action-card" @click="$router.push('/pomodoro')">
                    <span class="action-icon">⏱️</span>
                    <span class="action-label">Start Pomodoro</span>
                    <span class="action-desc">25 min focus session</span>
                </button>

                <button
                    class="action-card"
                    @click="$router.push('/quick-notes')"
                >
                    <span class="action-icon">📝</span>
                    <span class="action-label">Quick Note</span>
                    <span class="action-desc">Jot down ideas</span>
                </button>

                <button class="action-card" @click="$router.push('/music')">
                    <span class="action-icon">🎵</span>
                    <span class="action-label">Focus Music</span>
                    <span class="action-desc">Boost concentration</span>
                </button>

                <button class="action-card" @click="$router.push('/zen')">
                    <span class="action-icon">🧘</span>
                    <span class="action-label">Zen Mode</span>
                    <span class="action-desc">Deep focus</span>
                </button>
            </div>
        </section>

        <!-- Recent Activity -->
        <section class="activity-section">
            <div class="section-header">
                <h2 class="section-title">Recent Activity</h2>
                <button class="see-all-btn">See All</button>
            </div>
            <div class="activity-list">
                <div class="activity-item">
                    <span class="activity-icon">🎯</span>
                    <div class="activity-content">
                        <p class="activity-text">Completed Pomodoro session</p>
                        <p class="activity-time">25 min • 10:30 AM</p>
                    </div>
                </div>
                <div class="activity-item">
                    <span class="activity-icon">📝</span>
                    <div class="activity-content">
                        <p class="activity-text">Created note "Study plan"</p>
                        <p class="activity-time">9:45 AM</p>
                    </div>
                </div>
                <div class="activity-item">
                    <span class="activity-icon">📚</span>
                    <div class="activity-content">
                        <p class="activity-text">Looked up "algorithm"</p>
                        <p class="activity-time">Yesterday</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Goals Progress -->
        <section class="goals-section">
            <h2 class="section-title">Daily Goals</h2>
            <div class="goals-grid">
                <div class="goal-card">
                    <div class="goal-header">
                        <span class="goal-icon">🎯</span>
                        <div class="goal-info">
                            <h3 class="goal-title">Pomodoro Sessions</h3>
                            <p class="goal-progress">3/8 completed</p>
                        </div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 37.5%"></div>
                    </div>
                </div>

                <div class="goal-card">
                    <div class="goal-header">
                        <span class="goal-icon">⏱️</span>
                        <div class="goal-info">
                            <h3 class="goal-title">Focus Time</h3>
                            <p class="goal-progress">75/120 minutes</p>
                        </div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 62.5%"></div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Cat Status -->
        <section class="cat-section">
            <div class="cat-card">
                <div class="cat-display">
                    <div class="cat-avatar">🐱</div>
                    <div class="cat-status">
                        <h3>Bangocat is Happy! 😊</h3>
                        <p>Keep up the good work! Your cat is leveling up.</p>
                    </div>
                </div>
                <button
                    class="play-btn"
                    @click="$router.push('/customize-cat')"
                >
                    <span>🎨</span>
                    Customize
                </button>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    name: "Dashboard",
    computed: {
        timeOfDay() {
            const hour = new Date().getHours();
            if (hour < 12) return "morning";
            if (hour < 18) return "afternoon";
            return "evening";
        },
    },
};
</script>

<style scoped>
.dashboard-page {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xl);
}

/* Welcome Section */
.welcome-section {
    background: linear-gradient(
        135deg,
        var(--ios-system-blue),
        var(--ios-system-teal)
    );
    border-radius: var(--radius-xl);
    padding: var(--spacing-2xl);
    color: white;
    position: relative;
    overflow: hidden;
}

.welcome-content {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: var(--spacing-xl);
    align-items: center;
    margin-bottom: var(--spacing-xl);
}

.welcome-title {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    margin: 0 0 var(--spacing-sm) 0;
    letter-spacing: -0.5px;
}

.welcome-subtitle {
    font-size: var(--font-size-lg);
    margin: 0;
    opacity: 0.9;
}

.welcome-mascot {
    text-align: center;
}

.mascot-animation {
    font-size: 80px;
    animation: bounce 2s ease-in-out infinite;
    margin-bottom: var(--spacing-sm);
}

@keyframes bounce {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

.mascot-message {
    margin: 0;
    font-weight: 600;
    opacity: 0.9;
}

.quick-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-md);
}

.stat-bubble {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(20px);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.stat-icon {
    font-size: 24px;
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
}

.stat-info {
    flex: 1;
}

.stat-value {
    font-size: var(--font-size-xl);
    font-weight: 700;
    margin-bottom: var(--spacing-xs);
}

.stat-label {
    font-size: var(--font-size-sm);
    opacity: 0.9;
}

/* Section Styles */
.section-title {
    font-size: var(--font-size-xl);
    font-weight: 700;
    color: var(--ios-label-primary);
    margin: 0 0 var(--spacing-lg) 0;
    letter-spacing: -0.5px;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--spacing-lg);
}

.see-all-btn {
    background: none;
    border: none;
    color: var(--ios-system-blue);
    font-weight: 600;
    cursor: pointer;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-md);
    transition: background var(--transition-fast);
}

.see-all-btn:hover {
    background: var(--ios-system-gray6);
}

/* Quick Actions */
.actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-lg);
}

.action-card {
    background: var(--ios-background-primary);
    border: 1px solid var(--ios-system-gray6);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    text-align: center;
    cursor: pointer;
    transition: all var(--transition-fast);
    text-decoration: none;
    color: inherit;
}

.action-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--ios-system-blue);
}

.action-icon {
    font-size: 40px;
    display: block;
    margin-bottom: var(--spacing-md);
}

.action-label {
    display: block;
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--ios-label-primary);
    margin-bottom: var(--spacing-xs);
}

.action-desc {
    display: block;
    font-size: var(--font-size-sm);
    color: var(--ios-label-secondary);
}

/* Activity List */
.activity-list {
    background: var(--ios-background-primary);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
}

.activity-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--ios-system-gray6);
    transition: background var(--transition-fast);
}

.activity-item:hover {
    background: var(--ios-background-secondary);
}

.activity-item:last-child {
    border-bottom: none;
}

.activity-icon {
    font-size: 20px;
    width: 40px;
    height: 40px;
    background: var(--ios-background-secondary);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.activity-content {
    flex: 1;
}

.activity-text {
    margin: 0 0 var(--spacing-xs) 0;
    font-weight: 500;
    color: var(--ios-label-primary);
}

.activity-time {
    margin: 0;
    font-size: var(--font-size-sm);
    color: var(--ios-label-tertiary);
}

/* Goals Section */
.goals-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: var(--spacing-lg);
}

.goal-card {
    background: var(--ios-background-primary);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    box-shadow: var(--shadow-sm);
}

.goal-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-lg);
}

.goal-icon {
    font-size: 24px;
    width: 50px;
    height: 50px;
    background: var(--ios-system-blue);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.goal-info {
    flex: 1;
}

.goal-title {
    margin: 0 0 var(--spacing-xs) 0;
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--ios-label-primary);
}

.goal-progress {
    margin: 0;
    font-size: var(--font-size-sm);
    color: var(--ios-label-secondary);
}

.progress-bar {
    height: 6px;
    background: var(--ios-system-gray6);
    border-radius: 3px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(
        90deg,
        var(--ios-system-blue),
        var(--ios-system-teal)
    );
    border-radius: 3px;
    transition: width var(--transition-slow);
}

/* Cat Section */
.cat-card {
    background: linear-gradient(
        135deg,
        var(--ios-system-orange),
        var(--ios-system-yellow)
    );
    border-radius: var(--radius-xl);
    padding: var(--spacing-2xl);
    color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.cat-display {
    display: flex;
    align-items: center;
    gap: var(--spacing-xl);
}

.cat-avatar {
    font-size: 60px;
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(10px);
}

.cat-status h3 {
    margin: 0 0 var(--spacing-sm) 0;
    font-size: var(--font-size-xl);
    font-weight: 700;
}

.cat-status p {
    margin: 0;
    opacity: 0.9;
}

.play-btn {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(20px);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg) var(--spacing-xl);
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.play-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
    .welcome-content {
        grid-template-columns: 1fr;
        text-align: center;
    }

    .quick-stats {
        grid-template-columns: 1fr;
    }

    .actions-grid {
        grid-template-columns: 1fr;
    }

    .goals-grid {
        grid-template-columns: 1fr;
    }

    .cat-card {
        flex-direction: column;
        gap: var(--spacing-xl);
        text-align: center;
    }

    .cat-display {
        flex-direction: column;
        text-align: center;
    }
}
</style>
