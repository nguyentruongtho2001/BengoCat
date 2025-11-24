<template>
  <div class="zenmode-container">
    <div class="card">
      <!-- Header -->
      <div class="card-header">
        <div>
          <h2>🧘 Zen Mode</h2>
          <p class="card-description">Vào trạng thái tập trung sâu và thư giãn tối đa</p>
        </div>
      </div>

      <!-- Status Badge -->
      <div v-if="isActive" class="active-badge">
        <span class="pulse-dot"></span>
        Zen Mode đang hoạt động
      </div>

      <!-- Settings Section -->
      <div v-if="!isActive" class="settings-section">
        <!-- UI Preferences -->
        <div class="settings-group">
          <p class="group-title">Giao diện</p>
          
          <div class="setting-toggle">
            <div class="toggle-content">
              <label class="toggle-label">UI tối thiểu</label>
              <p class="toggle-description">Ẩn các yếu tố giao diện không cần thiết</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.minimalUI" class="toggle-input" />
              <span class="toggle-switch"></span>
            </label>
          </div>

          <div class="setting-toggle">
            <div class="toggle-content">
              <label class="toggle-label">Chế độ im lặng</label>
              <p class="toggle-description">Tắt tất cả thông báo và âm thanh</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.silent" class="toggle-input" />
              <span class="toggle-switch"></span>
            </label>
          </div>

          <div class="setting-toggle">
            <div class="toggle-content">
              <label class="toggle-label">Chế độ tối</label>
              <p class="toggle-description">Bảo vệ mắt với giao diện tối</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.darkMode" class="toggle-input" />
              <span class="toggle-switch"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-content">
              <label class="setting-label">Độ mờ nền</label>
              <p class="setting-description">{{ settings.opacity }}%</p>
            </div>
            <div class="slider-wrapper">
              <span class="slider-icon">☀️</span>
              <input 
                type="range" 
                min="20" 
                max="100" 
                v-model.number="settings.opacity"
                class="custom-slider"
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
              :class="{ active: settings.ambientSound === sound.id }"
              @click="settings.ambientSound = sound.id"
            >
              <span class="sound-icon">{{ sound.icon }}</span>
              <span class="sound-name">{{ sound.name }}</span>
            </button>
          </div>

          <div class="volume-control">
            <label class="volume-label">Âm lượng âm thanh</label>
            <div class="volume-slider-wrapper">
              <span>🔇</span>
              <input 
                type="range" 
                min="0" 
                max="100" 
                v-model.number="settings.soundVolume"
                class="custom-slider"
              />
              <span>🔊</span>
            </div>
          </div>
        </div>

        <!-- Duration & Features -->
        <div class="settings-group">
          <p class="group-title">Phiên Zen</p>

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

          <div class="setting-toggle">
            <div class="toggle-content">
              <label class="toggle-label">Hướng dẫn hít thở</label>
              <p class="toggle-description">Hướng dẫn từng bước về hít thở sâu</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.breathingGuide" class="toggle-input" />
              <span class="toggle-switch"></span>
            </label>
          </div>

          <div class="setting-toggle">
            <div class="toggle-content">
              <label class="toggle-label">Thông báo định kỳ</label>
              <p class="toggle-description">Nhắc nhở kiểm tra tiến độ sau 5 phút</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.reminders" class="toggle-input" />
              <span class="toggle-switch"></span>
            </label>
          </div>
        </div>

        <!-- Start Button -->
        <button @click="startZenMode" class="btn-start">
          <span>🧘</span>
          Bắt đầu Zen Mode
        </button>
      </div>

      <!-- Active Mode Display -->
      <div v-else class="zen-display">
        <!-- Timer Circle -->
        <div class="timer-circle" :style="{ strokeDashoffset: timerOffset }">
          <svg viewBox="0 0 200 200">
            <circle cx="100" cy="100" r="90" class="timer-bg" />
            <circle cx="100" cy="100" r="90" class="timer-fill" />
          </svg>
          <div class="timer-content">
            <div class="timer-text">
              <span class="timer-value">{{ timerDisplay }}</span>
              <span class="timer-label">{{ currentPhase }}</span>
            </div>
          </div>
        </div>

        <!-- Breathing Guide -->
        <div v-if="settings.breathingGuide" class="breathing-guide">
          <div class="breath-circle" :class="breathPhase"></div>
          <p class="breath-instruction">{{ breathingInstruction }}</p>
        </div>

        <!-- Ambient Indicator -->
        <div class="ambient-indicator">
          <span class="sound-icon-indicator">{{ getAmbientIcon }}</span>
          <p class="ambient-text">{{ getAmbientName }}</p>
        </div>

        <!-- Controls -->
        <div class="zen-controls">
          <button @click="pauseZenMode" class="btn-control btn-pause">
            <span>⏸</span>
            Tạm dừng
          </button>
          <button @click="exitZenMode" class="btn-control btn-exit">
            <span>✕</span>
            Thoát
          </button>
        </div>

        <!-- Info -->
        <div class="zen-info">
          <div class="info-item">
            <span class="info-icon">🎯</span>
            <p class="info-text">{{ settings.minimalUI ? 'UI tối thiểu' : 'UI đầy đủ' }}</p>
          </div>
          <div class="info-item">
            <span class="info-icon">🔇</span>
            <p class="info-text">{{ settings.silent ? 'Chế độ im lặng' : 'Có thông báo' }}</p>
          </div>
          <div v-if="settings.breathingGuide" class="info-item">
            <span class="info-icon">💨</span>
            <p class="info-text">Hướng dẫn hít thở</p>
          </div>
        </div>
      </div>

      <!-- Tips -->
      <div v-if="!isActive" class="tips-section">
        <p class="tips-title">💡 Gợi ý cho Zen Mode</p>
        <ul class="tips-list">
          <li>Tìm một nơi yên tĩnh để tập trung tốt nhất</li>
          <li>Để thiết bị ở vị trí thoải mái, cách xa mắt khoảng 50cm</li>
          <li>Kích hoạt hướng dẫn hít thở để giảm căng thẳng</li>
          <li>Sử dụng âm thanh xung quanh phù hợp với tâm trạng của bạn</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ZenMode',
  data() {
    return {
      isActive: false,
      settings: {
        minimalUI: true,
        silent: true,
        darkMode: true,
        opacity: 80,
        ambientSound: 'forest',
        soundVolume: 60,
        duration: 10,
        breathingGuide: true,
        reminders: true
      },
      durations: [5, 10, 15, 20, 30],
      ambientSounds: [
        { id: 'none', name: 'Yên tĩnh', icon: '🔇' },
        { id: 'forest', name: 'Rừng sâu', icon: '🌲' },
        { id: 'rain', name: 'Tiếng mưa', icon: '🌧️' },
        { id: 'ocean', name: 'Biển', icon: '🌊' },
        { id: 'river', name: 'Sông', icon: '💧' },
        { id: 'birds', name: 'Chim hót', icon: '🐦' }
      ],
      remainingTime: 0,
      totalTime: 0,
      timer: null,
      breathCycle: 0,
      breathPhase: 'inhale'
    }
  },
  computed: {
    timerDisplay() {
      const mins = Math.floor(this.remainingTime / 60)
      const secs = this.remainingTime % 60
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
    },
    timerOffset() {
      const circumference = 2 * Math.PI * 90
      const progress = 1 - this.remainingTime / this.totalTime
      return circumference * progress
    },
    currentPhase() {
      if (this.remainingTime > this.totalTime * 0.66) return 'Tập trung'
      if (this.remainingTime > this.totalTime * 0.33) return 'Vừa phải'
      return 'Cuối cùng'
    },
    breathingInstruction() {
      const instructions = {
        inhale: '💨 Hít vào (4 giây)',
        hold: '⏸ Nín (4 giây)',
        exhale: '💨 Thở ra (4 giây)'
      }
      return instructions[this.breathPhase] || 'Thở tự nhiên'
    },
    getAmbientIcon() {
      const sound = this.ambientSounds.find(s => s.id === this.settings.ambientSound)
      return sound ? sound.icon : '🔇'
    },
    getAmbientName() {
      const sound = this.ambientSounds.find(s => s.id === this.settings.ambientSound)
      return sound ? sound.name : 'Yên tĩnh'
    }
  },
  methods: {
    startZenMode() {
      this.isActive = true
      this.totalTime = this.settings.duration * 60
      this.remainingTime = this.totalTime
      this.startTimer()
      this.startBreathingCycle()
    },
    pauseZenMode() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },
    exitZenMode() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
      this.isActive = false
      this.remainingTime = 0
    },
    startTimer() {
      this.timer = setInterval(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--
        } else {
          this.completeZenMode()
        }
      }, 1000)
    },
    startBreathingCycle() {
      setInterval(() => {
        const phases = ['inhale', 'hold', 'exhale', 'hold']
        this.breathCycle = (this.breathCycle + 1) % phases.length
        this.breathPhase = phases[this.breathCycle]
      }, 4000)
    },
    completeZenMode() {
      clearInterval(this.timer)
      this.timer = null
      alert('🎉 Xin chúc mừng! Bạn đã hoàn thành phiên Zen Mode.')
      this.exitZenMode()
    }
  },
  beforeUnmount() {
    if (this.timer) clearInterval(this.timer)
  }
}
</script>

