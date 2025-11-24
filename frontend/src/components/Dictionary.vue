<template>
    <div class="dictionary-page">
        <div class="page-header">
            <h1 class="page-title">Dictionary & Translate</h1>
            <p class="page-subtitle">Look up words and translate instantly</p>
        </div>

        <div class="dictionary-container">
            <!-- Translation Card -->
            <div class="translation-card">
                <div class="card-header">
                    <h2 class="card-title">Quick Translate</h2>
                    <div class="usage-stats">
                        <span class="stat">Today: {{ todayUsage }}</span>
                        <span class="stat">Total: {{ totalUsage }}</span>
                    </div>
                </div>

                <!-- Language Selection -->
                <div class="language-section">
                    <div class="language-selector">
                        <div class="language-from">
                            <label class="language-label">From</label>
                            <div class="language-picker">
                                <button
                                    class="lang-btn"
                                    :class="{ active: fromLang === 'vi' }"
                                    @click="fromLang = 'vi'"
                                >
                                    <span class="flag">🇻🇳</span>
                                    <span class="lang-name">Vietnamese</span>
                                </button>
                                <button
                                    class="lang-btn"
                                    :class="{ active: fromLang === 'en' }"
                                    @click="fromLang = 'en'"
                                >
                                    <span class="flag">🇺🇸</span>
                                    <span class="lang-name">English</span>
                                </button>
                            </div>
                        </div>

                        <button
                            class="swap-btn"
                            @click="swapLanguages"
                            title="Swap languages"
                        >
                            <span class="swap-icon">⇄</span>
                        </button>

                        <div class="language-to">
                            <label class="language-label">To</label>
                            <div class="language-picker">
                                <button
                                    class="lang-btn"
                                    :class="{ active: toLang === 'en' }"
                                    @click="toLang = 'en'"
                                >
                                    <span class="flag">🇺🇸</span>
                                    <span class="lang-name">English</span>
                                </button>
                                <button
                                    class="lang-btn"
                                    :class="{ active: toLang === 'vi' }"
                                    @click="toLang = 'vi'"
                                >
                                    <span class="flag">🇻🇳</span>
                                    <span class="lang-name">Vietnamese</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Input Section -->
                <div class="input-section">
                    <div class="input-container">
                        <textarea
                            v-model="query"
                            @keyup.enter="translate"
                            placeholder="Enter text to translate..."
                            class="translate-input"
                            rows="3"
                        ></textarea>
                        <div class="input-actions">
                            <button
                                class="action-btn"
                                @click="clearInput"
                                title="Clear"
                                v-if="query"
                            >
                                <span class="icon">✕</span>
                            </button>
                            <button
                                class="action-btn"
                                @click="speakText"
                                title="Speak"
                                v-if="query"
                            >
                                <span class="icon">🔊</span>
                            </button>
                        </div>
                    </div>

                    <button
                        @click="translate"
                        class="translate-btn"
                        :disabled="!query.trim() || isLoading"
                    >
                        <span class="btn-icon" v-if="!isLoading">🔍</span>
                        <span class="btn-icon loading" v-else>⏳</span>
                        <span class="btn-text">{{
                            isLoading ? "Translating..." : "Translate"
                        }}</span>
                    </button>
                </div>

                <!-- Result Section -->
                <div v-if="result" class="result-section">
                    <div class="result-card">
                        <div class="result-header">
                            <h3 class="result-title">Translation Result</h3>
                            <div class="result-meta">
                                <span
                                    class="confidence"
                                    :class="confidenceClass"
                                >
                                    {{ confidence }}% confident
                                </span>
                            </div>
                        </div>

                        <div class="translation-content">
                            <div class="original-text">
                                <p class="text-label">Original</p>
                                <p class="text-content">{{ query }}</p>
                                <button class="speak-btn" @click="speakText">
                                    <span class="icon">🔊</span>
                                </button>
                            </div>

                            <div class="translation-arrow">→</div>

                            <div class="translated-text">
                                <p class="text-label">Translation</p>
                                <p class="text-content">{{ result }}</p>
                                <div class="translation-actions">
                                    <button
                                        class="action-btn"
                                        @click="speakTranslation"
                                    >
                                        <span class="icon">🔊</span>
                                    </button>
                                    <button
                                        class="action-btn"
                                        @click="copyTranslation"
                                    >
                                        <span
                                            class="icon"
                                            :class="{ copied: copySuccess }"
                                        >
                                            {{ copySuccess ? "✓" : "📋" }}
                                        </span>
                                    </button>
                                    <button
                                        class="action-btn"
                                        @click="saveToVocabulary"
                                    >
                                        <span class="icon">⭐</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Additional Info -->
                        <div v-if="wordDetails" class="word-details">
                            <div class="detail-item">
                                <span class="detail-label">Pronunciation</span>
                                <span class="detail-value">{{
                                    wordDetails.pronunciation
                                }}</span>
                                <button
                                    class="speak-btn small"
                                    @click="speakText"
                                >
                                    <span class="icon">🔊</span>
                                </button>
                            </div>
                            <div
                                class="detail-item"
                                v-if="wordDetails.partOfSpeech"
                            >
                                <span class="detail-label">Part of Speech</span>
                                <span class="detail-value tag">{{
                                    wordDetails.partOfSpeech
                                }}</span>
                            </div>
                            <div class="detail-item" v-if="wordDetails.example">
                                <span class="detail-label">Example</span>
                                <span class="detail-value">{{
                                    wordDetails.example
                                }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-else-if="!isLoading" class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <h3>Ready to translate</h3>
                    <p>Enter text above to get started</p>
                </div>
            </div>

            <!-- Side Panel -->
            <div class="side-panel">
                <!-- Quick Access -->
                <div class="quick-access-card">
                    <h3 class="card-title">Quick Access</h3>
                    <div class="quick-words">
                        <button
                            v-for="word in quickWords"
                            :key="word"
                            class="word-chip"
                            @click="setQuickWord(word)"
                        >
                            {{ word }}
                        </button>
                    </div>
                </div>

                <!-- History -->
                <div class="history-card">
                    <div class="card-header">
                        <h3 class="card-title">Recent Translations</h3>
                        <button
                            class="clear-btn"
                            @click="clearHistory"
                            v-if="history.length > 0"
                        >
                            Clear
                        </button>
                    </div>

                    <div class="history-list">
                        <div
                            v-for="(item, index) in history"
                            :key="index"
                            class="history-item"
                            @click="loadFromHistory(item)"
                        >
                            <div class="history-content">
                                <p class="history-original">{{ item.query }}</p>
                                <p class="history-translation">
                                    {{ item.result }}
                                </p>
                                <div class="history-meta">
                                    <span class="lang-pair"
                                        >{{ item.fromLang }} →
                                        {{ item.toLang }}</span
                                    >
                                    <span class="time-ago">{{
                                        formatTimeAgo(item.timestamp)
                                    }}</span>
                                </div>
                            </div>
                            <button
                                class="remove-btn"
                                @click.stop="removeFromHistory(index)"
                            >
                                <span class="icon">×</span>
                            </button>
                        </div>

                        <div v-if="history.length === 0" class="empty-history">
                            <p>No translation history yet</p>
                        </div>
                    </div>
                </div>

                <!-- Vocabulary Stats -->
                <div class="stats-card">
                    <h3 class="card-title">Vocabulary</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-icon">📚</div>
                            <div class="stat-info">
                                <div class="stat-value">
                                    {{ vocabularyCount }}
                                </div>
                                <div class="stat-label">Words Saved</div>
                            </div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-icon">⭐</div>
                            <div class="stat-info">
                                <div class="stat-value">
                                    {{ masteredCount }}
                                </div>
                                <div class="stat-label">Mastered</div>
                            </div>
                        </div>
                    </div>
                    <button class="view-vocab-btn" @click="viewVocabulary">
                        View All Words
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Dictionary",
    data() {
        return {
            fromLang: "vi",
            toLang: "en",
            query: "",
            result: "",
            isLoading: false,
            copySuccess: false,
            todayUsage: 5,
            totalUsage: 127,
            confidence: 95,
            history: [],
            quickWords: [
                "hello",
                "thank you",
                "good morning",
                "how are you",
                "please",
                "sorry",
            ],
            wordDetails: null,
            vocabularyCount: 24,
            masteredCount: 8,
        };
    },
    computed: {
        confidenceClass() {
            if (this.confidence >= 90) return "high";
            if (this.confidence >= 70) return "medium";
            return "low";
        },
    },
    methods: {
        async translate() {
            if (!this.query.trim()) return;

            this.isLoading = true;

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Mock translation data
            const mockTranslations = {
                "vi-en": {
                    "xin chào": "hello",
                    "cảm ơn": "thank you",
                    "chào buổi sáng": "good morning",
                    "bạn khỏe không": "how are you",
                    "làm ơn": "please",
                    "xin lỗi": "sorry",
                    "học tập": "study",
                    "từ điển": "dictionary",
                    mèo: "cat",
                },
                "en-vi": {
                    hello: "xin chào",
                    "thank you": "cảm ơn",
                    "good morning": "chào buổi sáng",
                    "how are you": "bạn khỏe không",
                    please: "làm ơn",
                    sorry: "xin lỗi",
                    study: "học tập",
                    dictionary: "từ điển",
                    cat: "mèo",
                },
            };

            const translationKey = `${this.fromLang}-${this.toLang}`;
            const key = this.query.toLowerCase().trim();

            if (
                mockTranslations[translationKey] &&
                mockTranslations[translationKey][key]
            ) {
                this.result = mockTranslations[translationKey][key];
                this.wordDetails = this.getWordDetails(key);
                this.addToHistory();
            } else {
                this.result = `[${translationKey}] ${this.query}`;
                this.wordDetails = null;
            }

            this.isLoading = false;
            this.todayUsage++;
            this.totalUsage++;
        },

        getWordDetails(word) {
            const details = {
                hello: {
                    pronunciation: "heˈlō",
                    partOfSpeech: "interjection",
                    example: "Hello, how are you?",
                },
                "thank you": {
                    pronunciation: "ˈthaNGk ˌyo͞o",
                    partOfSpeech: "phrase",
                    example: "Thank you for your help.",
                },
                "xin chào": {
                    pronunciation: "sin chow",
                    partOfSpeech: "thán từ",
                    example: "Xin chào, bạn khỏe không?",
                },
                "cảm ơn": {
                    pronunciation: "gam uhn",
                    partOfSpeech: "động từ",
                    example: "Cảm ơn bạn rất nhiều.",
                },
            };
            return details[word.toLowerCase()] || null;
        },

        swapLanguages() {
            [this.fromLang, this.toLang] = [this.toLang, this.fromLang];
            if (this.query && this.result) {
                [this.query, this.result] = [this.result, this.query];
            }
        },

        clearInput() {
            this.query = "";
            this.result = "";
            this.wordDetails = null;
        },

        speakText() {
            if ("speechSynthesis" in window && this.query) {
                const utterance = new SpeechSynthesisUtterance(this.query);
                utterance.lang = this.fromLang === "vi" ? "vi-VN" : "en-US";
                speechSynthesis.speak(utterance);
            }
        },

        speakTranslation() {
            if ("speechSynthesis" in window && this.result) {
                const utterance = new SpeechSynthesisUtterance(this.result);
                utterance.lang = this.toLang === "vi" ? "vi-VN" : "en-US";
                speechSynthesis.speak(utterance);
            }
        },

        copyTranslation() {
            navigator.clipboard.writeText(this.result);
            this.copySuccess = true;
            setTimeout(() => {
                this.copySuccess = false;
            }, 2000);
        },

        saveToVocabulary() {
            if (!this.query || !this.result) return;

            // In real app, this would save to backend
            this.vocabularyCount++;
            // Show success message
        },

        addToHistory() {
            const historyItem = {
                query: this.query,
                result: this.result,
                fromLang: this.fromLang,
                toLang: this.toLang,
                timestamp: new Date(),
            };

            const existingIndex = this.history.findIndex(
                (item) => item.query.toLowerCase() === this.query.toLowerCase(),
            );

            if (existingIndex > -1) {
                this.history.splice(existingIndex, 1);
            }

            this.history.unshift(historyItem);

            // Keep only last 10 items
            if (this.history.length > 10) {
                this.history.pop();
            }
        },

        loadFromHistory(item) {
            this.fromLang = item.fromLang;
            this.toLang = item.toLang;
            this.query = item.query;
            this.result = item.result;
            this.wordDetails = this.getWordDetails(item.query);
        },

        removeFromHistory(index) {
            this.history.splice(index, 1);
        },

        clearHistory() {
            this.history = [];
        },

        setQuickWord(word) {
            this.query = word;
            this.translate();
        },

        viewVocabulary() {
            // Navigate to vocabulary page
            this.$router.push("/vocabulary");
        },

        formatTimeAgo(timestamp) {
            const now = new Date();
            const diff = now - new Date(timestamp);
            const minutes = Math.floor(diff / 60000);
            const hours = Math.floor(diff / 3600000);
            const days = Math.floor(diff / 86400000);

            if (minutes < 1) return "Just now";
            if (minutes < 60) return `${minutes}m ago`;
            if (hours < 24) return `${hours}h ago`;
            return `${days}d ago`;
        },
    },

    mounted() {
        // Load history from localStorage in real app
        this.history = [
            {
                query: "hello",
                result: "xin chào",
                fromLang: "en",
                toLang: "vi",
                timestamp: new Date(Date.now() - 300000), // 5 minutes ago
            },
            {
                query: "cảm ơn",
                result: "thank you",
                fromLang: "vi",
                toLang: "en",
                timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
            },
        ];
    },
};
</script>

