<template>
    <div class="customize-page">
        <div class="page-header">
            <h1 class="page-title">Customize Your Cat</h1>
            <p class="page-subtitle">Personalize your study companion</p>
        </div>

        <div class="customize-container">
            <!-- Cat Profile Card -->
            <div class="profile-card">
                <div class="profile-header">
                    <div class="cat-info">
                        <h2 class="cat-name">Bangocat</h2>
                        <p class="cat-level">Level 5 • Study Companion</p>
                    </div>
                    <div class="points-display">
                        <div class="points-badge">
                            <span class="points-icon">⭐</span>
                            <span class="points-value">{{ points }}</span>
                        </div>
                        <p class="points-label">Reward Points</p>
                    </div>
                </div>

                <!-- Cat Preview -->
                <div class="cat-preview-section">
                    <div class="preview-container">
                        <div class="cat-display">
                            <div class="cat-avatar" :class="currentStyle">
                                <span class="cat-emoji">🐱</span>
                                <div
                                    v-if="accessory !== 'None'"
                                    class="cat-accessory"
                                >
                                    <span class="accessory-emoji">{{
                                        getAccessoryEmoji
                                    }}</span>
                                </div>
                            </div>
                            <div
                                class="mood-indicator"
                                :class="mood.toLowerCase()"
                            >
                                <span class="mood-emoji">{{
                                    getMoodEmoji
                                }}</span>
                            </div>
                        </div>

                        <div class="preview-info">
                            <h3 class="preview-title">{{ skin }} Cat</h3>
                            <p class="preview-description">
                                {{ getCatDescription }}
                            </p>
                            <div class="style-tags">
                                <span class="style-tag">{{ skin }}</span>
                                <span
                                    v-if="accessory !== 'None'"
                                    class="style-tag"
                                    >{{ accessory }}</span
                                >
                                <span class="style-tag">{{ mood }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Customization Panel -->
            <div class="customize-panel">
                <!-- Skin Selection -->
                <div class="customize-section">
                    <h3 class="section-title">Cat Style</h3>
                    <p class="section-description">
                        Choose your cat's appearance
                    </p>

                    <div class="options-grid">
                        <div
                            v-for="style in skins"
                            :key="style.id"
                            class="option-card"
                            :class="{
                                active: skin === style.name,
                                locked: style.locked,
                            }"
                            @click="selectSkin(style)"
                        >
                            <div class="option-preview">
                                <span class="option-emoji">{{
                                    style.emoji
                                }}</span>
                                <div v-if="style.locked" class="lock-overlay">
                                    <span class="lock-icon">🔒</span>
                                </div>
                            </div>
                            <div class="option-info">
                                <h4 class="option-name">{{ style.name }}</h4>
                                <p class="option-price" v-if="style.locked">
                                    {{ style.price }} ⭐
                                </p>
                                <p v-else class="option-status">Unlocked</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Accessories -->
                <div class="customize-section">
                    <h3 class="section-title">Accessories</h3>
                    <p class="section-description">Add some personality</p>

                    <div class="options-grid">
                        <div
                            v-for="item in accessories"
                            :key="item.id"
                            class="option-card"
                            :class="{
                                active: accessory === item.name,
                                locked: item.locked,
                                selected: accessory === item.name,
                            }"
                            @click="selectAccessory(item)"
                        >
                            <div class="option-preview">
                                <span class="option-emoji">{{
                                    item.emoji
                                }}</span>
                                <div v-if="item.locked" class="lock-overlay">
                                    <span class="lock-icon">🔒</span>
                                </div>
                            </div>
                            <div class="option-info">
                                <h4 class="option-name">{{ item.name }}</h4>
                                <p class="option-price" v-if="item.locked">
                                    {{ item.price }} ⭐
                                </p>
                                <p v-else class="option-status">
                                    {{
                                        accessory === item.name
                                            ? "Equipped"
                                            : "Available"
                                    }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Mood Selection -->
                <div class="customize-section">
                    <h3 class="section-title">Mood</h3>
                    <p class="section-description">How's your cat feeling?</p>

                    <div class="mood-selector">
                        <button
                            v-for="moodOption in moods"
                            :key="moodOption.id"
                            class="mood-btn"
                            :class="{ active: mood === moodOption.name }"
                            @click="mood = moodOption.name"
                        >
                            <span class="mood-emoji">{{
                                moodOption.emoji
                            }}</span>
                            <span class="mood-label">{{
                                moodOption.name
                            }}</span>
                        </button>
                    </div>
                </div>

                <!-- Quick Presets -->
                <div class="customize-section">
                    <h3 class="section-title">Quick Presets</h3>
                    <p class="section-description">One-click styles</p>

                    <div class="presets-grid">
                        <button
                            v-for="preset in presets"
                            :key="preset.id"
                            class="preset-btn"
                            @click="applyPreset(preset)"
                        >
                            <span class="preset-emoji">{{ preset.emoji }}</span>
                            <span class="preset-name">{{ preset.name }}</span>
                            <span class="preset-desc">{{
                                preset.description
                            }}</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Action Panel -->
            <div class="action-panel">
                <div class="action-buttons">
                    <button class="btn-primary" @click="applyCustomization">
                        <span class="btn-icon">💾</span>
                        Save Changes
                    </button>
                    <button class="btn-secondary" @click="randomize">
                        <span class="btn-icon">🎲</span>
                        Randomize
                    </button>
                    <button class="btn-tertiary" @click="reset">
                        <span class="btn-icon">↺</span>
                        Reset
                    </button>
                </div>

                <div class="achievement-notice" v-if="showAchievement">
                    <div class="achievement-badge">
                        <span class="achievement-icon">🏆</span>
                        <div class="achievement-text">
                            <strong>New Style Unlocked!</strong>
                            <p>Keep studying to unlock more</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "CustomizeCat",
    data() {
        return {
            skin: "Classic",
            accessory: "None",
            mood: "Focused",
            points: 120,
            showAchievement: false,
            skins: [
                {
                    id: 1,
                    name: "Classic",
                    emoji: "🐱",
                    locked: false,
                    price: 0,
                },
                { id: 2, name: "Pixel", emoji: "🐾", locked: false, price: 50 },
                { id: 3, name: "Anime", emoji: "😺", locked: true, price: 100 },
                { id: 4, name: "Cyber", emoji: "🤖", locked: true, price: 150 },
                { id: 5, name: "Royal", emoji: "👑", locked: true, price: 200 },
                {
                    id: 6,
                    name: "Wizard",
                    emoji: "🧙",
                    locked: true,
                    price: 250,
                },
            ],
            accessories: [
                { id: 1, name: "None", emoji: "", locked: false, price: 0 },
                {
                    id: 2,
                    name: "Glasses",
                    emoji: "👓",
                    locked: false,
                    price: 30,
                },
                { id: 3, name: "Hat", emoji: "🎩", locked: false, price: 40 },
                { id: 4, name: "Bowtie", emoji: "🎀", locked: true, price: 60 },
                {
                    id: 5,
                    name: "Headphones",
                    emoji: "🎧",
                    locked: true,
                    price: 80,
                },
                { id: 6, name: "Book", emoji: "📚", locked: true, price: 100 },
            ],
            moods: [
                { id: 1, name: "Happy", emoji: "😸" },
                { id: 2, name: "Focused", emoji: "😼" },
                { id: 3, name: "Sleepy", emoji: "😴" },
                { id: 4, name: "Playful", emoji: "😹" },
                { id: 5, name: "Curious", emoji: "🙀" },
                { id: 6, name: "Proud", emoji: "😼" },
            ],
            presets: [
                {
                    id: 1,
                    name: "Study Buddy",
                    emoji: "📚",
                    description: "Ready to learn",
                    skin: "Classic",
                    accessory: "Glasses",
                    mood: "Focused",
                },
                {
                    id: 2,
                    name: "Happy Camper",
                    emoji: "😸",
                    description: "Always cheerful",
                    skin: "Pixel",
                    accessory: "None",
                    mood: "Happy",
                },
                {
                    id: 3,
                    name: "Nap Time",
                    emoji: "😴",
                    description: "Time to rest",
                    skin: "Anime",
                    accessory: "None",
                    mood: "Sleepy",
                },
                {
                    id: 4,
                    name: "Scholar",
                    emoji: "👓",
                    description: "Academic style",
                    skin: "Classic",
                    accessory: "Glasses",
                    mood: "Focused",
                },
            ],
        };
    },
    computed: {
        currentStyle() {
            return {
                [this.skin.toLowerCase()]: true,
                [`accessory-${this.accessory.toLowerCase()}`]:
                    this.accessory !== "None",
            };
        },
        getAccessoryEmoji() {
            const item = this.accessories.find(
                (a) => a.name === this.accessory,
            );
            return item ? item.emoji : "";
        },
        getMoodEmoji() {
            const moodOption = this.moods.find((m) => m.name === this.mood);
            return moodOption ? moodOption.emoji : "😸";
        },
        getCatDescription() {
            const descriptions = {
                Classic: "Your reliable study companion",
                Pixel: "Retro-style digital friend",
                Anime: "Kawaii anime-inspired buddy",
                Cyber: "Futuristic tech-savvy cat",
                Royal: "Noble and majestic partner",
                Wizard: "Magical learning assistant",
            };
            return descriptions[this.skin] || "Your study companion";
        },
    },
    methods: {
        selectSkin(style) {
            if (style.locked) {
                if (this.points >= style.price) {
                    // Unlock the style
                    style.locked = false;
                    this.points -= style.price;
                    this.showAchievement = true;
                    setTimeout(() => (this.showAchievement = false), 3000);
                } else {
                    // Show not enough points message
                    return;
                }
            }
            this.skin = style.name;
        },
        selectAccessory(item) {
            if (item.locked) {
                if (this.points >= item.price) {
                    // Unlock the accessory
                    item.locked = false;
                    this.points -= item.price;
                    this.showAchievement = true;
                    setTimeout(() => (this.showAchievement = false), 3000);
                } else {
                    // Show not enough points message
                    return;
                }
            }
            this.accessory = item.name;
        },
        applyPreset(preset) {
            this.skin = preset.skin;
            this.accessory = preset.accessory;
            this.mood = preset.mood;
        },
        applyCustomization() {
            this.$emit("customize-applied", {
                skin: this.skin,
                accessory: this.accessory,
                mood: this.mood,
            });
            // Show success message
        },
        randomize() {
            const availableSkins = this.skins.filter((s) => !s.locked);
            const availableAccessories = this.accessories.filter(
                (a) => !a.locked,
            );
            const availableMoods = this.moods;

            this.skin =
                availableSkins[
                    Math.floor(Math.random() * availableSkins.length)
                ].name;
            this.accessory =
                availableAccessories[
                    Math.floor(Math.random() * availableAccessories.length)
                ].name;
            this.mood =
                availableMoods[
                    Math.floor(Math.random() * availableMoods.length)
                ].name;
        },
        reset() {
            this.skin = "Classic";
            this.accessory = "None";
            this.mood = "Focused";
        },
    },
};
</script>

