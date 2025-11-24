<template>
  <div class="music-container">
    <div class="card">
      <!-- Header -->
      <div class="card-header">
        <div>
          <h2>🎵 Nhạc nền</h2>
          <p class="card-description">Nghe nhạc thư giãn để tăng cường sự tập trung</p>
        </div>
        <div class="now-playing" v-if="isPlaying">
          <span class="pulse"></span>
          <span class="playing-text">Đang phát</span>
        </div>
      </div>

      <!-- Current Player -->
      <div class="player-section">
        <div class="player-card">
          <div class="player-icon">
            <span v-if="isPlaying" class="icon-animated">🎵</span>
            <span v-else class="icon-static">🎵</span>
          </div>

          <div class="player-info">
            <p class="player-title">{{ currentPlaylist.name }}</p>
            <p class="player-description">{{ currentPlaylist.description }}</p>
          </div>

          <button 
            @click="toggle" 
            class="btn-play"
            :class="{ playing: isPlaying }"
          >
            <span v-if="!isPlaying">▶</span>
            <span v-else>⏸</span>
          </button>
        </div>

        <!-- Volume Control -->
        <div class="volume-section">
          <div class="volume-header">
            <label class="volume-label">Âm lượng</label>
            <span class="volume-value">{{ volume }}%</span>
          </div>
          <div class="volume-slider-wrapper">
            <span class="volume-icon">🔇</span>
            <input 
              type="range" 
              min="0" 
              max="100" 
              v-model="volume"
              class="volume-slider"
            />
            <span class="volume-icon">🔊</span>
          </div>
        </div>

        <!-- Playback Speed -->
        <div class="speed-section">
          <p class="speed-label">Tốc độ</p>
          <div class="speed-buttons">
            <button 
              v-for="speed in [0.75, 1, 1.25, 1.5]"
              :key="speed"
              class="speed-btn"
              :class="{ active: playbackSpeed === speed }"
              @click="playbackSpeed = speed"
            >
              {{ speed }}x
            </button>
          </div>
        </div>
      </div>

      <!-- Playlists -->
      <div class="playlists-section">
        <p class="section-title">Danh sách phát</p>
        <div class="playlists-grid">
          <div 
            v-for="item in playlists"
            :key="item.id"
            class="playlist-card"
            @click="selectPlaylist(item)"
            :class="{ active: playlist.id === item.id }"
          >
            <div class="playlist-icon">{{ item.icon }}</div>
            <div class="playlist-content">
              <p class="playlist-name">{{ item.name }}</p>
              <p class="playlist-songs">{{ item.songs }} ca khúc</p>
            </div>
            <div v-if="playlist.id === item.id" class="active-indicator">✓</div>
          </div>
        </div>
      </div>

      <!-- Sound Features -->
      <div class="features-section">
        <p class="section-title">Tính năng</p>
        <div class="features-grid">
          <button 
            class="feature-btn"
            :class="{ active: loopMode }"
            @click="loopMode = !loopMode"
            title="Loop"
          >
            <span>🔁</span>
            Lặp lại
          </button>
          <button 
            class="feature-btn"
            :class="{ active: shuffleMode }"
            @click="shuffleMode = !shuffleMode"
            title="Shuffle"
          >
            <span>🔀</span>
            Xáo trộn
          </button>
          <button 
            class="feature-btn"
            :class="{ active: timberMode }"
            @click="timberMode = !timberMode"
            title="EQ"
          >
            <span>🎚️</span>
            EQ
          </button>
          <button 
            class="feature-btn"
            :class="{ active: timerActive }"
            @click="showTimer = !showTimer"
            title="Timer"
          >
            <span>⏱️</span>
            Hẹn giờ
          </button>
        </div>
      </div>

      <!-- Timer -->
      <div v-if="showTimer" class="timer-section">
        <p class="timer-label">Tắt nhạc sau (phút)</p>
        <div class="timer-controls">
          <input 
            type="number" 
            v-model.number="timerMinutes" 
            min="1" 
            max="120"
            class="timer-input"
          />
          <button 
            @click="setTimer"
            class="btn-set-timer"
            :class="{ active: timerActive }"
          >
            {{ timerActive ? '✓ Đã hẹn' : 'Hẹn giờ' }}
          </button>
        </div>
      </div>

      <!-- Info -->
      <div class="info-box">
        <p class="info-text">💡 Mẹo: Sử dụng nhạc nền để tăng sự tập trung và học tập hiệu quả hơn!</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Music',
  data() {
    return {
      volume: 60,
      isPlaying: false,
      playbackSpeed: 1,
      loopMode: false,
      shuffleMode: false,
      timberMode: false,
      timerActive: false,
      timerMinutes: 30,
      showTimer: false,
      playlistId: 1,
      playlists: [
        { 
          id: 1, 
          name: 'Lofi Chill', 
          icon: '☁️',
          description: 'Nhạc lofi thư giãn',
          songs: 50
        },
        { 
          id: 2, 
          name: 'Tiếng mưa', 
          icon: '🌧️',
          description: 'Âm thanh mưa tự nhiên',
          songs: 20
        },
        { 
          id: 3, 
          name: 'Rừng sâu', 
          icon: '🌲',
          description: 'Âm thanh thiên nhiên',
          songs: 15
        },
        { 
          id: 4, 
          name: 'Cà phê quán', 
          icon: '☕',
          description: 'Âm thanh quán cà phê',
          songs: 30
        }
      ]
    }
  },
  computed: {
    playlist() {
      return this.playlists.find(p => p.id === this.playlistId) || this.playlists[0]
    },
    currentPlaylist() {
      return this.playlist
    }
  },
  methods: {
    toggle() {
      this.isPlaying = !this.isPlaying
    },
    selectPlaylist(item) {
      this.playlistId = item.id
      if (!this.isPlaying) {
        this.isPlaying = true
      }
    },
    setTimer() {
      this.timerActive = !this.timerActive
      if (this.timerActive) {
        // Simulate timer countdown
        setTimeout(() => {
          this.isPlaying = false
          this.timerActive = false
        }, this.timerMinutes * 60 * 1000)
      }
    }
  }
}
</script>

