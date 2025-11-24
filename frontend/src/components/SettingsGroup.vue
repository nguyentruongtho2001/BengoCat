<template>
  <div class="settings-container">
    <div class="card">
      <!-- Header -->
      <div class="card-header">
        <div>
          <h2>⚙️ Cài đặt</h2>
          <p class="card-description">Tùy chỉnh trải nghiệm ứng dụng của bạn</p>
        </div>
      </div>

      <!-- General Section -->
      <div class="settings-section">
        <p class="section-title">Cài đặt chung</p>
        
        <div class="setting-item">
          <div class="setting-content">
            <label class="setting-label">Ngôn ngữ</label>
            <p class="setting-description">Chọn ngôn ngữ giao diện</p>
          </div>
          <select v-model="settings.language" class="setting-select">
            <option value="vi">🇻🇳 Tiếng Việt</option>
            <option value="en">🇺🇸 English</option>
            <option value="zh">🇨🇳 中文</option>
          </select>
        </div>

        <div class="setting-item">
          <div class="setting-content">
            <label class="setting-label">Múi giờ</label>
            <p class="setting-description">Đặt múi giờ của bạn</p>
          </div>
          <select v-model="settings.timezone" class="setting-select">
            <option value="asia/ho_chi_minh">GMT+7 (Hà Nội)</option>
            <option value="asia/bangkok">GMT+7 (Bangkok)</option>
            <option value="asia/shanghai">GMT+8 (Shanghai)</option>
            <option value="utc">UTC</option>
          </select>
        </div>
      </div>

      <!-- Display Section -->
      <div class="settings-section">
        <p class="section-title">Giao diện</p>

        <div class="setting-item">
          <div class="setting-content">
            <label class="setting-label">Chế độ hiển thị</label>
            <p class="setting-description">Chọn sáng, tối hoặc tự động</p>
          </div>
          <div class="theme-selector">
            <button 
              v-for="theme in ['light', 'dark', 'auto']"
              :key="theme"
              class="theme-btn"
              :class="{ active: settings.theme === theme }"
              @click="settings.theme = theme"
              :title="themeLabel(theme)"
            >
              {{ themeIcon(theme) }}
            </button>
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-content">
            <label class="setting-label">Màu chủ đề</label>
            <p class="setting-description">Chọn màu chính của ứng dụng</p>
          </div>
          <div class="color-selector">
            <button 
              v-for="color in colors"
              :key="color"
              class="color-btn"
              :class="{ active: settings.accentColor === color }"
              @click="settings.accentColor = color"
              :style="{ backgroundColor: getColorValue(color) }"
              :title="color"
            ></button>
          </div>
        </div>

        <div class="setting-item">
          <div class="setting-content">
            <label class="setting-label">Fontsize giao diện</label>
            <p class="setting-description">Kích thước văn bản mặc định</p>
          </div>
          <div class="font-size-selector">
            <button 
              v-for="size in ['small', 'normal', 'large']"
              :key="size"
              class="size-btn"
              :class="{ active: settings.fontSize === size }"
              @click="settings.fontSize = size"
            >
              {{ sizeLabel(size) }}
            </button>
          </div>
        </div>
      </div>

      <!-- Notification Section -->
      <div class="settings-section">
        <p class="section-title">Thông báo</p>

        <div class="setting-item">
          <div class="setting-content">
            <label class="setting-label">Thông báo hoạt động</label>
            <p class="setting-description">Nhận thông báo về các sự kiện quan trọng</p>
          </div>
          <label class="toggle">
            <input 
              type="checkbox" 
              v-model="settings.notificationsEnabled"
              class="toggle-input"
            />
            <span class="toggle-switch"></span>
          </label>
        </div>

        <div class="setting-item">
          <div class="setting-content">
            <label class="setting-label">Âm thanh thông báo</label>
            <p class="setting-description">Phát âm thanh khi có thông báo</p>
          </div>
          <label class="toggle">
            <input 
              type="checkbox" 
              v-model="settings.soundEnabled"
              class="toggle-input"
              :disabled="!settings.notificationsEnabled"
            />
            <span class="toggle-switch"></span>
          </label>
        </div>

        <div class="setting-item">
          <div class="setting-content">
            <label class="setting-label">Rung thiết bị</label>
            <p class="setting-description">Rung khi có thông báo quan trọng</p>
          </div>
          <label class="toggle">
            <input 
              type="checkbox" 
              v-model="settings.vibrationEnabled"
              class="toggle-input"
              :disabled="!settings.notificationsEnabled"
            />
            <span class="toggle-switch"></span>
          </label>
        </div>

        <div class="setting-item">
          <div class="setting-content">
            <label class="setting-label">Thông báo timer hoàn thành</label>
            <p class="setting-description">Thông báo khi Pomodoro hoàn thành</p>
          </div>
          <label class="toggle">
            <input 
              type="checkbox" 
              v-model="settings.timerNotifications"
              class="toggle-input"
            />
            <span class="toggle-switch"></span>
          </label>
        </div>
      </div>

      <!-- Behavior Section -->
      <div class="settings-section">
        <p class="section-title">Hành vi</p>

        <div class="setting-item">
          <div class="setting-content">
            <label class="setting-label">Tự động bắt đầu giờ nghỉ</label>
            <p class="setting-description">Tự động bắt đầu session tiếp theo</p>
          </div>
          <label class="toggle">
            <input 
              type="checkbox" 
              v-model="settings.autoStartBreak"
              class="toggle-input"
            />
            <span class="toggle-switch"></span>
          </label>
        </div>

        <div class="setting-item">
          <div class="setting-content">
            <label class="setting-label">Lưu dữ liệu tự động</label>
            <p class="setting-description">Lưu ghi chú và dữ liệu mỗi 5 phút</p>
          </div>
          <label class="toggle">
            <input 
              type="checkbox" 
              v-model="settings.autoSave"
              class="toggle-input"
            />
            <span class="toggle-switch"></span>
          </label>
        </div>

        <div class="setting-item">
          <div class="setting-content">
            <label class="setting-label">Hiện mèo</label>
            <p class="setting-description">Hiển thị mascot Bangocat</p>
          </div>
          <label class="toggle">
            <input 
              type="checkbox" 
              v-model="settings.showMascot"
              class="toggle-input"
            />
            <span class="toggle-switch"></span>
          </label>
        </div>
      </div>

      <!-- Privacy Section -->
      <div class="settings-section">
        <p class="section-title">Riêng tư & Dữ liệu</p>

        <div class="setting-item">
          <div class="setting-content">
            <label class="setting-label">Chu kỳ lưu giữ dữ liệu</label>
            <p class="setting-description">Thời gian lưu giữ dữ liệu cũ</p>
          </div>
          <select v-model="settings.dataRetention" class="setting-select">
            <option value="30">30 ngày</option>
            <option value="90">90 ngày</option>
            <option value="180">180 ngày</option>
            <option value="365">1 năm</option>
          </select>
        </div>

        <button class="danger-btn" @click="showClearDataConfirm = true">
          <span>🗑️</span>
          Xóa tất cả dữ liệu
        </button>
      </div>

      <!-- About Section -->
      <div class="settings-section">
        <p class="section-title">Về ứng dụng</p>

        <div class="about-item">
          <p class="about-label">Phiên bản</p>
          <p class="about-value">1.0.0</p>
        </div>

        <div class="about-item">
          <p class="about-label">Tác giả</p>
          <p class="about-value">Bangocat Team</p>
        </div>

        <div class="about-item">
          <p class="about-label">Công nghệ</p>
          <p class="about-value">Vue 3 + Apple Design System</p>
        </div>

        <button class="link-btn" @click="openLink">
          <span>🔗</span>
          Truy cập trang web
        </button>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons">
        <button @click="saveSettings" class="btn-primary">
          <span>✓</span>
          Lưu cài đặt
        </button>
        <button @click="resetSettings" class="btn-secondary">
          <span>↺</span>
          Khôi phục mặc định
        </button>
      </div>

      <!-- Confirmation Dialog -->
      <div v-if="showClearDataConfirm" class="modal-overlay" @click="showClearDataConfirm = false">
        <div class="modal-content" @click.stop>
          <h3>Xác nhận xóa dữ liệu</h3>
          <p>Bạn có chắc chắn muốn xóa tất cả dữ liệu? Hành động này không thể hoàn tác.</p>
          <div class="modal-actions">
            <button @click="showClearDataConfirm = false" class="btn-cancel">Hủy</button>
            <button @click="clearAllData" class="btn-delete">Xóa</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsGroup',
  data() {
    return {
      settings: {
        language: 'vi',
        timezone: 'asia/ho_chi_minh',
        theme: 'light',
        accentColor: 'blue',
        fontSize: 'normal',
        notificationsEnabled: true,
        soundEnabled: true,
        vibrationEnabled: true,
        timerNotifications: true,
        autoStartBreak: false,
        autoSave: true,
        showMascot: true,
        dataRetention: '90'
      },
      colors: ['blue', 'purple', 'pink', 'green', 'orange'],
      colorMap: {
        blue: '#007AFF',
        purple: '#AF52DE',
        pink: '#FF2D55',
        green: '#34C759',
        orange: '#FF9500'
      },
      showClearDataConfirm: false
    }
  },
  methods: {
    themeIcon(theme) {
      const icons = {
        light: '☀️',
        dark: '🌙',
        auto: '🔄'
      }
      return icons[theme] || theme
    },
    themeLabel(theme) {
      const labels = {
        light: 'Sáng',
        dark: 'Tối',
        auto: 'Tự động'
      }
      return labels[theme] || theme
    },
    sizeLabel(size) {
      const labels = {
        small: 'Nhỏ',
        normal: 'Bình thường',
        large: 'Lớn'
      }
      return labels[size] || size
    },
    getColorValue(color) {
      return this.colorMap[color] || color
    },
    saveSettings() {
      // In real app, save to localStorage or API
      alert('✓ Đã lưu cài đặt thành công')
    },
    resetSettings() {
      if (confirm('Bạn có chắc chắn muốn khôi phục cài đặt mặc định?')) {
        this.settings = {
          language: 'vi',
          timezone: 'asia/ho_chi_minh',
          theme: 'light',
          accentColor: 'blue',
          fontSize: 'normal',
          notificationsEnabled: true,
          soundEnabled: true,
          vibrationEnabled: true,
          timerNotifications: true,
          autoStartBreak: false,
          autoSave: true,
          showMascot: true,
          dataRetention: '90'
        }
      }
    },
    clearAllData() {
      // In real app, clear from localStorage or API
      alert('✓ Đã xóa tất cả dữ liệu')
      this.showClearDataConfirm = false
    },
    openLink() {
      window.open('#', '_blank')
    }
  }
}
</script>

