package infrastructure

import (
	"errors"
	"sync"

	"bangocat/backend/domain"
)

// PomodoroRepository là interface định nghĩa các hành động cần có
type PomodoroRepository interface {
	Save(session domain.PomodoroSession) error
	FindByID(id int) (domain.PomodoroSession, error)
	FindActive() (domain.PomodoroSession, error)
	NextID() int
}

// InMemoryPomodoroRepo là implement cụ thể, lưu dữ liệu ngay trong RAM
type InMemoryPomodoroRepo struct {
	mu       sync.RWMutex
	sessions []domain.PomodoroSession
	nextID   int
}

// Hàm khởi tạo repository
func NewInMemoryPomodoroRepo() *InMemoryPomodoroRepo {
	return &InMemoryPomodoroRepo{
		sessions: make([]domain.PomodoroSession, 0),
		nextID:   1,
	}
}

// Lưu hoặc cập nhật một session
func (r *InMemoryPomodoroRepo) Save(session domain.PomodoroSession) error {
	r.mu.Lock()
	defer r.mu.Unlock()

	for i, s := range r.sessions {
		if s.ID == session.ID {
			r.sessions[i] = session
			return nil
		}
	}
	r.sessions = append(r.sessions, session)
	if session.ID >= r.nextID {
		r.nextID = session.ID + 1
	}
	return nil
}

// Tìm session theo ID
func (r *InMemoryPomodoroRepo) FindByID(id int) (domain.PomodoroSession, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, s := range r.sessions {
		if s.ID == id {
			return s, nil
		}
	}
	return domain.PomodoroSession{}, errors.New("session not found")
}

// Tìm session đang chạy hoặc nghỉ
func (r *InMemoryPomodoroRepo) FindActive() (domain.PomodoroSession, error) {
	r.mu.RLock()
	defer r.mu.RUnlock()

	for _, s := range r.sessions {
		if s.Status == "active" || s.Status == "break" {
			return s, nil
		}
	}
	return domain.PomodoroSession{}, errors.New("no active session")
}

// Cấp ID mới cho session tiếp theo
func (r *InMemoryPomodoroRepo) NextID() int {
	r.mu.Lock()
	defer r.mu.Unlock()
	id := r.nextID
	r.nextID++
	return id
}
