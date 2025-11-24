<template>
    <div class="settings-container">
        <div class="card">
            <!-- Header -->
            <div class="card-header">
                <div class="header-content">
                    <h2 class="card-title">⚙️ Cài đặt</h2>
                    <p class="card-description">
                        Tùy chỉnh trải nghiệm ứng dụng của bạn
                    </p>
                </div>
            </div>

            <!-- General Section -->
            <div class="settings-section">
                <p class="section-title">Cài đặt chung</p>

                <div class="setting-item">
                    <div class="setting-content">
                        <label class="setting-label">Ngôn ngữ</label>
                        <p class="setting-description">
                            Chọn ngôn ngữ giao diện
                        </p>
                    </div>
                    <select v-model="settings.language" class="ios-select">
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
                    <select v-model="settings.timezone" class="ios-select">
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
                        <p class="setting-description">
                            Chọn sáng, tối hoặc tự động
                        </p>
                    </div>
                    <div class="theme-selector">
                        <button
                            v-for="theme in themeOptions"
                            :key="theme.value"
                            class="theme-btn"
                            :class="{ active: settings.theme === theme.value }"
                            @click="settings.theme = theme.value"
                            :title="theme.label"
                        >
                            <span class="theme-icon">{{ theme.icon }}</span>
                            <span class="theme-text">{{ theme.label }}</span>
                        </button>
                    </div>
                </div>

                <div class="setting-item">
                    <div class="setting-content">
                        <label class="setting-label">Màu chủ đề</label>
                        <p class="setting-description">
                            Chọn màu chính của ứng dụng
                        </p>
                    </div>
                    <div class="color-selector">
                        <button
                            v-for="color in colors"
                            :key="color.value"
                            class="color-btn"
                            :class="{
                                active: settings.accentColor === color.value,
                            }"
                            @click="settings.accentColor = color.value"
                            :style="{ backgroundColor: color.code }"
                            :title="color.label"
                        >
                            <div
                                v-if="settings.accentColor === color.value"
                                class="color-checkmark"
                            ></div>
                        </button>
                    </div>
                </div>

                <div class="setting-item">
                    <div class="setting-content">
                        <label class="setting-label">Fontsize giao diện</label>
                        <p class="setting-description">
                            Kích thước văn bản mặc định
                        </p>
                    </div>
                    <div class="size-selector">
                        <button
                            v-for="size in sizeOptions"
                            :key="size.value"
                            class="size-btn"
                            :class="{
                                active: settings.fontSize === size.value,
                            }"
                            @click="settings.fontSize = size.value"
                        >
                            {{ size.label }}
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
                        <p class="setting-description">
                            Nhận thông báo về các sự kiện quan trọng
                        </p>
                    </div>
                    <label class="ios-toggle">
                        <input
                            type="checkbox"
                            v-model="settings.notificationsEnabled"
                            class="toggle-input"
                        />
                        <span class="toggle-track"></span>
                    </label>
                </div>

                <div class="setting-item">
                    <div class="setting-content">
                        <label class="setting-label">Âm thanh thông báo</label>
                        <p class="setting-description">
                            Phát âm thanh khi có thông báo
                        </p>
                    </div>
                    <label class="ios-toggle">
                        <input
                            type="checkbox"
                            v-model="settings.soundEnabled"
                            class="toggle-input"
                            :disabled="!settings.notificationsEnabled"
                        />
                        <span class="toggle-track"></span>
                    </label>
                </div>

                <div class="setting-item">
                    <div class="setting-content">
                        <label class="setting-label">Rung thiết bị</label>
                        <p class="setting-description">
                            Rung khi có thông báo quan trọng
                        </p>
                    </div>
                    <label class="ios-toggle">
                        <input
                            type="checkbox"
                            v-model="settings.vibrationEnabled"
                            class="toggle-input"
                            :disabled="!settings.notificationsEnabled"
                        />
                        <span class="toggle-track"></span>
                    </label>
                </div>

                <div class="setting-item">
                    <div class="setting-content">
                        <label class="setting-label"
                            >Thông báo timer hoàn thành</label
                        >
                        <p class="setting-description">
                            Thông báo khi Pomodoro hoàn thành
                        </p>
                    </div>
                    <label class="ios-toggle">
                        <input
                            type="checkbox"
                            v-model="settings.timerNotifications"
                            class="toggle-input"
                        />
                        <span class="toggle-track"></span>
                    </label>
                </div>
            </div>

            <!-- Behavior Section -->
            <div class="settings-section">
                <p class="section-title">Hành vi</p>

                <div class="setting-item">
                    <div class="setting-content">
                        <label class="setting-label"
                            >Tự động bắt đầu giờ nghỉ</label
                        >
                        <p class="setting-description">
                            Tự động bắt đầu session tiếp theo
                        </p>
                    </div>
                    <label class="ios-toggle">
                        <input
                            type="checkbox"
                            v-model="settings.autoStartBreak"
                            class="toggle-input"
                        />
                        <span class="toggle-track"></span>
                    </label>
                </div>

                <div class="setting-item">
                    <div class="setting-content">
                        <label class="setting-label">Lưu dữ liệu tự động</label>
                        <p class="setting-description">
                            Lưu ghi chú và dữ liệu mỗi 5 phút
                        </p>
                    </div>
                    <label class="ios-toggle">
                        <input
                            type="checkbox"
                            v-model="settings.autoSave"
                            class="toggle-input"
                        />
                        <span class="toggle-track"></span>
                    </label>
                </div>

                <div class="setting-item">
                    <div class="setting-content">
                        <label class="setting-label">Hiện mèo</label>
                        <p class="setting-description">
                            Hiển thị mascot Bangocat
                        </p>
                    </div>
                    <label class="ios-toggle">
                        <input
                            type="checkbox"
                            v-model="settings.showMascot"
                            class="toggle-input"
                        />
                        <span class="toggle-track"></span>
                    </label>
                </div>
            </div>

            <!-- Privacy Section -->
            <div class="settings-section">
                <p class="section-title">Riêng tư & Dữ liệu</p>

                <div class="setting-item">
                    <div class="setting-content">
                        <label class="setting-label"
                            >Chu kỳ lưu giữ dữ liệu</label
                        >
                        <p class="setting-description">
                            Thời gian lưu giữ dữ liệu cũ
                        </p>
                    </div>
                    <select v-model="settings.dataRetention" class="ios-select">
                        <option value="30">30 ngày</option>
                        <option value="90">90 ngày</option>
                        <option value="180">180 ngày</option>
                        <option value="365">1 năm</option>
                    </select>
                </div>

                <button class="danger-btn" @click="showClearDataConfirm = true">
                    <span class="btn-icon">🗑️</span>
                    <span class="btn-text">Xóa tất cả dữ liệu</span>
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
                    <span class="btn-icon">🔗</span>
                    <span class="btn-text">Truy cập trang web</span>
                </button>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
                <button @click="saveSettings" class="btn-primary">
                    <span class="btn-icon">✓</span>
                    <span class="btn-text">Lưu cài đặt</span>
                </button>
                <button @click="resetSettings" class="btn-secondary">
                    <span class="btn-icon">↺</span>
                    <span class="btn-text">Khôi phục mặc định</span>
                </button>
            </div>

            <!-- Confirmation Dialog -->
            <div
                v-if="showClearDataConfirm"
                class="modal-overlay"
                @click="showClearDataConfirm = false"
            >
                <div class="modal-card" @click.stop>
                    <div class="modal-header">
                        <h3 class="modal-title">Xác nhận xóa dữ liệu</h3>
                    </div>
                    <div class="modal-body">
                        <p class="modal-description">
                            Bạn có chắc chắn muốn xóa tất cả dữ liệu? Hành động
                            này không thể hoàn tác.
                        </p>
                    </div>
                    <div class="modal-actions">
                        <button
                            @click="showClearDataConfirm = false"
                            class="modal-btn modal-btn-cancel"
                        >
                            Hủy
                        </button>
                        <button
                            @click="clearAllData"
                            class="modal-btn modal-btn-delete"
                        >
                            Xóa
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SettingsGroup",
    data() {
        return {
            settings: {
                language: "vi",
                timezone: "asia/ho_chi_minh",
                theme: "light",
                accentColor: "blue",
                fontSize: "normal",
                notificationsEnabled: true,
                soundEnabled: true,
                vibrationEnabled: true,
                timerNotifications: true,
                autoStartBreak: false,
                autoSave: true,
                showMascot: true,
                dataRetention: "90",
            },
            themeOptions: [
                { value: "light", label: "Sáng", icon: "☀️" },
                { value: "dark", label: "Tối", icon: "🌙" },
                { value: "auto", label: "Tự động", icon: "🔄" },
            ],
            colors: [
                { value: "blue", label: "Xanh dương", code: "#007AFF" },
                { value: "purple", label: "Tím", code: "#AF52DE" },
                { value: "pink", label: "Hồng", code: "#FF2D55" },
                { value: "green", label: "Xanh lá", code: "#34C759" },
                { value: "orange", label: "Cam", code: "#FF9500" },
            ],
            sizeOptions: [
                { value: "small", label: "Nhỏ" },
                { value: "normal", label: "Bình thường" },
                { value: "large", label: "Lớn" },
            ],
            showClearDataConfirm: false,
        };
    },
    methods: {
        saveSettings() {
            // In real app, save to localStorage or API
            this.showToast("✓ Đã lưu cài đặt thành công");
        },
        resetSettings() {
            if (confirm("Bạn có chắc chắn muốn khôi phục cài đặt mặc định?")) {
                this.settings = {
                    language: "vi",
                    timezone: "asia/ho_chi_minh",
                    theme: "light",
                    accentColor: "blue",
                    fontSize: "normal",
                    notificationsEnabled: true,
                    soundEnabled: true,
                    vibrationEnabled: true,
                    timerNotifications: true,
                    autoStartBreak: false,
                    autoSave: true,
                    showMascot: true,
                    dataRetention: "90",
                };
                this.showToast("✓ Đã khôi phục cài đặt mặc định");
            }
        },
        clearAllData() {
            // In real app, clear from localStorage or API
            this.showToast("✓ Đã xóa tất cả dữ liệu");
            this.showClearDataConfirm = false;
        },
        openLink() {
            window.open("#", "_blank");
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
.settings-container {
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

/* Settings Section */
.settings-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-2xl);
    padding: var(--spacing-lg);
    background-color: var(--ios-background-secondary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--ios-system-gray5);
}

.section-title {
    margin: 0 0 var(--spacing-md) 0;
    font-size: var(--font-size-sm);
    font-weight: 700;
    color: var(--ios-label-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Setting Item */
.setting-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-lg);
    padding: var(--spacing-md);
    background-color: var(--ios-background-primary);
    border-radius: var(--radius-md);
    border: 1px solid var(--ios-system-gray5);
    transition: all var(--transition-base);
    position: relative;
    overflow: hidden;
}

.setting-item::before {
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

.setting-item:hover::before {
    left: 100%;
}

.setting-item:hover {
    border-color: var(--ios-system-gray4);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
}

.setting-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    flex: 1;
    min-width: 0;
}

.setting-label {
    margin: 0;
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--ios-label-primary);
}