<style scoped>
.dictionary-page {
    max-width: 1200px;
    margin: 0 auto;
}

.page-header {
    margin-bottom: var(--spacing-2xl);
}

.page-title {
    font-size: var(--font-size-3xl);
    font-weight: 700;
    color: var(--ios-label-primary);
    margin: 0 0 var(--spacing-sm) 0;
    letter-spacing: -0.5px;
}

.page-subtitle {
    font-size: var(--font-size-base);
    color: var(--ios-label-secondary);
    margin: 0;
}

.dictionary-container {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: var(--spacing-2xl);
    align-items: start;
}

/* Translation Card */
.translation-card {
    background: var(--ios-background-primary);
    border-radius: var(--radius-xl);
    padding: var(--spacing-2xl);
    box-shadow: var(--shadow-md);
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--spacing-xl);
}

.card-title {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--ios-label-primary);
    margin: 0;
}

.usage-stats {
    display: flex;
    gap: var(--spacing-lg);
}

.stat {
    font-size: var(--font-size-sm);
    color: var(--ios-label-secondary);
    font-weight: 500;
}

/* Language Selection */
.language-section {
    margin-bottom: var(--spacing-xl);
}

.language-selector {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: var(--spacing-lg);
    align-items: end;
}

.language-from,
.language-to {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.language-label {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--ios-label-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.language-picker {
    display: flex;
    gap: var(--spacing-sm);
    background: var(--ios-background-secondary);
    border-radius: var(--radius-lg);
    padding: var(--spacing-sm);
}

.lang-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    background: transparent;
    border: 2px solid transparent;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
    color: var(--ios-label-secondary);
}

.lang-btn:hover {
    background: var(--ios-background-primary);
}

.lang-btn.active {
    background: var(--ios-background-primary);
    border-color: var(--ios-system-blue);
    color: var(--ios-label-primary);
    box-shadow: var(--shadow-sm);
}

.flag {
    font-size: 20px;
}

.lang-name {
    font-size: var(--font-size-sm);
    font-weight: 600;
}

.swap-btn {
    background: var(--ios-background-secondary);
    border: none;
    border-radius: var(--radius-md);
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--transition-fast);
    color: var(--ios-label-primary);
}

