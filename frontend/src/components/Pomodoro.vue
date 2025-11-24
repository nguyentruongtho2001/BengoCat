<template>
    <div class="pomodoro-page">
        <div class="page-header">
            <h1 class="page-title">Pomodoro Timer</h1>
            <p class="page-subtitle">Focus on your tasks with timed sessions</p>
        </div>

        <div class="pomodoro-container">
            <!-- Timer Card -->
            <div class="timer-card">
                <div class="timer-display">
                    <div class="progress-ring">
                        <svg viewBox="0 0 200 200">
                            <circle
                                class="progress-bg"
                                cx="100"
                                cy="100"
                                r="90"
                            />
                            <circle
                                class="progress-fill"
                                cx="100"
                                cy="100"
                                r="90"
                                :style="{ strokeDashoffset: progressOffset }"
                            />
                        </svg>
                        <div class="timer-content">
                            <div class="time-display">
                                {{ formattedTime }}
                            </div>
                            <div class="timer-status">
                                {{ currentMode.label }}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Mode Selector -->
                <div class="mode-selector">
                    <button
                        v-for="mode in modes"
                        :key="mode.id"
                        class="mode-btn"
                        :class="{ active: currentMode.id === mode.id }"
                        @click="switchMode(mode)"
                    >
                        <span class="mode-icon">{{ mode.icon }}</span>
                        <span class="mode-label">{{ mode.label }}</span>
                        <span class="mode-duration">{{ mode.duration }}m</span>
                    </button>
                </div>

                <!-- Controls -->
                <div class="timer-controls">
                    <button
                        v-if="!isRunning"
                        @click="startTimer"
                        class="control-btn primary"
                    >
                        <span class="btn-icon">▶️</span>
                        <span class="btn-label">Start</span>
                    </button>

                    <button
                        v-else
                        @click="pauseTimer"
                        class="control-btn secondary"
                    >
                        <span class="btn-icon">⏸️</span>
                        <span class="btn-label">Pause</span>
                    </button>

                    <button @click="resetTimer" class="control-btn tertiary">
                        <span class="btn-icon">↻</span>
                        <span class="btn-label">Reset</span>
                    </button>
                </div>
            </div>

            <!-- Stats Card -->
            <div class="stats-card">
                <h3 class="card-title">Today's Progress</h3>
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-content">
                            <div class="stat-value">3</div>
                            <div class="stat-label">Sessions</div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon">⏱️</div>
                        <div class="stat-content">
                            <div class="stat-value">75m</div>
                            <div class="stat-label">Focused</div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon">🔥</div>
                        <div class="stat-content">
                            <div class="stat-value">5</div>
                            <div class="stat-label">Streak</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Quick Settings -->
            <div class="settings-card">
                <h3 class="card-title">Quick Settings</h3>
                <div class="settings-grid">
                    <div class="setting-item">
                        <label class="setting-label">Auto-start breaks</label>
                        <label class="ios-toggle">
                            <input type="checkbox" v-model="autoStartBreaks" />
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <label class="setting-label">Sound notifications</label>
                        <label class="ios-toggle">
                            <input type="checkbox" v-model="soundEnabled" />
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Pomodoro",
    data() {
        return {
            timeLeft: 25 * 60,
            isRunning: false,
            currentMode: {
                id: "focus",
                label: "Focus Time",
                icon: "🎯",
                duration: 25,
            },
            modes: [
                { id: "focus", label: "Focus", icon: "🎯", duration: 25 },
                {
                    id: "shortBreak",
                    label: "Short Break",
                    icon: "☕",
                    duration: 5,
                },
                {
                    id: "longBreak",
                    label: "Long Break",
                    icon: "🌴",
                    duration: 15,
                },
            ],
            autoStartBreaks: true,
            soundEnabled: true,
            timer: null,
        };
    },
    computed: {
        formattedTime() {
            const minutes = Math.floor(this.timeLeft / 60);
            const seconds = this.timeLeft % 60;
            return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        },
        progressOffset() {
            const totalTime = this.currentMode.duration * 60;
            const progress = (totalTime - this.timeLeft) / totalTime;
            const circumference = 2 * Math.PI * 90;
            return circumference * (1 - progress);
        },
    },
    methods: {
        startTimer() {
            this.isRunning = true;
            this.timer = setInterval(() => {
                if (this.timeLeft > 0) {
                    this.timeLeft--;
                } else {
                    this.timerComplete();
                }
            }, 1000);
        },
        pauseTimer() {
            this.isRunning = false;
            clearInterval(this.timer);
        },
        resetTimer() {
            this.pauseTimer();
            this.timeLeft = this.currentMode.duration * 60;
        },
        switchMode(mode) {
            this.pauseTimer();
            this.currentMode = mode;
            this.timeLeft = mode.duration * 60;
        },
        timerComplete() {
            this.pauseTimer();
            if (this.soundEnabled) {
                this.playCompletionSound();
            }
            // Auto-start next mode if enabled
            if (this.autoStartBreaks && this.currentMode.id === "focus") {
                setTimeout(() => {
                    this.switchMode(this.modes[1]); // Switch to short break
                    this.startTimer();
                }, 1000);
            }
        },
        playCompletionSound() {
            // Simple completion sound
            const audioContext = new (window.AudioContext ||
                window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = "sine";

            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(
                0.01,
                audioContext.currentTime + 0.5,
            );

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        },
    },
    beforeUnmount() {
        this.pauseTimer();
    },
};
</script>

