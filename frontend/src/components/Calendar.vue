<template>
    <div class="calendar-page">
        <div class="page-header">
            <h1 class="page-title">Tasks & Calendar</h1>
            <p class="page-subtitle">Stay organized and productive</p>
        </div>

        <div class="calendar-container">
            <!-- Calendar View -->
            <div class="calendar-card">
                <div class="calendar-header">
                    <div class="month-navigation">
                        <button class="nav-btn" @click="previousMonth">
                            <span class="icon">‹</span>
                        </button>
                        <h2 class="current-month">{{ currentMonth }}</h2>
                        <button class="nav-btn" @click="nextMonth">
                            <span class="icon">›</span>
                        </button>
                    </div>
                    <button class="today-btn" @click="goToToday">
                        <span class="icon">📅</span>
                        Today
                    </button>
                </div>

                <div class="calendar-grid">
                    <div class="weekdays">
                        <div
                            v-for="day in [
                                'Sun',
                                'Mon',
                                'Tue',
                                'Wed',
                                'Thu',
                                'Fri',
                                'Sat',
                            ]"
                            :key="day"
                            class="weekday"
                        >
                            {{ day }}
                        </div>
                    </div>
                    <div class="days-grid">
                        <div
                            v-for="day in calendarDays"
                            :key="day.date"
                            class="calendar-day"
                            :class="{
                                'other-month': !day.isCurrentMonth,
                                today: day.isToday,
                                selected: day.isSelected,
                                'has-tasks': day.hasTasks,
                            }"
                            @click="selectDate(day.date)"
                        >
                            <span class="day-number">{{ day.day }}</span>
                            <div
                                v-if="day.hasTasks"
                                class="task-indicator"
                            ></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tasks Section -->
            <div class="tasks-section">
                <!-- Quick Add -->
                <div class="quick-add-card">
                    <div class="add-task-input">
                        <input
                            v-model="newTask.title"
                            @keyup.enter="addTask"
                            type="text"
                            placeholder="Add a new task..."
                            class="task-input"
                        />
                        <button
                            @click="addTask"
                            class="add-btn"
                            :disabled="!newTask.title.trim()"
                        >
                            <span class="icon">+</span>
                        </button>
                    </div>

                    <div class="task-options" v-if="newTask.title.trim()">
                        <div class="option-group">
                            <label class="option-label">
                                <input
                                    type="checkbox"
                                    v-model="newTask.important"
                                    class="option-checkbox"
                                />
                                <span class="custom-checkbox"></span>
                                Important ⭐
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Tasks List -->
                <div class="tasks-list-section">
                    <div class="section-header">
                        <h3 class="section-title">
                            Tasks for {{ selectedDateFormatted }}
                            <span class="tasks-count"
                                >({{ filteredTasks.length }})</span
                            >
                        </h3>
                        <div class="view-controls">
                            <button
                                class="filter-btn"
                                :class="{ active: filter === 'all' }"
                                @click="filter = 'all'"
                            >
                                All
                            </button>
                            <button
                                class="filter-btn"
                                :class="{ active: filter === 'pending' }"
                                @click="filter = 'pending'"
                            >
                                Pending
                            </button>
                            <button
                                class="filter-btn"
                                :class="{ active: filter === 'completed' }"
                                @click="filter = 'completed'"
                            >
                                Done
                            </button>
                        </div>
                    </div>

                    <!-- Tasks List -->
                    <div class="tasks-list">
                        <transition-group name="task-list" tag="div">
                            <div
                                v-for="task in filteredTasks"
                                :key="task.id"
                                class="task-item"
                                :class="{
                                    'task-completed': task.completed,
                                    'task-important': task.important,
                                }"
                            >
                                <div class="task-main">
                                    <button
                                        class="task-checkbox"
                                        :class="{ checked: task.completed }"
                                        @click="toggleTask(task.id)"
                                    >
                                        <span class="check-icon">{{
                                            task.completed ? "✓" : ""
                                        }}</span>
                                    </button>

                                    <div class="task-content">
                                        <p class="task-title">
                                            {{ task.title }}
                                        </p>
                                        <div class="task-meta">
                                            <span class="task-time">{{
                                                formatTaskTime(task.createdAt)
                                            }}</span>
                                            <span
                                                v-if="task.important"
                                                class="important-badge"
                                                >⭐ Important</span
                                            >
                                        </div>
                                    </div>
                                </div>

                                <div class="task-actions">
                                    <button
                                        class="action-btn"
                                        @click="attachPomodoro(task)"
                                        title="Start Pomodoro"
                                    >
                                        <span class="icon">⏱️</span>
                                    </button>
                                    <button
                                        class="action-btn danger"
                                        @click="deleteTask(task.id)"
                                        title="Delete Task"
                                    >
                                        <span class="icon">🗑️</span>
                                    </button>
                                </div>
                            </div>
                        </transition-group>

                        <!-- Empty State -->
                        <div
                            v-if="filteredTasks.length === 0"
                            class="empty-state"
                        >
                            <div class="empty-icon">📝</div>
                            <h4>No tasks yet</h4>
                            <p>Add a task to get started!</p>
                        </div>
                    </div>
                </div>

                <!-- Quick Stats -->
                <div class="stats-card">
                    <div class="stat-item">
                        <div class="stat-icon">📊</div>
                        <div class="stat-info">
                            <div class="stat-value">{{ tasks.length }}</div>
                            <div class="stat-label">Total Tasks</div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon">✅</div>
                        <div class="stat-info">
                            <div class="stat-value">
                                {{ completedTasksCount }}
                            </div>
                            <div class="stat-label">Completed</div>
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-icon">⭐</div>
                        <div class="stat-info">
                            <div class="stat-value">
                                {{ importantTasksCount }}
                            </div>
                            <div class="stat-label">Important</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Calendar",
    data() {
        return {
            currentDate: new Date(),
            selectedDate: new Date(),
            newTask: {
                title: "",
                important: false,
            },
            tasks: [
                {
                    id: 1,
                    title: "Complete math homework",
                    completed: false,
                    important: true,
                    createdAt: new Date(),
                    dueDate: new Date(),
                },
                {
                    id: 2,
                    title: "Review English vocabulary",
                    completed: true,
                    important: false,
                    createdAt: new Date(Date.now() - 86400000),
                    dueDate: new Date(Date.now() - 86400000),
                },
                {
                    id: 3,
                    title: "Prepare for science test",
                    completed: false,
                    important: true,
                    createdAt: new Date(),
                    dueDate: new Date(Date.now() + 86400000),
                },
            ],
            filter: "all",
        };
    },
    computed: {
        currentMonth() {
            return this.currentDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
            });
        },
        selectedDateFormatted() {
            return this.selectedDate.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
            });
        },
        calendarDays() {
            const year = this.currentDate.getFullYear();
            const month = this.currentDate.getMonth();

            // First day of the month
            const firstDay = new Date(year, month, 1);
            // Last day of the month
            const lastDay = new Date(year, month + 1, 0);
            // Start from the first Sunday of the calendar view
            const startDate = new Date(firstDay);
            startDate.setDate(startDate.getDate() - startDate.getDay());

            const days = [];
            const today = new Date();

            for (let i = 0; i < 42; i++) {
                // 6 weeks
                const date = new Date(startDate);
                date.setDate(startDate.getDate() + i);

                const isCurrentMonth = date.getMonth() === month;
                const isToday = date.toDateString() === today.toDateString();
                const isSelected =
                    date.toDateString() === this.selectedDate.toDateString();
                const hasTasks = this.tasks.some(
                    (task) =>
                        task.dueDate &&
                        task.dueDate.toDateString() === date.toDateString(),
                );

                days.push({
                    date: new Date(date),
                    day: date.getDate(),
                    isCurrentMonth,
                    isToday,
                    isSelected,
                    hasTasks,
                });
            }

            return days;
        },
        filteredTasks() {
            let filtered = this.tasks.filter(
                (task) =>
                    task.dueDate &&
                    task.dueDate.toDateString() ===
                        this.selectedDate.toDateString(),
            );

            switch (this.filter) {
                case "pending":
                    return filtered.filter((task) => !task.completed);
                case "completed":
                    return filtered.filter((task) => task.completed);
                default:
                    return filtered;
            }
        },
        completedTasksCount() {
            return this.tasks.filter((task) => task.completed).length;
        },
        importantTasksCount() {
            return this.tasks.filter(
                (task) => task.important && !task.completed,
            ).length;
        },
    },
    methods: {
        previousMonth() {
            this.currentDate = new Date(
                this.currentDate.getFullYear(),
                this.currentDate.getMonth() - 1,
                1,
            );
        },
        nextMonth() {
            this.currentDate = new Date(
                this.currentDate.getFullYear(),
                this.currentDate.getMonth() + 1,
                1,
            );
        },
        goToToday() {
            this.currentDate = new Date();
            this.selectedDate = new Date();
        },
        selectDate(date) {
            this.selectedDate = date;
        },
        addTask() {
            if (!this.newTask.title.trim()) return;

            const task = {
                id: Date.now(),
                title: this.newTask.title.trim(),
                completed: false,
                important: this.newTask.important,
                createdAt: new Date(),
                dueDate: new Date(this.selectedDate),
            };

            this.tasks.push(task);
            this.newTask = { title: "", important: false };
        },
        toggleTask(id) {
            const task = this.tasks.find((t) => t.id === id);
            if (task) {
                task.completed = !task.completed;
            }
        },
        deleteTask(id) {
            this.tasks = this.tasks.filter((task) => task.id !== id);
        },
        attachPomodoro(task) {
            this.$emit("attach-pomodoro", {
                taskTitle: task.title,
                taskId: task.id,
            });
            // In real app, this would navigate to Pomodoro with task pre-filled
        },
        formatTaskTime(date) {
            const now = new Date();
            const diff = now - date;
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(diff / 3600000);
            const days = Math.floor(diff / 86400000);

            if (minutes < 1) return "Just now";
            if (minutes < 60) return `${minutes}m ago`;
            if (hours < 24) return `${hours}h ago`;
            if (days < 7) return `${days}d ago`;
            return date.toLocaleDateString("en-US");
        },
    },
};
</script>