<style scoped>
.settings-container {
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

/* Settings Section */
.settings-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background-color: var(--background-secondary);
  border-radius: var(--radius-lg);
}

.section-title {
  margin: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-sm);
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Setting Item */
.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--card-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  transition: all var(--transition-fast);
}

.setting-item:hover {
  border-color: var(--border-light);
}

.setting-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  flex: 1;
}

.setting-label {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-color);
}

.setting-description {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

/* Selects */
.setting-select {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background-color: var(--card-bg);
  color: var(--text-color);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
  min-width: 150px;
}

.setting-select:hover {
  border-color: var(--border-light);
}

.setting-select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

/* Theme Selector */
.theme-selector {
  display: flex;
  gap: var(--spacing-sm);
}

.theme-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background-secondary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: 20px;
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
}

.theme-btn:hover {
  border-color: var(--border-light);
}

.theme-btn.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

/* Color Selector */
.color-selector {
  display: flex;
  gap: var(--spacing-sm);
}

.color-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
}

.color-btn:hover {
  transform: scale(1.1);
}

.color-btn.active {
  border-color: var(--text-color);
  box-shadow: 0 0 0 2px var(--card-bg);
}

/* Font Size Selector */
.font-size-selector {
  display: flex;
  gap: var(--spacing-sm);
}

