<template>
  <div class="app-shell">
    <Sidebar />
    
    <main class="content">
      <header class="topbar">
        <div class="topbar-left">
          <h2 class="app-title">Bangocat</h2>
        </div>
        
        <div class="topbar-actions">
          <button class="icon-button" title="Theme">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="5"></circle>
              <line x1="12" y1="1" x2="12" y2="3"></line>
              <line x1="12" y1="21" x2="12" y2="23"></line>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
              <line x1="1" y1="12" x2="3" y2="12"></line>
              <line x1="21" y1="12" x2="23" y2="12"></line>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
          </button>
          
          <button class="icon-button" title="Settings">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M12 1v6m0 6v6M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h6M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24"></path>
            </svg>
          </button>
          
          <span class="badge badge-primary">iOS</span>
        </div>
      </header>
      
      <section class="page-content">
        <router-view />
      </section>
    </main>
  </div>
</template>

<script>
import Sidebar from './Sidebar.vue'

export default {
  name: 'AppShell',
  components: { Sidebar }
}
</script>

<style scoped>
.app-shell {
  display: flex;
  width: 100%;
  height: 100vh;
  background-color: var(--background-secondary);
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  overflow-y: auto;
}

/* Topbar */
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: var(--spacing-xl);
  z-index: 10;
  transition: all var(--transition-base);
}

.topbar:hover {
  border-color: var(--border-light);
  box-shadow: var(--shadow-md);
}

.topbar-left {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.app-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  letter-spacing: -0.3px;
  color: var(--text-color);
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

/* Icon Button */
.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background-color: var(--background-secondary);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0;
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
}

.icon-button:hover {
  background-color: var(--border-light);
  border-color: var(--border-light);
  color: var(--primary-color);
}

.icon-button:active {
  transform: scale(0.95);
  background-color: var(--border-color);
}

.icon-button svg {
  width: 20px;
  height: 20px;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Page Content */
.page-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  overflow-y: auto;
  padding-right: var(--spacing-sm);
}

.page-content::-webkit-scrollbar {
  width: 6px;
}

.page-content::-webkit-scrollbar-track {
  background: transparent;
}

.page-content::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: var(--radius-full);
  transition: background var(--transition-base);
}

.page-content::-webkit-scrollbar-thumb:hover {
  background: var(--border-light);
}

/* Badge Variants */
.badge-primary {
  background-color: var(--primary-color);
  color: #FFFFFF;
}

/* Responsive */
@media (max-width: 1024px) {
  .content {
    padding: var(--spacing-lg);
    gap: var(--spacing-md);
  }
  
  .topbar {
    top: var(--spacing-lg);
  }
}

@media (max-width: 768px) {
  .app-shell {
    flex-direction: column;
  }
  
  .content {
    padding: var(--spacing-md);
    gap: var(--spacing-md);
  }
  
  .topbar {
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    top: var(--spacing-md);
  }
  
  .app-title {
    font-size: var(--font-size-base);
  }
  
  .topbar-actions {
    gap: var(--spacing-sm);
  }
  
  .icon-button {
    width: 32px;
    height: 32px;
  }
}
</style>