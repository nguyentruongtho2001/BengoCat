package backend

import (
	"bangocat/backend/api"
	"bangocat/backend/infrastructure"
	"bangocat/backend/usecase"
)

// BangocatApp gom các API lại để bind vào Wails
type BangocatApp struct {
	Pomodoro *api.PomodoroAPI
}

// Hàm khởi tạo App
func NewApp() *BangocatApp {
	// Khởi tạo Pomodoro (có repo + usecase)
	repo := infrastructure.NewInMemoryPomodoroRepo()
	use := usecase.NewPomodoroUsecase(repo)
	pomodoroAPI := api.NewPomodoroAPI(use)

	return &BangocatApp{
		Pomodoro: pomodoroAPI,
	}
}
