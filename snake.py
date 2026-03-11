import pygame
from utils import GRID_SIZE, GREEN

class Snake:
    def __init__(self):
        self.body = [(10 * GRID_SIZE, 10 * GRID_SIZE), (9 * GRID_SIZE, 10 * GRID_SIZE)] # Initial snake body
        self.direction = (1, 0) # Right
        self.grow = False

    def move(self):
        # This will be properly implemented in SCRUM-229
        if not self.grow:
            self.body.pop()
        else:
            self.grow = False
        
        new_head = (self.body[0][0] + self.direction[0] * GRID_SIZE, \
                    self.body[0][1] + self.direction[1] * GRID_SIZE)
        self.body.insert(0, new_head)

    def change_direction(self, new_direction):
        # This will be properly implemented in SCRUM-229
        if (new_direction[0] * -1, new_direction[1] * -1) == self.direction:
            return # Prevent immediate reverse
        self.direction = new_direction

    def draw(self, surface):
        for segment in self.body:
            rect = pygame.Rect(segment[0], segment[1], GRID_SIZE, GRID_SIZE)
            pygame.draw.rect(surface, GREEN, rect)
