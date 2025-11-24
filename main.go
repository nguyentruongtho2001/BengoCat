package main

import (
	"embed"

	"bangocat/backend"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed frontend/dist/*
var assets embed.FS

func main() {
	// Khởi tạo backend
	app := backend.NewApp()

	// Chạy Wails app
	err := wails.Run(&options.App{
		Title:            "Bangocat",
		Width:            800,
		Height:           600,
		Frameless:        false,
		AlwaysOnTop:      false,
		Assets:           assets,
		BackgroundColour: &options.RGBA{R: 0, G: 0, B: 0, A: 0},
		Windows: &windows.Options{
			DisableWindowIcon:    true,
			WebviewIsTransparent: true,
		},
		Bind: []interface{}{app.Pomodoro},
	})
	if err != nil {
		println("Error:", err.Error())
	}
}
