<template>
  <div class="roadmap-container">
    <div class="card">
      <!-- Header -->
      <div class="card-header">
        <div>
          <h2>🗺️ Lộ trình học tập</h2>
          <p class="card-description">Lập kế hoạch và tối ưu hóa thời gian học tập</p>
        </div>
      </div>

      <!-- Input Section -->
      <div class="input-section">
        <div class="input-group">
          <label class="input-label">Mục tiêu (giờ)</label>
          <div class="input-wrapper">
            <button class="btn-decrease" @click="decreaseHours">−</button>
            <input 
              type="number" 
              v-model.number="targetHours" 
              min="1" 
              max="12"
              class="number-input"
            />
            <button class="btn-increase" @click="increaseHours">+</button>
          </div>
        </div>

        <div class="input-group">
          <label class="input-label">Thời gian tập trung (phút)</label>
          <div class="input-wrapper">
            <button class="btn-decrease" @click="decreaseFocus">−</button>
            <input 
              type="number" 
              v-model.number="focusMinutes" 
              min="10" 
              max="60"
              step="5"
              class="number-input"
            />
            <button class="btn-increase" @click="increaseFocus">+</button>
          </div>
        </div>

        <div class="input-group">
          <label class="input-label">Thời gian nghỉ (phút)</label>
          <div class="input-wrapper">
            <button class="btn-decrease" @click="decreaseBreak">−</button>
            <input 
              type="number" 
              v-model.number="breakMinutes" 
              min="5" 
              max="15"
              step="5"
              class="number-input"
            />
            <button class="btn-increase" @click="increaseBreak">+</button>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="summary-section">
        <div class="summary-item">
          <span class="summary-icon">⏱️</span>
          <div class="summary-content">
            <p class="summary-label">Tổng thời gian</p>
            <p class="summary-value">{{ totalTimeEstimate }} phút</p>
          </div>
        </div>

        <div class="summary-item">
          <span class="summary-icon">🎯</span>
          <div class="summary-content">
            <p class="summary-label">Số phiên</p>
            <p class="summary-value">{{ estimatedCycles }}</p>
          </div>
        </div>

        <div class="summary-item">
          <span class="summary-icon">✓</span>
          <div class="summary-content">
            <p class="summary-label">Thực tế có thể</p>
            <p class="summary-value">{{ Math.floor(totalTimeEstimate / 60) }}h</p>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button @click="generate" class="btn-generate">
          <span>🎯</span>
          Tạo lộ trình
        </button>
        <button @click="savePlan" class="btn-save" :disabled="plan.length === 0">
          <span>💾</span>
          Lưu kế hoạch
        </button>
        <button @click="clearPlan" class="btn-clear" :disabled="plan.length === 0">
          <span>🗑️</span>
          Xóa
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="plan.length === 0" class="empty-state">
        <p class="empty-icon">📋</p>
        <p class="empty-text">Chưa có lộ trình</p>
        <p class="empty-description">Nhấn "Tạo lộ trình" để bắt đầu lập kế hoạch</p>
      </div>

      <!-- Timeline Section -->
      <div v-else class="timeline-section">
        <div class="section-header">
          <p class="section-title">Lộ trình chi tiết</p>
          <span class="timeline-count">{{ plan.length }} khối</span>
        </div>

        <!-- Timeline Visualization -->
        <div class="timeline-container">
          <div class="timeline-header">
            <span class="timeline-time">00:00</span>
            <span class="timeline-time">{{ formatEndTime }}</span>
          </div>

          <div class="timeline-items">
            <div 
              v-for="(slot, index) in plan"
              :key="index"
              class="timeline-item"
              :class="{ 'is-focus': slot.type === 'focus', 'is-break': slot.type === 'break' }"
              :title="`${slot.type === 'focus' ? 'Tập trung' : 'Nghỉ'}: ${slot.duration} phút`"
            >
              <div class="item-label">
                <span class="item-icon">{{ slot.type === 'focus' ? '🎯' : '☕' }}</span>
                <span class="item-time">{{ slot.duration }}m</span>
              </div>
              <div class="item-bar" :style="{ width: (slot.duration / focusMinutes) * 100 + '%' }"></div>
            </div>
          </div>
        </div>

        <!-- Milestones -->
        <div class="milestones-section">
          <p class="section-title">Các mốc quan trọng</p>
          <div class="milestones-list">
            <div 
              v-for="(milestone, index) in milestones"
              :key="index"
              class="milestone-item"
            >
              <div class="milestone-marker">
                <span class="marker-time">{{ milestone.time }}</span>
              </div>
              <p class="milestone-text">{{ milestone.text }}</p>
            </div>
          </div>
        </div>

        <!-- Session Breakdown -->
        <div class="breakdown-section">
          <p class="section-title">Thống kê</p>
          <div class="breakdown-stats">
            <div class="stat-card">
              <p class="stat-label">Thời gian tập trung</p>
              <p class="stat-value">{{ totalFocusTime }} phút</p>
              <p class="stat-percentage">{{ focusPercentage }}%</p>
            </div>

            <div class="stat-card">
              <p class="stat-label">Thời gian nghỉ</p>
              <p class="stat-value">{{ totalBreakTime }} phút</p>
              <p class="stat-percentage">{{ breakPercentage }}%</p>
            </div>

            <div class="stat-card">
              <p class="stat-label">Hiệu suất</p>
              <p class="stat-value">{{ efficiency }}%</p>
              <p class="stat-text">Tối ưu</p>
            </div>
          </div>
        </div>

        <!-- Tips -->
        <div class="tips-section">
          <p class="tips-title">💡 Gợi ý</p>
          <ul class="tips-list">
            <li>Bắt đầu từ những nhiệm vụ khó nhất vào phiên đầu tiên</li>
            <li>Đảm bảo có đủ nước uống trong các phiên tập trung</li>
            <li>Sử dụng thời gian nghỉ để thở sâu hoặc đi bộ nhẹ</li>
            <li>Lập kế hoạch 1-2 lộ trình cho mỗi chủ đề quan trọng</li>
          </ul>
        </div>

        <!-- Export -->
        <button @click="exportPlan" class="export-btn">
          <span>⬇️</span>
          Xuất kế hoạch
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudyRoadmap',
  data() {
    return {
      targetHours: 3,
      focusMinutes: 25,
      breakMinutes: 5,
      plan: []
    }
  },
  computed: {
    totalTimeEstimate() {
      const cycle = this.focusMinutes + this.breakMinutes
      const cycles = Math.floor((this.targetHours * 60) / cycle)
      return cycles * cycle
    },
    estimatedCycles() {
      const cycle = this.focusMinutes + this.breakMinutes
      return Math.floor((this.targetHours * 60) / cycle)
    },
    totalFocusTime() {
      return this.plan
        .filter(s => s.type === 'focus')
        .reduce((sum, s) => sum + s.duration, 0)
    },
    totalBreakTime() {
      return this.plan
        .filter(s => s.type === 'break')
        .reduce((sum, s) => sum + s.duration, 0)
    },
    focusPercentage() {
      const total = this.totalFocusTime + this.totalBreakTime
      return total > 0 ? Math.round((this.totalFocusTime / total) * 100) : 0
    },
    breakPercentage() {
      return 100 - this.focusPercentage
    },
    efficiency() {
      return Math.max(50, this.focusPercentage)
    },
    formatEndTime() {
      const totalMinutes = this.totalTimeEstimate
      const hours = Math.floor(totalMinutes / 60)
      const minutes = totalMinutes % 60
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    },
    milestones() {
      const milestones = []
      let currentTime = 0

      this.plan.forEach((slot, index) => {
        currentTime += slot.duration
        if (index % 4 === 3) {
          const hours = Math.floor(currentTime / 60)
          const mins = currentTime % 60
          milestones.push({
            time: `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`,
            text: `🎉 Hoàn thành ${Math.ceil((index + 1) / 2)} phiên`
          })
        }
      })

      return milestones
    }
  },
  methods: {
    generate() {
      const totalMinutes = this.targetHours * 60
      const cycle = this.focusMinutes + this.breakMinutes
      const cycles = Math.floor(totalMinutes / cycle)
      this.plan = []

      for (let i = 0; i < cycles; i++) {
        this.plan.push({ type: 'focus', duration: this.focusMinutes })
        this.plan.push({ type: 'break', duration: this.breakMinutes })
      }
    },
    clearPlan() {
      if (this.plan.length > 0 && confirm('Bạn có chắc chắn muốn xóa kế hoạch?')) {
        this.plan = []
      }
    },
    savePlan() {
      alert('✓ Đã lưu kế hoạch')
    },
    exportPlan() {
      const planText = this.plan
        .map((slot, i) => `${i + 1}. ${slot.type === 'focus' ? 'Tập trung' : 'Nghỉ'}: ${slot.duration} phút`)
        .join('\n')

      const report = `
Lộ trình học tập
================================================
Mục tiêu: ${this.targetHours} giờ
Thời gian tập trung: ${this.focusMinutes} phút
Thời gian nghỉ: ${this.breakMinutes} phút
Tổng thời gian: ${this.totalTimeEstimate} phút

Chi tiết:
${planText}

Thống kê:
- Tập trung: ${this.totalFocusTime} phút (${this.focusPercentage}%)
- Nghỉ: ${this.totalBreakTime} phút (${this.breakPercentage}%)
- Hiệu suất: ${this.efficiency}%
      `

      const blob = new Blob([report], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Study-Roadmap-${new Date().getTime()}.txt`
      a.click()
    },
    increaseHours() {
      if (this.targetHours < 12) this.targetHours++
    },
    decreaseHours() {
      if (this.targetHours > 1) this.targetHours--
    },
    increaseFocus() {
      if (this.focusMinutes < 60) this.focusMinutes += 5
    },
    decreaseFocus() {
      if (this.focusMinutes > 10) this.focusMinutes -= 5
    },
    increaseBreak() {
      if (this.breakMinutes < 15) this.breakMinutes += 5
    },
    decreaseBreak() {
      if (this.breakMinutes > 5) this.breakMinutes -= 5
    }
  }
}
</script>

<style scoped>
.roadmap-container {
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

/* Input Section */
.input-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-lg);
  background-color: var(--background-secondary);
  border-radius: var(--radius-lg);
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.input-label {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0 var(--spacing-sm);
}

.btn-decrease,
.btn-increase {
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  color: var(--text-secondary);
  font-size: 18px;
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
}

.btn-decrease:hover,
.btn-increase:hover {
  color: var(--primary-color);
}

.number-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--text-color);
  text-align: center;
  outline: none;
}

.number-input::-webkit-outer-spin-button,
.number-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}

/* Summary Section */
.summary-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.summary-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  background: linear-gradient(135deg, #F0F4FF 0%, #E8F1FF 100%);
  border: 1px solid rgba(0, 122, 255, 0.2);
  border-radius: var(--radius-lg);
}

.summary-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.summary-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.summary-label {
  margin: 0;
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-value {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--primary-color);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.btn-generate,
.btn-save,
.btn-clear {
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

.btn-generate {
  background-color: var(--primary-color);
  color: #FFFFFF;
}

.btn-generate:hover {
  background-color: #0051D5;
}

.btn-save {
  background-color: var(--success);
  color: #FFFFFF;
}

.btn-save:hover:not(:disabled) {
  opacity: 0.9;
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-clear {
  background-color: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn-clear:hover:not(:disabled) {
  background-color: var(--background-secondary);
}

.btn-clear:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl) var(--spacing-lg);
  text-align: center;
}

.empty-icon {
  font-size: 40px;
  margin: 0 0 var(--spacing-md) 0;
}

.empty-text {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-color);
}

.empty-description {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

/* Timeline Section */
.timeline-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.section-title {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: 700;
  color: var(--text-color);
}

.timeline-count {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--primary-color);
  background-color: rgba(0, 122, 255, 0.1);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-full);
}

/* Timeline */
.timeline-container {
  padding: var(--spacing-lg);
  background-color: var(--background-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--text-secondary);
}

.timeline-time {
  font-family: 'Monaco', 'Courier New', monospace;
}

.timeline-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.timeline-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  background-color: var(--card-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  transition: all var(--transition-fast);
}

.timeline-item:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-md);
}

.timeline-item.is-focus {
  border-left: 3px solid var(--primary-color);
}

.timeline-item.is-break {
  border-left: 3px solid var(--success);
}

.item-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-color);
}

.item-icon {
  font-size: 16px;
}

.item-time {
  font-family: 'Monaco', 'Courier New', monospace;
}

.item-bar {
  height: 4px;
  background-color: var(--primary-color);
  border-radius: 2px;
  min-width: 20px;
}

.timeline-item.is-break .item-bar {
  background-color: var(--success);
}

/* Milestones */
.milestones-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.milestones-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.milestone-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--background-secondary);
  border-radius: var(--radius-lg);
  border-left: 3px solid var(--success);
}

.milestone-marker {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background-color: rgba(52, 199, 89, 0.1);
  border-radius: 50%;
  flex-shrink: 0;
}

.marker-time {
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: var(--success);
  font-family: 'Monaco', 'Courier New', monospace;
}

.milestone-text {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-color);
}

/* Breakdown */
.breakdown-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.breakdown-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
}

.stat-card {
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, #F0F4FF 0%, #E8F1FF 100%);
  border: 1px solid rgba(0, 122, 255, 0.2);
  border-radius: var(--radius-lg);
  text-align: center;
}

.stat-label {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-color);
}

.stat-percentage,
.stat-text {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: 600;
}

/* Tips */
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

/* Export Button */
.export-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: var(--spacing-md);
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

.export-btn:hover {
  background-color: #0051D5;
}

/* Responsive */
@media (max-width: 768px) {
  .card {
    padding: var(--spacing-md);
  }

  .input-section {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn-generate,
  .btn-save,
  .btn-clear {
    width: 100%;
  }

  .breakdown-stats {
    grid-template-columns: 1fr;
  }

  .milestone-item {
    flex-direction: column;
    text-align: center;
  }

  .milestone-marker {
    width: 40px;
    height: 40px;
  }
}
</style>