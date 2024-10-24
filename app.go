package main

import (
	"context"
	"convert/internal/api"
	"convert/internal/models"
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
}

func (a *App) OpenFileDialog() (string, error) { //No param
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

func (a *App) ConvertImageFormat(args models.ConvertImageFormatArgs) (string, error) {
	return a.magickAPI.ConvertImageFormat(args)
}
