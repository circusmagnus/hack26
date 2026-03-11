import random
import pygame
from utils import GRID_SIZE, GRID_WIDTH, GRID_HEIGHT, RED

class Food:
    def __init__(self):
        self.position = (0, 0)
        self.randomize_position([]) # Initial placement, assuming empty snake body for now

    def randomize_position(self, snake_body):
        while True:
            x = random.randrange(0, GRID_WIDTH) * GRID_SIZE
            y = random.randrange(0, GRID_HEIGHT) * GRID_SIZE
            new_position = (x, y)
            if new_position not in snake_body:
                self.position = new_position
                break

    def draw(self, surface):
        rect = pygame.Rect(self.position[0], self.position[1], GRID_SIZE, GRID_SIZE)
        pygame.draw.rect(surface, RED, rect)
