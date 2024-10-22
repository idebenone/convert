package api

import (
	"convert/internal/models"
	"convert/pkg/imagemagick"
	"log"
)

type ExposeAPI struct {
	manager *imagemagick.MagickManager
}

func NewExposeAPI() *ExposeAPI {
	manager := imagemagick.Init()
	return &ExposeAPI{manager: manager}
}

func (api *ExposeAPI) ConvertImageFormat(args models.ConvertImageFormatArgs) string {
	err := api.manager.ConvertImageFormat(args)
	if err != nil {
		log.Printf("Failed to convert image: %v", err)
		return "Conversion failed: " + err.Error()
	}
	return "Image converted successfully"
}