<style scoped>
.pomodoro-page {
    max-width: 800px;
    margin: 0 auto;
}

.page-header {
    text-align: center;
    margin-bottom: var(--spacing-2xl);
}

.page-title {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    color: var(--ios-label-primary);
    margin: 0 0 var(--spacing-sm) 0;
    letter-spacing: -0.5px;
}

.page-subtitle {
    font-size: var(--font-size-base);
    color: var(--ios-label-secondary);
    margin: 0;
}

.pomodoro-container {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: var(--spacing-xl);
    align-items: start;
}

/* Timer Card */
.timer-card {
    background: var(--ios-background-primary);
    border-radius: var(--radius-xl);
    padding: var(--spacing-2xl);
    box-shadow: var(--shadow-md);
    grid-column: 1;
}

.timer-display {
    display: flex;
    justify-content: center;
    margin-bottom: var(--spacing-2xl);
}

.progress-ring {
    position: relative;
    width: 300px;
    height: 300px;
}

.progress-ring svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
}

.progress-bg {
    fill: none;
    stroke: var(--ios-system-gray6);
    stroke-width: 8;
}

.progress-fill {
    fill: none;
    stroke: var(--ios-system-blue);
    stroke-width: 8;
    stroke-linecap: round;
    stroke-dasharray: 565.48;
    transition: stroke-dashoffset 0.5s ease;
}

.timer-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}

.time-display {
    font-size: 64px;
    font-weight: 700;
    color: var(--ios-label-primary);
    font-variant-numeric: tabular-nums;
    line-height: 1;
    margin-bottom: var(--spacing-sm);
}

.timer-status {
    font-size: var(--font-size-lg);
    color: var(--ios-label-secondary);
    font-weight: 600;
}

/* Mode Selector */
.mode-selector {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-2xl);
}

.mode-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-lg);
    background: var(--ios-background-secondary);
    border: 2px solid transparent;
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.mode-btn:hover {
    background: var(--ios-system-gray6);
}

.mode-btn.active {
    background: var(--ios-system-blue);
    border-color: var(--ios-system-blue);
    color: white;
}

.mode-icon {
    font-size: 24px;
}

.mode-label {
    font-size: var(--font-size-sm);
    font-weight: 600;
}

.mode-duration {
    font-size: var(--font-size-xs);
    opacity: 0.8;
}

/* Controls */
.timer-controls {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
}

.control-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-lg);
    border: none;
    border-radius: var(--radius-lg);
    font-size: var(--font-size-base);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
}

.control-btn.primary {
    background: var(--ios-system-blue);
    color: white;
    grid-column: 1 / -1;
}

.control-btn.primary:hover {
    background: #0056cc;
}

.control-btn.secondary {
    background: var(--ios-system-orange);
    color: white;
}

.control-btn.tertiary {
    background: var(--ios-background-secondary);
    color: var(--ios-label-primary);
}

.control-btn.secondary:hover,
.control-btn.tertiary:hover {
    transform: translateY(-2px);
}

/* Stats Card */
.stats-card,
.settings-card {
    background: var(--ios-background-primary);
    border-radius: var(--radius-xl);
    padding: var(--spacing-xl);
    box-shadow: var(--shadow-md);
}

.card-title {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--ios-label-primary);
    margin: 0 0 var(--spacing-lg) 0;
}

.stats-grid {
    display: grid;
    gap: var(--spacing-md);
}

.stat-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    background: var(--ios-background-secondary);
    border-radius: var(--radius-lg);
}

.stat-icon {
    font-size: 24px;
    width: 50px;
    height: 50px;
    background: var(--ios-system-blue);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
}

.stat-content {
    flex: 1;
}

.stat-value {
    font-size: var(--font-size-xl);
    font-weight: 700;
    color: var(--ios-label-primary);
    margin-bottom: var(--spacing-xs);
}

.stat-label {
    font-size: var(--font-size-sm);
    color: var(--ios-label-secondary);
}

/* Settings */
.settings-grid {
    display: grid;
    gap: var(--spacing-lg);
}

.setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.setting-label {
    font-size: var(--font-size-base);
    color: var(--ios-label-primary);
    font-weight: 500;
}

/* iOS Toggle */
.ios-toggle {
    position: relative;
    display: inline-block;
    width: 51px;
    height: 31px;
}

.ios-toggle input {
    opacity: 0;
    width: 0;
    height: 0;
}

.toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--ios-system-gray4);
    transition: 0.4s;
    border-radius: 34px;
}

.toggle-slider:before {
    position: absolute;
    content: "";
    height: 27px;
    width: 27px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input:checked + .toggle-slider {
    background-color: var(--ios-system-blue);
}

input:checked + .toggle-slider:before {
    transform: translateX(20px);
}

/* Responsive */
@media (max-width: 768px) {
    .pomodoro-container {
        grid-template-columns: 1fr;
    }

    .progress-ring {
        width: 250px;
        height: 250px;
    }

    .time-display {
        font-size: 48px;
    }

    .mode-selector {
        grid-template-columns: 1fr;
    }

    .timer-controls {
        grid-template-columns: 1fr;
    }
}
</style>
