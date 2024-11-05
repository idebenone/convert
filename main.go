package main

import (
	"embed"
	"fmt"
	"net/http"
	"os"
	"path"
	"strings"

	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
)

//go:embed all:frontend/dist
var assets embed.FS

type FileLoader struct {
	http.Handler
}

func NewFileLoader() *FileLoader {
	return &FileLoader{}
}

func (h *FileLoader) ServeHTTP(res http.ResponseWriter, req *http.Request) {
	baseDir := "D:/convert_temp"
	requestedFilename := strings.TrimPrefix(req.URL.Path, "/files")

	fullPath := path.Join(baseDir, requestedFilename)
	println("Requesting file:", fullPath)

	fileData, err := os.ReadFile(fullPath)
	if err != nil {
		res.WriteHeader(http.StatusNotFound)
		res.Write([]byte(fmt.Sprintf("Could not load file %s", requestedFilename)))
		return
	}

	switch ext := path.Ext(fullPath); ext {
	case ".png":
		res.Header().Set("Content-Type", "image/png")
	case ".jpg", ".jpeg":
		res.Header().Set("Content-Type", "image/jpeg")
	case ".gif":
		res.Header().Set("Content-Type", "image/gif")
	case ".txt":
		res.Header().Set("Content-Type", "text/plain")
	default:
		res.Header().Set("Content-Type", "application/octet-stream")
	}

	res.Write(fileData)
}

func main() {
	// Create an instance of the app structure
	app := NewApp()

	// Create application with options
	err := wails.Run(&options.App{
		Title:  "client",
		Width:  1024,
		Height: 768,
		AssetServer: &assetserver.Options{
			Assets:  assets,
			Handler: NewFileLoader(),
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.startup,
		Bind: []interface{}{
			app,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