<style scoped>
.music-container {
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

.now-playing {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: rgba(52, 199, 89, 0.1);
  border: 1px solid rgba(52, 199, 89, 0.2);
  border-radius: var(--radius-md);
  color: var(--success);
  font-size: var(--font-size-sm);
  font-weight: 600;
}

.pulse {
  display: inline-block;
  width: 6px;
  height: 6px;
  background-color: var(--success);
  border-radius: 50%;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.playing-text {
  font-size: var(--font-size-xs);
}

/* Player Section */
.player-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.player-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  background: linear-gradient(135deg, #F0F4FF 0%, #E8F1FF 100%);
  border: 1px solid rgba(0, 122, 255, 0.2);
  border-radius: var(--radius-lg);
}

.player-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-lg);
  font-size: 32px;
}

.icon-animated {
  animation: bounce 1s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.player-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.player-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-color);
}

.player-description {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.btn-play {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background-color: var(--primary-color);
  color: #FFFFFF;
  border: none;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  transition: all var(--transition-base);
  flex-shrink: 0;
  outline: none;
}

.btn-play:hover {
  background-color: #0051D5;
  transform: scale(1.05);
}

.btn-play:active {
  transform: scale(0.95);
}

.btn-play.playing {
  animation: pulse-scale 1.5s ease-in-out infinite;
}

@keyframes pulse-scale {
  0%, 100% { box-shadow: 0 0 0 0 rgba(0, 122, 255, 0.7); }
  50% { box-shadow: 0 0 0 10px rgba(0, 122, 255, 0); }
}

/* Volume Section */
.volume-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background-color: var(--background-secondary);
  border-radius: var(--radius-lg);
}

.volume-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.volume-label {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.volume-value {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--primary-color);
}

.volume-slider-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.volume-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.volume-slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(to right, var(--primary-color) 0%, var(--primary-color) var(--slider-percent, 60%), var(--border-light) var(--slider-percent, 60%), var(--border-light) 100%);
  -webkit-appearance: none;
  appearance: none;
  outline: none;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: var(--primary-color);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.volume-slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: var(--primary-color);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Speed Section */
.speed-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.speed-label {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.speed-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
}

.speed-btn {
  padding: var(--spacing-sm) 0;
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

.speed-btn:hover {
  background-color: var(--card-bg);
  border-color: var(--border-light);
}

.speed-btn.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: #FFFFFF;
}

/* Playlists Section */
.playlists-section {
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

.playlists-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
}

.playlist-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--background-secondary);
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
}

.playlist-card:hover {
  background-color: var(--card-bg);
  border-color: var(--border-light);
}

.playlist-card.active {
  background-color: rgba(0, 122, 255, 0.1);
  border-color: var(--primary-color);
}

.playlist-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.playlist-content {
  flex: 1;
  min-width: 0;
}

.playlist-name {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-color);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.playlist-songs {
  margin: 0;
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.active-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background-color: var(--primary-color);
  color: #FFFFFF;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 700;
}

/* Features Section */
.features-section {
  margin-bottom: var(--spacing-xl);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: var(--spacing-md);
}

.feature-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background-color: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
}

.feature-btn:hover {
  background-color: var(--card-bg);
  border-color: var(--border-light);
}

.feature-btn.active {
  background-color: rgba(0, 122, 255, 0.1);
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.feature-btn span {
  font-size: 20px;
}

/* Timer Section */
.timer-section {
  padding: var(--spacing-lg);
  background-color: var(--background-secondary);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-lg);
}

.timer-label {
  margin: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.timer-controls {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.timer-input {
  width: 80px;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  text-align: center;
  outline: none;
  transition: all var(--transition-fast);
}

.timer-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.btn-set-timer {
  flex: 1;
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--primary-color);
  color: #FFFFFF;
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
}

.btn-set-timer:hover {
  background-color: #0051D5;
}

.btn-set-timer.active {
  background-color: var(--success);
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
    gap: var(--spacing-md);
  }

  .player-card {
    flex-direction: column;
    text-align: center;
  }

  .playlists-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }

  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .speed-buttons {
    grid-template-columns: repeat(2, 1fr);
  }

  .timer-controls {
    flex-direction: column;
  }

  .btn-set-timer {
    width: 100%;
  }
}
</style>