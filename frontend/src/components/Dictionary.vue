<template>
  <div class="dictionary-container">
    <div class="card">
      <!-- Header -->
      <div class="card-header">
        <div>
          <h2>📚 Từ điển & Dịch nhanh</h2>
          <p class="card-description">Tra cứu từ vựng và dịch ngôn ngữ</p>
        </div>
      </div>

      <!-- Translation Controls -->
      <div class="translate-section">
        <div class="direction-selector">
          <button 
            v-for="dir in directions"
            :key="dir.value"
            @click="direction = dir.value"
            class="direction-btn"
            :class="{ active: direction === dir.value }"
          >
            {{ dir.label }}
          </button>
        </div>

        <div class="input-group">
          <input 
            v-model="query" 
            @keyup.enter="translate"
            type="text"
            placeholder="Nhập từ hoặc cụm từ..."
            class="search-input"
          />
          <button @click="translate" class="btn-translate">
            <span>🔍</span>
            Dịch
          </button>
        </div>
      </div>

      <!-- Result Section -->
      <div v-if="result" class="result-section">
        <div class="result-card">
          <div class="result-header">
            <div class="result-word">
              <p class="result-label">Từ gốc</p>
              <p class="result-text">{{ query }}</p>
            </div>
            <div class="result-divider">→</div>
            <div class="result-translation">
              <p class="result-label">Dịch</p>
              <p class="result-text">{{ result }}</p>
            </div>
          </div>

          <div class="result-actions">
            <button class="btn-action" @click="copyResult" :title="copyButtonText">
              <span>📋</span>
              {{ copyButtonText }}
            </button>
            <button class="btn-action" @click="saveToHistory">
              <span>⭐</span>
              Lưu
            </button>
            <button class="btn-action" @click="speakWord">
              <span>🔊</span>
              Phát âm
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!result" class="empty-state">
        <p class="empty-icon">🔍</p>
        <p class="empty-text">Nhập từ để bắt đầu dịch</p>
      </div>

      <!-- History Section -->
      <div v-if="history.length > 0" class="history-section">
        <div class="history-header">
          <p class="history-title">Lịch sử gần đây</p>
          <button class="btn-clear" @click="clearHistory">Xóa</button>
        </div>

        <div class="history-list">
          <div 
            v-for="(item, index) in history"
            :key="index"
            class="history-item"
            @click="query = item.word; result = item.translation"
          >
            <div class="history-content">
              <p class="history-word">{{ item.word }}</p>
              <p class="history-translation">{{ item.translation }}</p>
            </div>
            <button 
              class="btn-remove" 
              @click.stop="removeFromHistory(index)"
              title="Xóa"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dictionary',
  data() {
    return {
      direction: 'vi-en',
      query: '',
      result: '',
      copyButtonText: '📋 Sao chép',
      history: [],
      directions: [
        { value: 'vi-en', label: '🇻🇳 → 🇺🇸' },
        { value: 'en-vi', label: '🇺🇸 → 🇻🇳' }
      ]
    }
  },
  methods: {
    translate() {
      if (!this.query.trim()) return

      // Mock translation - replace with real API later
      const mockTranslations = {
        'hello': 'xin chào',
        'world': 'thế giới',
        'learn': 'học',
        'cat': 'mèo',
        'xin chào': 'hello',
        'mèo': 'cat',
        'học': 'learn'
      }

      const key = this.query.toLowerCase().trim()
      this.result = mockTranslations[key] || `[${this.direction}] ${this.query}`
    },
    copyResult() {
      navigator.clipboard.writeText(this.result)
      this.copyButtonText = '✓ Đã sao chép'
      setTimeout(() => {
        this.copyButtonText = '📋 Sao chép'
      }, 2000)
    },
    saveToHistory() {
      if (!this.query || !this.result) return

      const existingIndex = this.history.findIndex(
        h => h.word.toLowerCase() === this.query.toLowerCase()
      )

      if (existingIndex > -1) {
        this.history.splice(existingIndex, 1)
      }

      this.history.unshift({
        word: this.query,
        translation: this.result,
        direction: this.direction
      })

      if (this.history.length > 10) {
        this.history.pop()
      }
    },
    removeFromHistory(index) {
      this.history.splice(index, 1)
    },
    clearHistory() {
      this.history = []
    },
    speakWord() {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(this.query)
        utterance.lang = this.direction === 'vi-en' ? 'vi-VN' : 'en-US'
        speechSynthesis.speak(utterance)
      }
    }
  }
}
</script>

