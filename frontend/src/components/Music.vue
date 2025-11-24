<template>
    <div class="music-container">
        <div class="card">
            <!-- Header -->
            <div class="card-header">
                <div class="header-content">
                    <h2 class="card-title">🎵 Nhạc nền</h2>
                    <p class="card-description">
                        Nghe nhạc thư giãn để tăng cường sự tập trung
                    </p>
                </div>
                <div class="now-playing" v-if="isPlaying">
                    <span class="pulse-dot"></span>
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
                        <p class="player-description">
                            {{ currentPlaylist.description }}
                        </p>
                    </div>

                    <button
                        @click="toggle"
                        class="btn-play"
                        :class="{ playing: isPlaying }"
                        aria-label="Play/Pause"
                    >
                        <span v-if="!isPlaying">▶</span>
                        <span v-else>⏸</span>
                    </button>
                </div>

                <!-- Volume Control -->
                <div class="control-section">
                    <div class="control-header">
                        <label class="control-label">Âm lượng</label>
                        <span class="control-value">{{ volume }}%</span>
                    </div>
                    <div class="slider-wrapper">
                        <span class="slider-icon">🔇</span>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            v-model="volume"
                            class="ios-slider"
                            :style="{ '--slider-value': volume + '%' }"
                        />
                        <span class="slider-icon">🔊</span>
                    </div>
                </div>

                <!-- Playback Speed -->
                <div class="control-section">
                    <p class="control-label">Tốc độ phát</p>
                    <div class="speed-buttons">
                        <button
                            v-for="speed in speedOptions"
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
            <div class="section">
                <p class="section-title">Danh sách phát</p>
                <div class="playlists-grid">
                    <div
                        v-for="item in playlists"
                        :key="item.id"
                        class="playlist-card"
                        @click="selectPlaylist(item)"
                        :class="{ active: currentPlaylist.id === item.id }"
                    >
                        <div class="playlist-icon">{{ item.icon }}</div>
                        <div class="playlist-content">
                            <p class="playlist-name">{{ item.name }}</p>
                            <p class="playlist-meta">
                                {{ item.songs }} ca khúc
                            </p>
                        </div>
                        <div
                            v-if="currentPlaylist.id === item.id"
                            class="active-indicator"
                        >
                            <div class="checkmark"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sound Features -->
            <div class="section">
                <p class="section-title">Tính năng âm thanh</p>
                <div class="features-grid">
                    <button
                        class="feature-btn"
                        :class="{ active: loopMode }"
                        @click="loopMode = !loopMode"
                    >
                        <span class="feature-icon">🔁</span>
                        <span class="feature-text">Lặp lại</span>
                    </button>
                    <button
                        class="feature-btn"
                        :class="{ active: shuffleMode }"
                        @click="shuffleMode = !shuffleMode"
                    >
                        <span class="feature-icon">🔀</span>
                        <span class="feature-text">Xáo trộn</span>
                    </button>
                    <button
                        class="feature-btn"
                        :class="{ active: timberMode }"
                        @click="timberMode = !timberMode"
                    >
                        <span class="feature-icon">🎚️</span>
                        <span class="feature-text">Âm sắc</span>
                    </button>
                    <button
                        class="feature-btn"
                        :class="{ active: timerActive }"
                        @click="showTimer = !showTimer"
                    >
                        <span class="feature-icon">⏱️</span>
                        <span class="feature-text">Hẹn giờ</span>
                    </button>
                </div>
            </div>

            <!-- Timer Section -->
            <div v-if="showTimer" class="timer-section">
                <p class="section-title">Hẹn giờ tắt nhạc</p>
                <div class="timer-controls">
                    <div class="timer-input-wrapper">
                        <input
                            type="number"
                            v-model.number="timerMinutes"
                            min="1"
                            max="120"
                            class="timer-input"
                        />
                        <span class="timer-unit">phút</span>
                    </div>
                    <button
                        @click="setTimer"
                        class="btn-timer"
                        :class="{ active: timerActive }"
                    >
                        {{ timerActive ? "Đã hẹn giờ" : "Bắt đầu hẹn giờ" }}
                    </button>
                </div>
            </div>

            <!-- Info Card -->
            <div class="info-card">
                <div class="info-icon">💡</div>
                <p class="info-text">
                    Mẹo: Nghe nhạc nền giúp tăng cường sự tập trung và hiệu quả
                    học tập!
                </p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Music",
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
            speedOptions: [0.75, 1, 1.25, 1.5],
            playlists: [
                {
                    id: 1,
                    name: "Lofi Chill",
                    icon: "☁️",
                    description: "Nhạc lofi thư giãn",
                    songs: 50,
                },
                {
                    id: 2,
                    name: "Tiếng mưa",
                    icon: "🌧️",
                    description: "Âm thanh mưa tự nhiên",
                    songs: 20,
                },
                {
                    id: 3,
                    name: "Rừng sâu",
                    icon: "🌲",
                    description: "Âm thanh thiên nhiên",
                    songs: 15,
                },
                {
                    id: 4,
                    name: "Cà phê quán",
                    icon: "☕",
                    description: "Âm thanh quán cà phê",
                    songs: 30,
                },
            ],
        };
    },
    computed: {
        currentPlaylist() {
            return (
                this.playlists.find((p) => p.id === this.playlistId) ||
                this.playlists[0]
            );
        },
    },
    methods: {
        toggle() {
            this.isPlaying = !this.isPlaying;
        },
        selectPlaylist(item) {
            this.playlistId = item.id;
            if (!this.isPlaying) {
                this.isPlaying = true;
            }
        },
        setTimer() {
            this.timerActive = !this.timerActive;
            if (this.timerActive) {
                setTimeout(
                    () => {
                        this.isPlaying = false;
                        this.timerActive = false;
                    },
                    this.timerMinutes * 60 * 1000,
                );
            }
        },
    },
};
</script>

