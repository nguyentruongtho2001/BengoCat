<template>
    <div class="app-shell" :class="{ 'sidebar-collapsed': isSidebarCollapsed }">
        <Sidebar :collapsed="isSidebarCollapsed" @toggle="toggleSidebar" />

        <main class="content">
            <header class="topbar">
                <button class="sidebar-toggle" @click="toggleSidebar">
                    <span class="toggle-icon">{{
                        isSidebarCollapsed ? "➡️" : "⬅️"
                    }}</span>
                </button>

                <div class="topbar-center">
                    <h1 class="app-title">Bangocat</h1>
                    <div class="app-subtitle">Focus with your study buddy</div>
                </div>

                <div class="topbar-actions">
                    <button
                        class="icon-button"
                        @click="toggleTheme"
                        title="Toggle theme"
                    >
                        <span class="icon">{{
                            isDarkTheme ? "☀️" : "🌙"
                        }}</span>
                    </button>

                    <button
                        class="icon-button"
                        @click="showNotifications"
                        title="Notifications"
                    >
                        <span class="icon">🔔</span>
                        <span class="badge" v-if="unreadNotifications">3</span>
                    </button>

                    <div class="user-avatar">
                        <span class="avatar">🐱</span>
                    </div>
                </div>
            </header>

            <div class="page-content">
                <router-view />
            </div>
        </main>
    </div>
</template>

<script>
import Sidebar from "./Sidebar.vue";

export default {
    name: "AppShell",
    components: { Sidebar },
    data() {
        return {
            isSidebarCollapsed: false,
            isDarkTheme: false,
            unreadNotifications: 3,
        };
    },
    methods: {
        toggleSidebar() {
            this.isSidebarCollapsed = !this.isSidebarCollapsed;
        },
        toggleTheme() {
            this.isDarkTheme = !this.isDarkTheme;
            document.documentElement.setAttribute(
                "data-theme",
                this.isDarkTheme ? "dark" : "light",
            );
        },
        showNotifications() {
            this.unreadNotifications = 0;
            // Show notifications panel
        },
    },
    mounted() {
        // Detect system theme
        const prefersDark = window.matchMedia(
            "(prefers-color-scheme: dark)",
        ).matches;
        this.isDarkTheme = prefersDark;
        document.documentElement.setAttribute(
            "data-theme",
            prefersDark ? "dark" : "light",
        );
    },
};
</script>

<style scoped>
.app-shell {
    display: flex;
    width: 100%;
    height: 100vh;
    background: var(--ios-background-secondary);
    font-family: var(--font-family);
}

.content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

/* Topbar */
.topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-md) var(--spacing-xl);
    background: var(--ios-background-primary);
    border-bottom: 1px solid var(--ios-system-gray6);
    backdrop-filter: blur(20px);
    position: sticky;
    top: 0;
    z-index: 100;
}

.sidebar-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.sidebar-toggle:hover {
    background: var(--ios-system-gray6);
}

.toggle-icon {
    font-size: 18px;
    transition: transform var(--transition-base);
}

.topbar-center {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xs);
}

.app-title {
    font-size: var(--font-size-xl);
    font-weight: 700;
    color: var(--ios-label-primary);
    margin: 0;
    letter-spacing: -0.5px;
}

.app-subtitle {
    font-size: var(--font-size-xs);
    color: var(--ios-label-tertiary);
    font-weight: 500;
}

.topbar-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.icon-button {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: transparent;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.icon-button:hover {
    background: var(--ios-system-gray6);
}

.icon-button .icon {
    font-size: 20px;
}

.badge {
    position: absolute;
    top: 6px;
    right: 6px;
    background: var(--ios-system-red);
    color: white;
    border-radius: var(--radius-full);
    width: 18px;
    height: 18px;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
}

.user-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: linear-gradient(
        135deg,
        var(--ios-system-blue),
        var(--ios-system-teal)
    );
    border-radius: var(--radius-md);
}

.avatar {
    font-size: 20px;
}

/* Page Content */
.page-content {
    flex: 1;
    overflow-y: auto;
    padding: var(--spacing-xl);
    background: var(--ios-background-secondary);
}

/* Responsive */
@media (max-width: 768px) {
    .app-shell {
        flex-direction: column;
    }

    .topbar {
        padding: var(--spacing-md);
    }

    .page-content {
        padding: var(--spacing-md);
    }

    .app-subtitle {
        display: none;
    }
}
</style>