.setting-description {
    margin: 0;
    font-size: var(--font-size-sm);
    color: var(--ios-label-secondary);
    line-height: 1.4;
}

/* iOS Select */
.ios-select {
    padding: var(--spacing-sm) var(--spacing-md);
    border: 1px solid var(--ios-system-gray4);
    border-radius: var(--radius-md);
    background-color: var(--ios-background-primary);
    color: var(--ios-label-primary);
    font-size: var(--font-size-sm);
    font-family: var(--font-family);
    cursor: pointer;
    transition: all var(--transition-base);
    outline: none;
    min-width: 140px;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%238e8e93' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
    padding-right: 40px;
    appearance: none;
}

.ios-select:hover {
    border-color: var(--ios-system-blue);
}

.ios-select:focus {
    border-color: var(--ios-system-blue);
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

/* Theme Selector */
.theme-selector {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-sm);
    min-width: 180px;
}

.theme-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xs);
    padding: var(--spacing-sm);
    background-color: var(--ios-background-secondary);
    border: 2px solid transparent;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-base);
    outline: none;
}

.theme-btn:hover {
    background-color: var(--ios-background-primary);
    border-color: var(--ios-system-gray4);
}

.theme-btn.active {
    background-color: rgba(0, 122, 255, 0.1);
    border-color: var(--ios-system-blue);
}