<style scoped>
.music-container {
    width: 100%;
    max-width: 400px;
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
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
    padding-bottom: var(--spacing-lg);
    border-bottom: 1px solid var(--ios-system-gray5);
}

.header-content {
    flex: 1;
}

.card-title {
    margin: 0 0 var(--spacing-xs) 0;
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

.now-playing {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: rgba(52, 199, 89, 0.1);
    border-radius: var(--radius-full);
    color: var(--ios-system-green);
    font-size: var(--font-size-sm);
    font-weight: 600;
    white-space: nowrap;
}

.pulse-dot {
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: var(--ios-system-green);
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
    0%,
    100% {
        opacity: 1;
        transform: scale(1);
    }
    50% {
        opacity: 0.7;
        transform: scale(1.1);
    }
}

/* Player Section */
.player-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    margin-bottom: var(--spacing-2xl);
}

.player-card {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
    background: var(--ios-background-secondary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--ios-system-gray5);
    transition: all var(--transition-base);
}

.player-card:hover {
    border-color: var(--ios-system-gray4);
    box-shadow: var(--shadow-sm);
}

.player-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    background: linear-gradient(
        135deg,
        var(--ios-system-blue),
        var(--ios-system-teal)
    );
    border-radius: var(--radius-lg);
    font-size: 28px;
    flex-shrink: 0;
}

.icon-animated {
    animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
    0%,
    100% {
        transform: scale(1) rotate(0deg);
    }
    25% {
        transform: scale(1.05) rotate(5deg);
    }
    75% {
        transform: scale(1.05) rotate(-5deg);
    }
}

.player-info {
    flex: 1;
    min-width: 0;
}

