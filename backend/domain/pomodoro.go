package domain

// PomodoroSession mô tả một phiên Pomodoro
type PomodoroSession struct {
	ID        int    // Mã phiên
	StartTime string // Thời điểm bắt đầu (ISO8601 string)
	Duration  int    // Thời lượng học (phút)
	Break     int    // Thời lượng nghỉ (phút)
	Status    string // Trạng thái: "active", "break", "finished"
}