<style scoped>
.zenmode-container {
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

/* Active Badge */
.active-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  background-color: rgba(52, 199, 89, 0.1);
  border: 1px solid var(--success);
  border-radius: var(--radius-full);
  color: var(--success);
  font-size: var(--font-size-sm);
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
}

.pulse-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  background-color: var(--success);
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Settings Section */
.settings-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-lg);
}

.settings-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background-color: var(--background-secondary);
  border-radius: var(--radius-lg);
}

.group-title {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Toggle Settings */
.setting-toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--card-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.toggle-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  flex: 1;
}

.toggle-label {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-color);
  cursor: pointer;
}

.toggle-description {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

/* Toggle Switch */
.toggle {
  display: inline-flex;
  cursor: pointer;
}

.toggle-input {
  display: none;
}

.toggle-switch {
  position: relative;
  width: 50px;
  height: 30px;
  background-color: var(--border-color);
  border-radius: 15px;
  transition: background-color var(--transition-fast);
}

.toggle-switch::before {
  content: '';
  position: absolute;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: #FFFFFF;
  top: 2px;
  left: 2px;
  transition: transform var(--transition-fast);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-input:checked + .toggle-switch {
  background-color: var(--primary-color);
}

.toggle-input:checked + .toggle-switch::before {
  transform: translateX(20px);
}

/* Setting Item */
.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--card-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.setting-content {
  flex: 1;
}

.setting-label {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-color);
}

.setting-description {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--primary-color);
  font-weight: 600;
}