<style scoped>
.dictionary-container {
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

/* Translate Section */
.translate-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.direction-selector {
  display: flex;
  gap: var(--spacing-md);
  background-color: var(--background-secondary);
  padding: var(--spacing-sm);
  border-radius: var(--radius-md);
}

.direction-btn {
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

.direction-btn:hover {
  background-color: var(--card-bg);
  color: var(--text-color);
}

.direction-btn.active {
  background-color: var(--card-bg);
  color: var(--primary-color);
  border-color: var(--primary-color);
}

.input-group {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.search-input {
  flex: 1;
  padding: var(--spacing-md) var(--spacing-lg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  background-color: var(--card-bg);
  color: var(--text-color);
  transition: all var(--transition-fast);
  outline: none;
}

.search-input:hover {
  border-color: var(--border-light);
}

.search-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.btn-translate {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--primary-color);
  color: #FFFFFF;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  flex-shrink: 0;
  outline: none;
}

.btn-translate:hover {
  background-color: #0051D5;
}

.btn-translate:active {
  transform: scale(0.98);
}

/* Result Section */
.result-section {
  margin-bottom: var(--spacing-lg);
}

.result-card {
  background: linear-gradient(135deg, #F0F4FF 0%, #E8F1FF 100%);
  border: 1px solid rgba(0, 122, 255, 0.2);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
}

.result-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid rgba(0, 122, 255, 0.1);
}

.result-word,
.result-translation {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.result-label {
  margin: 0;
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.result-text {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--primary-color);
}

.result-divider {
  font-size: 20px;
  color: var(--text-tertiary);
  user-select: none;
}

.result-actions {
  display: flex;
  gap: var(--spacing-md);
}

.btn-action {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 122, 255, 0.2);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--primary-color);
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
}

.btn-action:hover {
  background-color: #FFFFFF;
  border-color: var(--primary-color);
  box-shadow: var(--shadow-sm);
}

.btn-action:active {
  transform: scale(0.95);
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
  margin: 0;
  font-size: var(--font-size-base);
  color: var(--text-secondary);
}

/* History Section */
.history-section {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.history-title {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.btn-clear {
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-clear:hover {
  background-color: var(--background-secondary);
  border-color: var(--border-light);
  color: var(--text-color);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  max-height: 300px;
  overflow-y: auto;
}

.history-list::-webkit-scrollbar {
  width: 6px;
}

.history-list::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: var(--radius-full);
}

.history-list::-webkit-scrollbar-thumb:hover {
  background: var(--border-light);
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.history-item:hover {
  background-color: var(--card-bg);
  border-color: var(--primary-color);
  box-shadow: var(--shadow-sm);
}

.history-content {
  flex: 1;
  min-width: 0;
}

.history-word {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-translation {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-remove {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background-color: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  flex-shrink: 0;
  outline: none;
  font-size: 14px;
}

.btn-remove:hover {
  background-color: rgba(255, 59, 48, 0.1);
  border-color: var(--danger);
  color: var(--danger);
}

/* Responsive */
@media (max-width: 768px) {
  .card {
    padding: var(--spacing-md);
  }

  .input-group {
    flex-direction: column;
  }

  .btn-translate {
    width: 100%;
  }

  .result-header {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .result-divider {
    transform: rotate(90deg);
  }

  .result-actions {
    flex-direction: column;
  }

  .btn-action {
    width: 100%;
  }

  .history-list {
    max-height: 200px;
  }
}
</style>