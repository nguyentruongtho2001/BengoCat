<template>
  <div class="customize-container">
    <div class="card">
      <div class="card-header">
        <div>
          <h2>🎨 Tùy chỉnh Bangocat</h2>
          <p class="card-description">Cá nhân hóa hình dáng và phong cách của mèo</p>
        </div>
        <div class="points-badge">
          <span class="points-label">Điểm</span>
          <span class="points-value">{{ points }}</span>
        </div>
      </div>

      <!-- Preview Section -->
      <div class="preview-section">
        <div class="cat-preview">
          <div class="preview-placeholder">
            <p class="preview-emoji">🐱</p>
            <p class="preview-label">{{ skin }} {{ accessory !== 'None' ? `+ ${accessory}` : '' }}</p>
            <p class="preview-mood">{{ mood }}</p>
          </div>
        </div>

        <!-- Quick Info -->
        <div class="preview-info">
          <div class="info-row">
            <span class="info-label">Kiểu dáng</span>
            <span class="info-value">{{ skin }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Phụ kiện</span>
            <span class="info-value">{{ accessory }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Tâm trạng</span>
            <span class="info-value">{{ mood }}</span>
          </div>
        </div>
      </div>

      <!-- Customization Section -->
      <div class="customize-section">
        <div class="control-group">
          <label class="control-label">Kiểu dáng mèo</label>
          <div class="select-group">
            <select v-model="skin" class="custom-select">
              <option value="Classic">Classic</option>
              <option value="Pixel">Pixel</option>
              <option value="Anime">Anime</option>
            </select>
          </div>
        </div>

        <div class="control-group">
          <label class="control-label">Phụ kiện</label>
          <div class="select-group">
            <select v-model="accessory" class="custom-select">
              <option value="None">Không</option>
              <option value="Nón">Nón</option>
              <option value="Kính">Kính</option>
            </select>
          </div>
        </div>

        <div class="control-group">
          <label class="control-label">Tâm trạng</label>
          <div class="select-group">
            <select v-model="mood" class="custom-select">
              <option value="Vui">Vui 😸</option>
              <option value="Tập trung">Tập trung 😼</option>
              <option value="Ngủ">Ngủ 😴</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Presets Section -->
      <div class="presets-section">
        <p class="section-title">Bộ cài sẵn</p>
        <div class="presets-grid">
          <button 
            v-for="preset in presets" 
            :key="preset.id"
            class="preset-btn"
            @click="applyPreset(preset)"
            :title="preset.name"
          >
            <span class="preset-emoji">{{ preset.emoji }}</span>
            <span class="preset-name">{{ preset.name }}</span>
          </button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button class="btn-primary" @click="apply">
          <span>✓</span>
          Áp dụng thay đổi
        </button>
        <button class="btn-secondary" @click="randomize">
          <span>🎲</span>
          Tùy chỉnh ngẫu nhiên
        </button>
        <button class="btn-tertiary" @click="reset">
          <span>↺</span>
          Đặt lại
        </button>
      </div>

      <!-- Info Text -->
      <div class="info-box">
        <p class="info-text">💡 Hãy giữ mèo của bạn hạnh phúc bằng cách thay đổi phong cách và tâm trạng!</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomizeCat',
  data() {
    return {
      skin: 'Classic',
      accessory: 'None',
      mood: 'Tập trung',
      points: 120,
      presets: [
        { id: 1, name: 'Vui vẻ', emoji: '😸', skin: 'Classic', accessory: 'None', mood: 'Vui' },
        { id: 2, name: 'Chuyên tâm', emoji: '😼', skin: 'Pixel', accessory: 'Kính', mood: 'Tập trung' },
        { id: 3, name: 'Lười biếng', emoji: '😴', skin: 'Anime', accessory: 'Nón', mood: 'Ngủ' },
        { id: 4, name: 'Ngạo mạn', emoji: '😹', skin: 'Anime', accessory: 'Kính', mood: 'Vui' }
      ]
    }
  },
  methods: {
    apply() {
      this.$emit('customize-applied', {
        skin: this.skin,
        accessory: this.accessory,
        mood: this.mood
      })
    },
    randomize() {
      const skins = ['Classic', 'Pixel', 'Anime']
      const accs = ['None', 'Nón', 'Kính']
      const moods = ['Vui', 'Tập trung', 'Ngủ']
      
      this.skin = skins[Math.floor(Math.random() * skins.length)]
      this.accessory = accs[Math.floor(Math.random() * accs.length)]
      this.mood = moods[Math.floor(Math.random() * moods.length)]
    },
    reset() {
      this.skin = 'Classic'
      this.accessory = 'None'
      this.mood = 'Tập trung'
    },
    applyPreset(preset) {
      this.skin = preset.skin
      this.accessory = preset.accessory
      this.mood = preset.mood
    }
  }
}
</script>

<style scoped>
.customize-container {
  width: 100%;
}

.card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

/* Card Header */
.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
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

.points-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md) var(--spacing-lg);
  background: linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%);
  color: #FFFFFF;
  border-radius: var(--radius-md);
  text-align: center;
}

