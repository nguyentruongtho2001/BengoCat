<template>
    <aside class="sidebar" :class="{ collapsed }">
        <div class="sidebar-header">
            <div class="logo" @click="$router.push('/')">
                <span class="logo-icon">🐱</span>
                <span class="logo-text" v-if="!collapsed">Bangocat</span>
            </div>
            <button
                class="collapse-btn"
                @click="$emit('toggle')"
                v-if="!collapsed"
            >
                <span class="icon">←</span>
            </button>
        </div>

        <nav class="sidebar-nav">
            <!-- Study Tools Section -->
            <div class="nav-section">
                <h3 class="section-title" v-if="!collapsed">Study Tools</h3>
                <NavItem
                    to="/"
                    icon="🏠"
                    label="Dashboard"
                    :collapsed="collapsed"
                    :active="$route.path === '/'"
                />
                <NavItem
                    to="/pomodoro"
                    icon="⏱️"
                    label="Pomodoro"
                    :collapsed="collapsed"
                    :active="$route.path === '/pomodoro'"
                />
                <NavItem
                    to="/study-roadmap"
                    icon="🗺️"
                    label="Study Plan"
                    :collapsed="collapsed"
                    :active="$route.path === '/study-roadmap'"
                />
                <NavItem
                    to="/quick-notes"
                    icon="📝"
                    label="Quick Notes"
                    :collapsed="collapsed"
                    :active="$route.path === '/quick-notes'"
                />
            </div>

            <!-- Learning Resources -->
            <div class="nav-section">
                <h3 class="section-title" v-if="!collapsed">Learning</h3>
                <NavItem
                    to="/dictionary"
                    icon="📚"
                    label="Dictionary"
                    :collapsed="collapsed"
                    :active="$route.path === '/dictionary'"
                />
                <NavItem
                    to="/calendar"
                    icon="📅"
                    label="Calendar"
                    :collapsed="collapsed"
                    :active="$route.path === '/calendar'"
                />
            </div>

            <!-- Wellness -->
            <div class="nav-section">
                <h3 class="section-title" v-if="!collapsed">Wellness</h3>
                <NavItem
                    to="/music"
                    icon="🎵"
                    label="Focus Music"
                    :collapsed="collapsed"
                    :active="$route.path === '/music'"
                />
                <NavItem
                    to="/zen"
                    icon="🧘"
                    label="Zen Mode"
                    :collapsed="collapsed"
                    :active="$route.path === '/zen'"
                />
            </div>

            <!-- Insights -->
            <div class="nav-section">
                <h3 class="section-title" v-if="!collapsed">Insights</h3>
                <NavItem
                    to="/stats"
                    icon="📊"
                    label="Statistics"
                    :collapsed="collapsed"
                    :active="$route.path === '/stats'"
                />
                <NavItem
                    to="/customize-cat"
                    icon="🎨"
                    label="Customize Cat"
                    :collapsed="collapsed"
                    :active="$route.path === '/customize-cat'"
                />
            </div>

            <!-- Settings -->
            <div class="nav-section">
                <NavItem
                    to="/settings"
                    icon="⚙️"
                    label="Settings"
                    :collapsed="collapsed"
                    :active="$route.path === '/settings'"
                />
            </div>
        </nav>

        <!-- Current Cat Preview -->
        <div class="cat-preview" v-if="!collapsed">
            <div class="cat-avatar">🐱</div>
            <div class="cat-info">
                <p class="cat-name">Bangocat</p>
                <p class="cat-level">Level 5 • 120 XP</p>
            </div>
        </div>
    </aside>
</template>

<script>
import NavItem from "./NavItem.vue";

export default {
    name: "Sidebar",
    components: { NavItem },
    props: {
        collapsed: Boolean,
    },
};
</script>

<style scoped>
.sidebar {
    width: 280px;
    min-width: 280px;
    height: 100vh;
    background: var(--ios-background-primary);
    border-right: 1px solid var(--ios-system-gray6);
    display: flex;
    flex-direction: column;
    transition: all var(--transition-base);
    overflow: hidden;
}

.sidebar.collapsed {
    width: 80px;
    min-width: 80px;
}

/* Header */
.sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-lg) var(--spacing-xl);
    border-bottom: 1px solid var(--ios-system-gray6);
}

.logo {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.logo:hover {
    opacity: 0.8;
}

.logo-icon {
    font-size: 28px;
}

.logo-text {
    font-size: var(--font-size-lg);
    font-weight: 700;
    color: var(--ios-label-primary);
    letter-spacing: -0.5px;
}

.collapse-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.collapse-btn:hover {
    background: var(--ios-system-gray6);
}

/* Navigation */
.sidebar-nav {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    padding: var(--spacing-xl);
    overflow-y: auto;
}

.nav-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
}

.section-title {
    margin: 0 0 var(--spacing-md) 0;
    font-size: var(--font-size-xs);
    font-weight: 600;
    color: var(--ios-label-tertiary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* Cat Preview */
.cat-preview {
    padding: var(--spacing-lg);
    background: var(--ios-background-secondary);
    border-top: 1px solid var(--ios-system-gray6);
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
}

.cat-avatar {
    width: 50px;
    height: 50px;
    background: linear-gradient(
        135deg,
        var(--ios-system-orange),
        var(--ios-system-yellow)
    );
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
}

.cat-info {
    flex: 1;
}

.cat-name {
    margin: 0 0 var(--spacing-xs) 0;
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--ios-label-primary);
}

.cat-level {
    margin: 0;
    font-size: var(--font-size-xs);
    color: var(--ios-label-tertiary);
}

/* Responsive */
@media (max-width: 768px) {
    .sidebar {
        width: 100%;
        height: auto;
        border-right: none;
        border-bottom: 1px solid var(--ios-system-gray6);
    }

    .sidebar.collapsed {
        width: 100%;
    }

    .sidebar-nav {
        flex-direction: row;
        overflow-x: auto;
        gap: 0;
    }

    .nav-section {
        flex-direction: row;
        gap: 0;
    }

    .section-title {
        display: none;
    }

    .cat-preview {
        display: none;
    }
}
</style>
