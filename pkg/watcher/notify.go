package watcher

import (
	"convert/internal/config"
	"fmt"
	"log"

	"github.com/fsnotify/fsnotify"
)

func StartWatcher() {
	config, err := config.LoadConfig()
	if err != nil {
		fmt.Printf("failed to load config file: %w", err)
	}

	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		log.Fatal(err)
	}
	defer watcher.Close()

	go func() {
		for {
			select {
			case event, ok := <-watcher.Events:
				if !ok {
					return
				}
				if event.Op&fsnotify.Create == fsnotify.Create {
					fmt.Println("New file created:", event.Name)
					readFiles(event.Name)
				}
			case err, ok := <-watcher.Errors:
				if !ok {
					return
				}
				log.Println("Error:", err)
			}
		}
	}()
	err = watcher.Add(config.ImageDir)
	if err != nil {
		log.Fatal(err)
	}
	<-make(chan struct{})
}

func readFiles(filePath string) {
	fmt.Printf("Files Changed")
}