.theme-icon {
    font-size: 20px;
}

.theme-text {
    font-size: var(--font-size-xs);
    font-weight: 600;
    color: var(--ios-label-primary);
}

.theme-btn.active .theme-text {
    color: var(--ios-system-blue);
}

/* Color Selector */
.color-selector {
    display: flex;
    gap: var(--spacing-md);
    min-width: 160px;
}

.color-btn {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-full);
    border: 3px solid transparent;
    cursor: pointer;
    transition: all var(--transition-base);
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.color-btn:hover {
    transform: scale(1.1);
}

.color-btn.active {
    border-color: var(--ios-label-primary);
    transform: scale(1.1);
}

.color-checkmark {
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='white' d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'/%3E%3C/svg%3E")
        center/contain no-repeat;
}

/* Size Selector */
.size-selector {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-sm);
    min-width: 180px;
}

.size-btn {
    padding: var(--spacing-sm) var(--spacing-xs);
    background-color: var(--ios-background-secondary);
    border: 1px solid var(--ios-system-gray5);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--ios-label-secondary);
    cursor: pointer;
    transition: all var(--transition-base);
    outline: none;
}

.size-btn:hover {
    background-color: var(--ios-background-primary);
    border-color: var(--ios-system-blue);
    color: var(--ios-system-blue);
}

