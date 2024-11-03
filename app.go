package main

import (
	"context"
	"convert/internal/api"
	"convert/internal/config"
	"convert/internal/models"
	"convert/pkg/watcher"
	"fmt"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx       context.Context
	magickAPI *api.ExposeAPI
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
	watcher.StartWatcher()
}

func (a *App) OpenFileDialog() (string, error) {
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
		return "", fmt.Errorf("failed opening dialog - %s", err.Error())
	}
	return file, nil
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
