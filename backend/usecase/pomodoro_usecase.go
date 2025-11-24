package usecase

import (
	"time"

	"bangocat/backend/domain"

	"bangocat/backend/infrastructure"
)

type PomodoroUsecase struct {
	repo infrastructure.PomodoroRepository
}

func NewPomodoroUsecase(repo infrastructure.PomodoroRepository) *PomodoroUsecase {
	return &PomodoroUsecase{repo: repo}
}

// Bắt đầu một phiên Pomodoro mới
func (u *PomodoroUsecase) StartSession(durationMinutes, breakMinutes int) (domain.PomodoroSession, error) {
	// Nếu có phiên đang chạy, kết thúc nó trước
	if active, err := u.repo.FindActive(); err == nil {
		active.Status = "finished"
		_ = u.repo.Save(active)
	}

	session := domain.PomodoroSession{
		ID:        u.repo.NextID(),
		StartTime: time.Now().Format(time.RFC3339), // ✅ lưu dưới dạng string
		Duration:  durationMinutes,
		Break:     breakMinutes,
		Status:    "active",
	}
	if err := u.repo.Save(session); err != nil {
		return domain.PomodoroSession{}, err
	}
	return session, nil
}

// Chuyển sang phiên nghỉ
func (u *PomodoroUsecase) SwitchToBreak(id int) (domain.PomodoroSession, error) {
	session, err := u.repo.FindByID(id)
	if err != nil {
		return domain.PomodoroSession{}, err
	}
	session.Status = "break"
	if err := u.repo.Save(session); err != nil {
		return domain.PomodoroSession{}, err
	}
	return session, nil
}

// Kết thúc phiên Pomodoro
func (u *PomodoroUsecase) EndSession(id int) (domain.PomodoroSession, error) {
	session, err := u.repo.FindByID(id)
	if err != nil {
		return domain.PomodoroSession{}, err
	}
	session.Status = "finished"
	if err := u.repo.Save(session); err != nil {
		return domain.PomodoroSession{}, err
	}
	return session, nil
}

// Lấy phiên đang hoạt động
func (u *PomodoroUsecase) GetActiveSession() (domain.PomodoroSession, error) {
	return u.repo.FindActive()
}