<style scoped>
.calendar-page {
    max-width: 1200px;
    margin: 0 auto;
}

.page-header {
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

.calendar-container {
    display: grid;
    grid-template-columns: 400px 1fr;
    gap: var(--spacing-2xl);
    align-items: start;
}

/* Calendar Card */
.calendar-card {
    background: var(--ios-background-primary);
    border-radius: var(--radius-xl);
    padding: var(--spacing-xl);
    box-shadow: var(--shadow-md);
    position: sticky;
    top: var(--spacing-xl);
}

.calendar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--spacing-lg);
}

.month-navigation {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.nav-btn {
    background: var(--ios-background-secondary);
    border: none;
    border-radius: var(--radius-md);
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--transition-fast);
    color: var(--ios-label-primary);
}

.nav-btn:hover {
    background: var(--ios-system-gray6);
}

.current-month {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--ios-label-primary);
    margin: 0;
    min-width: 150px;
    text-align: center;
}

.today-btn {
    background: var(--ios-system-blue);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    padding: var(--spacing-sm) var(--spacing-md);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.today-btn:hover {
    background: #0056cc;
}

/* Calendar Grid */
.calendar-grid {
    background: var(--ios-background-secondary);
    border-radius: var(--radius-lg);
    overflow: hidden;
}

.weekdays {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background: var(--ios-background-primary);
    border-bottom: 1px solid var(--ios-system-gray6);
}

.weekday {
    padding: var(--spacing-md);
    text-align: center;
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--ios-label-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
    background: var(--ios-system-gray6);
}

.calendar-day {
    background: var(--ios-background-primary);
    aspect-ratio: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--transition-fast);
    position: relative;
}

