package main

import (
	"context"
	"convert/internal/api"
	"convert/internal/config"
	"convert/internal/models"
	"convert/pkg/watcher"
	"encoding/base64"
	"fmt"
	"mime"
	"os"
	"path/filepath"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx       context.Context
	magickAPI *api.ExposeAPI
}

type FileData struct {
	FilePath string `json:"filePath"`
	DataURL  string `json:"dataURL"`
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{
		magickAPI: api.NewExposeAPI(),
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
	fileEvents := make(chan string)
	watcher.StartWatcher(a.ctx, fileEvents)

	go func() {
		for fileName := range fileEvents {
			runtime.EventsEmit(a.ctx, "file-created", fileName)
		}
	}()
}

func (a *App) OpenFileDialog() (*FileData, error) {
	file, err := runtime.OpenFileDialog(a.ctx, runtime.OpenDialogOptions{
		DefaultDirectory: "C:\\",
		Title:            "Select Image",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "Image Files",
				Pattern:     "*.png;*.jpg;*.jpeg;*.webp",
			},
		},
	})
	if err != nil {
		return nil, fmt.Errorf("failed opening dialog - %s", err.Error())
	}
	data, err := os.ReadFile(file)
	if err != nil {
		return nil, fmt.Errorf("failed to read file - %s", err.Error())
	}
	encoded := base64.StdEncoding.EncodeToString(data)
	ext := filepath.Ext(file)
	mimeType := mime.TypeByExtension(ext)
	if mimeType == "" {
		mimeType = "application/octet-stream"
	}

	dataURL := fmt.Sprintf("data:%s;base64,%s", mimeType, encoded)

	return &FileData{
		FilePath: file,
		DataURL:  dataURL,
	}, nil
}

func (a *App) OpenDirectoryDialog() (string, error) {

	filePath, errMsg := api.ReadConfigFile()
	if errMsg != "" {
		return "Failed to read the config file", nil
	}

	directoryPath, err := runtime.OpenDirectoryDialog(a.ctx, runtime.OpenDialogOptions{
		DefaultDirectory: filePath.ImageDir,
		Title:            "Select Directory",
	})

	if err != nil {
		return "", err
	}

	return directoryPath, nil
}

func (a *App) ReadConfigFile() (*config.ImageConfig, string) {
	return api.ReadConfigFile()
}

func (a *App) UpdateConfigFile(key, value string) string {
	return api.UpdateConfigFile(key, value)
}

func (a *App) ConvertImageFormat(input_file string, format string) (string, error) {
	args := models.ConvertImageFormatArgs{
		InputFile: input_file,
		Format:    format,
	}
	return a.magickAPI.ConvertImageFormat(args)
}

func (a *App) ReadFiles() (string, error) {
	return a.magickAPI.ReadImages()
}