.swap-btn:hover {
    background: var(--ios-system-gray6);
    transform: rotate(180deg);
}

.swap-icon {
    font-size: 18px;
    font-weight: bold;
}

/* Input Section */
.input-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
}

.input-container {
    position: relative;
    background: var(--ios-background-secondary);
    border-radius: var(--radius-lg);
    border: 2px solid transparent;
    transition: all var(--transition-fast);
}

.input-container:focus-within {
    border-color: var(--ios-system-blue);
    background: var(--ios-background-primary);
}

.translate-input {
    width: 100%;
    border: none;
    background: transparent;
    padding: var(--spacing-lg);
    font-size: var(--font-size-base);
    color: var(--ios-label-primary);
    outline: none;
    resize: vertical;
    min-height: 100px;
    font-family: inherit;
}

.translate-input::placeholder {
    color: var(--ios-label-tertiary);
}

.input-actions {
    position: absolute;
    top: var(--spacing-md);
    right: var(--spacing-md);
    display: flex;
    gap: var(--spacing-sm);
}

.action-btn {
    background: rgba(255, 255, 255, 0.9);
    border: none;
    border-radius: var(--radius-md);
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--transition-fast);
    color: var(--ios-label-secondary);
    backdrop-filter: blur(10px);
}

.action-btn:hover {
    background: white;
    color: var(--ios-label-primary);
    transform: scale(1.1);
}

