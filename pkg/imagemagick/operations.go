package imagemagick

import (
	"convert/internal/config"
	"convert/internal/models"
	"fmt"

	"gopkg.in/gographics/imagick.v3/imagick"
)

func (m *MagickManager) ConvertImageFormat(args models.ConvertImageFormatArgs) error {
	mw := imagick.NewMagickWand()
	defer mw.Destroy()

	config, err := config.LoadConfig()
	if err != nil {
		return fmt.Errorf("failed to load config file: %w", err)
	}

	if err := mw.ReadImage(args.InputFile); err != nil {
		return fmt.Errorf("failed to read image: %w", err)
	}

	if err := mw.SetImageFormat(args.Format); err != nil {
		return fmt.Errorf("failed to set image format: %w", err)
	}

	if err := mw.WriteImage(config.ImageDir); err != nil {
		return fmt.Errorf("failed to write image: %w", err)
	}

	fmt.Println("Image converted successfully")
	return nil
}
