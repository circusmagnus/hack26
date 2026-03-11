import pygame

# Screen dimensions
SCREEN_WIDTH = 600
SCREEN_HEIGHT = 400

# Game grid
GRID_SIZE = 20 # Each segment of snake/food is 20x20 pixels
GRID_WIDTH = SCREEN_WIDTH // GRID_SIZE
GRID_HEIGHT = SCREEN_HEIGHT // GRID_SIZE

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
GREEN = (0, 255, 0)
RED = (255, 0, 0)

# Game speed
FPS = 10 # Frames per second for classic snake speed
