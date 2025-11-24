package main

import (
	"log"
	"os"
	"os/exec"
	"path/filepath"

	"github.com/getlantern/systray"
	"golang.org/x/sys/windows/registry"
)

func onReady() {
	systray.SetIcon(getIcon("Bangocat.ico"))
	systray.SetTitle("Bangocat")
	systray.SetTooltip("Pomodoro Cat App")

	mOpen := systray.AddMenuItem("Open Bangocat", "Launch the app")
	mQuit := systray.AddMenuItem("Quit", "Exit")

	go func() {
		for {
			select {
			case <-mOpen.ClickedCh:
				// Mở app chính (nếu tray.exe và Bangocat.exe cùng thư mục)
				exePath, _ := os.Executable()
				dir := filepath.Dir(exePath)
				appPath := filepath.Join(dir, "Bangocat.exe")
				err := exec.Command(appPath).Start()
				if err != nil {
					log.Println("Không thể mở Bangocat.exe:", err)
				}
			case <-mQuit.ClickedCh:
				systray.Quit()
				os.Exit(0)
			}
		}
	}()
}

func onExit() {}

func getIcon(path string) []byte {
	icon, err := os.ReadFile(path)
	if err != nil {
		log.Fatal(err)
	}
	return icon
}

// Ghi vào registry để khởi động cùng Windows
func addToStartup(appName string) error {
	exePath, err := os.Executable()
	if err != nil {
		return err
	}
	exePath, err = filepath.Abs(exePath)
	if err != nil {
		return err
	}

	key, _, err := registry.CreateKey(registry.CURRENT_USER,
		`Software\Microsoft\Windows\CurrentVersion\Run`,
		registry.SET_VALUE)
	if err != nil {
		return err
	}
	defer key.Close()

	return key.SetStringValue(appName, exePath)
}

func main() {
	err := addToStartup("BangocatTray")
	if err != nil {
		log.Println("Không thể thêm vào Startup:", err)
	} else {
		log.Println("Đã thêm Bangocat vào Startup thành công!")
	}

	systray.Run(onReady, onExit)
}
