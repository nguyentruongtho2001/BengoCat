<template>
    <div class="stats-container">
        <div class="card">
            <!-- Header -->
            <div class="card-header">
                <div class="header-content">
                    <h2 class="card-title">📊 Thống kê Pomodoro</h2>
                    <p class="card-description">
                        Theo dõi tiến độ và thành tích của bạn
                    </p>
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
                    <span class="range-icon">{{ option.icon }}</span>
                    <span class="range-text">{{ option.label }}</span>
                </button>
            </div>

            <!-- Key Metrics -->
            <div class="metrics-grid">
                <div
                    class="metric-card"
                    v-for="metric in metrics"
                    :key="metric.id"
                >
                    <div class="metric-icon">{{ metric.icon }}</div>
                    <div class="metric-content">
                        <p class="metric-label">{{ metric.label }}</p>
                        <p class="metric-value">{{ metric.value }}</p>
                        <p
                            class="metric-change"
                            :class="{ positive: metric.change >= 0 }"
                        >
                            <span class="change-icon">{{
                                metric.change >= 0 ? "↗️" : "↘️"
                            }}</span>
                            {{ metric.change >= 0 ? "+" : "" }}{{ metric.change
                            }}{{ metric.unit }} so với kỳ trước
                        </p>
                    </div>
                </div>
            </div>

            <!-- Chart Section -->
            <div class="chart-section">
                <div class="section-header">
                    <p class="section-title">Biểu đồ hoạt động</p>
                    <div class="chart-legend">
                        <div class="legend-item">
                            <div
                                class="legend-color"
                                style="background: var(--ios-system-blue)"
                            ></div>
                            <span>Số phiên</span>
                        </div>
                    </div>
                </div>
                <div class="chart-container">
                    <div class="chart-bars">
                        <div
                            v-for="(day, index) in chartData"
                            :key="index"
                            class="chart-bar-wrapper"
                            :title="`${day.label}: ${day.sessions} phiên`"
                        >
                            <div
                                class="chart-bar"
                                :style="{ height: day.height + '%' }"
                            >
                                <div class="bar-fill"></div>
                            </div>
                            <span class="bar-label">{{ day.label }}</span>
                            <span class="bar-value">{{ day.sessions }}</span>
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
                        <div class="progress-container">
                            <div class="progress-bar">
                                <div
                                    class="progress-fill"
                                    :style="{ width: day.progress + '%' }"
                                ></div>
                            </div>
                            <div class="progress-text">{{ day.progress }}%</div>
                        </div>
                        <div class="day-stats">
                            <span class="sessions-count"
                                >{{ day.sessions }} phiên</span
                            >
                            <span class="time-spent">{{ day.minutes }}m</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Achievements -->
            <div class="achievements-section">
                <div class="section-header">
                    <p class="section-title">Thành tích</p>
                    <span class="achievements-count"
                        >{{ unlockedAchievements }}/{{ totalAchievements }} mở
                        khóa</span
                    >
                </div>
                <div class="achievements-grid">
                    <div
                        v-for="achievement in achievements"
                        :key="achievement.id"
                        class="achievement-card"
                        :class="{
                            unlocked: achievement.unlocked,
                            locked: !achievement.unlocked,
                        }"
                    >
                        <div class="achievement-icon">
                            {{ achievement.icon }}
                        </div>
                        <div class="achievement-content">
                            <p class="achievement-name">
                                {{ achievement.name }}
                            </p>
                            <p class="achievement-description">
                                {{ achievement.description }}
                            </p>
                            <div
                                v-if="!achievement.unlocked"
                                class="achievement-progress"
                            >
                                <div class="progress-bar">
                                    <div
                                        class="progress-fill"
                                        :style="{
                                            width:
                                                (achievement.progress /
                                                    achievement.goal) *
                                                    100 +
                                                '%',
                                        }"
                                    ></div>
                                </div>
                                <span class="progress-text"
                                    >{{ achievement.progress }}/{{
                                        achievement.goal
                                    }}</span
                                >
                            </div>
                        </div>
                        <div
                            v-if="achievement.unlocked"
                            class="achievement-badge"
                        >
                            <div class="checkmark"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Goal Section -->
            <div class="goal-section">
                <p class="section-title">Mục tiêu tuần này</p>
                <div class="goal-cards">
                    <div v-for="goal in goals" :key="goal.id" class="goal-item">
                        <div class="goal-header">
                            <div class="goal-info">
                                <p class="goal-title">{{ goal.title }}</p>
                                <p class="goal-description">
                                    {{ goal.description }}
                                </p>
                            </div>
                            <p class="goal-target">
                                {{ goal.current }}/{{ goal.target }}
                            </p>
                        </div>
                        <div class="goal-progress">
                            <div class="progress-bar">
                                <div
                                    class="progress-fill"
                                    :style="{ width: goal.percentage + '%' }"
                                ></div>
                            </div>
                            <span class="goal-percentage"
                                >{{ goal.percentage }}%</span
                            >
                        </div>
                    </div>
                </div>
            </div>

            <!-- Insights -->
            <div class="insights-section">
                <p class="section-title">Thông tin chi tiết</p>
                <div class="insights-grid">
                    <div
                        v-for="insight in insights"
                        :key="insight.id"
                        class="insight-card"
                    >
                        <div class="insight-icon">{{ insight.icon }}</div>
                        <p class="insight-text">{{ insight.text }}</p>
                    </div>
                </div>
            </div>

            <!-- Export Button -->
            <button class="export-btn" @click="exportData">
                <span class="btn-icon">📤</span>
                <span class="btn-text">Xuất báo cáo</span>
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: "Stats",
    data() {
        return {
            range: "week",
            rangeOptions: [
                { value: "today", label: "Hôm nay", icon: "📅" },
                { value: "week", label: "Tuần này", icon: "📆" },
                { value: "month", label: "Tháng này", icon: "📊" },
            ],
            metrics: [
                {
                    id: 1,
                    label: "Phiên hoàn thành",
                    value: 18,
                    change: 3,
                    unit: "",
                    icon: "🎯",
                },
                {
                    id: 2,
                    label: "Tổng phút tập trung",
                    value: "450",
                    change: 12,
                    unit: "%",
                    icon: "⏱️",
                },
                {
                    id: 3,
                    label: "Chuỗi ngày liên tiếp",
                    value: 5,
                    change: 0,
                    unit: "",
                    icon: "🔥",
                },
                {
                    id: 4,
                    label: "Hiệu suất",
                    value: "85%",
                    change: 8,
                    unit: "%",
                    icon: "⭐",
                },
            ],
            chartData: [
                { label: "T2", sessions: 3, height: 60 },
                { label: "T3", sessions: 5, height: 100 },
                { label: "T4", sessions: 4, height: 80 },
                { label: "T5", sessions: 3, height: 60 },
                { label: "T6", sessions: 2, height: 40 },
                { label: "T7", sessions: 1, height: 20 },
                { label: "CN", sessions: 0, height: 0 },
            ],
            weeklyData: [
                {
                    name: "Thứ 2",
                    date: "11/25",
                    sessions: 3,
                    minutes: 75,
                    progress: 60,
                },
                {
                    name: "Thứ 3",
                    date: "11/26",
                    sessions: 5,
                    minutes: 125,
                    progress: 100,
                },
                {
                    name: "Thứ 4",
                    date: "11/27",
                    sessions: 4,
                    minutes: 100,
                    progress: 80,
                },
                {
                    name: "Thứ 5",
                    date: "11/28",
                    sessions: 3,
                    minutes: 75,
                    progress: 60,
                },
                {
                    name: "Thứ 6",
                    date: "11/29",
                    sessions: 2,
                    minutes: 50,
                    progress: 40,
                },
                {
                    name: "Thứ 7",
                    date: "11/30",
                    sessions: 1,
                    minutes: 25,
                    progress: 20,
                },
                {
                    name: "CN",
                    date: "12/1",
                    sessions: 0,
                    minutes: 0,
                    progress: 0,
                },
            ],
            achievements: [
                {
                    id: 1,
                    name: "Bắt đầu",
                    icon: "🚀",
                    description: "Hoàn thành phiên đầu tiên",
                    unlocked: true,
                    progress: 1,
                    goal: 1,
                },
                {
                    id: 2,
                    name: "Chuyên cần",
                    icon: "📚",
                    description: "Hoàn thành 10 phiên",
                    unlocked: true,
                    progress: 18,
                    goal: 10,
                },
                {
                    id: 3,
                    name: "Tập trung",
                    icon: "🎯",
                    description: "Hoàn thành 50 phiên",
                    unlocked: false,
                    progress: 18,
                    goal: 50,
                },
                {
                    id: 4,
                    name: "Thép",
                    icon: "💪",
                    description: "Giữ chuỗi 30 ngày",
                    unlocked: false,
                    progress: 5,
                    goal: 30,
                },
                {
                    id: 5,
                    name: "Huyền thoại",
                    icon: "⭐",
                    description: "Hoàn thành 100 phiên",
                    unlocked: false,
                    progress: 18,
                    goal: 100,
                },
                {
                    id: 6,
                    name: "Siêu nhân",
                    icon: "🦸",
                    description: "Một ngày 10 phiên",
                    unlocked: false,
                    progress: 5,
                    goal: 10,
                },
            ],
            goals: [
                {
                    id: 1,
                    title: "Hoàn thành 20 phiên",
                    description: "Phiên Pomodoro",
                    current: 10,
                    target: 20,
                    percentage: 50,
                },
                {
                    id: 2,
                    title: "Tập trung 500 phút",
                    description: "Tổng thời gian",
                    current: 450,
                    target: 500,
                    percentage: 90,
                },
                {
                    id: 3,
                    title: "Giữ chuỗi 7 ngày",
                    description: "Ngày liên tiếp",
                    current: 5,
                    target: 7,
                    percentage: 71,
                },
            ],
            insights: [
                {
                    id: 1,
                    icon: "🕐",
                    text: "Thời gian tập trung cao nhất: Sáng (8-10 AM)",
                },
                {
                    id: 2,
                    icon: "📈",
                    text: "Tuần này bạn tăng 25% so với tuần trước",
                },
                {
                    id: 3,
                    icon: "💪",
                    text: "Bạn là 80% so với người dùng khác",
                },
                {
                    id: 4,
                    icon: "⭐",
                    text: "Hãy tiếp tục! Bạn đang trên đường thành công",
                },
            ],
        };
    },
    computed: {
        unlockedAchievements() {
            return this.achievements.filter((a) => a.unlocked).length;
        },
        totalAchievements() {
            return this.achievements.length;
        },
    },
    methods: {
        exportData() {
            const report = `
Báo cáo thống kê Pomodoro - ${new Date().toLocaleDateString("vi-VN")}
================================================

Khoảng thời gian: ${this.range}

KPI Chính:
- Phiên hoàn thành: ${this.metrics[0].value}
- Tổng phút tập trung: ${this.metrics[1].value}
- Chuỗi ngày: ${this.metrics[2].value}
- Hiệu suất: ${this.metrics[3].value}

Dữ liệu chi tiết tuần này:
${this.weeklyData.map((d) => `${d.name}: ${d.sessions} phiên, ${d.minutes} phút`).join("\n")}

Thành tích:
${this.achievements
    .filter((a) => a.unlocked)
    .map((a) => `✓ ${a.name}`)
    .join("\n")}
      `;

            const blob = new Blob([report], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Pomodoro-Report-${new Date().getTime()}.txt`;
            a.click();

            this.showToast("📤 Đã xuất báo cáo thành công!");
        },
        showToast(message) {
            // Simple toast implementation
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
};
</script>

<style scoped>
.stats-container {
    width: 100%;
    max-width: 600px;
    margin: 0 auto;
}

.card {
    background-color: var(--ios-background-primary);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--ios-system-gray5);
}

/* Header */
.card-header {
    margin-bottom: var(--spacing-xl);
    padding-bottom: var(--spacing-lg);
    border-bottom: 1px solid var(--ios-system-gray5);
}

.header-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.card-title {
    margin: 0;
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--ios-label-primary);
    font-family: var(--font-family);
}

.card-description {
    margin: 0;
    font-size: var(--font-size-sm);
    color: var(--ios-label-secondary);
    line-height: 1.4;
}

/* Range Selector */
.range-selector {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-xl);
    background-color: var(--ios-background-secondary);
    padding: var(--spacing-sm);
    border-radius: var(--radius-lg);
    border: 1px solid var(--ios-system-gray5);
}

.range-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-md) var(--spacing-sm);
    background-color: transparent;
    border: 2px solid transparent;
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--ios-label-secondary);
    cursor: pointer;
    transition: all var(--transition-base);
    outline: none;
}

.range-btn:hover {
    background-color: var(--ios-background-primary);
    border-color: var(--ios-system-gray4);
}

.range-btn.active {
    background-color: var(--ios-background-primary);
    color: var(--ios-system-blue);
    border-color: var(--ios-system-blue);
    box-shadow: var(--shadow-sm);
}

.range-icon {
    font-size: 18px;
}

.range-text {
    font-size: var(--font-size-xs);
    font-weight: 600;
}

/* Metrics Grid */
.metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-2xl);
}

.metric-card {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    background-color: var(--ios-background-secondary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--ios-system-gray5);
    transition: all var(--transition-base);
    position: relative;
    overflow: hidden;
}

.metric-card::before {
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

.metric-card:hover::before {
    left: 100%;
}

.metric-card:hover {
    border-color: var(--ios-system-gray4);
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
}

.metric-icon {
    font-size: 24px;
    flex-shrink: 0;
}

.metric-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    flex: 1;
    min-width: 0;
}

.metric-label {
    margin: 0;
    font-size: var(--font-size-xs);
    font-weight: 600;
    color: var(--ios-label-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.metric-value {
    margin: 0;
    font-size: var(--font-size-xl);
    font-weight: 700;
    color: var(--ios-system-blue);
    line-height: 1;
}

.metric-change {
    margin: 0;
    font-size: var(--font-size-xs);
    color: var(--ios-system-red);
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
}

.metric-change.positive {
    color: var(--ios-system-green);
}

.change-icon {
    font-size: 12px;
}

/* Sections */
.chart-section,
.breakdown-section,
.achievements-section,
.goal-section,
.insights-section {
    margin-bottom: var(--spacing-2xl);
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--spacing-lg);
}

.section-title {
    margin: 0;
    font-size: var(--font-size-lg);
    font-weight: 700;
    color: var(--ios-label-primary);
}

.chart-legend {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.legend-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    font-size: var(--font-size-xs);
    color: var(--ios-label-secondary);
}

.legend-color {
    width: 12px;
    height: 12px;
    border-radius: var(--radius-sm);
    background: var(--ios-system-blue);
}

.achievements-count {
    font-size: var(--font-size-sm);
    color: var(--ios-label-secondary);
    font-weight: 600;
}

/* Chart Section */
.chart-container {
    padding: var(--spacing-lg);
    background-color: var(--ios-background-secondary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--ios-system-gray5);
    height: 200px;
}

.chart-bars {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    height: 100%;
    gap: var(--spacing-md);
}

.chart-bar-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    gap: var(--spacing-sm);
}

.chart-bar {
    flex: 1;
    width: 100%;
    display: flex;
    align-items: flex-end;
    border-radius: var(--radius-md) var(--radius-md) 0 0;
    min-height: 20px;
    transition: all var(--transition-base);
    cursor: pointer;
    position: relative;
}

.bar-fill {
    width: 100%;
    background: linear-gradient(
        to top,
        var(--ios-system-blue),
        var(--ios-system-teal)
    );
    border-radius: var(--radius-md) var(--radius-md) 0 0;
    transition: height var(--transition-base);
}

.chart-bar:hover .bar-fill {
    opacity: 0.8;
    transform: translateY(-4px);
}

.bar-label {
    font-size: var(--font-size-xs);
    color: var(--ios-label-tertiary);
    font-weight: 600;
}

.bar-value {
    font-size: var(--font-size-xs);
    color: var(--ios-label-primary);
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
    grid-template-columns: 80px 1fr auto;
    gap: var(--spacing-lg);
    align-items: center;
    padding: var(--spacing-md) var(--spacing-lg);
    background-color: var(--ios-background-secondary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--ios-system-gray5);
    transition: all var(--transition-base);
}

.breakdown-item:hover {
    border-color: var(--ios-system-gray4);
    transform: translateY(-1px);
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
    color: var(--ios-label-primary);
}

.day-date {
    margin: 0;
    font-size: var(--font-size-xs);
    color: var(--ios-label-tertiary);
}

.progress-container {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    flex: 1;
}

.progress-bar {
    flex: 1;
    height: 6px;
    background-color: var(--ios-system-gray5);
    border-radius: 3px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(
        to right,
        var(--ios-system-blue),
        var(--ios-system-teal)
    );
    border-radius: 3px;
    transition: width var(--transition-base);
}

.progress-text {
    font-size: var(--font-size-xs);
    color: var(--ios-label-secondary);
    font-weight: 600;
    min-width: 30px;
    text-align: right;
}

.day-stats {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    text-align: right;
    min-width: 80px;
}

.sessions-count {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--ios-label-primary);
}

.time-spent {
    font-size: var(--font-size-xs);
    color: var(--ios-label-secondary);
}

/* Achievements */
.achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--spacing-md);
}

.achievement-card {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
    background-color: var(--ios-background-secondary);
    border: 2px solid var(--ios-system-gray5);
    border-radius: var(--radius-lg);
    transition: all var(--transition-base);
    position: relative;
}

.achievement-card.unlocked {
    background: linear-gradient(
        135deg,
        rgba(52, 199, 89, 0.08) 0%,
        rgba(52, 199, 89, 0.04) 100%
    );
    border-color: var(--ios-system-green);
}

.achievement-card.locked {
    opacity: 0.7;
}

.achievement-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
}

.achievement-icon {
    font-size: 32px;
    flex-shrink: 0;
}

.achievement-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.achievement-name {
    margin: 0;
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--ios-label-primary);
}

.achievement-description {
    margin: 0;
    font-size: var(--font-size-sm);
    color: var(--ios-label-secondary);
    line-height: 1.4;
}

.achievement-progress {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    margin-top: var(--spacing-xs);
}

.achievement-progress .progress-bar {
    flex: 1;
    height: 4px;
}

.achievement-progress .progress-text {
    font-size: var(--font-size-xs);
    color: var(--ios-label-tertiary);
}

.achievement-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background-color: var(--ios-system-green);
    border-radius: var(--radius-full);
    flex-shrink: 0;
}

.checkmark {
    width: 12px;
    height: 12px;
    background: white;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='white' d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'/%3E%3C/svg%3E")
        center/contain no-repeat;
}

/* Goals */
.goal-cards {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
}

.goal-item {
    padding: var(--spacing-lg);
    background-color: var(--ios-background-secondary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--ios-system-gray5);
    transition: all var(--transition-base);
}

.goal-item:hover {
    border-color: var(--ios-system-gray4);
    transform: translateY(-1px);
}

.goal-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: var(--spacing-md);
}

.goal-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.goal-title {
    margin: 0;
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--ios-label-primary);
}

.goal-description {
    margin: 0;
    font-size: var(--font-size-sm);
    color: var(--ios-label-secondary);
}

.goal-target {
    margin: 0;
    font-size: var(--font-size-base);
    font-weight: 700;
    color: var(--ios-system-blue);
}

.goal-progress {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.goal-progress .progress-bar {
    flex: 1;
    height: 8px;
}

.goal-percentage {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--ios-label-primary);
    min-width: 40px;
    text-align: right;
}

/* Insights */
.insights-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-md);
}

.insight-card {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    background-color: var(--ios-background-secondary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--ios-system-gray5);
    transition: all var(--transition-base);
}

.insight-card:hover {
    border-color: var(--ios-system-gray4);
    transform: translateY(-1px);
}

.insight-icon {
    font-size: 20px;
    flex-shrink: 0;
    margin-top: 2px;
}

.insight-text {
    margin: 0;
    font-size: var(--font-size-sm);
    color: var(--ios-label-secondary);
    line-height: 1.5;
}

/* Export Button */
.export-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    width: 100%;
    padding: var(--spacing-lg);
    background-color: var(--ios-system-blue);
    color: white;
    border: none;
    border-radius: var(--radius-lg);
    font-size: var(--font-size-base);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-base);
    outline: none;
    position: relative;
    overflow: hidden;
}

.export-btn::before {
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

.export-btn:hover::before {
    left: 100%;
}

.export-btn:hover {
    background-color: #0056cc;
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.btn-icon {
    font-size: 18px;
}

.btn-text {
    font-weight: 600;
}

/* Responsive Design */
@media (max-width: 768px) {
    .stats-container {
        max-width: 100%;
    }

    .card {
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
    }

    .metrics-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-sm);
    }

    .range-selector {
        grid-template-columns: 1fr;
    }

    .breakdown-item {
        grid-template-columns: 1fr;
        gap: var(--spacing-md);
        text-align: center;
    }

    .progress-container {
        order: 3;
        grid-column: 1 / -1;
    }

    .day-stats {
        order: 2;
        flex-direction: row;
        justify-content: space-around;
        text-align: center;
    }

    .achievements-grid {
        grid-template-columns: 1fr;
    }

    .insights-grid {
        grid-template-columns: 1fr;
    }

    .section-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-sm);
    }
}

@media (max-width: 480px) {
    .metrics-grid {
        grid-template-columns: 1fr;
    }

    .chart-bars {
        gap: var(--spacing-sm);
    }

    .achievement-card {
        flex-direction: column;
        text-align: center;
        gap: var(--spacing-md);
    }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .metric-card {
        background: var(--ios-background-tertiary);
    }

    .breakdown-item {
        background: var(--ios-background-tertiary);
    }

    .achievement-card {
        background: var(--ios-background-tertiary);
    }

    .goal-item {
        background: var(--ios-background-tertiary);
    }

    .insight-card {
        background: var(--ios-background-tertiary);
    }
}
</style>
