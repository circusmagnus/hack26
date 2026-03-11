import pygame
import sys
from utils import SCREEN_WIDTH, SCREEN_HEIGHT, FPS, BLACK, WHITE

def main():
    pygame.init()

    screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
    pygame.display.set_caption("Snake Game")

    clock = pygame.time.Clock()

    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            # Add keyboard input handling later for snake movement

        # Game updates (will be handled by game.py later)

        # Rendering
        screen.fill(BLACK) # Clear the screen with black
        # Draw game objects (snake, food) later
        pygame.display.flip() # Update the full display Surface to the screen

        clock.tick(FPS)

    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()