<style scoped>
.customize-page {
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

.customize-container {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-2xl);
}

/* Profile Card */
.profile-card {
    background: var(--ios-background-primary);
    border-radius: var(--radius-xl);
    padding: var(--spacing-2xl);
    box-shadow: var(--shadow-md);
}

.profile-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--spacing-2xl);
}

.cat-info h2 {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--ios-label-primary);
    margin: 0 0 var(--spacing-xs) 0;
}

.cat-level {
    font-size: var(--font-size-base);
    color: var(--ios-label-secondary);
    margin: 0;
}

.points-display {
    text-align: center;
}

.points-badge {
    background: linear-gradient(
        135deg,
        var(--ios-system-orange),
        var(--ios-system-yellow)
    );
    border-radius: var(--radius-lg);
    padding: var(--spacing-md) var(--spacing-lg);
    color: white;
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-xs);
}

.points-icon {
    font-size: 20px;
}

.points-value {
    font-size: var(--font-size-xl);
    font-weight: 700;
}

.points-label {
    font-size: var(--font-size-xs);
    color: var(--ios-label-tertiary);
    margin: 0;
    font-weight: 600;
}

/* Cat Preview */
.cat-preview-section {
    background: linear-gradient(
        135deg,
        var(--ios-background-secondary),
        #f8faff
    );
    border-radius: var(--radius-lg);
    padding: var(--spacing-2xl);
}