.calendar-day:hover {
    background: var(--ios-system-gray6);
}

.calendar-day.other-month {
    color: var(--ios-label-tertiary);
    background: var(--ios-background-secondary);
}

.calendar-day.today {
    background: var(--ios-system-blue);
    color: white;
}

.calendar-day.selected {
    background: var(--ios-system-blue);
    color: white;
}

.calendar-day.has-tasks::after {
    content: "";
    position: absolute;
    bottom: 6px;
    width: 4px;
    height: 4px;
    background: var(--ios-system-blue);
    border-radius: 50%;
}

.calendar-day.selected.has-tasks::after {
    background: white;
}

.day-number {
    font-size: var(--font-size-base);
    font-weight: 600;
}

/* Tasks Section */
.tasks-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
}

/* Quick Add Card */
.quick-add-card {
    background: var(--ios-background-primary);
    border-radius: var(--radius-xl);
    padding: var(--spacing-xl);
    box-shadow: var(--shadow-md);
}

.add-task-input {
    display: flex;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
}

.task-input {
    flex: 1;
    border: 2px solid var(--ios-system-gray6);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    font-size: var(--font-size-base);
    color: var(--ios-label-primary);
    outline: none;
    transition: all var(--transition-fast);
    background: var(--ios-background-primary);
}

.task-input:focus {
    border-color: var(--ios-system-blue);
    background: var(--ios-background-secondary);
}

.task-input::placeholder {
    color: var(--ios-label-tertiary);
}

.add-btn {
    background: var(--ios-system-blue);
    color: white;
    border: none;
    border-radius: var(--radius-lg);
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--transition-fast);
    font-size: 20px;
    font-weight: 600;
}

.add-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.add-btn:not(:disabled):hover {
    background: #0056cc;
    transform: scale(1.05);
}

.task-options {
    display: flex;
    gap: var(--spacing-lg);
}

.option-group {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.option-label {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    cursor: pointer;
    font-size: var(--font-size-sm);
    color: var(--ios-label-secondary);
    font-weight: 500;
}

.option-checkbox {
    display: none;
}

.custom-checkbox {
    width: 18px;
    height: 18px;
    border: 2px solid var(--ios-system-gray4);
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all var(--transition-fast);
}

.option-checkbox:checked + .custom-checkbox {
    background: var(--ios-system-blue);
    border-color: var(--ios-system-blue);
}

.option-checkbox:checked + .custom-checkbox::after {
    content: "✓";
    color: white;
    font-size: 12px;
    font-weight: bold;
}

/* Tasks List Section */
.tasks-list-section {
    background: var(--ios-background-primary);
    border-radius: var(--radius-xl);
    padding: var(--spacing-xl);
    box-shadow: var(--shadow-md);
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--spacing-lg);
}

