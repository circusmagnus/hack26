import pygame
from snake import Snake
from food import Food
from utils import SCREEN_WIDTH, SCREEN_HEIGHT, BLACK, WHITE

class Game:
    def __init__(self):
        self.snake = Snake()
        self.food = Food()
        self.game_over = False

    def update(self):
        if not self.game_over:
            self.snake.move()

            # Check if snake eats food
            if self.snake.body[0] == self.food.position:
                self.snake.grow = True
                self.food.randomize_position(self.snake.body)
                # Score increment will be added in SCRUM-232
            
            # Collision detection (will be expanded in SCRUM-231)
            # Wall collision
            head_x, head_y = self.snake.body[0]
            if head_x < 0 or head_x >= SCREEN_WIDTH or head_y < 0 or head_y >= SCREEN_HEIGHT:
                self.game_over = True
            
            # Self-collision
            if self.snake.body[0] in self.snake.body[1:]:
                self.game_over = True

    def draw(self, surface):
        surface.fill(BLACK) # Clear screen
        self.snake.draw(surface)
        self.food.draw(surface)

        if self.game_over:
            font = pygame.font.Font(None, 50)
            text = font.render("Game Over!", True, WHITE)
            text_rect = text.get_rect(center=(SCREEN_WIDTH // 2, SCREEN_HEIGHT // 2))
            surface.blit(text, text_rect)

    def handle_input(self, event):
        # This will be properly implemented in SCRUM-229
        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_UP:
                self.snake.change_direction((0, -1))
            elif event.key == pygame.K_DOWN:
                self.snake.change_direction((0, 1))
            elif event.key == pygame.K_LEFT:
                self.snake.change_direction((-1, 0))
            elif event.key == pygame.K_RIGHT:
                self.snake.change_direction((1, 0))
