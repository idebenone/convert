package imagemagick

import (
	"convert/internal/config"
	"convert/internal/models"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"gopkg.in/gographics/imagick.v3/imagick"
)

type ImageMetadata struct {
	Filename string `json:"filename"`
	Size     int64  `json:"size"`
	Data     string `json:"data"`
}

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

func encodeImageToBase64(filePath string) (string, error) {
	fileData, err := os.ReadFile(filePath)
	if err != nil {
		return "", err
	}
	return base64.StdEncoding.EncodeToString(fileData), nil
}

func (m *MagickManager) ReadImagesAsBase64() (string, error) {
	cfg, cfg_err := config.LoadConfig()
	if cfg_err != nil {
		return "Failed to read images", cfg_err
	}

	imageMetadataList := []ImageMetadata{}
	validExtensions := map[string]struct{}{
		".jpg":  {},
		".jpeg": {},
		".png":  {},
		".gif":  {},
		".bmp":  {},
		".tiff": {},
		".webp": {},
	}

	err := filepath.Walk(cfg.ImageDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if !info.IsDir() {
			ext := filepath.Ext(path)
			if _, isValid := validExtensions[ext]; isValid {
				// Encode the image to Base64
				base64Data, err := encodeImageToBase64(path)
				if err != nil {
					return err
				}

				// Append the image metadata to the list
				imageMetadataList = append(imageMetadataList, ImageMetadata{
					Filename: info.Name(),
					Size:     info.Size(),
					Data:     base64Data,
				})
			}
		}
		return nil
	})

	if err != nil {
		return "", err
	}

	jsonData, err := json.Marshal(imageMetadataList)
	if err != nil {
		return "", err
	}

	return string(jsonData), nil
}