.points-label {
  font-size: var(--font-size-xs);
  font-weight: 600;
  letter-spacing: 0.5px;
  opacity: 0.9;
}

.points-value {
  font-size: 24px;
  font-weight: 700;
}

/* Preview Section */
.preview-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  align-items: center;
}

.cat-preview {
  background: linear-gradient(135deg, #F0F4FF 0%, #E8F1FF 100%);
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.preview-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.preview-emoji {
  font-size: 80px;
  margin: 0 0 var(--spacing-md) 0;
  animation: bobbing 2s ease-in-out infinite;
}

.preview-label {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-color);
}

.preview-mood {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

@keyframes bobbing {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Preview Info */
.preview-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--background-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.info-label {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--primary-color);
}

/* Customize Section */
.customize-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background-color: var(--background-secondary);
  border-radius: var(--radius-lg);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.control-label {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.select-group {
  display: flex;
}

.custom-select {
  flex: 1;
  padding: var(--spacing-md) var(--spacing-lg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  background-color: var(--card-bg);
  color: var(--text-color);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.custom-select:hover {
  border-color: var(--border-light);
}

.custom-select:focus {
  border-color: var(--primary-color);
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

/* Presets Section */
.presets-section {
  margin-bottom: var(--spacing-xl);
}

.section-title {
  margin: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.presets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: var(--spacing-md);
}

.preset-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background-color: var(--background-secondary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
}

.preset-btn:hover {
  border-color: var(--primary-color);
  background-color: rgba(0, 122, 255, 0.05);
  transform: translateY(-2px);
}

.preset-btn:active {
  transform: translateY(0);
}

.preset-emoji {
  font-size: 32px;
}

.preset-name {
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--text-color);
  text-align: center;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.btn-primary,
.btn-secondary,
.btn-tertiary {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
}

.btn-primary {
  background-color: var(--primary-color);
  color: #FFFFFF;
}

.btn-primary:hover {
  background-color: #0051D5;
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-secondary {
  background-color: var(--background-secondary);
  color: var(--primary-color);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background-color: var(--border-light);
  border-color: var(--border-light);
}

.btn-tertiary {
  background-color: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn-tertiary:hover {
  background-color: var(--background-secondary);
  color: var(--text-color);
}

/* Info Box */
.info-box {
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: rgba(0, 122, 255, 0.05);
  border: 1px solid rgba(0, 122, 255, 0.2);
  border-radius: var(--radius-md);
}

.info-text {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Responsive */
@media (max-width: 768px) {
  .card {
    padding: var(--spacing-md);
  }

  .card-header {
    flex-direction: column;
    margin-bottom: var(--spacing-lg);
  }

  .preview-section {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
  }

  .cat-preview {
    min-height: 150px;
  }

  .preview-emoji {
    font-size: 60px;
  }

  .presets-grid {
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  }

  .action-buttons {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary,
  .btn-tertiary {
    width: 100%;
  }
}
</style>