package watcher

import (
	"context"
	"convert/internal/config"
	"fmt"
	"log"

	"github.com/fsnotify/fsnotify"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func StartWatcher(ctx context.Context, events chan<- string) {
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
					runtime.EventsEmit(ctx, "file-created", event.Name)
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