.size-btn.active {
    background-color: var(--ios-system-blue);
    border-color: var(--ios-system-blue);
    color: white;
}

/* iOS Toggle */
.ios-toggle {
    display: inline-flex;
    align-items: center;
    cursor: pointer;
    user-select: none;
}

.toggle-input {
    display: none;
}

.toggle-track {
    position: relative;
    width: 52px;
    height: 32px;
    background-color: var(--ios-system-gray4);
    border-radius: 16px;
    transition: all var(--transition-base);
    flex-shrink: 0;
}

.toggle-track::before {
    content: "";
    position: absolute;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background-color: white;
    top: 2px;
    left: 2px;
    transition: transform var(--transition-base);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-input:checked + .toggle-track {
    background-color: var(--ios-system-blue);
}

.toggle-input:checked + .toggle-track::before {
    transform: translateX(20px);
}

.toggle-input:disabled + .toggle-track {
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
    background-color: rgba(255, 59, 48, 0.05);
    border: 1px solid var(--ios-system-red);
    border-radius: var(--radius-md);
    color: var(--ios-system-red);
    font-size: var(--font-size-base);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-base);
    outline: none;
    width: 100%;
}

.danger-btn:hover {
    background-color: rgba(255, 59, 48, 0.1);
    transform: translateY(-1px);
}

/* About Items */
.about-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--spacing-lg);
    padding: var(--spacing-md);
    background-color: var(--ios-background-primary);
    border-radius: var(--radius-md);
    border: 1px solid var(--ios-system-gray5);
}

.about-label {
    margin: 0;
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--ios-label-secondary);
}

.about-value {
    margin: 0;
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--ios-label-primary);
}