.player-title {
    margin: 0 0 var(--spacing-xs) 0;
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--ios-label-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.player-description {
    margin: 0;
    font-size: var(--font-size-sm);
    color: var(--ios-label-secondary);
}

.btn-play {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    background: var(--ios-system-blue);
    color: white;
    border: none;
    border-radius: var(--radius-full);
    font-size: 20px;
    cursor: pointer;
    transition: all var(--transition-base);
    flex-shrink: 0;
    position: relative;
    overflow: hidden;
}

.btn-play::before {
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

.btn-play:hover::before {
    left: 100%;
}

.btn-play:hover {
    background: #0056cc;
    transform: scale(1.05);
}

.btn-play:active {
    transform: scale(0.95);
}

.btn-play.playing {
    background: var(--ios-system-orange);
    animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
    0%,
    100% {
        box-shadow: 0 0 0 0 rgba(255, 149, 0, 0.4);
    }
    50% {
        box-shadow: 0 0 0 8px rgba(255, 149, 0, 0);
    }
}

/* Control Sections */
.control-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.control-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.control-label {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--ios-label-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.control-value {
    font-size: var(--font-size-base);
    font-weight: 700;
    color: var(--ios-system-blue);
}

.slider-wrapper {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.slider-icon {
    font-size: 18px;
    color: var(--ios-label-tertiary);
    flex-shrink: 0;
}

.ios-slider {
    flex: 1;
    height: 6px;
    border-radius: 3px;
    background: linear-gradient(
        to right,
        var(--ios-system-blue) 0%,
        var(--ios-system-blue) var(--slider-value, 60%),
        var(--ios-system-gray5) var(--slider-value, 60%),
        var(--ios-system-gray5) 100%
    );
    -webkit-appearance: none;
    appearance: none;
    outline: none;
    cursor: pointer;
    transition: all var(--transition-fast);
}

.ios-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--ios-system-blue);
    cursor: pointer;
    border: 3px solid white;
    box-shadow: var(--shadow-md);
    transition: all var(--transition-fast);
}

.ios-slider::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: var(--shadow-lg);
}

.ios-slider::-moz-range-thumb {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--ios-system-blue);
    cursor: pointer;
    border: 3px solid white;
    box-shadow: var(--shadow-md);
    border: none;
}

/* Speed Buttons */
.speed-buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: var(--spacing-sm);
}

.speed-btn {
    padding: var(--spacing-sm) var(--spacing-xs);
    background-color: var(--ios-background-secondary);
    border: 1px solid var(--ios-system-gray5);
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--ios-label-secondary);
    cursor: pointer;
    transition: all var(--transition-fast);
    outline: none;
}

.speed-btn:hover {
    background-color: var(--ios-background-primary);
    border-color: var(--ios-system-blue);
    color: var(--ios-system-blue);
}

.speed-btn.active {
    background-color: var(--ios-system-blue);
    border-color: var(--ios-system-blue);
    color: white;
    transform: scale(1.05);
}

/* Sections */
.section {
    margin-bottom: var(--spacing-2xl);
}

.section-title {
    margin: 0 0 var(--spacing-lg) 0;
    font-size: var(--font-size-sm);
    font-weight: 700;
    color: var(--ios-label-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Playlists Grid */
.playlists-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: var(--spacing-md);
}

.playlist-card {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background-color: var(--ios-background-secondary);
    border: 2px solid transparent;
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--transition-base);
    position: relative;
    overflow: hidden;
}

.playlist-card::before {
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

.playlist-card:hover::before {
    left: 100%;
}

.playlist-card:hover {
    background-color: var(--ios-background-primary);
    border-color: var(--ios-system-gray4);
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
}

.playlist-card.active {
    background-color: rgba(0, 122, 255, 0.08);
    border-color: var(--ios-system-blue);
    transform: translateY(-1px);
}

.playlist-icon {
    font-size: 32px;
    flex-shrink: 0;
    filter: grayscale(0.3);
    transition: filter var(--transition-base);
}

.playlist-card.active .playlist-icon {
    filter: grayscale(0);
}

.playlist-content {
    flex: 1;
    min-width: 0;
}

.playlist-name {
    margin: 0 0 var(--spacing-xs) 0;
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--ios-label-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.playlist-meta {
    margin: 0;
    font-size: var(--font-size-xs);
    color: var(--ios-label-tertiary);
}

.active-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    background-color: var(--ios-system-blue);
    border-radius: var(--radius-full);
    flex-shrink: 0;
}

.checkmark {
    width: 12px;
    height: 12px;
    background: white;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='white' d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z'/%3E%3C/svg%3E")
        center/contain no-repeat;
}

/* Features Grid */
.features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: var(--spacing-md);
}

.feature-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-lg) var(--spacing-md);
    background-color: var(--ios-background-secondary);
    border: 1px solid var(--ios-system-gray5);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--transition-base);
    outline: none;
}

