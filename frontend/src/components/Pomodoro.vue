<template>
  <div class="pomodoro-container">
    <div class="card">
      <!-- Header -->
      <div class="card-header">
        <div>
          <h2>⏱️ Pomodoro Timer</h2>
          <p class="card-description">Kỹ thuật Pomodoro để tăng năng suất</p>
        </div>
        <div class="session-badge">
          <span class="badge-label">Session</span>
          <span class="badge-value">{{ sessionCount }}</span>
        </div>
      </div>

      <!-- Mode Selector -->
      <div class="mode-selector">
        <button 
          v-for="mode in modes"
          :key="mode.id"
          class="mode-btn"
          :class="{ active: currentMode === mode.id }"
          @click="switchMode(mode.id, mode.duration)"
        >
          <span class="mode-icon">{{ mode.icon }}</span>
          <span class="mode-name">{{ mode.name }}</span>
        </button>
      </div>

      <!-- Timer Display -->
      <div class="timer-section">
        <div class="progress-ring-container">
          <svg class="progress-ring" viewBox="0 0 200 200">
            <circle
              class="progress-ring-bg"
              cx="100"
              cy="100"
              r="90"
            />
            <circle
              class="progress-ring-fill"
              cx="100"
              cy="100"
              r="90"
              :style="{ strokeDashoffset: ringOffset }"
            />
          </svg>
          
          <div class="timer-display">
            <div class="timer-main">
              <span class="timer-value">{{ mm }}</span>
              <span class="timer-separator">:</span>
              <span class="timer-value">{{ ss }}</span>
            </div>
            <p class="timer-label">{{ timerLabel }}</p>
          </div>
        </div>

        <!-- Timer Info -->
        <div class="timer-info">
          <div class="info-item">
            <span class="info-label">Thời lượng</span>
            <span class="info-value">{{ duration }} phút</span>
          </div>
          <div class="info-item">
            <span class="info-label">Trôi qua</span>
            <span class="info-value">{{ elapsedTime }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Còn lại</span>
            <span class="info-value">{{ remainingTime }}</span>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="controls-section">
        <button 
          v-if="!isRunning"
          @click="start" 
          class="btn-control btn-primary"
        >
          <span>▶</span>
          Bắt đầu
        </button>
        <button 
          v-else
          @click="pause" 
          class="btn-control btn-primary"
        >
          <span>⏸</span>
          Tạm dừng
        </button>
        
        <button 
          @click="reset" 
          class="btn-control btn-secondary"
        >
          <span>↺</span>
          Reset
        </button>

        <button 
          @click="skip" 
          class="btn-control btn-tertiary"
          :disabled="!isRunning && remaining === initialDuration * 60"
        >
          <span>⏭</span>
          Bỏ qua
        </button>
      </div>

      <!-- Custom Duration -->
      <div class="custom-section">
        <p class="section-title">Tùy chỉnh thời gian (phút)</p>
        <div class="custom-controls">
          <button @click="decreaseDuration" class="btn-adjust">−</button>
          <input 
            v-model.number="customDuration" 
            type="number" 
            min="1" 
            max="60"
            class="duration-input"
            @change="updateDuration"
          />
          <button @click="increaseDuration" class="btn-adjust">+</button>
        </div>
      </div>

      <!-- Settings -->
      <div class="settings-section">
        <div class="setting-item">
          <label class="setting-label">
            <input 
              type="checkbox" 
              v-model="soundEnabled"
              class="setting-checkbox"
            />
            <span>Âm thanh thông báo</span>
          </label>
        </div>
        
        <div class="setting-item">
          <label class="setting-label">
            <input 
              type="checkbox" 
              v-model="autoStart"
              class="setting-checkbox"
            />
            <span>Tự động bắt đầu giờ nghỉ</span>
          </label>
        </div>
      </div>

      <!-- Stats -->
      <div class="stats-section">
        <div class="stat-card">
          <span class="stat-icon">✓</span>
          <div class="stat-content">
            <p class="stat-label">Session hoàn thành</p>
            <p class="stat-value">{{ completedSessions }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <span class="stat-icon">⏱️</span>
          <div class="stat-content">
            <p class="stat-label">Tổng thời gian tập trung</p>
            <p class="stat-value">{{ totalFocusTime }}</p>
          </div>
        </div>
      </div>

      <!-- Tips -->
      <div class="tips-box">
        <p class="tips-text">💡 Mẹo: Một session Pomodoro gồm 25 phút tập trung + 5 phút nghỉ. Sau 4 session, hãy nghỉ 15 phút!</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pomodoro',
  data() {
    return {
      remaining: 25 * 60,
      initialDuration: 25,
      duration: 25,
      customDuration: 25,
      timer: null,
      isRunning: false,
      currentMode: 'focus',
      sessionCount: 0,
      completedSessions: 0,
      totalFocusMinutes: 0,
      soundEnabled: true,
      autoStart: false,
      modes: [
        { id: 'focus', name: 'Tập trung', icon: '🎯', duration: 25 },
        { id: 'shortBreak', name: 'Nghỉ ngắn', icon: '☕', duration: 5 },
        { id: 'longBreak', name: 'Nghỉ dài', icon: '🌟', duration: 15 }
      ]
    }
  },
  computed: {
    mm() {
      return String(Math.floor(this.remaining / 60)).padStart(2, '0')
    },
    ss() {
      return String(this.remaining % 60).padStart(2, '0')
    },
    timerLabel() {
      const modeObj = this.modes.find(m => m.id === this.currentMode)
      return modeObj ? modeObj.name : 'Pomodoro'
    },
    ringOffset() {
      const circumference = 2 * Math.PI * 90
      const progress = (this.initialDuration * 60 - this.remaining) / (this.initialDuration * 60)
      return circumference * (1 - progress)
    },
    elapsedTime() {
      const elapsed = this.initialDuration * 60 - this.remaining
      const mins = Math.floor(elapsed / 60)
      const secs = elapsed % 60
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    },
    remainingTime() {
      return `${String(Math.floor(this.remaining / 60)).padStart(2, '0')}:${String(this.remaining % 60).padStart(2, '0')}`
    },
    totalFocusTime() {
      const mins = this.totalFocusMinutes
      const hours = Math.floor(mins / 60)
      const remainingMins = mins % 60
      return hours > 0 ? `${hours}h ${remainingMins}m` : `${mins}m`
    }
  },
  methods: {
    start() {
      if (this.isRunning) return

      this.isRunning = true

      this.timer = setInterval(() => {
        if (this.remaining > 0) {
          this.remaining--
        } else {
          this.timerComplete()
        }
      }, 1000)
    },
    pause() {
      clearInterval(this.timer)
      this.timer = null
      this.isRunning = false
    },
    reset() {
      this.pause()
      this.remaining = this.initialDuration * 60
    },
    skip() {
      this.pause()
      this.timerComplete()
    },
    timerComplete() {
      this.pause()

      if (this.soundEnabled) {
        this.playSound()
      }

      if (this.currentMode === 'focus') {
        this.completedSessions++
        this.sessionCount++
        this.totalFocusMinutes += this.initialDuration
      }

      // Auto switch mode
      if (this.autoStart) {
        if (this.currentMode === 'focus') {
          this.sessionCount % 4 === 0
            ? this.switchMode('longBreak', 15)
            : this.switchMode('shortBreak', 5)
        } else {
          this.switchMode('focus', 25)
        }
        setTimeout(() => this.start(), 500)
      }
    },
    switchMode(modeId, duration) {
      this.pause()
      this.currentMode = modeId
      this.initialDuration = duration
      this.duration = duration
      this.customDuration = duration
      this.remaining = duration * 60
    },
    increaseDuration() {
      if (this.customDuration < 60) {
        this.customDuration++
        this.updateDuration()
      }
    },
    decreaseDuration() {
      if (this.customDuration > 1) {
        this.customDuration--
        this.updateDuration()
      }
    },
    updateDuration() {
      if (!this.isRunning) {
        this.initialDuration = this.customDuration
        this.duration = this.customDuration
        this.remaining = this.customDuration * 60
      }
    },
    playSound() {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      oscillator.frequency.value = 800
      oscillator.type = 'sine'

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 0.5)
    }
  },
  beforeUnmount() {
    if (this.timer) clearInterval(this.timer)
  }
}
</script>

