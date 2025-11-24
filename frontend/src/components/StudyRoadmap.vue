<template>
    <div class="roadmap-container">
        <div class="card">
            <!-- Header -->
            <div class="card-header">
                <div class="header-content">
                    <h2 class="card-title">🗺️ Lộ trình học tập</h2>
                    <p class="card-description">
                        Lập kế hoạch và tối ưu hóa thời gian học tập
                    </p>
                </div>
            </div>

            <!-- Input Section -->
            <div class="input-section">
                <div
                    class="input-group"
                    v-for="input in inputs"
                    :key="input.id"
                >
                    <label class="input-label">{{ input.label }}</label>
                    <div class="input-wrapper">
                        <button
                            class="btn-stepper"
                            @click="input.decrease"
                            :disabled="input.value <= input.min"
                        >
                            <span class="stepper-icon">−</span>
                        </button>
                        <input
                            type="number"
                            v-model.number="input.value"
                            :min="input.min"
                            :max="input.max"
                            :step="input.step"
                            class="number-input"
                        />
                        <button
                            class="btn-stepper"
                            @click="input.increase"
                            :disabled="input.value >= input.max"
                        >
                            <span class="stepper-icon">+</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Summary Cards -->
            <div class="summary-section">
                <div
                    v-for="summary in summaries"
                    :key="summary.id"
                    class="summary-card"
                >
                    <div class="summary-icon">{{ summary.icon }}</div>
                    <div class="summary-content">
                        <p class="summary-label">{{ summary.label }}</p>
                        <p class="summary-value">{{ summary.value }}</p>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
                <button @click="generate" class="btn-primary">
                    <span class="btn-icon">🎯</span>
                    <span class="btn-text">Tạo lộ trình</span>
                </button>
                <button
                    @click="savePlan"
                    class="btn-secondary"
                    :disabled="plan.length === 0"
                >
                    <span class="btn-icon">💾</span>
                    <span class="btn-text">Lưu kế hoạch</span>
                </button>
                <button
                    @click="clearPlan"
                    class="btn-outline"
                    :disabled="plan.length === 0"
                >
                    <span class="btn-icon">🗑️</span>
                    <span class="btn-text">Xóa</span>
                </button>
            </div>

            <!-- Empty State -->
            <div v-if="plan.length === 0" class="empty-state">
                <div class="empty-icon">📋</div>
                <p class="empty-title">Chưa có lộ trình</p>
                <p class="empty-description">
                    Nhấn "Tạo lộ trình" để bắt đầu lập kế hoạch học tập
                </p>
            </div>

            <!-- Timeline Section -->
            <div v-else class="timeline-section">
                <div class="section-header">
                    <p class="section-title">Lộ trình chi tiết</p>
                    <span class="section-badge">{{ plan.length }} khối</span>
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
                            :class="{
                                'focus-slot': slot.type === 'focus',
                                'break-slot': slot.type === 'break',
                            }"
                            :title="`${slot.type === 'focus' ? 'Tập trung' : 'Nghỉ'}: ${slot.duration} phút`"
                        >
                            <div class="item-content">
                                <div class="item-icon">
                                    {{ slot.type === "focus" ? "🎯" : "☕" }}
                                </div>
                                <div class="item-info">
                                    <p class="item-type">
                                        {{
                                            slot.type === "focus"
                                                ? "Tập trung"
                                                : "Nghỉ ngơi"
                                        }}
                                    </p>
                                    <p class="item-duration">
                                        {{ slot.duration }} phút
                                    </p>
                                </div>
                                <div class="item-index">#{{ index + 1 }}</div>
                            </div>
                            <div
                                class="item-progress"
                                :style="{
                                    width:
                                        (slot.duration / focusMinutes) * 100 +
                                        '%',
                                }"
                            ></div>
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
                                <span class="marker-time">{{
                                    milestone.time
                                }}</span>
                            </div>
                            <p class="milestone-text">{{ milestone.text }}</p>
                        </div>
                    </div>
                </div>

                <!-- Statistics -->
                <div class="stats-section">
                    <p class="section-title">Thống kê hiệu suất</p>
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div
                                class="stat-icon"
                                style="color: var(--ios-system-blue)"
                            >
                                🎯
                            </div>
                            <div class="stat-content">
                                <p class="stat-label">Tập trung</p>
                                <p class="stat-value">
                                    {{ totalFocusTime }} phút
                                </p>
                                <p class="stat-percentage">
                                    {{ focusPercentage }}%
                                </p>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div
                                class="stat-icon"
                                style="color: var(--ios-system-green)"
                            >
                                ☕
                            </div>
                            <div class="stat-content">
                                <p class="stat-label">Nghỉ ngơi</p>
                                <p class="stat-value">
                                    {{ totalBreakTime }} phút
                                </p>
                                <p class="stat-percentage">
                                    {{ breakPercentage }}%
                                </p>
                            </div>
                        </div>

                        <div class="stat-card">
                            <div
                                class="stat-icon"
                                style="color: var(--ios-system-orange)"
                            >
                                ⚡
                            </div>
                            <div class="stat-content">
                                <p class="stat-label">Hiệu suất</p>
                                <p class="stat-value">{{ efficiency }}%</p>
                                <p class="stat-text">Tối ưu</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Tips Section -->
                <div class="tips-section">
                    <div class="tips-header">
                        <span class="tips-icon">💡</span>
                        <p class="tips-title">Mẹo học tập hiệu quả</p>
                    </div>
                    <ul class="tips-list">
                        <li class="tip-item">
                            Bắt đầu từ những nhiệm vụ khó nhất vào phiên đầu
                            tiên
                        </li>
                        <li class="tip-item">
                            Đảm bảo có đủ nước uống trong các phiên tập trung
                        </li>
                        <li class="tip-item">
                            Sử dụng thời gian nghỉ để thở sâu hoặc đi bộ nhẹ
                        </li>
                        <li class="tip-item">
                            Lập kế hoạch 1-2 lộ trình cho mỗi chủ đề quan trọng
                        </li>
                    </ul>
                </div>

                <!-- Export Button -->
                <button @click="exportPlan" class="export-btn">
                    <span class="btn-icon">📤</span>
                    <span class="btn-text">Xuất kế hoạch</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "StudyRoadmap",
    data() {
        return {
            targetHours: 3,
            focusMinutes: 25,
            breakMinutes: 5,
            plan: [],
        };
    },
    computed: {
        inputs() {
            return [
                {
                    id: 1,
                    label: "Mục tiêu (giờ)",
                    value: this.targetHours,
                    min: 1,
                    max: 12,
                    step: 1,
                    decrease: this.decreaseHours,
                    increase: this.increaseHours,
                },
                {
                    id: 2,
                    label: "Tập trung (phút)",
                    value: this.focusMinutes,
                    min: 10,
                    max: 60,
                    step: 5,
                    decrease: this.decreaseFocus,
                    increase: this.increaseFocus,
                },
                {
                    id: 3,
                    label: "Nghỉ (phút)",
                    value: this.breakMinutes,
                    min: 5,
                    max: 15,
                    step: 5,
                    decrease: this.decreaseBreak,
                    increase: this.increaseBreak,
                },
            ];
        },
        summaries() {
            return [
                {
                    id: 1,
                    label: "Tổng thời gian",
                    value: `${this.totalTimeEstimate} phút`,
                    icon: "⏱️",
                },
                {
                    id: 2,
                    label: "Số phiên",
                    value: this.estimatedCycles,
                    icon: "🎯",
                },
                {
                    id: 3,
                    label: "Thực tế có thể",
                    value: `${Math.floor(this.totalTimeEstimate / 60)}h`,
                    icon: "✓",
                },
            ];
        },
        totalTimeEstimate() {
            const cycle = this.focusMinutes + this.breakMinutes;
            const cycles = Math.floor((this.targetHours * 60) / cycle);
            return cycles * cycle;
        },
        estimatedCycles() {
            const cycle = this.focusMinutes + this.breakMinutes;
            return Math.floor((this.targetHours * 60) / cycle);
        },
        totalFocusTime() {
            return this.plan
                .filter((s) => s.type === "focus")
                .reduce((sum, s) => sum + s.duration, 0);
        },
        totalBreakTime() {
            return this.plan
                .filter((s) => s.type === "break")
                .reduce((sum, s) => sum + s.duration, 0);
        },
        focusPercentage() {
            const total = this.totalFocusTime + this.totalBreakTime;
            return total > 0
                ? Math.round((this.totalFocusTime / total) * 100)
                : 0;
        },
        breakPercentage() {
            return 100 - this.focusPercentage;
        },
        efficiency() {
            return Math.max(50, this.focusPercentage);
        },
        formatEndTime() {
            const totalMinutes = this.totalTimeEstimate;
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
        },
        milestones() {
            const milestones = [];
            let currentTime = 0;

            this.plan.forEach((slot, index) => {
                currentTime += slot.duration;
                if (index % 4 === 3) {
                    const hours = Math.floor(currentTime / 60);
                    const mins = currentTime % 60;
                    milestones.push({
                        time: `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`,
                        text: `🎉 Hoàn thành ${Math.ceil((index + 1) / 2)} phiên`,
                    });
                }
            });

            return milestones;
        },
    },
    methods: {
        generate() {
            const totalMinutes = this.targetHours * 60;
            const cycle = this.focusMinutes + this.breakMinutes;
            const cycles = Math.floor(totalMinutes / cycle);
            this.plan = [];

            for (let i = 0; i < cycles; i++) {
                this.plan.push({ type: "focus", duration: this.focusMinutes });
                this.plan.push({ type: "break", duration: this.breakMinutes });
            }

            this.showToast("🎯 Đã tạo lộ trình thành công!");
        },
        clearPlan() {
            if (
                this.plan.length > 0 &&
                confirm("Bạn có chắc chắn muốn xóa kế hoạch?")
            ) {
                this.plan = [];
                this.showToast("🗑️ Đã xóa lộ trình");
            }
        },
        savePlan() {
            this.showToast("💾 Đã lưu kế hoạch");
        },
        exportPlan() {
            const planText = this.plan
                .map(
                    (slot, i) =>
                        `${i + 1}. ${slot.type === "focus" ? "Tập trung" : "Nghỉ"}: ${slot.duration} phút`,
                )
                .join("\n");

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
      `;

            const blob = new Blob([report], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Study-Roadmap-${new Date().getTime()}.txt`;
            a.click();

            this.showToast("📤 Đã xuất kế hoạch!");
        },
        increaseHours() {
            if (this.targetHours < 12) this.targetHours++;
        },
        decreaseHours() {
            if (this.targetHours > 1) this.targetHours--;
        },
        increaseFocus() {
            if (this.focusMinutes < 60) this.focusMinutes += 5;
        },
        decreaseFocus() {
            if (this.focusMinutes > 10) this.focusMinutes -= 5;
        },
        increaseBreak() {
            if (this.breakMinutes < 15) this.breakMinutes += 5;
        },
        decreaseBreak() {
            if (this.breakMinutes > 5) this.breakMinutes -= 5;
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
};
</script>

<style scoped>
.roadmap-container {
    width: 100%;
    max-width: 500px;
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

/* Input Section */
.input-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
    padding: var(--spacing-lg);
    background-color: var(--ios-background-secondary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--ios-system-gray5);
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.input-label {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--ios-label-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.input-wrapper {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    background-color: var(--ios-background-primary);
    border: 1px solid var(--ios-system-gray4);
    border-radius: var(--radius-md);
    padding: 0 var(--spacing-sm);
    transition: all var(--transition-base);
}

.input-wrapper:focus-within {
    border-color: var(--ios-system-blue);
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.btn-stepper {
    width: 32px;
    height: 32px;
    background: none;
    border: none;
    color: var(--ios-label-tertiary);
    font-size: 18px;
    cursor: pointer;
    transition: all var(--transition-base);
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
}

.btn-stepper:hover:not(:disabled) {
    background-color: var(--ios-system-gray5);
    color: var(--ios-system-blue);
}

.btn-stepper:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.stepper-icon {
    font-weight: 600;
}

.number-input {
    flex: 1;
    border: none;
    background: transparent;
    font-size: var(--font-size-lg);
    font-weight: 700;
    color: var(--ios-label-primary);
    text-align: center;
    outline: none;
    padding: var(--spacing-sm) 0;
}

.number-input::-webkit-outer-spin-button,
.number-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Summary Section */
.summary-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
}

.summary-card {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    background-color: var(--ios-background-secondary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--ios-system-gray5);
    transition: all var(--transition-base);
    position: relative;
    overflow: hidden;
}

.summary-card::before {
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

.summary-card:hover::before {
    left: 100%;
}

.summary-card:hover {
    border-color: var(--ios-system-gray4);
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
}

.summary-icon {
    font-size: 24px;
    flex-shrink: 0;
}

.summary-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    flex: 1;
    min-width: 0;
}

.summary-label {
    margin: 0;
    font-size: var(--font-size-xs);
    font-weight: 600;
    color: var(--ios-label-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.summary-value {
    margin: 0;
    font-size: var(--font-size-lg);
    font-weight: 700;
    color: var(--ios-system-blue);
    line-height: 1;
}

/* Action Buttons */
.action-buttons {
    display: flex;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
}

.btn-primary,
.btn-secondary,
.btn-outline {
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
    transition: all var(--transition-base);
    outline: none;
    position: relative;
    overflow: hidden;
}

.btn-primary::before,
.btn-secondary::before,
.btn-outline::before {
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

.btn-primary:hover::before,
.btn-secondary:hover::before,
.btn-outline:hover::before {
    left: 100%;
}

.btn-primary {
    background-color: var(--ios-system-blue);
    color: white;
}

.btn-primary:hover {
    background-color: #0056cc;
    transform: translateY(-1px);
}

.btn-secondary {
    background-color: var(--ios-system-green);
    color: white;
}

.btn-secondary:hover:not(:disabled) {
    background-color: #30b456;
    transform: translateY(-1px);
}

.btn-secondary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-outline {
    background-color: transparent;
    color: var(--ios-label-secondary);
    border: 1px solid var(--ios-system-gray4);
}

.btn-outline:hover:not(:disabled) {
    background-color: var(--ios-background-secondary);
    border-color: var(--ios-system-gray3);
    color: var(--ios-label-primary);
    transform: translateY(-1px);
}

.btn-outline:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-icon {
    font-size: 18px;
}

.btn-text {
    font-weight: 600;
}

/* Empty State */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-2xl) var(--spacing-lg);
    text-align: center;
    background-color: var(--ios-background-secondary);
    border-radius: var(--radius-lg);
    border: 2px dashed var(--ios-system-gray5);
}

.empty-icon {
    font-size: 48px;
    margin: 0 0 var(--spacing-lg) 0;
    opacity: 0.5;
}

.empty-title {
    margin: 0 0 var(--spacing-sm) 0;
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--ios-label-primary);
}

.empty-description {
    margin: 0;
    font-size: var(--font-size-sm);
    color: var(--ios-label-secondary);
    line-height: 1.5;
}

/* Timeline Section */
.timeline-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xl);
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-md);
}

