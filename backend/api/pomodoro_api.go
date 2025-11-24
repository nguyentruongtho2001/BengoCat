package api

import (
	"bangocat/backend/domain"
	"bangocat/backend/usecase"
)

// PomodoroAPI là lớp để frontend gọi qua Wails
type PomodoroAPI struct {
	usecase *usecase.PomodoroUsecase
}

// Hàm khởi tạo
func NewPomodoroAPI(u *usecase.PomodoroUsecase) *PomodoroAPI {
	return &PomodoroAPI{usecase: u}
}

// Bắt đầu Pomodoro (frontend truyền số phút)
func (api *PomodoroAPI) StartPomodoro(durationMinutes int, breakMinutes int) (domain.PomodoroSession, error) {
	return api.usecase.StartSession(durationMinutes, breakMinutes)
}

// Chuyển sang phiên nghỉ
func (api *PomodoroAPI) SwitchToBreak(id int) (domain.PomodoroSession, error) {
	return api.usecase.SwitchToBreak(id)
}

// Kết thúc phiên
func (api *PomodoroAPI) EndPomodoro(id int) (domain.PomodoroSession, error) {
	return api.usecase.EndSession(id)
}

// Lấy phiên đang hoạt động
func (api *PomodoroAPI) GetActivePomodoro() (domain.PomodoroSession, error) {
	return api.usecase.GetActiveSession()
}
