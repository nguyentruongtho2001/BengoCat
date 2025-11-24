<template>
    <div class="notes-page">
        <div class="page-header">
            <h1 class="page-title">Quick Notes</h1>
            <p class="page-subtitle">Capture your thoughts instantly</p>
        </div>

        <div class="notes-container">
            <!-- New Note Card -->
            <div class="new-note-card">
                <div class="card-header">
                    <h2 class="card-title">New Note</h2>
                    <button
                        class="save-btn"
                        @click="saveNote"
                        :disabled="!canSave"
                    >
                        <span class="btn-icon">💾</span>
                        Save
                    </button>
                </div>

                <div class="note-form">
                    <input
                        v-model="newNote.title"
                        type="text"
                        placeholder="Note title..."
                        class="title-input"
                    />
                    <textarea
                        v-model="newNote.content"
                        placeholder="Start typing your note here..."
                        class="content-textarea"
                        rows="5"
                    ></textarea>

                    <div class="note-actions">
                        <div class="tags-section">
                            <div class="tags-input">
                                <span
                                    v-for="tag in newNote.tags"
                                    :key="tag"
                                    class="tag"
                                >
                                    {{ tag }}
                                    <button
                                        @click="removeTag(tag)"
                                        class="remove-tag"
                                    >
                                        ×
                                    </button>
                                </span>
                                <input
                                    v-model="tagInput"
                                    @keyup.enter="addTag"
                                    placeholder="Add tags..."
                                    class="tag-input"
                                />
                            </div>
                        </div>

                        <div class="action-buttons">
                            <button class="action-btn" @click="clearNote">
                                <span class="icon">🗑️</span>
                                Clear
                            </button>
                            <button class="action-btn" @click="togglePin">
                                <span class="icon">{{
                                    newNote.pinned ? "📌" : "📍"
                                }}</span>
                                {{ newNote.pinned ? "Pinned" : "Pin" }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Notes List -->
            <div class="notes-list-section">
                <div class="section-header">
                    <h2 class="section-title">Your Notes</h2>
                    <div class="view-controls">
                        <button
                            class="view-btn"
                            :class="{ active: viewMode === 'grid' }"
                            @click="viewMode = 'grid'"
                        >
                            <span class="icon">⊞</span>
                        </button>
                        <button
                            class="view-btn"
                            :class="{ active: viewMode === 'list' }"
                            @click="viewMode = 'list'"
                        >
                            <span class="icon">☰</span>
                        </button>
                    </div>
                </div>

                <!-- Search & Filter -->
                <div class="search-section">
                    <div class="search-box">
                        <span class="search-icon">🔍</span>
                        <input
                            v-model="searchQuery"
                            type="text"
                            placeholder="Search notes..."
                            class="search-input"
                        />
                    </div>
                    <div class="filter-tags">
                        <button
                            v-for="tag in availableTags"
                            :key="tag"
                            class="filter-tag"
                            :class="{ active: selectedTags.includes(tag) }"
                            @click="toggleTagFilter(tag)"
                        >
                            {{ tag }}
                        </button>
                    </div>
                </div>

                <!-- Notes Grid/List -->
                <div class="notes-display" :class="`view-${viewMode}`">
                    <div
                        v-for="note in filteredNotes"
                        :key="note.id"
                        class="note-card"
                        :class="{ pinned: note.pinned }"
                    >
                        <div class="note-header">
                            <h3 class="note-title">
                                {{ note.title || "Untitled" }}
                            </h3>
                            <div class="note-actions">
                                <button
                                    class="icon-btn"
                                    @click="editNote(note)"
                                    title="Edit"
                                >
                                    <span class="icon">✏️</span>
                                </button>
                                <button
                                    class="icon-btn"
                                    @click="toggleNotePin(note.id)"
                                    title="Pin"
                                >
                                    <span class="icon">{{
                                        note.pinned ? "📌" : "📍"
                                    }}</span>
                                </button>
                                <button
                                    class="icon-btn danger"
                                    @click="deleteNote(note.id)"
                                    title="Delete"
                                >
                                    <span class="icon">🗑️</span>
                                </button>
                            </div>
                        </div>

                        <p class="note-content">{{ note.content }}</p>

                        <div v-if="note.tags.length > 0" class="note-tags">
                            <span
                                v-for="tag in note.tags"
                                :key="tag"
                                class="note-tag"
                            >
                                {{ tag }}
                            </span>
                        </div>

                        <div class="note-footer">
                            <span class="note-date">{{
                                formatDate(note.createdAt)
                            }}</span>
                            <button
                                class="copy-btn"
                                @click="copyNote(note)"
                                title="Copy"
                            >
                                <span class="icon">📋</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Empty State -->
                <div v-if="filteredNotes.length === 0" class="empty-state">
                    <div class="empty-icon">📝</div>
                    <h3>No notes yet</h3>
                    <p>Create your first note to get started!</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "QuickNotes",
    data() {
        return {
            newNote: {
                title: "",
                content: "",
                tags: [],
                pinned: false,
            },
            notes: [
                {
                    id: 1,
                    title: "Study Plan for Math",
                    content:
                        "Complete chapter 5 exercises. Review theorems from chapter 4.",
                    tags: ["study", "math", "important"],
                    pinned: true,
                    createdAt: new Date("2024-01-15"),
                },
                {
                    id: 2,
                    title: "Book Recommendations",
                    content:
                        "Atomic Habits, Deep Work, The Pragmatic Programmer",
                    tags: ["books", "learning"],
                    pinned: false,
                    createdAt: new Date("2024-01-14"),
                },
            ],
            tagInput: "",
            searchQuery: "",
            selectedTags: [],
            viewMode: "grid",
            availableTags: [
                "study",
                "work",
                "personal",
                "ideas",
                "important",
                "books",
            ],
        };
    },
    computed: {
        canSave() {
            return this.newNote.title.trim() || this.newNote.content.trim();
        },
        filteredNotes() {
            let filtered = this.notes;

            // Filter by search query
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                filtered = filtered.filter(
                    (note) =>
                        note.title.toLowerCase().includes(query) ||
                        note.content.toLowerCase().includes(query) ||
                        note.tags.some((tag) =>
                            tag.toLowerCase().includes(query),
                        ),
                );
            }

            // Filter by tags
            if (this.selectedTags.length > 0) {
                filtered = filtered.filter((note) =>
                    this.selectedTags.every((tag) => note.tags.includes(tag)),
                );
            }

            // Sort: pinned first, then by date
            return filtered.sort((a, b) => {
                if (a.pinned === b.pinned) {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                }
                return a.pinned ? -1 : 1;
            });
        },
    },
    methods: {
        saveNote() {
            if (!this.canSave) return;

            const note = {
                id: this.notes.length + 1,
                title: this.newNote.title,
                content: this.newNote.content,
                tags: [...this.newNote.tags],
                pinned: this.newNote.pinned,
                createdAt: new Date(),
            };

            this.notes.unshift(note);
            this.clearNote();
        },
        clearNote() {
            this.newNote = {
                title: "",
                content: "",
                tags: [],
                pinned: false,
            };
        },
        addTag() {
            if (
                this.tagInput.trim() &&
                !this.newNote.tags.includes(this.tagInput.trim())
            ) {
                this.newNote.tags.push(this.tagInput.trim());
                this.tagInput = "";
            }
        },
        removeTag(tag) {
            this.newNote.tags = this.newNote.tags.filter((t) => t !== tag);
        },
        editNote(note) {
            this.newNote = { ...note };
            // Remove from notes list if editing existing
            this.notes = this.notes.filter((n) => n.id !== note.id);
        },
        deleteNote(id) {
            this.notes = this.notes.filter((note) => note.id !== id);
        },
        toggleNotePin(id) {
            const note = this.notes.find((n) => n.id === id);
            if (note) {
                note.pinned = !note.pinned;
            }
        },
        togglePin() {
            this.newNote.pinned = !this.newNote.pinned;
        },
        copyNote(note) {
            const text = `${note.title}\n\n${note.content}`;
            navigator.clipboard.writeText(text);
            // Show success message
        },
        toggleTagFilter(tag) {
            const index = this.selectedTags.indexOf(tag);
            if (index > -1) {
                this.selectedTags.splice(index, 1);
            } else {
                this.selectedTags.push(tag);
            }
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
            });
        },
    },
};
</script>

