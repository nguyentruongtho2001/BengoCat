<template>
  <div class="stats-container">
    <div class="card">
      <!-- Header -->
      <div class="card-header">
        <div>
          <h2>📊 Thống kê Pomodoro</h2>
          <p class="card-description">Theo dõi tiến độ và thành tích của bạn</p>
        </div>
      </div>

      <!-- Range Selector -->
      <div class="range-selector">
        <button 
          v-for="option in rangeOptions"
          :key="option.value"
          class="range-btn"
          :class="{ active: range === option.value }"
          @click="range = option.value"
        >
          {{ option.label }}
        </button>
      </div>

      <!-- Key Metrics -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon">🎯</div>
          <div class="metric-content">
            <p class="metric-label">Phiên hoàn thành</p>
            <p class="metric-value">{{ totalSessions }}</p>
            <p class="metric-change">
              <span class="change-icon" :class="{ positive: sessionsChange >= 0 }">
                {{ sessionsChange >= 0 ? '↑' : '↓' }}
              </span>
              {{ Math.abs(sessionsChange) }} so với kỳ trước
            </p>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">⏱️</div>
          <div class="metric-content">
            <p class="metric-label">Tổng phút tập trung</p>
            <p class="metric-value">{{ totalMinutes }}</p>
            <p class="metric-change">
              <span class="change-icon" :class="{ positive: minutesChange >= 0 }">
                {{ minutesChange >= 0 ? '↑' : '↓' }}
              </span>
              {{ Math.abs(minutesChange) }}% so với kỳ trước
            </p>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">🔥</div>
          <div class="metric-content">
            <p class="metric-label">Chuỗi ngày liên tiếp</p>
            <p class="metric-value">{{ streak }}</p>
            <p class="metric-change">
              Tiếp tục giữ chuỗi!
            </p>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-icon">⭐</div>
          <div class="metric-content">
            <p class="metric-label">Hiệu suất</p>
            <p class="metric-value">{{ performanceScore }}%</p>
            <p class="metric-change">
              <span class="score-badge" :class="performanceLevel">
                {{ performanceLevel }}
              </span>
            </p>
          </div>
        </div>
      </div>

      <!-- Chart Section -->
      <div class="chart-section">
        <p class="section-title">Biểu đồ hoạt động</p>
        <div class="chart-container">
          <div class="chart-bars">
            <div 
              v-for="(day, index) in chartData"
              :key="index"
              class="chart-bar"
              :style="{ height: day.height + '%' }"
              :title="`${day.label}: ${day.sessions} phiên`"
            >
              <span class="bar-label">{{ day.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Weekly Breakdown -->
      <div class="breakdown-section">
        <p class="section-title">Chi tiết theo ngày</p>
        <div class="breakdown-list">
          <div 
            v-for="(day, index) in weeklyData"
            :key="index"
            class="breakdown-item"
          >
            <div class="day-info">
              <p class="day-name">{{ day.name }}</p>
              <p class="day-date">{{ day.date }}</p>
            </div>
            <div class="progress-bar">
              <div 
                class="progress-fill"
                :style="{ width: day.progress + '%' }"
              ></div>
            </div>
            <div class="day-stats">
              <span class="sessions-count">{{ day.sessions }} phiên</span>
              <span class="time-spent">{{ day.minutes }}m</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Achievements -->
      <div class="achievements-section">
        <p class="section-title">Thành tích</p>
        <div class="achievements-grid">
          <div 
            v-for="achievement in achievements"
            :key="achievement.id"
            class="achievement-card"
            :class="{ unlocked: achievement.unlocked }"
            :title="achievement.description"
          >
            <div class="achievement-icon">{{ achievement.icon }}</div>
            <p class="achievement-name">{{ achievement.name }}</p>
            <p v-if="!achievement.unlocked" class="achievement-progress">
              {{ achievement.progress }}/{{ achievement.goal }}
            </p>
          </div>
        </div>
      </div>

      <!-- Goal Section -->
      <div class="goal-section">
        <p class="section-title">Mục tiêu tuần này</p>
        <div class="goal-cards">
          <div class="goal-item">
            <div class="goal-header">
              <p class="goal-title">Hoàn thành 20 phiên</p>
              <p class="goal-target">10/20</p>
            </div>
            <div class="goal-progress-bar">
              <div class="goal-progress-fill" style="width: 50%"></div>
            </div>
          </div>

          <div class="goal-item">
            <div class="goal-header">
              <p class="goal-title">Tập trung 500 phút</p>
              <p class="goal-target">450/500</p>
            </div>
            <div class="goal-progress-bar">
              <div class="goal-progress-fill" style="width: 90%"></div>
            </div>
          </div>

          <div class="goal-item">
            <div class="goal-header">
              <p class="goal-title">Giữ chuỗi 7 ngày</p>
              <p class="goal-target">5/7</p>
            </div>
            <div class="goal-progress-bar">
              <div class="goal-progress-fill" style="width: 71%"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Insights -->
      <div class="insights-section">
        <p class="section-title">Thông tin chi tiết</p>
        <div class="insights-grid">
          <div class="insight-card">
            <span class="insight-icon">🕐</span>
            <p class="insight-text">Thời gian tập trung cao nhất: Sáng (8-10 AM)</p>
          </div>
          <div class="insight-card">
            <span class="insight-icon">📈</span>
            <p class="insight-text">Tuần này bạn tăng 25% so với tuần trước</p>
          </div>
          <div class="insight-card">
            <span class="insight-icon">💪</span>
            <p class="insight-text">Bạn là 80% so với người dùng khác</p>
          </div>
          <div class="insight-card">
            <span class="insight-icon">⭐</span>
            <p class="insight-text">Hãy tiếp tục! Bạn đang trên đường thành công</p>
          </div>
        </div>
      </div>

      <!-- Export Button -->
      <button class="export-btn" @click="exportData">
        <span>⬇️</span>
        Xuất báo cáo
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Stats',
  data() {
    return {
      range: 'week',
      rangeOptions: [
        { value: 'today', label: '📅 Hôm nay' },
        { value: 'week', label: '📆 Tuần này' },
        { value: 'month', label: '📊 Tháng này' }
      ],
      totalSessions: 18,
      totalMinutes: 450,
      streak: 5,
      sessionsChange: 3,
      minutesChange: 12,
      performanceScore: 85,
      chartData: [
        { label: 'Thứ 2', sessions: 3, height: 60 },
        { label: 'Thứ 3', sessions: 5, height: 100 },
        { label: 'Thứ 4', sessions: 4, height: 80 },
        { label: 'Thứ 5', sessions: 3, height: 60 },
        { label: 'Thứ 6', sessions: 2, height: 40 },
        { label: 'Thứ 7', sessions: 1, height: 20 },
        { label: 'CN', sessions: 0, height: 0 }
      ],
      weeklyData: [
        { name: 'Thứ 2', date: '11/25', sessions: 3, minutes: 75, progress: 60 },
        { name: 'Thứ 3', date: '11/26', sessions: 5, minutes: 125, progress: 100 },
        { name: 'Thứ 4', date: '11/27', sessions: 4, minutes: 100, progress: 80 },
        { name: 'Thứ 5', date: '11/28', sessions: 3, minutes: 75, progress: 60 },
        { name: 'Thứ 6', date: '11/29', sessions: 2, minutes: 50, progress: 40 },
        { name: 'Thứ 7', date: '11/30', sessions: 1, minutes: 25, progress: 20 },
        { name: 'CN', date: '12/1', sessions: 0, minutes: 0, progress: 0 }
      ],
      achievements: [
        { id: 1, name: 'Bắt đầu', icon: '🚀', description: 'Hoàn thành phiên đầu tiên', unlocked: true, progress: 1, goal: 1 },
        { id: 2, name: 'Chuyên cần', icon: '📚', description: 'Hoàn thành 10 phiên', unlocked: true, progress: 18, goal: 10 },
        { id: 3, name: 'Tập trung', icon: '🎯', description: 'Hoàn thành 50 phiên', unlocked: false, progress: 18, goal: 50 },
        { id: 4, name: 'Thép', icon: '💪', description: 'Giữ chuỗi 30 ngày', unlocked: false, progress: 5, goal: 30 },
        { id: 5, name: 'Huyền thoại', icon: '⭐', description: 'Hoàn thành 100 phiên', unlocked: false, progress: 18, goal: 100 },
        { id: 6, name: 'Siêu nhân', icon: '🦸', description: 'Một ngày 10 phiên', unlocked: false, progress: 5, goal: 10 }
      ]
    }
  },
  computed: {
    performanceLevel() {
      if (this.performanceScore >= 90) return 'Xuất sắc'
      if (this.performanceScore >= 75) return 'Tốt'
      if (this.performanceScore >= 60) return 'Bình thường'
      return 'Cần cải thiện'
    }
  },
  methods: {
    exportData() {
      const report = `
Báo cáo thống kê Pomodoro - ${new Date().toLocaleDateString('vi-VN')}
================================================

Khoảng thời gian: ${this.range}

KPI Chính:
- Phiên hoàn thành: ${this.totalSessions}
- Tổng phút tập trung: ${this.totalMinutes}
- Chuỗi ngày: ${this.streak}
- Hiệu suất: ${this.performanceScore}%

Dữ liệu chi tiết tuần này:
${this.weeklyData.map(d => `${d.name}: ${d.sessions} phiên, ${d.minutes} phút`).join('\n')}

Thành tích:
${this.achievements.filter(a => a.unlocked).map(a => `✓ ${a.name}`).join('\n')}
      `
      
      const blob = new Blob([report], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Pomodoro-Report-${new Date().getTime()}.txt`
      a.click()
    }
  }
}
</script>

<style scoped>
.stats-container {
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

/* Range Selector */
.range-selector {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  background-color: var(--background-secondary);
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
}

.range-btn {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
}

.range-btn:hover {
  background-color: var(--card-bg);
}

.range-btn.active {
  background-color: var(--card-bg);
  color: var(--primary-color);
  border-color: var(--primary-color);
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.metric-card {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, #F0F4FF 0%, #E8F1FF 100%);
  border: 1px solid rgba(0, 122, 255, 0.2);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);
}

.metric-card:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-md);
}

.metric-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.metric-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  flex: 1;
}

.metric-label {
  margin: 0;
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.metric-value {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: var(--primary-color);
}

.metric-change {
  margin: 0;
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.change-icon {
  font-size: 12px;
  color: var(--danger);
}

.change-icon.positive {
  color: var(--success);
}

.score-badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: var(--success);
  color: #FFFFFF;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
}

/* Chart Section */
.chart-section,
.breakdown-section,
.achievements-section,
.goal-section,
.insights-section {
  margin-bottom: var(--spacing-xl);
}

.section-title {
  margin: 0 0 var(--spacing-lg) 0;
  font-size: var(--font-size-base);
  font-weight: 700;
  color: var(--text-color);
}

.chart-container {
  padding: var(--spacing-lg);
  background-color: var(--background-secondary);
  border-radius: var(--radius-lg);
  height: 200px;
}

.chart-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 100%;
  gap: var(--spacing-md);
}

.chart-bar {
  flex: 1;
  background: linear-gradient(to top, var(--primary-color), #5AC8FA);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  min-height: 20px;
  transition: all var(--transition-base);
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.chart-bar:hover {
  opacity: 0.8;
  transform: translateY(-4px);
}

.bar-label {
  font-size: 11px;
  color: var(--text-tertiary);
  margin-bottom: 4px;
  font-weight: 600;
}

/* Breakdown Section */
.breakdown-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.breakdown-item {
  display: grid;
  grid-template-columns: 80px 1fr 100px;
  gap: var(--spacing-md);
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--background-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.day-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.day-name {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-color);
}

.day-date {
  margin: 0;
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.progress-bar {
  height: 6px;
  background-color: var(--border-color);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(to right, var(--primary-color), #5AC8FA);
  border-radius: 3px;
  transition: width var(--transition-base);
}

.day-stats {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  text-align: right;
}

.sessions-count {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-color);
}

.time-spent {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

/* Achievements */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--spacing-md);
}

.achievement-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background-color: var(--background-secondary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-lg);
  text-align: center;
  opacity: 0.6;
  transition: all var(--transition-base);
}

.achievement-card.unlocked {
  opacity: 1;
  background: linear-gradient(135deg, rgba(52, 199, 89, 0.1) 0%, rgba(52, 199, 89, 0.05) 100%);
  border-color: var(--success);
}

.achievement-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.achievement-icon {
  font-size: 40px;
}

.achievement-name {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-color);
}

.achievement-progress {
  margin: 0;
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

/* Goals */
.goal-cards {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.goal-item {
  padding: var(--spacing-lg);
  background-color: var(--background-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
}

.goal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.goal-title {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-color);
}

.goal-target {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--primary-color);
}

.goal-progress-bar {
  height: 8px;
  background-color: var(--border-color);
  border-radius: 4px;
  overflow: hidden;
}

.goal-progress-fill {
  height: 100%;
  background: linear-gradient(to right, var(--primary-color), #5AC8FA);
  border-radius: 4px;
  transition: width var(--transition-base);
}

/* Insights */
.insights-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.insight-card {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background-color: var(--background-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
}

.insight-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.insight-text {
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

  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
  }

  .breakdown-item {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }

  .achievements-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .insights-grid {
    grid-template-columns: 1fr;
  }
}
</style>