.section-title {
    margin: 0;
    font-size: var(--font-size-lg);
    font-weight: 700;
    color: var(--ios-label-primary);
}

.section-badge {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--ios-system-blue);
    background-color: rgba(0, 122, 255, 0.1);
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: var(--radius-full);
}

/* Timeline Container */
.timeline-container {
    padding: var(--spacing-lg);
    background-color: var(--ios-background-secondary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--ios-system-gray5);
}

.timeline-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: var(--spacing-lg);
    font-size: var(--font-size-xs);
    font-weight: 600;
    color: var(--ios-label-secondary);
}

.timeline-time {
    font-family: "Monaco", "Courier New", monospace;
    font-weight: 600;
}

.timeline-items {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.timeline-item {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    padding: var(--spacing-lg);
    background-color: var(--ios-background-primary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--ios-system-gray5);
    transition: all var(--transition-base);
    position: relative;
    overflow: hidden;
}

.timeline-item::before {
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

.timeline-item:hover::before {
    left: 100%;
}

.timeline-item:hover {
    border-color: var(--ios-system-gray4);
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
}

.focus-slot {
    border-left: 4px solid var(--ios-system-blue);
}

.break-slot {
    border-left: 4px solid var(--ios-system-green);
}

.item-content {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.item-icon {
    font-size: 20px;
    flex-shrink: 0;
}

.item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.item-type {
    margin: 0;
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--ios-label-primary);
}

.item-duration {
    margin: 0;
    font-size: var(--font-size-sm);
    color: var(--ios-label-secondary);
    font-family: "Monaco", "Courier New", monospace;
}

.item-index {
    font-size: var(--font-size-xs);
    font-weight: 600;
    color: var(--ios-label-tertiary);
    background-color: var(--ios-system-gray6);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-full);
}

.item-progress {
    height: 4px;
    background-color: var(--ios-system-blue);
    border-radius: 2px;
    min-width: 20px;
    transition: width var(--transition-base);
}

.break-slot .item-progress {
    background-color: var(--ios-system-green);
}

/* Milestones Section */
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
    padding: var(--spacing-lg);
    background-color: var(--ios-background-secondary);
    border-radius: var(--radius-lg);
    border-left: 4px solid var(--ios-system-green);
    transition: all var(--transition-base);
}

