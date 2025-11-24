<template>
  <div class="app-container">
    <AppShell />
    
    <div class="main-content">
      <div class="cat-area">
        <transition name="fade" mode="out-in">
          <div v-if="position === 'left'" key="left" class="cat-container cat-left">
            <img 
              src="./assets/left.png" 
              alt="Bangocat Left" 
              class="cat-image"
              loading="lazy"
            />
          </div>
          <div v-else-if="position === 'right'" key="right" class="cat-container cat-right">
            <img 
              src="./assets/right.png" 
              alt="Bangocat Right" 
              class="cat-image"
              loading="lazy"
            />
          </div>
          <div v-else key="none" class="cat-container cat-center">
            <img 
              src="./assets/none.png" 
              alt="Bangocat" 
              class="cat-image"
              loading="lazy"
            />
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import AppShell from './components/layout/AppShell.vue'

export default {
  name: 'App',
  components: { AppShell },
  data() {
    return {
      position: 'none',
      nextLeft: true,
      idleTimer: null
    }
  },
  methods: {
    onKey() {
      this.position = this.nextLeft ? 'left' : 'right'
      this.nextLeft = !this.nextLeft
      this.resetIdleTimer()
    },
    onIdle() {
      this.position = 'none'
      this.nextLeft = true
    },
    resetIdleTimer() {
      if (this.idleTimer) clearTimeout(this.idleTimer)
      this.idleTimer = setTimeout(this.onIdle, 3000)
    }
  },
  mounted() {
    window.addEventListener('keydown', this.onKey)
    this.resetIdleTimer()
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.onKey)
    if (this.idleTimer) clearTimeout(this.idleTimer)
  }
}
</script>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: var(--background-secondary);
  overflow: hidden;
}

.main-content {
  display: flex;
  flex: 1;
  align-items: flex-end;
  justify-content: center;
  padding: var(--spacing-xl);
  pointer-events: none;
}

.cat-area {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  height: 100%;
  position: relative;
}

.cat-container {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.cat-image {
  max-height: 100%;
  max-width: 100%;
  object-fit: contain;
  object-position: bottom center;
  user-select: none;
  -webkit-user-drag: none;
}

.cat-left {
  animation: slideInLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.cat-right {
  animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.cat-center {
  animation: fadeInScale 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-base);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Animations */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    padding: var(--spacing-lg);
  }
  
  .cat-area {
    max-width: 100%;
  }
}
</style>