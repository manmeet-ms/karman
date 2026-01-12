
import { useCallback } from 'react';

// Using native Audio for simplicity and avoiding external dependency issues
export function useSound(soundPath: string) {
    const play = useCallback(() => {
        try {
            const audio = new Audio(soundPath);
            audio.volume = 0.5;
            audio.play().catch(err => {
                // Ignore autoplay errors or user interaction requirements
                console.warn("Audio playback failed", err);
            });
        } catch (e) {
            console.error("Audio initialization failed", e);
        }
    }, [soundPath]);

    return { play };
}
