<template>
    <div class="zenmode-container">
        <div class="card">
            <!-- Header -->
            <div class="card-header">
                <div class="header-content">
                    <h2 class="card-title">🧘 Zen Mode</h2>
                    <p class="card-description">
                        Vào trạng thái tập trung sâu và thư giãn tối đa
                    </p>
                </div>
            </div>

            <!-- Status Badge -->
            <div v-if="isActive" class="active-badge">
                <span class="pulse-dot"></span>
                <span class="badge-text">Zen Mode đang hoạt động</span>
            </div>

            <!-- Settings Section -->
            <div v-if="!isActive" class="settings-section">
                <!-- UI Preferences -->
                <div class="settings-group">
                    <p class="group-title">Tùy chỉnh giao diện</p>

                    <div class="setting-item">
                        <div class="setting-content">
                            <label class="setting-label">UI tối thiểu</label>
                            <p class="setting-description">
                                Ẩn các yếu tố giao diện không cần thiết
                            </p>
                        </div>
                        <label class="ios-toggle">
                            <input
                                type="checkbox"
                                v-model="settings.minimalUI"
                                class="toggle-input"
                            />
                            <span class="toggle-track"></span>
                        </label>
                    </div>

                    <div class="setting-item">
                        <div class="setting-content">
                            <label class="setting-label">Chế độ im lặng</label>
                            <p class="setting-description">
                                Tắt tất cả thông báo và âm thanh
                            </p>
                        </div>
                        <label class="ios-toggle">
                            <input
                                type="checkbox"
                                v-model="settings.silent"
                                class="toggle-input"
                            />
                            <span class="toggle-track"></span>
                        </label>
                    </div>

                    <div class="setting-item">
                        <div class="setting-content">
                            <label class="setting-label">Chế độ tối</label>
                            <p class="setting-description">
                                Bảo vệ mắt với giao diện tối
                            </p>
                        </div>
                        <label class="ios-toggle">
                            <input
                                type="checkbox"
                                v-model="settings.darkMode"
                                class="toggle-input"
                            />
                            <span class="toggle-track"></span>
                        </label>
                    </div>

                    <div class="setting-item">
                        <div class="setting-content">
                            <label class="setting-label">Độ mờ nền</label>
                            <p class="setting-description">
                                {{ settings.opacity }}%
                            </p>
                        </div>
                        <div class="slider-wrapper">
                            <span class="slider-icon">☀️</span>
                            <input
                                type="range"
                                min="20"
                                max="100"
                                v-model.number="settings.opacity"
                                class="ios-slider"
                                :style="{
                                    '--slider-value': settings.opacity + '%',
                                }"
                            />
                            <span class="slider-icon">🌑</span>
                        </div>
                    </div>
                </div>

                <!-- Ambient Sounds -->
                <div class="settings-group">
                    <p class="group-title">Âm thanh xung quanh</p>

                    <div class="sounds-grid">
                        <button
                            v-for="sound in ambientSounds"
                            :key="sound.id"
                            class="sound-btn"
                            :class="{
                                active: settings.ambientSound === sound.id,
                            }"
                            @click="settings.ambientSound = sound.id"
                        >
                            <span class="sound-icon">{{ sound.icon }}</span>
                            <span class="sound-name">{{ sound.name }}</span>
                        </button>
                    </div>

                    <div class="volume-control">
                        <div class="volume-header">
                            <label class="volume-label"
                                >Âm lượng âm thanh</label
                            >
                            <span class="volume-value"
                                >{{ settings.soundVolume }}%</span
                            >
                        </div>
                        <div class="slider-wrapper">
                            <span class="slider-icon">🔇</span>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                v-model.number="settings.soundVolume"
                                class="ios-slider"
                                :style="{
                                    '--slider-value':
                                        settings.soundVolume + '%',
                                }"
                            />
                            <span class="slider-icon">🔊</span>
                        </div>
                    </div>
                </div>

                <!-- Duration & Features -->
                <div class="settings-group">
                    <p class="group-title">Thiết lập phiên</p>

                    <div class="duration-selector">
                        <button
                            v-for="duration in durations"
                            :key="duration"
                            class="duration-btn"
                            :class="{ active: settings.duration === duration }"
                            @click="settings.duration = duration"
                        >
                            {{ duration }}m
                        </button>
                    </div>

                    <div class="setting-item">
                        <div class="setting-content">
                            <label class="setting-label"
                                >Hướng dẫn hít thở</label
                            >
                            <p class="setting-description">
                                Hướng dẫn từng bước về hít thở sâu
                            </p>
                        </div>
                        <label class="ios-toggle">
                            <input
                                type="checkbox"
                                v-model="settings.breathingGuide"
                                class="toggle-input"
                            />
                            <span class="toggle-track"></span>
                        </label>
                    </div>

                    <div class="setting-item">
                        <div class="setting-content">
                            <label class="setting-label"
                                >Thông báo định kỳ</label
                            >
                            <p class="setting-description">
                                Nhắc nhở kiểm tra tiến độ sau 5 phút
                            </p>
                        </div>
                        <label class="ios-toggle">
                            <input
                                type="checkbox"
                                v-model="settings.reminders"
                                class="toggle-input"
                            />
                            <span class="toggle-track"></span>
                        </label>
                    </div>
                </div>

                <!-- Start Button -->
                <button @click="startZenMode" class="btn-primary">
                    <span class="btn-icon">🧘</span>
                    <span class="btn-text">Bắt đầu Zen Mode</span>
                </button>
            </div>

            <!-- Active Mode Display -->
            <div v-else class="zen-display">
                <!-- Timer Circle -->
                <div class="timer-container">
                    <div
                        class="timer-circle"
                        :style="{ '--progress': timerProgress }"
                    >
                        <svg viewBox="0 0 200 200">
                            <circle cx="100" cy="100" r="90" class="timer-bg" />
                            <circle
                                cx="100"
                                cy="100"
                                r="90"
                                class="timer-fill"
                            />
                        </svg>
                        <div class="timer-content">
                            <div class="timer-text">
                                <span class="timer-value">{{
                                    timerDisplay
                                }}</span>
                                <span class="timer-label">{{
                                    currentPhase
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Breathing Guide -->
                <div v-if="settings.breathingGuide" class="breathing-guide">
                    <div class="breath-circle" :class="breathPhase">
                        <div class="breath-inner"></div>
                    </div>
                    <p class="breath-instruction">{{ breathingInstruction }}</p>
                </div>

                <!-- Ambient Indicator -->
                <div class="ambient-indicator">
                    <div class="ambient-icon">{{ getAmbientIcon }}</div>
                    <p class="ambient-text">{{ getAmbientName }}</p>
                </div>

                <!-- Controls -->
                <div class="zen-controls">
                    <button
                        @click="togglePause"
                        class="btn-control"
                        :class="{ paused: isPaused }"
                    >
                        <span class="control-icon">{{
                            isPaused ? "▶" : "⏸"
                        }}</span>
                        <span class="control-text">{{
                            isPaused ? "Tiếp tục" : "Tạm dừng"
                        }}</span>
                    </button>
                    <button @click="exitZenMode" class="btn-control btn-exit">
                        <span class="control-icon">✕</span>
                        <span class="control-text">Thoát</span>
                    </button>
                </div>

                <!-- Info -->
                <div class="zen-info">
                    <div class="info-item">
                        <span class="info-icon">🎯</span>
                        <p class="info-text">
                            {{
                                settings.minimalUI
                                    ? "UI tối thiểu"
                                    : "UI đầy đủ"
                            }}
                        </p>
                    </div>
                    <div class="info-item">
                        <span class="info-icon">🔇</span>
                        <p class="info-text">
                            {{
                                settings.silent
                                    ? "Chế độ im lặng"
                                    : "Có thông báo"
                            }}
                        </p>
                    </div>
                    <div v-if="settings.breathingGuide" class="info-item">
                        <span class="info-icon">💨</span>
                        <p class="info-text">Hướng dẫn hít thở</p>
                    </div>
                </div>
            </div>

            <!-- Tips -->
            <div v-if="!isActive" class="tips-section">
                <div class="tips-header">
                    <span class="tips-icon">💡</span>
                    <p class="tips-title">Mẹo cho Zen Mode</p>
                </div>
                <ul class="tips-list">
                    <li class="tip-item">
                        Tìm một nơi yên tĩnh để tập trung tốt nhất
                    </li>
                    <li class="tip-item">
                        Để thiết bị ở vị trí thoải mái, cách xa mắt khoảng 50cm
                    </li>
                    <li class="tip-item">
                        Kích hoạt hướng dẫn hít thở để giảm căng thẳng
                    </li>
                    <li class="tip-item">
                        Sử dụng âm thanh xung quanh phù hợp với tâm trạng của
                        bạn
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ZenMode",
    data() {
        return {
            isActive: false,
            isPaused: false,
            settings: {
                minimalUI: true,
                silent: true,
                darkMode: true,
                opacity: 80,
                ambientSound: "forest",
                soundVolume: 60,
                duration: 10,
                breathingGuide: true,
                reminders: true,
            },
            durations: [5, 10, 15, 20, 30],
            ambientSounds: [
                { id: "none", name: "Yên tĩnh", icon: "🔇" },
                { id: "forest", name: "Rừng sâu", icon: "🌲" },
                { id: "rain", name: "Tiếng mưa", icon: "🌧️" },
                { id: "ocean", name: "Biển", icon: "🌊" },
                { id: "river", name: "Sông", icon: "💧" },
                { id: "birds", name: "Chim hót", icon: "🐦" },
            ],
            remainingTime: 0,
            totalTime: 0,
            timer: null,
            breathCycle: 0,
            breathPhase: "inhale",
        };
    },
    computed: {
        timerDisplay() {
            const mins = Math.floor(this.remainingTime / 60);
            const secs = this.remainingTime % 60;
            return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
        },
        timerProgress() {
            return 1 - this.remainingTime / this.totalTime;
        },
        currentPhase() {
            if (this.remainingTime > this.totalTime * 0.66) return "Tập trung";
            if (this.remainingTime > this.totalTime * 0.33) return "Vừa phải";
            return "Cuối cùng";
        },
        breathingInstruction() {
            const instructions = {
                inhale: "💨 Hít vào sâu (4 giây)",
                hold: "⏸ Nín thở (4 giây)",
                exhale: "💨 Thở ra chậm (4 giây)",
            };
            return instructions[this.breathPhase] || "Thở tự nhiên";
        },
        getAmbientIcon() {
            const sound = this.ambientSounds.find(
                (s) => s.id === this.settings.ambientSound,
            );
            return sound ? sound.icon : "🔇";
        },
        getAmbientName() {
            const sound = this.ambientSounds.find(
                (s) => s.id === this.settings.ambientSound,
            );
            return sound ? sound.name : "Yên tĩnh";
        },
    },
    methods: {
        startZenMode() {
            this.isActive = true;
            this.isPaused = false;
            this.totalTime = this.settings.duration * 60;
            this.remainingTime = this.totalTime;
            this.startTimer();
            this.startBreathingCycle();
            this.showToast("🧘 Zen Mode đã bắt đầu");
        },
        togglePause() {
            this.isPaused = !this.isPaused;
            if (this.isPaused) {
                clearInterval(this.timer);
                this.showToast("⏸ Zen Mode tạm dừng");
            } else {
                this.startTimer();
                this.showToast("▶ Tiếp tục Zen Mode");
            }
        },
        exitZenMode() {
            if (confirm("Bạn có chắc chắn muốn thoát Zen Mode?")) {
                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
                this.isActive = false;
                this.isPaused = false;
                this.remainingTime = 0;
                this.showToast("👋 Đã thoát Zen Mode");
            }
        },
        startTimer() {
            this.timer = setInterval(() => {
                if (this.remainingTime > 0) {
                    this.remainingTime--;
                } else {
                    this.completeZenMode();
                }
            }, 1000);
        },
        startBreathingCycle() {
            setInterval(() => {
                const phases = ["inhale", "hold", "exhale", "hold"];
                this.breathCycle = (this.breathCycle + 1) % phases.length;
                this.breathPhase = phases[this.breathCycle];
            }, 4000);
        },
        completeZenMode() {
            clearInterval(this.timer);
            this.timer = null;
            this.showToast(
                "🎉 Xin chúc mừng! Bạn đã hoàn thành phiên Zen Mode.",
            );
            this.exitZenMode();
        },
        showToast(message) {
            const toast = document.createElement("div");
            toast.textContent = message;
            toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--ios-system-green);
        color: white;
        padding: var(--spacing-md) var(--spacing-lg);
        border-radius: var(--radius-lg);
        font-weight: 600;
        z-index: 1000;
        box-shadow: var(--shadow-lg);
      `;
            document.body.appendChild(toast);
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 3000);
        },
    },
    beforeUnmount() {
        if (this.timer) clearInterval(this.timer);
    },
};
</script>

<style scoped>
.zenmode-container {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
}

.card {
    background-color: var(--ios-background-primary);
    border-radius: var(--radius-lg);
    padding: var(--spacing-2xl);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--ios-system-gray5);
}

/* Header */
.card-header {
    margin-bottom: var(--spacing-2xl);
    padding-bottom: var(--spacing-xl);
    border-bottom: 1px solid var(--ios-system-gray5);
}

.header-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
}

.card-title {
    margin: 0;
    font-size: var(--font-size-3xl);
    font-weight: 700;
    color: var(--ios-label-primary);
    font-family: var(--font-family);
}

.card-description {
    margin: 0;
    font-size: var(--font-size-base);
    color: var(--ios-label-secondary);
    line-height: 1.5;
}

/* Active Badge */
.active-badge {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md) var(--spacing-xl);
    background-color: rgba(52, 199, 89, 0.1);
    border: 1px solid var(--ios-system-green);
    border-radius: var(--radius-full);
    color: var(--ios-system-green);
    font-size: var(--font-size-base);
    font-weight: 600;
    margin-bottom: var(--spacing-2xl);
}

.pulse-dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    background-color: var(--ios-system-green);
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.7;
        transform: scale(1.1);
    }
}

.badge-text {
    font-weight: 600;
}

/* Settings Section */
.settings-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xl);
    margin-bottom: var(--spacing-xl);
}

.settings-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    padding: var(--spacing-xl);
    background-color: var(--ios-background-secondary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--ios-system-gray5);
}

.group-title {
    margin: 0;
    font-size: var(--font-size-base);
    font-weight: 700;
    color: var(--ios-label-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Setting Items */
.setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-xl);
    padding: var(--spacing-lg);
    background-color: var(--ios-background-primary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--ios-system-gray5);
    transition: all var(--transition-base);
    position: relative;
    overflow: hidden;
}

.setting-item::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(0, 122, 255, 0.05),
        transparent
    );
    transition: left var(--transition-slow);
}

.setting-item:hover::before {
    left: 100%;
}

.setting-item:hover {
    border-color: var(--ios-system-gray4);
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
}

.setting-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    flex: 1;
}

.setting-label {
    margin: 0;
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--ios-label-primary);
    cursor: pointer;
}

.setting-description {
    margin: 0;
    font-size: var(--font-size-base);
    color: var(--ios-label-secondary);
    line-height: 1.5;
}

/* iOS Toggle */
.ios-toggle {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
}

.toggle-input {
    display: none;
}

.toggle-track {
    position: relative;
    width: 60px;
    height: 34px;
    background-color: var(--ios-system-gray4);
    border-radius: 17px;
    transition: all var(--transition-base);
    flex-shrink: 0;
}

.toggle-track::before {
    content: "";
    position: absolute;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: white;
    top: 2px;
    left: 2px;
    transition: transform var(--transition-base);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-input:checked + .toggle-track {
    background-color: var(--ios-system-blue);
}

.toggle-input:checked + .toggle-track::before {
    transform: translateX(26px);
}

/* Slider */
.slider-wrapper {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    flex: 1;
    max-width: 300px;
}

.slider-icon {
    font-size: 20px;
    color: var(--ios-label-tertiary);
    flex-shrink: 0;
}

.ios-slider {
    flex: 1;
    height: 8px;
    border-radius: 4px;
    background: linear-gradient(
        to right,
        var(--ios-system-blue) 0%,
        var(--ios-system-blue) var(--slider-value, 60%),
        var(--ios-system-gray5) var(--slider-value, 60%),
        var(--ios-system-gray5) 100%
    );
    -webkit-appearance: none;
    appearance: none;
    outline: none;
    cursor: pointer;
    transition: all var(--transition-fast);
}

.ios-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--ios-system-blue);
    cursor: pointer;
    border: 3px solid white;
    box-shadow: var(--shadow-md);
    transition: all var(--transition-fast);
}

.ios-slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: var(--shadow-lg);
}

.ios-slider::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--ios-system-blue);
    cursor: pointer;
    border: 3px solid white;
    box-shadow: var(--shadow-md);
    border: none;
}

/* Volume Control */
.volume-control {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
    background-color: var(--ios-background-primary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--ios-system-gray5);
}

.volume-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.volume-label {
    margin: 0;
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--ios-label-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.volume-value {
    font-size: var(--font-size-lg);
    font-weight: 700;
    color: var(--ios-system-blue);
}

/* Sounds Grid */
.sounds-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-lg);
}

.sound-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-lg);
    padding: var(--spacing-xl);
    background-color: var(--ios-background-primary);
    border: 2px solid var(--ios-system-gray5);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--transition-base);
    outline: none;
    position: relative;
    overflow: hidden;
    min-height: 120px;
}

.sound-btn::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(0, 122, 255, 0.05),
        transparent
    );
    transition: left var(--transition-slow);
}

.sound-btn:hover::before {
    left: 100%;
}

.sound-btn:hover {
    border-color: var(--ios-system-gray4);
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
}

.sound-btn.active {
    background-color: rgba(0, 122, 255, 0.08);
    border-color: var(--ios-system-blue);
    transform: translateY(-1px);
}

.sound-icon {
    font-size: 32px;
}

.sound-name {
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--ios-label-primary);
    text-align: center;
}

/* Duration Selector */
.duration-selector {
    display: flex;
    gap: var(--spacing-md);
    flex-wrap: wrap;
}

.duration-btn {
    padding: var(--spacing-md) var(--spacing-lg);
    background-color: var(--ios-background-primary);
    border: 1px solid var(--ios-system-gray5);
    border-radius: var(--radius-md);
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--ios-label-secondary);
    cursor: pointer;
    transition: all var(--transition-base);
    outline: none;
    min-width: 70px;
}

.duration-btn:hover {
    background-color: var(--ios-background-secondary);
    border-color: var(--ios-system-blue);
    color: var(--ios-system-blue);
    transform: translateY(-1px);
}

.duration-btn.active {
    background-color: var(--ios-system-blue);
    border-color: var(--ios-system-blue);
    color: white;
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
}

/* Start Button */
.btn-primary {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-md);
    width: 100%;
    padding: var(--spacing-xl);
    background-color: var(--ios-system-blue);
    color: white;
    border: none;
    border-radius: var(--radius-lg);
    font-size: var(--font-size-lg);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-base);
    outline: none;
    position: relative;
    overflow: hidden;
    min-height: 70px;
}

.btn-primary::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
    );
    transition: left var(--transition-slow);
}

.btn-primary:hover::before {
    left: 100%;
}

.btn-primary:hover {
    background-color: #0056cc;
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.btn-icon {
    font-size: 24px;
}

.btn-text {
    font-weight: 600;
}

/* Zen Display */
.zen-display {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-2xl);
    padding: var(--spacing-2xl);
    text-align: center;
}

/* Timer Container */
.timer-container {
    position: relative;
    width: 300px;
    height: 300px;
    margin: var(--spacing-xl) 0;
}

.timer-circle {
    position: relative;
    width: 100%;
    height: 100%;
}

.timer-circle svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
}

.timer-bg {
    fill: none;
    stroke: var(--ios-system-gray5);
    stroke-width: 8;
}

.timer-fill {
    fill: none;
    stroke: var(--ios-system-blue);
    stroke-width: 8;
    stroke-linecap: round;
    stroke-dasharray: 565.48;
    stroke-dashoffset: calc(565.48 * (1 - var(--progress, 0)));
    transition: stroke-dashoffset 0.5s ease;
}

.timer-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
}

.timer-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-lg);
}

.timer-value {
    font-size: 72px;
    font-weight: 700;
    color: var(--ios-label-primary);
    line-height: 1;
    font-family: "Monaco", "Courier New", monospace;
    letter-spacing: -2px;
}

.timer-label {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--ios-label-secondary);
}

/* Breathing Guide */
.breathing-guide {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xl);
}

.breath-circle {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: linear-gradient(
        135deg,
        var(--ios-system-blue),
        var(--ios-system-teal)
    );
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
}

.breath-inner {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
}

.breath-circle.inhale {
    transform: scale(1);
    animation: pulse-glow 4s ease-in-out;
}

.breath-circle.hold {
    transform: scale(1.1);
}

.breath-circle.exhale {
    transform: scale(0.9);
}

@keyframes pulse-glow {
    0%,
    100% {
        box-shadow: 0 0 0 0 rgba(0, 122, 255, 0.4);
    }
    50% {
        box-shadow: 0 0 0 25px rgba(0, 122, 255, 0);
    }
}

.breath-instruction {
    margin: 0;
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--ios-label-primary);
}

/* Ambient Indicator */
.ambient-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-lg);
    padding: var(--spacing-xl);
    background-color: var(--ios-background-secondary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--ios-system-gray5);
}

.ambient-icon {
    font-size: 40px;
}

.ambient-text {
    margin: 0;
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--ios-label-secondary);
}

/* Zen Controls */
.zen-controls {
    display: flex;
    gap: var(--spacing-lg);
    width: 100%;
    max-width: 400px;
}

.btn-control {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    border: none;
    border-radius: var(--radius-lg);
    font-size: var(--font-size-base);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-base);
    outline: none;
    position: relative;
    overflow: hidden;
    min-height: 60px;
}

.btn-control::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
    );
    transition: left var(--transition-slow);
}

.btn-control:hover::before {
    left: 100%;
}

.btn-control:first-child {
    background-color: var(--ios-background-secondary);
    color: var(--ios-label-primary);
    border: 1px solid var(--ios-system-gray4);
}

.btn-control:first-child:hover {
    background-color: var(--ios-background-primary);
    border-color: var(--ios-system-blue);
    color: var(--ios-system-blue);
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
}

.btn-control.paused {
    background-color: var(--ios-system-green);
    color: white;
    border-color: var(--ios-system-green);
}

.btn-exit {
    background-color: var(--ios-system-red);
    color: white;
}

.btn-exit:hover {
    background-color: #d70015;
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
}

.control-icon {
    font-size: 20px;
}

.control-text {
    font-weight: 600;
}

/* Zen Info */
.zen-info {
    display: flex;
    justify-content: center;
    gap: var(--spacing-xl);
    flex-wrap: wrap;
}

.info-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md) var(--spacing-lg);
    background-color: var(--ios-background-secondary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--ios-system-gray5);
}

.info-icon {
    font-size: 20px;
}

.info-text {
    margin: 0;
    font-size: var(--font-size-base);
    color: var(--ios-label-secondary);
    font-weight: 600;
}

/* Tips Section */
.tips-section {
    padding: var(--spacing-xl);
    background: linear-gradient(
        135deg,
        rgba(0, 122, 255, 0.05) 0%,
        rgba(90, 200, 250, 0.05) 100%
    );
    border: 1px solid rgba(0, 122, 255, 0.1);
    border-radius: var(--radius-lg);
}

.tips-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
}

.tips-icon {
    font-size: 24px;
}

.tips-title {
    margin: 0;
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--ios-label-primary);
}

.tips-list {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    list-style: none;
}

.tip-item {
    margin: 0;
    font-size: var(--font-size-base);
    color: var(--ios-label-secondary);
    line-height: 1.6;
    padding-left: var(--spacing-xl);
    position: relative;
}

.tip-item::before {
    content: "•";
    position: absolute;
    left: 0;
    color: var(--ios-system-blue);
    font-weight: 700;
    font-size: var(--font-size-lg);
}

/* Responsive Design - Desktop First */
@media (max-width: 1024px) {
    .zenmode-container {
        max-width: 90%;
    }

    .sounds-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .zenmode-container {
        max-width: 95%;
    }

    .card {
        padding: var(--spacing-xl);
    }

    .settings-group {
        padding: var(--spacing-lg);
    }

    .sounds-grid {
        grid-template-columns: repeat(3, 1fr);
    }

    .zen-display {
        gap: var(--spacing-xl);
        padding: var(--spacing-xl);
    }

    .timer-container {
        width: 240px;
        height: 240px;
    }

    .timer-value {
        font-size: 60px;
    }

    .zen-controls {
        max-width: 100%;
    }

    .zen-info {
        gap: var(--spacing-lg);
    }
}

@media (max-width: 480px) {
    .card {
        padding: var(--spacing-lg);
    }

    .sounds-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .duration-selector {
        justify-content: center;
    }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .setting-item {
        background: var(--ios-background-tertiary);
    }

    .sound-btn {
        background: var(--ios-background-tertiary);
    }

    .volume-control {
        background: var(--ios-background-tertiary);
    }

    .ambient-indicator {
        background: var(--ios-background-tertiary);
    }

    .info-item {
        background: var(--ios-background-tertiary);
    }
}
</style>