.preview-container {
    display: flex;
    align-items: center;
    gap: var(--spacing-2xl);
}

.cat-display {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-md);
}

.cat-avatar {
    width: 120px;
    height: 120px;
    background: linear-gradient(
        135deg,
        var(--ios-system-blue),
        var(--ios-system-teal)
    );
    border-radius: var(--radius-xl);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    box-shadow: var(--shadow-lg);
}

.cat-emoji {
    font-size: 60px;
}

.cat-accessory {
    position: absolute;
    top: 10px;
    right: 10px;
}

.accessory-emoji {
    font-size: 24px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: var(--radius-md);
    padding: var(--spacing-xs);
    backdrop-filter: blur(10px);
}

.mood-indicator {
    background: var(--ios-background-primary);
    border-radius: var(--radius-full);
    padding: var(--spacing-sm) var(--spacing-lg);
    box-shadow: var(--shadow-sm);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.mood-emoji {
    font-size: 20px;
}

.preview-info {
    flex: 1;
}

.preview-title {
    font-size: var(--font-size-xl);
    font-weight: 700;
    color: var(--ios-label-primary);
    margin: 0 0 var(--spacing-sm) 0;
}

.preview-description {
    font-size: var(--font-size-base);
    color: var(--ios-label-secondary);
    margin: 0 0 var(--spacing-lg) 0;
    line-height: 1.5;
}

.style-tags {
    display: flex;
    gap: var(--spacing-sm);
    flex-wrap: wrap;
}

.style-tag {
    background: var(--ios-system-blue);
    color: white;
    padding: var(--spacing-xs) var(--spacing-md);
    border-radius: var(--radius-full);
    font-size: var(--font-size-xs);
    font-weight: 600;
}

/* Customize Panel */
.customize-panel {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-2xl);
}