<style scoped>
.notes-page {
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

.notes-container {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: var(--spacing-2xl);
    align-items: start;
}

/* New Note Card */
.new-note-card {
    background: var(--ios-background-primary);
    border-radius: var(--radius-xl);
    padding: var(--spacing-xl);
    box-shadow: var(--shadow-md);
    position: sticky;
    top: var(--spacing-xl);
}

.card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: var(--spacing-lg);
}

.card-title {
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--ios-label-primary);
    margin: 0;
}

.save-btn {
    background: var(--ios-system-blue);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    padding: var(--spacing-sm) var(--spacing-lg);
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
}

.save-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.save-btn:not(:disabled):hover {
    background: #0056cc;
}

.note-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
}

.title-input {
    border: none;
    background: var(--ios-background-secondary);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--ios-label-primary);
    outline: none;
    transition: background var(--transition-fast);
}

.title-input:focus {
    background: var(--ios-system-gray6);
}

.title-input::placeholder {
    color: var(--ios-label-tertiary);
}

.content-textarea {
    border: none;
    background: var(--ios-background-secondary);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    font-size: var(--font-size-base);
    color: var(--ios-label-primary);
    outline: none;
    resize: vertical;
    min-height: 120px;
    transition: background var(--transition-fast);
    font-family: inherit;
}