<style scoped>
.pomodoro-container {
  width: 100%;
}

.card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

/* Header */
.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--border-color);
}

.card-header h2 {
  margin: 0 0 var(--spacing-xs) 0;
}

.card-description {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.session-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md) var(--spacing-lg);
  background: linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%);
  color: #FFFFFF;
  border-radius: var(--radius-md);
}

.badge-label {
  font-size: var(--font-size-xs);
  font-weight: 600;
  opacity: 0.9;
}

.badge-value {
  font-size: 24px;
  font-weight: 700;
}

/* Mode Selector */
.mode-selector {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  background-color: var(--background-secondary);
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
}

.mode-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
}

.mode-btn:hover {
  background-color: var(--card-bg);
}

.mode-btn.active {
  background-color: var(--card-bg);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.mode-icon {
  font-size: 20px;
}

.mode-name {
  font-size: var(--font-size-xs);
  font-weight: 600;
}

/* Timer Section */
.timer-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.progress-ring-container {
  position: relative;
  width: 240px;
  height: 240px;
}

.progress-ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-ring-bg {
  fill: none;
  stroke: var(--border-light);
  stroke-width: 6;
}

.progress-ring-fill {
  fill: none;
  stroke: var(--primary-color);
  stroke-width: 6;
  stroke-linecap: round;
  stroke-dasharray: 565.48;
  transition: stroke-dashoffset 0.5s ease;
}

.timer-display {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
}

.timer-main {
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.timer-value {
  font-size: 60px;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1;
}

.timer-separator {
  font-size: 60px;
  font-weight: 700;
  color: var(--text-tertiary);
  line-height: 1;
  margin: 0 var(--spacing-sm);
  animation: blink 1s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.timer-label {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-secondary);
}

/* Timer Info */
.timer-info {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  width: 100%;
}

.info-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  background-color: var(--background-secondary);
  border-radius: var(--radius-md);
}

.info-label {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--primary-color);
}