.customize-section {
    background: var(--ios-background-primary);
    border-radius: var(--radius-xl);
    padding: var(--spacing-xl);
    box-shadow: var(--shadow-md);
}

.section-title {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--ios-label-primary);
    margin: 0 0 var(--spacing-xs) 0;
}

.section-description {
    font-size: var(--font-size-sm);
    color: var(--ios-label-secondary);
    margin: 0 0 var(--spacing-lg) 0;
}

/* Options Grid */
.options-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
}

.option-card {
    background: var(--ios-background-secondary);
    border: 2px solid transparent;
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    cursor: pointer;
    transition: all var(--transition-fast);
    position: relative;
    overflow: hidden;
}

.option-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.option-card.active {
    border-color: var(--ios-system-blue);
    background: rgba(0, 122, 255, 0.05);
}

.option-card.locked {
    opacity: 0.6;
    cursor: not-allowed;
}

.option-preview {
    width: 60px;
    height: 60px;
    background: var(--ios-background-primary);
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto var(--spacing-md) auto;
    position: relative;
}

.option-emoji {
    font-size: 32px;
}

.lock-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-md);
}

.lock-icon {
    font-size: 20px;
    color: white;
}

.option-info {
    text-align: center;
}

.option-name {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--ios-label-primary);
    margin: 0 0 var(--spacing-xs) 0;
}