.translate-btn {
    background: var(--ios-system-blue);
    color: white;
    border: none;
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    font-size: var(--font-size-base);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
}

.translate-btn:hover:not(:disabled) {
    background: #0056cc;
    transform: translateY(-2px);
}

.translate-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

.btn-icon.loading {
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

/* Result Section */
.result-card {
    background: linear-gradient(135deg, #f0f4ff 0%, #e8f1ff 100%);
    border: 1px solid rgba(0, 122, 255, 0.2);
    border-radius: var(--radius-xl);
    padding: var(--spacing-xl);
}

.result-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--spacing-lg);
}

.result-title {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--ios-label-primary);
    margin: 0;
}

.confidence {
    font-size: var(--font-size-xs);
    font-weight: 600;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-full);
}

.confidence.high {
    background: var(--ios-system-green);
    color: white;
}

.confidence.medium {
    background: var(--ios-system-orange);
    color: white;
}

.confidence.low {
    background: var(--ios-system-red);
    color: white;
}

.translation-content {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: var(--spacing-xl);
    align-items: start;
    margin-bottom: var(--spacing-lg);
}

.original-text,
.translated-text {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.text-label {
    font-size: var(--font-size-xs);
    font-weight: 600;
    color: var(--ios-label-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin: 0;
}

.text-content {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--ios-label-primary);
    margin: 0;
    line-height: 1.4;
}

.translation-arrow {
    font-size: 24px;
    color: var(--ios-label-tertiary);
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.translation-actions {
    display: flex;
    gap: var(--spacing-sm);
}

.speak-btn {
    background: var(--ios-system-blue);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all var(--transition-fast);
}

.speak-btn:hover {
    background: #0056cc;
    transform: scale(1.1);
}

.speak-btn.small {
    width: 28px;
    height: 28px;
}

/* Word Details */
.word-details {
    border-top: 1px solid rgba(0, 122, 255, 0.1);
    padding-top: var(--spacing-lg);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.detail-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
    padding: var(--spacing-md);
    background: rgba(255, 255, 255, 0.5);
    border-radius: var(--radius-md);
}

.detail-label {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--ios-label-secondary);
    min-width: 100px;
}

.detail-value {
    flex: 1;
    font-size: var(--font-size-base);
    color: var(--ios-label-primary);
}

.detail-value.tag {
    background: var(--ios-system-blue);
    color: white;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-full);
    font-size: var(--font-size-xs);
    font-weight: 600;
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: var(--spacing-2xl);
    color: var(--ios-label-secondary);
}

