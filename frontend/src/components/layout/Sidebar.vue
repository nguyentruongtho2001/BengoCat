<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <h3 class="logo">🐱 Bangocat</h3>
    </div>
    
    <nav class="sidebar-nav">
      <div class="nav-section">
        <router-link 
          to="/" 
          class="nav-link"
          :class="{ 'router-link-active': isActive('/') }"
        >
          <span class="nav-icon">ℹ️</span>
          <span class="nav-label">Giới thiệu</span>
        </router-link>
      </div>
      
      <div class="nav-section">
        <p class="nav-section-title">Công cụ học</p>
        
        <router-link 
          to="/pomodoro" 
          class="nav-link"
          :class="{ 'router-link-active': isActive('/pomodoro') }"
        >
          <span class="nav-icon">⏱️</span>
          <span class="nav-label">Pomodoro</span>
        </router-link>
        
        <router-link 
          to="/study-roadmap" 
          class="nav-link"
          :class="{ 'router-link-active': isActive('/study-roadmap') }"
        >
          <span class="nav-icon">🗺️</span>
          <span class="nav-label">Lộ trình học</span>
        </router-link>
        
        <router-link 
          to="/quick-notes" 
          class="nav-link"
          :class="{ 'router-link-active': isActive('/quick-notes') }"
        >
          <span class="nav-icon">📝</span>
          <span class="nav-label">Ghi chú</span>
        </router-link>
        
        <router-link 
          to="/dictionary" 
          class="nav-link"
          :class="{ 'router-link-active': isActive('/dictionary') }"
        >
          <span class="nav-icon">📚</span>
          <span class="nav-label">Từ điển</span>
        </router-link>
        
        <router-link 
          to="/calendar" 
          class="nav-link"
          :class="{ 'router-link-active': isActive('/calendar') }"
        >
          <span class="nav-icon">📅</span>
          <span class="nav-label">Lịch</span>
        </router-link>
      </div>
      
      <div class="nav-section">
        <p class="nav-section-title">Bổ sung</p>
        
        <router-link 
          to="/music" 
          class="nav-link"
          :class="{ 'router-link-active': isActive('/music') }"
        >
          <span class="nav-icon">🎵</span>
          <span class="nav-label">Nhạc nền</span>
        </router-link>
        
        <router-link 
          to="/zen" 
          class="nav-link"
          :class="{ 'router-link-active': isActive('/zen') }"
        >
          <span class="nav-icon">🧘</span>
          <span class="nav-label">Zen Mode</span>
        </router-link>
        
        <router-link 
          to="/stats" 
          class="nav-link"
          :class="{ 'router-link-active': isActive('/stats') }"
        >
          <span class="nav-icon">📊</span>
          <span class="nav-label">Thống kê</span>
        </router-link>
        
        <router-link 
          to="/customize-cat" 
          class="nav-link"
          :class="{ 'router-link-active': isActive('/customize-cat') }"
        >
          <span class="nav-icon">🎨</span>
          <span class="nav-label">Tùy chỉnh mèo</span>
        </router-link>
      </div>
      
      <div class="nav-section">
        <router-link 
          to="/settings" 
          class="nav-link"
          :class="{ 'router-link-active': isActive('/settings') }"
        >
          <span class="nav-icon">⚙️</span>
          <span class="nav-label">Cài đặt</span>
        </router-link>
      </div>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar',
  methods: {
    isActive(path) {
      return this.$route.path === path
    }
  }
}
</script>

<style scoped>
.sidebar {
  width: 260px;
  min-width: 260px;
  height: 100vh;
  background-color: var(--card-bg);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  overflow-y: auto;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: var(--radius-full);
  transition: background var(--transition-base);
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: var(--border-light);
}

/* Header */
.sidebar-header {
  padding: var(--spacing-md) 0;
  border-bottom: 1px solid var(--border-color);
}

.logo {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 700;
  letter-spacing: -0.3px;
  color: var(--text-color);
}

/* Navigation */
.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  flex: 1;
}

.nav-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.nav-section-title {
  margin: 0 var(--spacing-md) 0 0;
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: 0.5px;
  color: var(--text-tertiary);
  text-transform: uppercase;
}

/* Navigation Links */
.nav-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  font-size: var(--font-size-base);
  font-weight: 500;
  cursor: pointer;
  outline: none;
  position: relative;
}

.nav-link:hover {
  background-color: var(--background-secondary);
  color: var(--text-color);
}

.nav-link:active {
  transform: scale(0.98);
}

.nav-link.router-link-active {
  background-color: rgba(0, 122, 255, 0.1);
  color: var(--primary-color);
  font-weight: 600;
}

.nav-link.router-link-active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 24px;
  background-color: var(--primary-color);
  border-radius: 0 3px 3px 0;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  font-size: 16px;
}

.nav-label {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Responsive */
@media (max-width: 1024px) {
  .sidebar {
    width: 240px;
    min-width: 240px;
    padding: var(--spacing-md);
    gap: var(--spacing-md);
  }
  
  .nav-link {
    padding: var(--spacing-sm) var(--spacing-md);
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    min-width: auto;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--border-color);
    flex-direction: row;
    overflow-x: auto;
    overflow-y: hidden;
  }
  
  .sidebar-header {
    border-bottom: none;
    border-right: 1px solid var(--border-color);
    padding: 0 var(--spacing-lg) 0 0;
    min-width: max-content;
  }
  
  .sidebar-nav {
    flex-direction: row;
    gap: 0;
  }
  
  .nav-section {
    display: flex;
    flex-direction: row;
    gap: 0;
    border-right: 1px solid var(--border-color);
  }
  
  .nav-section-title {
    display: none;
  }
  
  .nav-link {
    padding: var(--spacing-md);
    border-radius: 0;
    flex-direction: column;
    justify-content: center;
  }
  
  .nav-link.router-link-active::before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    top: auto;
    width: 100%;
    height: 2px;
    border-radius: 2px 2px 0 0;
  }
}
</style>