/* Link Button */
.link-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    background-color: transparent;
    border: 1px solid var(--ios-system-blue);
    border-radius: var(--radius-md);
    color: var(--ios-system-blue);
    font-size: var(--font-size-base);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-base);
    outline: none;
    width: 100%;
}

.link-btn:hover {
    background-color: rgba(0, 122, 255, 0.05);
    transform: translateY(-1px);
}

/* Button Icons & Text */
.btn-icon {
    font-size: 18px;
}

.btn-text {
    font-weight: 600;
}

/* Action Buttons */
.action-buttons {
    display: flex;
    gap: var(--spacing-md);
    margin-top: var(--spacing-xl);
    padding-top: var(--spacing-lg);
    border-top: 1px solid var(--ios-system-gray5);
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
    transition: all var(--transition-base);
    outline: none;
    position: relative;
    overflow: hidden;
}

.btn-primary::before,
.btn-secondary::before {
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
.btn-secondary:hover::before {
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
    background-color: var(--ios-background-secondary);
    color: var(--ios-label-primary);
    border: 1px solid var(--ios-system-gray4);
}

.btn-secondary:hover {
    background-color: var(--ios-background-primary);
    border-color: var(--ios-system-blue);
    color: var(--ios-system-blue);
    transform: translateY(-1px);
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
    z-index: 1000;
    padding: var(--spacing-md);
}

.modal-card {
    background-color: var(--ios-background-primary);
    border-radius: var(--radius-lg);
    padding: 0;
    max-width: 400px;
    width: 100%;
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--ios-system-gray5);
    overflow: hidden;
}

.modal-header {
    padding: var(--spacing-xl) var(--spacing-xl) 0;
}

.modal-title {
    margin: 0;
    font-size: var(--font-size-lg);
    font-weight: 700;
    color: var(--ios-label-primary);
    text-align: center;
}

.modal-body {
    padding: var(--spacing-lg) var(--spacing-xl);
}

.modal-description {
    margin: 0;
    font-size: var(--font-size-base);
    color: var(--ios-label-secondary);
    line-height: 1.6;
    text-align: center;
}

.modal-actions {
    display: flex;
    gap: var(--spacing-md);
    padding: 0 var(--spacing-xl) var(--spacing-xl);
}

.modal-btn {
    flex: 1;
    padding: var(--spacing-md);
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--font-size-base);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-base);
    outline: none;
}

.modal-btn-cancel {
    background-color: var(--ios-background-secondary);
    color: var(--ios-label-primary);
    border: 1px solid var(--ios-system-gray4);
}

.modal-btn-cancel:hover {
    background-color: var(--ios-background-primary);
    border-color: var(--ios-system-gray3);
}

.modal-btn-delete {
    background-color: var(--ios-system-red);
    color: white;
}

.modal-btn-delete:hover {
    background-color: #d70015;
}

/* Responsive Design */
@media (max-width: 768px) {
    .settings-container {
        max-width: 100%;
    }

    .card {
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
    }

    .settings-section {
        padding: var(--spacing-md);
    }

    .setting-item {
        flex-direction: column;
        align-items: stretch;
        gap: var(--spacing-md);
    }

    .ios-select,
    .theme-selector,
    .color-selector,
    .size-selector {
        width: 100%;
    }

    .theme-selector {
        grid-template-columns: 1fr;
    }

    .action-buttons {
        flex-direction: column;
    }

    .modal-card {
        max-width: 100%;
    }

    .modal-actions {
        flex-direction: column;
    }
}

@media (max-width: 480px) {
    .color-selector {
        justify-content: space-between;
    }

    .theme-selector {
        grid-template-columns: repeat(3, 1fr);
    }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .setting-item {
        background: var(--ios-background-tertiary);
    }

    .about-item {
        background: var(--ios-background-tertiary);
    }

    .ios-select {
        background-color: var(--ios-background-tertiary);
    }

    .btn-secondary {
        background: var(--ios-background-tertiary);
    }
}
</style>
