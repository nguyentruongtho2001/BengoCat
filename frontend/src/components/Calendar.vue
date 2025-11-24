<template>
  <div class="calendar-container">
    <div class="card">
      <div class="card-header">
        <div>
          <h2>📅 Lịch & To-do</h2>
          <p class="card-description">Quản lý và theo dõi các task hàng ngày</p>
        </div>
        <div class="badge badge-primary">{{ tasks.length }} task</div>
      </div>
      
      <!-- Input Section -->
      <div class="input-section">
        <div class="input-group">
          <input 
            v-model="newTask" 
            @keyup.enter="addTask"
            type="text"
            placeholder="Thêm task mới..."
            class="task-input"
          />
          <button @click="addTask" class="btn-add">
            <span>+</span>
          </button>
        </div>
      </div>
      
      <!-- Task List -->
      <div class="task-list">
        <transition-group name="list" tag="div">
          <div 
            v-for="(task, index) in tasks" 
            :key="task.id"
            class="task-item"
            :class="{ 'task-done': task.done }"
          >
            <div class="task-main">
              <input 
                type="checkbox" 
                v-model="task.done"
                class="task-checkbox"
              />
              <div class="task-content">
                <p class="task-title">{{ task.title }}</p>
                <p class="task-date">
                  <small>{{ formatDate(task.created) }}</small>
                </p>
              </div>
            </div>
            
            <div class="task-actions">
              <button 
                class="btn-icon" 
                @click="attachPomodoro(index)"
                title="Gắn Pomodoro"
              >
                ⏱️
              </button>
              <button 
                class="btn-icon btn-danger" 
                @click="removeTask(index)"
                title="Xóa"
              >
                ✕
              </button>
            </div>
          </div>
        </transition-group>
        
        <div v-if="tasks.length === 0" class="empty-state">
          <p class="empty-icon">✓</p>
          <p class="empty-text">Không có task nào</p>
          <p class="empty-description">Hãy thêm task mới để bắt đầu</p>
        </div>
      </div>
      
      <!-- Stats -->
      <div class="task-stats">
        <div class="stat">
          <span class="stat-label">Hoàn thành</span>
          <span class="stat-value">{{ completedCount }}/{{ tasks.length }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Còn lại</span>
          <span class="stat-value">{{ tasks.length - completedCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Calendar',
  data() {
    return {
      newTask: '',
      tasks: [
        { 
          id: Date.now(),
          title: 'Ôn từ vựng', 
          done: false, 
          created: new Date() 
        }
      ],
      nextId: Date.now() + 1
    }
  },
  computed: {
    completedCount() {
      return this.tasks.filter(t => t.done).length
    }
  },
  methods: {
    addTask() {
      if (!this.newTask.trim()) return
      
      this.tasks.unshift({
        id: this.nextId++,
        title: this.newTask.trim(),
        done: false,
        created: new Date()
      })
      this.newTask = ''
    },
    removeTask(index) {
      this.tasks.splice(index, 1)
    },
    attachPomodoro(index) {
      const task = this.tasks[index]
      this.$emit('attach-pomodoro', { taskTitle: task.title, taskIndex: index })
    },
    formatDate(date) {
      const now = new Date()
      const diff = now - date
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)
      
      if (minutes < 1) return 'Vừa xong'
      if (minutes < 60) return `${minutes}m trước`
      if (hours < 24) return `${hours}h trước`
      if (days < 7) return `${days} ngày trước`
      return date.toLocaleDateString('vi-VN')
    }
  }
}
</script>

<style scoped>
.calendar-container {
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

.badge-primary {
  background-color: var(--primary-color);
  color: #FFFFFF;
  font-size: var(--font-size-xs);
  font-weight: 600;
}

/* Input Section */
.input-section {
  margin-bottom: var(--spacing-lg);
}

.input-group {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.task-input {
  flex: 1;
  padding: var(--spacing-md) var(--spacing-lg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  transition: all var(--transition-fast);
}

.task-input:hover {
  border-color: var(--border-light);
}

.task-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.task-input::placeholder {
  color: var(--text-tertiary);
}

.btn-add {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: var(--primary-color);
  color: #FFFFFF;
  border: none;
  border-radius: var(--radius-md);
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.btn-add:hover {
  background-color: #0051D5;
}

.btn-add:active {
  transform: scale(0.95);
}

/* Task List */
.task-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  min-height: 100px;
}

.task-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.task-item:hover {
  background-color: #FAFBFC;
  border-color: var(--border-light);
  box-shadow: var(--shadow-sm);
}

.task-item.task-done {
  opacity: 0.6;
}

.task-item.task-done .task-title {
  text-decoration: line-through;
  color: var(--text-tertiary);
}

.task-main {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
  min-width: 0;
}

.task-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: var(--primary-color);
  flex-shrink: 0;
}

.task-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  min-width: 0;
  flex: 1;
}

.task-title {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-date {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-tertiary);
}

/* Task Actions */
.task-actions {
  display: flex;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: 14px;
  padding: 0;
}

.btn-icon:hover {
  background-color: var(--background-secondary);
  border-color: var(--border-light);
}

.btn-icon.btn-danger:hover {
  background-color: rgba(255, 59, 48, 0.1);
  border-color: var(--danger);
  color: var(--danger);
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

/* Stats */
.task-stats {
  display: flex;
  gap: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

.stat {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  flex: 1;
  text-align: center;
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: 500;
}

.stat-value {
  font-size: var(--font-size-xl);
  font-weight: 700;
  color: var(--primary-color);
}

/* Transitions */
.list-enter-active,
.list-leave-active {
  transition: all var(--transition-base);
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Responsive */
@media (max-width: 768px) {
  .card {
    padding: var(--spacing-md);
  }
  
  .card-header {
    flex-direction: column;
    gap: var(--spacing-md);
  }
  
  .input-group {
    gap: var(--spacing-sm);
  }
  
  .task-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .task-actions {
    width: 100%;
  }
  
  .btn-icon {
    width: 28px;
    height: 28px;
  }
}
</style>