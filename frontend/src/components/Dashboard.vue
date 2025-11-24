<template>
  <div class="dashboard-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">Chào mừng đến với Bangocat</h1>
          <p class="hero-subtitle">Ứng dụng Pomodoro kết hợp mèo dễ thương để giúp bạn học tập hiệu quả hơn</p>
          <div class="hero-buttons">
            <router-link to="/pomodoro" class="btn-hero btn-primary">
              <span>⏱️</span>
              Bắt đầu Pomodoro
            </router-link>
            <router-link to="/study-roadmap" class="btn-hero btn-secondary">
              <span>🗺️</span>
              Xem lộ trình
            </router-link>
          </div>
        </div>
        <div class="hero-mascot">
          <p class="mascot-emoji">🐱</p>
          <p class="mascot-text">Bangocat đang chờ bạn!</p>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="features-section">
      <h2 class="section-title">Tính năng chính</h2>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">⏱️</div>
          <h3>Pomodoro Timer</h3>
          <p>Quản lý thời gian làm việc với kỹ thuật Pomodoro hiệu quả</p>
          <router-link to="/pomodoro" class="feature-link">Khám phá →</router-link>
        </div>

        <div class="feature-card">
          <div class="feature-icon">📝</div>
          <h3>Ghi chú nhanh</h3>
          <p>Lưu ý các ý tưởng và thông tin quan trọng ngay lập tức</p>
          <router-link to="/quick-notes" class="feature-link">Khám phá →</router-link>
        </div>

        <div class="feature-card">
          <div class="feature-icon">📚</div>
          <h3>Từ điển</h3>
          <p>Tra cứu từ vựng và mở rộng vốn từ của bạn mọi lúc</p>
          <router-link to="/dictionary" class="feature-link">Khám phá →</router-link>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🗺️</div>
          <h3>Lộ trình học</h3>
          <p>Lập kế hoạch học tập chi tiết với các mục tiêu rõ ràng</p>
          <router-link to="/study-roadmap" class="feature-link">Khám phá →</router-link>
        </div>

        <div class="feature-card">
          <div class="feature-icon">📅</div>
          <h3>Lịch & To-do</h3>
          <p>Quản lý công việc hàng ngày và theo dõi tiến độ</p>
          <router-link to="/calendar" class="feature-link">Khám phá →</router-link>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🎵</div>
          <h3>Nhạc nền</h3>
          <p>Nghe nhạc thư giãn để tăng cường sự tập trung</p>
          <router-link to="/music" class="feature-link">Khám phá →</router-link>
        </div>

        <div class="feature-card">
          <div class="feature-icon">🧘</div>
          <h3>Zen Mode</h3>
          <p>Chế độ thiền định giúp bạn thư giãn và khôi phục năng lượng</p>
          <router-link to="/zen" class="feature-link">Khám phá →</router-link>
        </div>

        <div class="feature-card">
          <div class="feature-icon">📊</div>
          <h3>Thống kê</h3>
          <p>Theo dõi tiến độ học tập và phân tích hiệu suất</p>
          <router-link to="/stats" class="feature-link">Khám phá →</router-link>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="stat-card">
        <div class="stat-number">25</div>
        <div class="stat-label">Phút mỗi session</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">5</div>
        <div class="stat-label">Phút nghỉ ngơi</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">4</div>
        <div class="stat-label">Lần lặp lại</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">∞</div>
        <div class="stat-label">Niềm vui</div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <h2>Sẵn sàng tăng năng suất?</h2>
      <p>Hãy bắt đầu cuộc hành trình học tập của bạn ngay hôm nay cùng Bangocat</p>
      <router-link to="/customize-cat" class="btn-cta">
        <span>🎨</span>
        Cá nhân hóa mèo của bạn
      </router-link>
    </section>

    <!-- About Section -->
    <section class="about-section">
      <h3>Về Bangocat</h3>
      <p>
        Bangocat là một ứng dụng học tập hiệu quả kết hợp kỹ thuật Pomodoro với một chú mèo dễ thương. 
        Được thiết kế để giúp bạn duy trì sự tập trung, quản lý thời gian và đạt được mục tiêu học tập của mình. 
        Mỗi session hoàn thành đều mang lại niềm vui từ Bangocat.
      </p>
      <div class="about-links">
        <router-link to="/settings" class="about-link">⚙️ Cài đặt</router-link>
        <router-link to="/customize-cat" class="about-link">🎨 Tùy chỉnh</router-link>
        <a href="#" class="about-link">💬 Phản hồi</a>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'Dashboard'
}
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
  width: 100%;
}