.milestone-item:hover {
    border-color: var(--ios-system-green);
    transform: translateX(4px);
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
    color: var(--ios-system-green);
    font-family: "Monaco", "Courier New", monospace;
}

.milestone-text {
    margin: 0;
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--ios-label-primary);
    line-height: 1.4;
}

/* Statistics Section */
.stats-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: var(--spacing-md);
}

.stat-card {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    background-color: var(--ios-background-secondary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--ios-system-gray5);
    transition: all var(--transition-base);
}

.stat-card:hover {
    border-color: var(--ios-system-gray4);
    transform: translateY(-1px);
}

.stat-icon {
    font-size: 24px;
    flex-shrink: 0;
}

.stat-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    flex: 1;
}

.stat-label {
    margin: 0;
    font-size: var(--font-size-xs);
    font-weight: 600;
    color: var(--ios-label-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.stat-value {
    margin: 0;
    font-size: var(--font-size-lg);
    font-weight: 700;
    color: var(--ios-label-primary);
    line-height: 1;
}

.stat-percentage,
.stat-text {
    margin: 0;
    font-size: var(--font-size-sm);
    color: var(--ios-label-secondary);
    font-weight: 600;
}

/* Tips Section */
.tips-section {
    padding: var(--spacing-lg);
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
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
}

.tips-icon {
    font-size: 20px;
}

.tips-title {
    margin: 0;
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--ios-label-primary);
}

.tips-list {
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    list-style: none;
}

.tip-item {
    margin: 0;
    font-size: var(--font-size-sm);
    color: var(--ios-label-secondary);
    line-height: 1.6;
    padding-left: var(--spacing-lg);
    position: relative;
}

.tip-item::before {
    content: "•";
    position: absolute;
    left: 0;
    color: var(--ios-system-blue);
    font-weight: 700;
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

/* Responsive Design */
@media (max-width: 768px) {
    .roadmap-container {
        max-width: 100%;
    }

    .card {
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
    }

    .input-section {
        grid-template-columns: 1fr;
        gap: var(--spacing-md);
        padding: var(--spacing-md);
    }

    .summary-section {
        grid-template-columns: repeat(2, 1fr);
    }

    .action-buttons {
        flex-direction: column;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }

    .milestone-item {
        flex-direction: column;
        text-align: center;
        gap: var(--spacing-md);
    }

    .milestone-marker {
        width: 40px;
        height: 40px;
    }

    .item-content {
        flex-direction: column;
        text-align: center;
        gap: var(--spacing-sm);
    }
}

@media (max-width: 480px) {
    .summary-section {
        grid-template-columns: 1fr;
    }

    .timeline-item {
        padding: var(--spacing-md);
    }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .summary-card {
        background: var(--ios-background-tertiary);
    }

    .timeline-item {
        background: var(--ios-background-tertiary);
    }

    .milestone-item {
        background: var(--ios-background-tertiary);
    }

    .stat-card {
        background: var(--ios-background-tertiary);
    }
}
</style>