.section-title {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--ios-label-primary);
    margin: 0;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.tasks-count {
    font-size: var(--font-size-sm);
    color: var(--ios-label-tertiary);
    font-weight: normal;
}

.view-controls {
    display: flex;
    background: var(--ios-background-secondary);
    border-radius: var(--radius-md);
    padding: var(--spacing-xs);
    gap: var(--spacing-xs);
}

.filter-btn {
    background: none;
    border: none;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    color: var(--ios-label-secondary);
    font-size: var(--font-size-sm);
    font-weight: 500;
}

.filter-btn.active {
    background: var(--ios-background-primary);
    color: var(--ios-label-primary);
    box-shadow: var(--shadow-sm);
}

/* Tasks List */
.tasks-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    min-height: 200px;
}

.task-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
    background: var(--ios-background-secondary);
    border-radius: var(--radius-lg);
    border-left: 4px solid transparent;
    transition: all var(--transition-fast);
}

.task-item:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.task-item.task-important {
    border-left-color: var(--ios-system-orange);
    background: linear-gradient(
        135deg,
        var(--ios-background-secondary),
        #fff9f2
    );
}

.task-item.task-completed {
    opacity: 0.6;
    background: var(--ios-background-primary);
}

.task-main {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-lg);
    flex: 1;
}

.task-checkbox {
    width: 24px;
    height: 24px;
    border: 2px solid var(--ios-system-gray4);
    border-radius: var(--radius-sm);
    background: none;
    cursor: pointer;
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-top: 2px;
}

.task-checkbox.checked {
    background: var(--ios-system-blue);
    border-color: var(--ios-system-blue);
}

.task-checkbox.checked .check-icon {
    color: white;
    font-weight: bold;
    font-size: 14px;
}

.task-checkbox:hover {
    border-color: var(--ios-system-blue);
}

.task-content {
    flex: 1;
}

.task-title {
    margin: 0 0 var(--spacing-xs) 0;
    font-weight: 500;
    color: var(--ios-label-primary);
    line-height: 1.4;
}

.task-completed .task-title {
    text-decoration: line-through;
    color: var(--ios-label-tertiary);
}

.task-meta {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.task-time {
    font-size: var(--font-size-xs);
    color: var(--ios-label-tertiary);
}

.important-badge {
    background: var(--ios-system-orange);
    color: white;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-full);
    font-size: var(--font-size-xs);
    font-weight: 600;
}

.task-actions {
    display: flex;
    gap: var(--spacing-sm);
    flex-shrink: 0;
}

.action-btn {
    background: none;
    border: none;
    padding: var(--spacing-sm);
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    color: var(--ios-label-secondary);
}

.action-btn:hover {
    background: var(--ios-system-gray6);
    color: var(--ios-label-primary);
}

.action-btn.danger:hover {
    background: var(--ios-system-red);
    color: white;
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: var(--spacing-2xl);
    color: var(--ios-label-secondary);
}

.empty-icon {
    font-size: 48px;
    margin-bottom: var(--spacing-md);
    opacity: 0.5;
}

.empty-state h4 {
    margin: 0 0 var(--spacing-sm) 0;
    color: var(--ios-label-primary);
    font-size: var(--font-size-lg);
}

.empty-state p {
    margin: 0;
    font-size: var(--font-size-sm);
}

/* Stats Card */
.stats-card {
    background: var(--ios-background-primary);
    border-radius: var(--radius-xl);
    padding: var(--spacing-xl);
    box-shadow: var(--shadow-md);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-lg);
}

.stat-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
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
    flex-shrink: 0;
}

.stat-info {
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
    font-weight: 500;
}

/* Transitions */
.task-list-enter-active,
.task-list-leave-active {
    transition: all var(--transition-base);
}

.task-list-enter-from {
    opacity: 0;
    transform: translateX(-30px);
}

.task-list-leave-to {
    opacity: 0;
    transform: translateX(30px);
}

/* Responsive */
@media (max-width: 768px) {
    .calendar-container {
        grid-template-columns: 1fr;
    }

    .calendar-card {
        position: static;
    }

    .calendar-header {
        flex-direction: column;
        gap: var(--spacing-md);
        align-items: stretch;
    }

    .month-navigation {
        justify-content: center;
    }

    .stats-card {
        grid-template-columns: 1fr;
    }

    .task-main {
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .task-actions {
        align-self: flex-end;
    }
}
</style>