.content-textarea:focus {
    background: var(--ios-system-gray6);
}

.content-textarea::placeholder {
    color: var(--ios-label-tertiary);
}

.note-actions {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
}

.tags-input {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    align-items: center;
    background: var(--ios-background-secondary);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    min-height: 50px;
}

.tag {
    background: var(--ios-system-blue);
    color: white;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-full);
    font-size: var(--font-size-xs);
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
}

.remove-tag {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0;
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.remove-tag:hover {
    background: rgba(255, 255, 255, 0.2);
}

.tag-input {
    border: none;
    background: none;
    outline: none;
    flex: 1;
    min-width: 80px;
    color: var(--ios-label-primary);
}

.tag-input::placeholder {
    color: var(--ios-label-tertiary);
}

.action-buttons {
    display: flex;
    gap: var(--spacing-md);
}

.action-btn {
    flex: 1;
    background: var(--ios-background-secondary);
    border: 1px solid var(--ios-system-gray5);
    border-radius: var(--radius-md);
    padding: var(--spacing-md);
    color: var(--ios-label-primary);
    cursor: pointer;
    transition: all var(--transition-fast);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-sm);
    font-weight: 500;
}

.action-btn:hover {
    background: var(--ios-system-gray6);
    border-color: var(--ios-system-gray4);
}

/* Notes List Section */
.notes-list-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.section-title {
    font-size: var(--font-size-xl);
    font-weight: 600;
    color: var(--ios-label-primary);
    margin: 0;
}

.view-controls {
    display: flex;
    background: var(--ios-background-secondary);
    border-radius: var(--radius-md);
    padding: var(--spacing-xs);
    gap: var(--spacing-xs);
}

.view-btn {
    background: none;
    border: none;
    padding: var(--spacing-sm);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    color: var(--ios-label-secondary);
}

.view-btn.active {
    background: var(--ios-background-primary);
    color: var(--ios-label-primary);
    box-shadow: var(--shadow-sm);
}

/* Search Section */
.search-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
}

.search-box {
    position: relative;
    background: var(--ios-background-primary);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-sm);
}