.empty-icon {
    font-size: 48px;
    margin-bottom: var(--spacing-md);
    opacity: 0.5;
}

.empty-state h3 {
    margin: 0 0 var(--spacing-sm) 0;
    color: var(--ios-label-primary);
    font-size: var(--font-size-lg);
}

.empty-state p {
    margin: 0;
    font-size: var(--font-size-sm);
}

/* Side Panel */
.side-panel {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
}

.quick-access-card,
.history-card,
.stats-card {
    background: var(--ios-background-primary);
    border-radius: var(--radius-xl);
    padding: var(--spacing-xl);
    box-shadow: var(--shadow-md);
}

.quick-words {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
}

.word-chip {
    background: var(--ios-background-secondary);
    border: 1px solid var(--ios-system-gray5);
    border-radius: var(--radius-full);
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: var(--font-size-sm);
    color: var(--ios-label-primary);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.word-chip:hover {
    background: var(--ios-system-blue);
    border-color: var(--ios-system-blue);
    color: white;
    transform: translateY(-1px);
}

/* History */
.history-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    max-height: 400px;
    overflow-y: auto;
}

.history-item {
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: var(--ios-background-secondary);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--transition-fast);
    border: 1px solid transparent;
}

.history-item:hover {
    border-color: var(--ios-system-blue);
    transform: translateY(-1px);
    box-shadow: var(--shadow-sm);
}

