<template>
  <div class="quicknotes-container">
    <div class="card">
      <!-- Header -->
      <div class="card-header">
        <div>
          <h2>📝 Ghi chú nhanh</h2>
          <p class="card-description">Lưu ý những ý tưởng và thông tin quan trọng</p>
        </div>
        <div class="notes-badge">
          <span class="badge-label">Ghi chú</span>
          <span class="badge-value">{{ notes.length }}</span>
        </div>
      </div>

      <!-- Search & Filter -->
      <div class="search-section">
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input 
            v-model="searchQuery" 
            type="text"
            placeholder="Tìm kiếm ghi chú..."
            class="search-input"
          />
        </div>
        <div class="filter-buttons">
          <button 
            v-for="tag in tags"
            :key="tag"
            class="filter-btn"
            :class="{ active: selectedTag === tag }"
            @click="selectedTag = selectedTag === tag ? '' : tag"
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <!-- New Note Section -->
      <div class="new-note-section">
        <div class="form-group">
          <label class="form-label">Tiêu đề</label>
          <input 
            v-model="title" 
            type="text"
            placeholder="Nhập tiêu đề ghi chú..."
            class="form-input"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Nội dung</label>
          <textarea 
            v-model="content" 
            rows="5"
            placeholder="Nhập nội dung ghi chú..."
            class="form-textarea"
          ></textarea>
        </div>

        <div class="form-group">
          <label class="form-label">Thẻ</label>
          <div class="tag-selector">
            <button 
              v-for="tag in allTags"
              :key="tag"
              class="tag-btn"
              :class="{ active: selectedTags.includes(tag) }"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>

        <div class="form-actions">
          <button @click="saveNote" class="btn-save">
            <span>✓</span>
            Lưu ghi chú
          </button>
          <button @click="clearForm" class="btn-clear">
            <span>✕</span>
            Xóa form
          </button>
        </div>
      </div>

      <!-- Notes List -->
      <div class="notes-section">
        <div class="section-header">
          <p class="section-title">{{ filteredNotes.length }} ghi chú</p>
          <div class="view-toggle">
            <button 
              class="view-btn"
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
              title="Danh sách"
            >
              ☰
            </button>
            <button 
              class="view-btn"
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
              title="Lưới"
            >
              ⊞
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredNotes.length === 0" class="empty-state">
          <p class="empty-icon">📭</p>
          <p class="empty-text">Không có ghi chú nào</p>
          <p class="empty-description">Hãy tạo ghi chú mới để bắt đầu</p>
        </div>

        <!-- Notes Grid/List -->
        <transition-group 
          name="notes"
          tag="div"
          :class="['notes-grid', `view-${viewMode}`]"
        >
          <div 
            v-for="note in filteredNotes"
            :key="note.id"
            class="note-card"
          >
            <div class="note-header">
              <h3 class="note-title">{{ note.title || 'Không tiêu đề' }}</h3>
              <button 
                class="btn-menu"
                @click="toggleNoteMenu(note.id)"
              >
                ⋯
              </button>
            </div>

            <p class="note-content">{{ note.content }}</p>

            <div v-if="note.tags && note.tags.length > 0" class="note-tags">
              <span 
                v-for="tag in note.tags"
                :key="tag"
                class="tag-badge"
              >
                {{ tag }}
              </span>
            </div>

            <div class="note-footer">
              <p class="note-date">{{ formatDate(note.date) }}</p>
              <div class="note-actions">
                <button 
                  class="btn-action"
                  @click="copyNote(note)"
                  title="Sao chép"
                >
                  📋
                </button>
                <button 
                  class="btn-action"
                  @click="editNote(note)"
                  title="Chỉnh sửa"
                >
                  ✏️
                </button>
                <button 
                  class="btn-action btn-danger"
                  @click="deleteNote(note.id)"
                  title="Xóa"
                >
                  🗑️
                </button>
              </div>
            </div>

            <!-- Note Menu -->
            <div v-if="openMenuId === note.id" class="note-menu">
              <button @click="pinNote(note.id)" class="menu-item">
                {{ note.pinned ? '📌 Bỏ ghim' : '📍 Ghim' }}
              </button>
              <button @click="shareNote(note)" class="menu-item">
                🔗 Chia sẻ
              </button>
              <button @click="exportNote(note)" class="menu-item">
                ⬇️ Xuất
              </button>
            </div>
          </div>
        </transition-group>
      </div>

      <!-- Stats -->
      <div class="stats-section">
        <div class="stat-item">
          <span class="stat-icon">📝</span>
          <span class="stat-text">{{ notes.length }} ghi chú tổng cộng</span>
        </div>
        <div class="stat-item">
          <span class="stat-icon">📌</span>
          <span class="stat-text">{{ pinnedCount }} được ghim</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let nextId = 1