.search-icon {
    position: absolute;
    left: var(--spacing-lg);
    top: 50%;
    transform: translateY(-50%);
    color: var(--ios-label-tertiary);
}

.search-input {
    width: 100%;
    border: none;
    background: none;
    padding: var(--spacing-lg) var(--spacing-lg) var(--spacing-lg) 50px;
    font-size: var(--font-size-base);
    color: var(--ios-label-primary);
    outline: none;
}

.search-input::placeholder {
    color: var(--ios-label-tertiary);
}

.filter-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
}

.filter-tag {
    background: var(--ios-background-secondary);
    border: 1px solid var(--ios-system-gray5);
    border-radius: var(--radius-full);
    padding: var(--spacing-xs) var(--spacing-md);
    font-size: var(--font-size-xs);
    color: var(--ios-label-secondary);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.filter-tag.active {
    background: var(--ios-system-blue);
    border-color: var(--ios-system-blue);
    color: white;
}

.filter-tag:hover:not(.active) {
    background: var(--ios-system-gray6);
}

/* Notes Display */
.notes-display {
    display: grid;
    gap: var(--spacing-lg);
}

.notes-display.view-grid {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
}

.notes-display.view-list {
    grid-template-columns: 1fr;
}

.note-card {
    background: var(--ios-background-primary);
    border-radius: var(--radius-lg);
    padding: var(--spacing-xl);
    box-shadow: var(--shadow-sm);
    transition: all var(--transition-fast);
    border: 2px solid transparent;
}

.note-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.note-card.pinned {
    border-color: var(--ios-system-orange);
    background: linear-gradient(135deg, var(--ios-background-primary), #fff9f2);
}

.note-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: var(--spacing-md);
}

.note-title {
    font-size: var(--font-size-base);
    font-weight: 600;
    color: var(--ios-label-primary);
    margin: 0;
    flex: 1;
    margin-right: var(--spacing-md);
}

.note-actions {
    display: flex;
    gap: var(--spacing-xs);
}

.icon-btn {
    background: none;
    border: none;
    padding: var(--spacing-xs);
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: all var(--transition-fast);
    color: var(--ios-label-secondary);
}

.icon-btn:hover {
    background: var(--ios-system-gray6);
    color: var(--ios-label-primary);
}

.icon-btn.danger:hover {
    background: var(--ios-system-red);
    color: white;
}

.note-content {
    color: var(--ios-label-secondary);
    margin: 0 0 var(--spacing-lg) 0;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.note-tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-xs);
    margin-bottom: var(--spacing-lg);
}

.note-tag {
    background: var(--ios-system-gray6);
    color: var(--ios-label-secondary);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-full);
    font-size: var(--font-size-xs);
    font-weight: 500;
}

.note-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.note-date {
    font-size: var(--font-size-xs);
    color: var(--ios-label-tertiary);
}

.copy-btn {
    background: none;
    border: none;
    padding: var(--spacing-xs);
    border-radius: var(--radius-sm);
    cursor: pointer;
    color: var(--ios-label-tertiary);
    transition: all var(--transition-fast);
}

.copy-btn:hover {
    background: var(--ios-system-gray6);
    color: var(--ios-label-primary);
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: var(--spacing-2xl);
    background: var(--ios-background-primary);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-sm);
}

.empty-icon {
    font-size: 64px;
    margin-bottom: var(--spacing-lg);
}

.empty-state h3 {
    margin: 0 0 var(--spacing-sm) 0;
    color: var(--ios-label-primary);
    font-size: var(--font-size-lg);
}

.empty-state p {
    margin: 0;
    color: var(--ios-label-secondary);
}

/* Responsive */
@media (max-width: 768px) {
    .notes-container {
        grid-template-columns: 1fr;
    }

    .new-note-card {
        position: static;
    }

    .notes-display.view-grid {
        grid-template-columns: 1fr;
    }

    .action-buttons {
        flex-direction: column;
    }
}
</style>
