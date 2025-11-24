<template>
    <router-link :to="to" class="nav-item" :class="{ active, collapsed }">
        <span class="nav-icon">{{ icon }}</span>
        <span class="nav-label" v-if="!collapsed">{{ label }}</span>
        <span class="active-indicator" v-if="active && !collapsed"></span>
    </router-link>
</template>

<script>
export default {
    name: "NavItem",
    props: {
        to: String,
        icon: String,
        label: String,
        active: Boolean,
        collapsed: Boolean,
    },
};
</script>

<style scoped>
.nav-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md) var(--spacing-lg);
    color: var(--ios-label-secondary);
    text-decoration: none;
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
    position: relative;
    cursor: pointer;
}

.nav-item:hover {
    background: var(--ios-system-gray6);
    color: var(--ios-label-primary);
}

.nav-item.active {
    background: var(--ios-system-blue);
    color: white;
}

.nav-item.collapsed {
    justify-content: center;
    padding: var(--spacing-md);
}

.nav-icon {
    font-size: 20px;
    flex-shrink: 0;
}

.nav-label {
    font-size: var(--font-size-base);
    font-weight: 500;
    flex: 1;
}

.active-indicator {
    width: 4px;
    height: 20px;
    background: currentColor;
    border-radius: var(--radius-full);
    position: absolute;
    right: var(--spacing-md);
}

/* Collapsed state */
.nav-item.collapsed .nav-label {
    display: none;
}

.nav-item.collapsed .active-indicator {
    right: 4px;
}

/* Mobile */
@media (max-width: 768px) {
    .nav-item {
        flex-direction: column;
        padding: var(--spacing-sm);
        gap: var(--spacing-xs);
        min-width: 60px;
    }

    .nav-label {
        font-size: var(--font-size-xs);
        text-align: center;
    }

    .active-indicator {
        display: none;
    }
}
</style>
