package main

import (
	"context"
	"convert/internal/api"
	"convert/internal/models"
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

func (a *App) ConvertImageFormat(args models.ConvertImageFormatArgs) string {
	return a.magickAPI.ConvertImageFormat(args)
}