/* Slider */
.slider-wrapper,
.volume-slider-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.slider-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.custom-slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(to right, var(--border-color) 0%, var(--border-color) 100%);
  -webkit-appearance: none;
  appearance: none;
  outline: none;
  cursor: pointer;
}

.custom-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: var(--primary-color);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.custom-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: var(--primary-color);
  cursor: pointer;
  border: none;
}

/* Sounds Grid */
.sounds-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: var(--spacing-md);
}

.sound-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--card-bg);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
}

.sound-btn:hover {
  border-color: var(--border-light);
  background-color: var(--background-secondary);
}

.sound-btn.active {
  background-color: rgba(0, 122, 255, 0.1);
  border-color: var(--primary-color);
}

.sound-icon {
  font-size: 28px;
}

.sound-name {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--text-color);
  text-align: center;
}

/* Volume Control */
.volume-control {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--card-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.volume-label {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Duration Selector */
.duration-selector {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.duration-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.duration-btn:hover {
  background-color: var(--background-secondary);
  border-color: var(--border-light);
}

.duration-btn.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: #FFFFFF;
}

/* Start Button */
.btn-start {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--primary-color);
  color: #FFFFFF;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
}

.btn-start:hover {
  background-color: #0051D5;
}

/* Zen Display */
.zen-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2xl);
  padding: var(--spacing-xl);
  text-align: center;
}

/* Timer Circle */
.timer-circle {
  position: relative;
  width: 240px;
  height: 240px;
  margin: var(--spacing-xl) 0;
}

.timer-circle svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.timer-bg {
  fill: none;
  stroke: var(--border-light);
  stroke-width: 6;
}

.timer-fill {
  fill: none;
  stroke: var(--primary-color);
  stroke-width: 6;
  stroke-linecap: round;
  stroke-dasharray: 565.48;
  transition: stroke-dashoffset 0.5s ease;
}

.timer-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.timer-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
}

.timer-value {
  font-size: 60px;
  font-weight: 700;
  color: var(--text-color);
  line-height: 1;
  font-family: 'Monaco', 'Courier New', monospace;
}

.timer-label {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-secondary);
}

/* Breathing Guide */
.breathing-guide {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-lg);
}

.breath-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%);
  transition: transform 4s ease-in-out;
}

.breath-circle.inhale {
  transform: scale(1);
}

.breath-circle.hold {
  transform: scale(1.1);
}

.breath-circle.exhale {
  transform: scale(0.8);
}

.breath-instruction {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-color);
}

/* Ambient Indicator */
.ambient-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background-color: var(--background-secondary);
  border-radius: var(--radius-lg);
}

.sound-icon-indicator {
  font-size: 32px;
}

.ambient-text {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-secondary);
}

/* Zen Controls */
.zen-controls {
  display: flex;
  gap: var(--spacing-md);
  width: 100%;
  max-width: 300px;
}

.btn-control {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
}

.btn-pause {
  background-color: var(--background-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn-pause:hover {
  background-color: var(--border-light);
  color: var(--text-color);
}

.btn-exit {
  background-color: var(--danger);
  color: #FFFFFF;
}

.btn-exit:hover {
  opacity: 0.9;
}

/* Zen Info */
.zen-info {
  display: flex;
  justify-content: center;
  gap: var(--spacing-lg);
  flex-wrap: wrap;
}

.info-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.info-icon {
  font-size: 20px;
}

.info-text {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: 600;
}

/* Tips Section */
.tips-section {
  padding: var(--spacing-lg);
  background-color: rgba(0, 122, 255, 0.05);
  border: 1px solid rgba(0, 122, 255, 0.2);
  border-radius: var(--radius-lg);
}

.tips-title {
  margin: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-color);
}

.tips-list {
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.tips-list li {
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

  .settings-group {
    padding: var(--spacing-md);
  }

  .sounds-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .zen-display {
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
  }

  .timer-circle {
    width: 180px;
    height: 180px;
  }

  .timer-value {
    font-size: 48px;
  }

  .zen-controls {
    max-width: 100%;
  }

  .zen-info {
    gap: var(--spacing-md);
  }
}
</style>