package api

import (
	"convert/internal/models"
	"convert/pkg/imagemagick"
)

type ExposeAPI struct {
	manager *imagemagick.MagickManager
}

func NewExposeAPI() *ExposeAPI {
	manager := imagemagick.Init()
	return &ExposeAPI{manager: manager}
}

func (api *ExposeAPI) ConvertImageFormat(args models.ConvertImageFormatArgs) (string, error) {
	err := api.manager.ConvertImageFormat(args)
	if err != nil {
		return "Conversion failed", err
	}
	return "Image converted successfully", nil
}

func (api *ExposeAPI) ReadImages() (string, error) {
	images, err := api.manager.ReadImagesAsBase64()
	if err != nil {
		return err.Error(), err
	}

	return images, nil
}