.option-price {
    font-size: var(--font-size-xs);
    color: var(--ios-system-orange);
    font-weight: 600;
    margin: 0;
}

.option-status {
    font-size: var(--font-size-xs);
    color: var(--ios-label-tertiary);
    margin: 0;
}

/* Mood Selector */
.mood-selector {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-md);
}

.mood-btn {
    background: var(--ios-background-secondary);
    border: 2px solid transparent;
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    cursor: pointer;
    transition: all var(--transition-fast);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
}

.mood-btn:hover {
    background: var(--ios-system-gray6);
}

.mood-btn.active {
    border-color: var(--ios-system-blue);
    background: rgba(0, 122, 255, 0.05);
}

.mood-emoji {
    font-size: 24px;
}

.mood-label {
    font-size: var(--font-size-sm);
    font-weight: 600;
    color: var(--ios-label-primary);
}

/* Presets Grid */
.presets-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-md);
}

.preset-btn {
    background: var(--ios-background-secondary);
    border: 2px solid transparent;
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    cursor: pointer;
    transition: all var(--transition-fast);
    text-align: center;
}

.preset-btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
    border-color: var(--ios-system-blue);
}

.preset-emoji {
    font-size: 32px;
    display: block;
    margin-bottom: var(--spacing-sm);
}

.preset-name {
    display: block;
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--ios-label-primary);
    margin-bottom: var(--spacing-xs);
}

.preset-desc {
    display: block;
    font-size: var(--font-size-xs);
    color: var(--ios-label-secondary);
    margin: 0;
}

/* Action Panel */
.action-panel {
    background: var(--ios-background-primary);
    border-radius: var(--radius-xl);
    padding: var(--spacing-xl);
    box-shadow: var(--shadow-md);
}

.action-buttons {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-lg);
}

.btn-primary,
.btn-secondary,
.btn-tertiary {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-lg);
    border: none;
    border-radius: var(--radius-lg);
    font-size: var(--font-size-base);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
}

.btn-primary {
    background: var(--ios-system-blue);
    color: white;
}

.btn-primary:hover {
    background: #0056cc;
    transform: translateY(-2px);
}

.btn-secondary {
    background: var(--ios-background-secondary);
    color: var(--ios-label-primary);
    border: 1px solid var(--ios-system-gray5);
}

.btn-secondary:hover {
    background: var(--ios-system-gray6);
    transform: translateY(-2px);
}

.btn-tertiary {
    background: transparent;
    color: var(--ios-label-secondary);
    border: 1px solid var(--ios-system-gray5);
}

.btn-tertiary:hover {
    background: var(--ios-background-secondary);
    color: var(--ios-label-primary);
}

/* Achievement Notice */
.achievement-notice {
    background: linear-gradient(135deg, var(--ios-system-green), #4cd964);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
    color: white;
    animation: slideIn 0.5s ease-out;
}

.achievement-badge {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.achievement-icon {
    font-size: 32px;
}

.achievement-text {
    flex: 1;
}

.achievement-text strong {
    display: block;
    margin-bottom: var(--spacing-xs);
    font-size: var(--font-size-base);
}

.achievement-text p {
    margin: 0;
    font-size: var(--font-size-sm);
    opacity: 0.9;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsive */
@media (max-width: 768px) {
    .customize-panel {
        grid-template-columns: 1fr;
    }

    .preview-container {
        flex-direction: column;
        text-align: center;
    }

    .options-grid {
        grid-template-columns: 1fr;
    }

    .mood-selector {
        grid-template-columns: repeat(2, 1fr);
    }

    .presets-grid {
        grid-template-columns: 1fr;
    }

    .action-buttons {
        grid-template-columns: 1fr;
    }

    .profile-header {
        flex-direction: column;
        gap: var(--spacing-lg);
        text-align: center;
    }
}
</style>
