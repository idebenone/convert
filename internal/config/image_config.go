package config

import (
	"encoding/json"
	"fmt"
	"io"
	"os"
	"sync"
)

type ImageConfig struct {
	ImageDir string `json:"image_dir"`
}

var configInstance *ImageConfig
var once sync.Once

var configFilePath = "./../config.json"

func LoadConfig() (*ImageConfig, error) {
	once.Do(func() {
		file, err := os.Open(configFilePath)
		if err != nil {
			if os.IsNotExist(err) {
				configInstance = &ImageConfig{}
			} else {
				fmt.Printf("Error opening config file: %v\n", err)
				return
			}
		} else {
			defer file.Close()
			byteValue, _ := io.ReadAll(file)

			err = json.Unmarshal(byteValue, &configInstance)
			if err != nil {
				fmt.Printf("Error parsing config file: %v\n", err)
				return
			}
		}
	})
	return configInstance, nil
}

func (c *ImageConfig) SaveConfig() error {
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