.size-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
}

.size-btn:hover {
  background-color: var(--card-bg);
  border-color: var(--border-light);
}

.size-btn.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: #FFFFFF;
}

/* Toggle Switch */
.toggle {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.toggle-input {
  display: none;
}

.toggle-switch {
  position: relative;
  width: 50px;
  height: 30px;
  background-color: var(--border-color);
  border-radius: 15px;
  transition: background-color var(--transition-fast);
}

.toggle-switch::before {
  content: '';
  position: absolute;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background-color: #FFFFFF;
  top: 2px;
  left: 2px;
  transition: transform var(--transition-fast);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-input:checked + .toggle-switch {
  background-color: var(--primary-color);
}

.toggle-input:checked + .toggle-switch::before {
  transform: translateX(20px);
}

.toggle-input:disabled + .toggle-switch {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Danger Button */
.danger-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background-color: rgba(255, 59, 48, 0.1);
  border: 1px solid var(--danger);
  border-radius: var(--radius-md);
  color: var(--danger);
  font-size: var(--font-size-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
  width: 100%;
}

.danger-btn:hover {
  background-color: rgba(255, 59, 48, 0.2);
}

/* About Items */
.about-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--card-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.about-label {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-secondary);
}

.about-value {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-color);
}

/* Link Button */
.link-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background-color: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--primary-color);
  font-size: var(--font-size-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
  width: 100%;
}

.link-btn:hover {
  background-color: rgba(0, 122, 255, 0.05);
  border-color: var(--primary-color);
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

.btn-primary,
.btn-secondary {
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

.btn-secondary {
  background-color: var(--background-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn-secondary:hover {
  background-color: var(--border-light);
  color: var(--text-color);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background-color: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  max-width: 400px;
  box-shadow: var(--shadow-lg);
}

.modal-content h3 {
  margin: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-lg);
  color: var(--text-color);
}

.modal-content p {
  margin: 0 0 var(--spacing-lg) 0;
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: var(--spacing-md);
}

.btn-cancel,
.btn-delete {
  flex: 1;
  padding: var(--spacing-md);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
}

.btn-cancel {
  background-color: var(--background-secondary);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.btn-cancel:hover {
  background-color: var(--border-light);
}

.btn-delete {
  background-color: var(--danger);
  color: #FFFFFF;
}

.btn-delete:hover {
  opacity: 0.9;
}

/* Responsive */
@media (max-width: 768px) {
  .card {
    padding: var(--spacing-md);
  }

  .settings-section {
    padding: var(--spacing-md);
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-md);
  }

  .setting-select,
  .theme-selector,
  .color-selector,
  .font-size-selector {
    width: 100%;
  }

  .action-buttons {
    flex-direction: column;
  }

  .modal-content {
    max-width: 90%;
  }
}
</style>