/* Controls */
.controls-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.btn-control {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
}

.btn-control:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: var(--primary-color);
  color: #FFFFFF;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0051D5;
}

.btn-secondary {
  background-color: var(--background-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--border-light);
  color: var(--text-color);
}

.btn-tertiary {
  background-color: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn-tertiary:hover:not(:disabled) {
  background-color: var(--background-secondary);
  color: var(--primary-color);
  border-color: var(--primary-color);
}

/* Custom Duration */
.custom-section {
  padding: var(--spacing-lg);
  background-color: var(--background-secondary);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-lg);
}

.section-title {
  margin: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.custom-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
}

.btn-adjust {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 20px;
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
}

.btn-adjust:hover {
  background-color: var(--primary-color);
  color: #FFFFFF;
  border-color: var(--primary-color);
}

.duration-input {
  width: 80px;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: var(--font-size-lg);
  font-weight: 700;
  text-align: center;
  color: var(--primary-color);
  outline: none;
  transition: all var(--transition-fast);
}

.duration-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

/* Settings */
.settings-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-lg);
  background-color: var(--background-secondary);
  border-radius: var(--radius-lg);
}

.setting-item {
  display: flex;
  align-items: center;
}

.setting-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-color);
  cursor: pointer;
  user-select: none;
}

.setting-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--primary-color);
}

/* Stats */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, #F0F4FF 0%, #E8F1FF 100%);
  border: 1px solid rgba(0, 122, 255, 0.2);
  border-radius: var(--radius-lg);
}

.stat-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-label {
  margin: 0;
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--primary-color);
}

/* Tips */
.tips-box {
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: rgba(0, 122, 255, 0.05);
  border: 1px solid rgba(0, 122, 255, 0.2);
  border-radius: var(--radius-md);
}

.tips-text {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.6;
}

/* Responsive */
@media (max-width: 768px) {
  .card {
    padding: var(--spacing-md);
  }

  .progress-ring-container {
    width: 180px;
    height: 180px;
  }

  .timer-value {
    font-size: 48px;
  }

  .timer-separator {
    font-size: 48px;
  }

  .timer-info {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-sm);
  }

  .controls-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats-section {
    grid-template-columns: 1fr;
  }
}
</style>