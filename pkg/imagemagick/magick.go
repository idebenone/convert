package imagemagick

import (
	"fmt"
	"sync"

	"gopkg.in/gographics/imagick.v3/imagick"
)

var (
	once     sync.Once
	instance *MagickManager
)

type MagickManager struct{}

func Init() *MagickManager {
	once.Do(func() {
		imagick.Initialize()
		instance = &MagickManager{}
		fmt.Println("ImageMagick initialized")
	})
	return instance
}

func (m *MagickManager) Destroy() {
	imagick.Terminate()
	fmt.Println("ImageMagick destroyed")
}