export default {
  name: 'QuickNotes',
  data() {
    return {
      title: '',
      content: '',
      selectedTags: [],
      notes: [],
      searchQuery: '',
      selectedTag: '',
      viewMode: 'list',
      openMenuId: null,
      editingId: null,
      allTags: ['Quan trọng', 'Ý tưởng', 'Công việc', 'Học tập', 'Cá nhân'],
      tags: ['Quan trọng', 'Ý tưởng', 'Công việc', 'Học tập', 'Cá nhân']
    }
  },
  computed: {
    filteredNotes() {
      let result = this.notes

      if (this.searchQuery.trim()) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter(n =>
          n.title.toLowerCase().includes(query) ||
          n.content.toLowerCase().includes(query)
        )
      }

      if (this.selectedTag) {
        result = result.filter(n => n.tags && n.tags.includes(this.selectedTag))
      }

      return result.sort((a, b) => {
        if (a.pinned === b.pinned) {
          return new Date(b.date) - new Date(a.date)
        }
        return a.pinned ? -1 : 1
      })
    },
    pinnedCount() {
      return this.notes.filter(n => n.pinned).length
    }
  },
  methods: {
    saveNote() {
      if (!this.title.trim() && !this.content.trim()) return

      if (this.editingId) {
        const note = this.notes.find(n => n.id === this.editingId)
        if (note) {
          note.title = this.title
          note.content = this.content
          note.tags = this.selectedTags
          note.date = new Date()
        }
        this.editingId = null
      } else {
        this.notes.unshift({
          id: nextId++,
          title: this.title,
          content: this.content,
          tags: this.selectedTags,
          date: new Date(),
          pinned: false
        })
      }

      this.clearForm()
    },
    clearForm() {
      this.title = ''
      this.content = ''
      this.selectedTags = []
      this.editingId = null
    },
    deleteNote(id) {
      this.notes = this.notes.filter(n => n.id !== id)
      this.openMenuId = null
    },
    editNote(note) {
      this.title = note.title
      this.content = note.content
      this.selectedTags = [...note.tags]
      this.editingId = note.id
      window.scrollTo(0, 0)
    },
    copyNote(note) {
      const text = `${note.title}\n\n${note.content}`
      navigator.clipboard.writeText(text)
    },
    pinNote(id) {
      const note = this.notes.find(n => n.id === id)
      if (note) {
        note.pinned = !note.pinned
      }
      this.openMenuId = null
    },
    shareNote(note) {
      alert(`Chia sẻ: ${note.title}`)
    },
    exportNote(note) {
      const text = `${note.title}\n\n${note.content}\n\nTạo: ${note.date.toLocaleString()}`
      const blob = new Blob([text], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${note.title || 'note'}.txt`
      a.click()
    },
    toggleTag(tag) {
      const index = this.selectedTags.indexOf(tag)
      if (index > -1) {
        this.selectedTags.splice(index, 1)
      } else {
        this.selectedTags.push(tag)
      }
    },
    toggleNoteMenu(id) {
      this.openMenuId = this.openMenuId === id ? null : id
    },
    formatDate(date) {
      const now = new Date()
      const diff = now - new Date(date)
      const minutes = Math.floor(diff / 60000)
      const hours = Math.floor(diff / 3600000)
      const days = Math.floor(diff / 86400000)

      if (minutes < 1) return 'Vừa xong'
      if (minutes < 60) return `${minutes}m trước`
      if (hours < 24) return `${hours}h trước`
      if (days < 7) return `${days} ngày trước`
      return new Date(date).toLocaleDateString('vi-VN')
    }
  }
}
</script>

<style scoped>
.quicknotes-container {
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

.notes-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md) var(--spacing-lg);
  background: linear-gradient(135deg, #007AFF 0%, #5AC8FA 100%);
  color: #FFFFFF;
  border-radius: var(--radius-md);
}

.badge-label {
  font-size: var(--font-size-xs);
  font-weight: 600;
  opacity: 0.9;
}

.badge-value {
  font-size: 24px;
  font-weight: 700;
}

/* Search Section */
.search-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.search-input-wrapper {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: 0 var(--spacing-lg);
  background-color: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.search-input-wrapper:focus-within {
  border-color: var(--primary-color);
  background-color: var(--card-bg);
}

.search-icon {
  font-size: 16px;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  padding: var(--spacing-md) 0;
  border: none;
  background: transparent;
  font-size: var(--font-size-base);
  outline: none;
}

.search-input::placeholder {
  color: var(--text-tertiary);
}

.filter-buttons {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.filter-btn {
  padding: var(--spacing-xs) var(--spacing-md);
  background-color: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-btn:hover {
  background-color: var(--card-bg);
  border-color: var(--border-light);
}

.filter-btn.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: #FFFFFF;
}

/* New Note Section */
.new-note-section {
  padding: var(--spacing-lg);
  background-color: var(--background-secondary);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-input,
.form-textarea {
  padding: var(--spacing-md) var(--spacing-lg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-family: var(--font-family);
  background-color: var(--card-bg);
  color: var(--text-color);
  transition: all var(--transition-fast);
  outline: none;
}

.form-input:hover,
.form-textarea:hover {
  border-color: var(--border-light);
}

.form-input:focus,
.form-textarea:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.form-textarea {
  resize: vertical;
  font-family: var(--font-family);
}

/* Tag Selector */
.tag-selector {
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.tag-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tag-btn:hover {
  background-color: var(--border-light);
  border-color: var(--border-light);
}

.tag-btn.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: #FFFFFF;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: var(--spacing-md);
}

.btn-save,
.btn-clear {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border: none;
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
  outline: none;
}

.btn-save {
  background-color: var(--primary-color);
  color: #FFFFFF;
}

.btn-save:hover {
  background-color: #0051D5;
}

.btn-clear {
  background-color: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn-clear:hover {
  background-color: var(--card-bg);
  color: var(--text-color);
}

/* Notes Section */
.notes-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.section-title {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.view-toggle {
  display: flex;
  gap: var(--spacing-xs);
  background-color: var(--background-secondary);
  padding: var(--spacing-xs);
  border-radius: var(--radius-md);
}

.view-btn {
  width: 32px;
  height: 32px;
  background-color: transparent;
  border: none;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: 16px;
}

.view-btn:hover {
  background-color: var(--card-bg);
}

.view-btn.active {
  background-color: var(--primary-color);
  color: #FFFFFF;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl) var(--spacing-lg);
  text-align: center;
}

.empty-icon {
  font-size: 40px;
  margin: 0 0 var(--spacing-md) 0;
}

.empty-text {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-color);
}

.empty-description {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

/* Notes Grid */
.notes-grid {
  display: grid;
  gap: var(--spacing-md);
}

.notes-grid.view-list {
  grid-template-columns: 1fr;
}

.notes-grid.view-grid {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

/* Note Card */
.note-card {
  position: relative;
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: var(--spacing-lg);
  transition: all var(--transition-base);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.note-card:hover {
  border-color: var(--primary-color);
  box-shadow: var(--shadow-md);
}

.note-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.note-title {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: 600;
  color: var(--text-color);
  line-height: 1.4;
  word-break: break-word;
}

.btn-menu {
  background: none;
  border: none;
  color: var(--text-tertiary);
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  flex-shrink: 0;
}

.btn-menu:hover {
  color: var(--text-secondary);
}

.note-content {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: 1.6;
  word-break: break-word;
  flex: 1;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.note-tags {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.tag-badge {
  display: inline-block;
  padding: var(--spacing-xs) var(--spacing-sm);
  background-color: rgba(0, 122, 255, 0.1);
  color: var(--primary-color);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
}

.note-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
}

.note-date {
  margin: 0;
  font-size: var(--font-size-xs);
  color: var(--text-tertiary);
}

.note-actions {
  display: flex;
  gap: var(--spacing-xs);
}

.btn-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background-color: transparent;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
  font-size: 14px;
}

.btn-action:hover {
  background-color: var(--background-secondary);
  border-color: var(--border-light);
}

.btn-action.btn-danger:hover {
  background-color: rgba(255, 59, 48, 0.1);
  border-color: var(--danger);
}

/* Note Menu */
.note-menu {
  position: absolute;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  background-color: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 10;
  min-width: 150px;
}

.menu-item {
  display: block;
  width: 100%;
  padding: var(--spacing-md) var(--spacing-lg);
  background: none;
  border: none;
  text-align: left;
  font-size: var(--font-size-sm);
  color: var(--text-color);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.menu-item:hover {
  background-color: var(--background-secondary);
}

/* Stats Section */
.stats-section {
  display: flex;
  gap: var(--spacing-md);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 1;
  padding: var(--spacing-md);
  background-color: var(--background-secondary);
  border-radius: var(--radius-md);
}

.stat-icon {
  font-size: 20px;
}

.stat-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: 500;
}

/* Transitions */
.notes-enter-active,
.notes-leave-active {
  transition: all var(--transition-base);
}

.notes-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.notes-leave-to {
  opacity: 0;
  transform: translateX(30px);
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

  .search-section {
    gap: var(--spacing-sm);
  }

  .filter-buttons {
    gap: var(--spacing-xs);
  }

  .form-actions {
    flex-direction: column;
  }

  .notes-grid.view-grid {
    grid-template-columns: 1fr;
  }

  .note-card {
    padding: var(--spacing-md);
  }

  .stats-section {
    flex-direction: column;
  }
}
</style>