.feature-btn:hover {
    background-color: var(--ios-background-primary);
    border-color: var(--ios-system-blue);
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
}

.feature-btn.active {
    background-color: rgba(0, 122, 255, 0.1);
    border-color: var(--ios-system-blue);
    color: var(--ios-system-blue);
    transform: translateY(-1px);
}

.feature-icon {
    font-size: 24px;
    transition: transform var(--transition-base);
}

.feature-btn.active .feature-icon {
    transform: scale(1.1);
}

.feature-text {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: inherit;
}

.feature-btn.active .feature-text {
    color: var(--ios-system-blue);
}

/* Timer Section */
.timer-section {
    padding: var(--spacing-lg);
    background-color: var(--ios-background-secondary);
    border-radius: var(--radius-lg);
    margin-bottom: var(--spacing-xl);
    border: 1px solid var(--ios-system-gray5);
}

.timer-controls {
    display: flex;
    gap: var(--spacing-md);
    align-items: stretch;
}

.timer-input-wrapper {
    position: relative;
    flex: 1;
}

.timer-input {
    width: 100%;
    padding: var(--spacing-md) var(--spacing-lg) var(--spacing-md)
        var(--spacing-md);
    border: 1px solid var(--ios-system-gray4);
    border-radius: var(--radius-md);
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--ios-label-primary);
    text-align: center;
    outline: none;
    transition: all var(--transition-fast);
    background: var(--ios-background-primary);
}

.timer-input:focus {
    border-color: var(--ios-system-blue);
    box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.timer-unit {
    position: absolute;
    right: var(--spacing-md);
    top: 50%;
    transform: translateY(-50%);
    font-size: var(--font-size-sm);
    color: var(--ios-label-tertiary);
    pointer-events: none;
}

.btn-timer {
    padding: var(--spacing-md) var(--spacing-lg);
    background-color: var(--ios-system-blue);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-size: var(--font-size-sm);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-base);
    outline: none;
    white-space: nowrap;
    min-width: 120px;
}

.btn-timer:hover {
    background-color: #0056cc;
    transform: translateY(-1px);
}

.btn-timer.active {
    background-color: var(--ios-system-green);
}

.btn-timer.active:hover {
    background-color: #30b456;
}

/* Info Card */
.info-card {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-md);
    padding: var(--spacing-lg);
    background: linear-gradient(
        135deg,
        rgba(0, 122, 255, 0.05) 0%,
        rgba(90, 200, 250, 0.05) 100%
    );
    border: 1px solid rgba(0, 122, 255, 0.1);
    border-radius: var(--radius-lg);
}

.info-icon {
    font-size: 20px;
    flex-shrink: 0;
    margin-top: 2px;
}

.info-text {
    margin: 0;
    font-size: var(--font-size-sm);
    color: var(--ios-label-secondary);
    line-height: 1.5;
}

/* Responsive Design */
@media (max-width: 768px) {
    .music-container {
        max-width: 100%;
    }

    .card {
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
    }

    .card-header {
        flex-direction: column;
        align-items: stretch;
        gap: var(--spacing-md);
    }

    .now-playing {
        align-self: flex-start;
    }

    .player-card {
        flex-direction: column;
        text-align: center;
        gap: var(--spacing-md);
    }

    .player-info {
        text-align: center;
    }

    .playlists-grid {
        grid-template-columns: 1fr;
        gap: var(--spacing-sm);
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

    .btn-timer {
        width: 100%;
    }
}

@media (max-width: 480px) {
    .features-grid {
        grid-template-columns: 1fr;
    }

    .speed-buttons {
        grid-template-columns: repeat(4, 1fr);
    }

    .card-title {
        font-size: var(--font-size-xl);
    }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .player-card {
        background: var(--ios-background-tertiary);
    }

    .playlist-card {
        background: var(--ios-background-tertiary);
    }

    .feature-btn {
        background: var(--ios-background-tertiary);
    }

    .timer-section {
        background: var(--ios-background-tertiary);
    }

    .timer-input {
        background: var(--ios-background-primary);
    }
}
</style>
