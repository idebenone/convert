package config

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"sync"

	"github.com/joho/godotenv"
)

type ImageConfig struct {
	ImageDir string `json:"image_dir"`
}

var configInstance *ImageConfig
var once sync.Once

func getConfigFilePath() (string, error) {
	_ = godotenv.Load(".env")
	env := os.Getenv("APP_ENV")

	var configPath string

	if env == "development" {
		configPath = filepath.Join(".", "config.json")
	} else {
		execPath, err := os.Executable()

		if err != nil {
			return "", fmt.Errorf("failed to get user config directory: %v", err)
		}

		execDir := filepath.Dir(execPath)
		configPath = filepath.Join(execDir, "config.json")
	}

	fmt.Println("config file path: ", configPath)
	return configPath, nil
}

func LoadConfig() (*ImageConfig, error) {
	var loadErr error
	once.Do(func() {
		configFilePath, err := getConfigFilePath()
		if err != nil {
			loadErr = fmt.Errorf("error determining config file path: %v", err)
			return
		}

		file, err := os.Open(configFilePath)
		if err != nil {
			if os.IsNotExist(err) {
				configInstance = &ImageConfig{}
			} else {
				loadErr = fmt.Errorf("error opening config file: %v", err)
				return
			}
		} else {
			defer file.Close()
			byteValue, _ := io.ReadAll(file)

			err = json.Unmarshal(byteValue, &configInstance)
			if err != nil {
				loadErr = fmt.Errorf("error parsing config file: %v", err)
				return
			}
		}
	})

	if loadErr != nil {
		return nil, loadErr
	}

	return configInstance, nil
}

func (c *ImageConfig) SaveConfig() error {
	configFilePath, err := getConfigFilePath()
	if err != nil {
		return fmt.Errorf("error determining config file path: %v", err)
	}

	dir := filepath.Dir(configFilePath)
	if _, err := os.Stat(dir); os.IsNotExist(err) {
		if err := os.MkdirAll(dir, 0755); err != nil {
			return fmt.Errorf("error creating config directory: %v", err)
		}
	}

	file, err := json.MarshalIndent(c, "", "  ")
	if err != nil {
		return fmt.Errorf("error marshaling config: %v", err)
	}

	err = os.WriteFile(configFilePath, file, 0644)
	if err != nil {
		return fmt.Errorf("error writing config to file: %v", err)
	}
	return nil
}

func (c *ImageConfig) UpdateConfig(key, value string) error {
	switch key {
	case "image_dir":
		c.ImageDir = value
	default:
		return fmt.Errorf("unknown config key: %s", key)
	}

	return c.SaveConfig()
}
