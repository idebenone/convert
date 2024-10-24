package models

type ConvertImageFormatArgs = struct {
	InputFile string `json:"input_file"`
	Format    string `json:"format"`
}