/* Hero Section */
.hero-section {
  background: linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%);
  border-radius: var(--radius-lg);
  padding: var(--spacing-2xl);
  color: #FFFFFF;
  overflow: hidden;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-2xl);
  align-items: center;
}

.hero-text {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.hero-title {
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.5px;
  line-height: 1.2;
}

.hero-subtitle {
  margin: 0;
  font-size: var(--font-size-lg);
  line-height: 1.6;
  opacity: 0.95;
}

.hero-buttons {
  display: flex;
  gap: var(--spacing-md);
}

.btn-hero {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-fast);
  cursor: pointer;
  border: none;
  outline: none;
}

.btn-hero.btn-primary {
  background-color: #FFFFFF;
  color: #007AFF;
}

.btn-hero.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

.btn-hero.btn-secondary {
  background-color: rgba(255, 255, 255, 0.2);
  color: #FFFFFF;
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.btn-hero.btn-secondary:hover {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.hero-mascot {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
  animation: floating 3s ease-in-out infinite;
}

.mascot-emoji {
  font-size: 120px;
  margin: 0;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.2));
}

.mascot-text {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  opacity: 0.95;
}

@keyframes floating {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

/* Features Section */
.features-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.section-title {
  margin: 0;
  font-size: var(--font-size-2xl);
  font-weight: 700;
  letter-spacing: -0.5px;
  color: var(--text-color);
  text-align: center;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--spacing-lg);
}

.feature-card {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  transition: all var(--transition-base);
  cursor: pointer;
}

.feature-card:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
}

.feature-icon {
  font-size: 40px;
}

.feature-card h3 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-color);
}

.feature-card p {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.5;
  flex: 1;
}

.feature-link {
  display: inline-block;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--primary-color);
  text-decoration: none;
  transition: color var(--transition-fast);
  align-self: flex-start;
}

.feature-link:hover {
  color: #0051D5;
}

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-lg);
}

.stat-card {
  background: linear-gradient(135deg, rgba(0, 122, 255, 0.1) 0%, rgba(90, 200, 250, 0.1) 100%);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  align-items: center;
  justify-content: center;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: var(--primary-color);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: 500;
}

/* CTA Section */
.cta-section {
  background: linear-gradient(135deg, #F0F4FF 0%, #E8F1FF 100%);
  border-radius: var(--radius-lg);
  padding: var(--spacing-2xl);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  align-items: center;
}

.cta-section h2 {
  margin: 0;
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--text-color);
}

.cta-section p {
  margin: 0;
  font-size: var(--font-size-lg);
  color: var(--text-secondary);
  max-width: 500px;
}

.btn-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-xl);
  background-color: var(--primary-color);
  color: #FFFFFF;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  text-decoration: none;
  transition: all var(--transition-fast);
  border: none;
  cursor: pointer;
}

.btn-cta:hover {
  background-color: #0051D5;
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

/* About Section */
.about-section {
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
}

.about-section h3 {
  margin: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-color);
}

.about-section p {
  margin: 0 0 var(--spacing-lg) 0;
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  line-height: 1.7;
}

.about-links {
  display: flex;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.about-link {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.about-link:hover {
  background-color: var(--border-light);
  color: var(--primary-color);
  border-color: var(--primary-color);
}

/* Responsive */
@media (max-width: 1024px) {
  .hero-content {
    grid-template-columns: 1fr;
  }

  .mascot-emoji {
    font-size: 80px;
  }

  .features-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    gap: var(--spacing-xl);
  }

  .hero-section {
    padding: var(--spacing-xl);
  }

  .hero-title {
    font-size: 24px;
  }

  .hero-subtitle {
    font-size: var(--font-size-base);
  }

  .hero-buttons {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .btn-hero {
    width: 100%;
    padding: var(--spacing-md);
  }

  .mascot-emoji {
    font-size: 60px;
  }

  .section-title {
    font-size: var(--font-size-xl);
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .cta-section {
    padding: var(--spacing-xl);
  }

  .cta-section h2 {
    font-size: var(--font-size-xl);
  }

  .about-links {
    flex-direction: column;
  }

  .about-link {
    width: 100%;
    justify-content: center;
  }
}
</style>