package imagemagick

import (
	"convert/internal/config"
	"convert/internal/models"
	"errors"
	"fmt"
	"path/filepath"
	"strings"

	"gopkg.in/gographics/imagick.v3/imagick"
)

func (m *MagickManager) ConvertImageFormat(args models.ConvertImageFormatArgs) error {
	if args.InputFile == "" {
		return errors.New("input file is required")
	}
	if args.Format == "" {
		return errors.New("output format is required")
	}

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

	baseName := strings.TrimSuffix(filepath.Base(args.InputFile), filepath.Ext(args.InputFile))
	outputPath := filepath.Join(config.ImageDir, baseName+"."+args.Format)

	if err := mw.WriteImage(outputPath); err != nil {
		return fmt.Errorf("failed to write image: %w", err)
	}

	return nil
}
