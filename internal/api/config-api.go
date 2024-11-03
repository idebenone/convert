package api

import "convert/internal/config"

func ReadConfigFile() (*config.ImageConfig, string) {
	cfg, err := config.LoadConfig()
	if err != nil {
		return nil, "Failed to read config file"
	}

	return cfg, ""
}

func UpdateConfigFile(key, value string) string {
	cfg, err := config.LoadConfig()
	if err != nil {
		return "Failed to load config for update: %v"
	}

	if err := cfg.UpdateConfig(key, value); err != nil {
		return "Failed to update config: %v"
	}

	return "Config updated successfully"
}