.history-content {
    flex: 1;
    min-width: 0;
}

.history-original {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--ios-label-primary);
    margin: 0 0 var(--spacing-xs) 0;
    line-height: 1.3;
}

.history-translation {
    font-size: var(--font-size-sm);
    color: var(--ios-label-secondary);
    margin: 0 0 var(--spacing-xs) 0;
    line-height: 1.3;
}

.history-meta {
    display: flex;
    gap: var(--spacing-md);
    font-size: var(--font-size-xs);
    color: var(--ios-label-tertiary);
}

.lang-pair {
    font-weight: 600;
}

.remove-btn {
    background: none;
    border: none;
    color: var(--ios-label-tertiary);
    cursor: pointer;
    padding: var(--spacing-xs);
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
    flex-shrink: 0;
}

.remove-btn:hover {
    background: var(--ios-system-red);
    color: white;
}

.empty-history {
    text-align: center;
    padding: var(--spacing-lg);
    color: var(--ios-label-tertiary);
    font-size: var(--font-size-sm);
}

.clear-btn {
    background: none;
    border: none;
    color: var(--ios-system-red);
    font-size: var(--font-size-sm);
    font-weight: 600;
    cursor: pointer;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
}

.clear-btn:hover {
    background: var(--ios-system-red);
    color: white;
}

/* Stats Card */
.stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
}

.stat-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: var(--ios-background-secondary);
    border-radius: var(--radius-lg);
}

.stat-icon {
    font-size: 20px;
    width: 40px;
    height: 40px;
    background: var(--ios-system-blue);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.stat-info {
    flex: 1;
}

.stat-value {
    font-size: var(--font-size-lg);
    font-weight: 700;
    color: var(--ios-label-primary);
    margin-bottom: var(--spacing-xs);
}

.stat-label {
    font-size: var(--font-size-xs);
    color: var(--ios-label-secondary);
    font-weight: 500;
}

.view-vocab-btn {
    width: 100%;
    background: var(--ios-system-blue);
    color: white;
    border: none;
    border-radius: var(--radius-lg);
    padding: var(--spacing-md);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
}

.view-vocab-btn:hover {
    background: #0056cc;
}

/* Responsive */
@media (max-width: 768px) {
    .dictionary-container {
        grid-template-columns: 1fr;
    }

    .language-selector {
        grid-template-columns: 1fr;
        gap: var(--spacing-md);
    }

    .swap-btn {
        align-self: center;
        transform: rotate(90deg);
    }

    .translation-content {
        grid-template-columns: 1fr;
        gap: var(--spacing-lg);
    }

    .translation-arrow {
        transform: rotate(90deg);
        height: auto;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }
}
</style>
