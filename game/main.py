import pygame
import sys
from game.board import Board

# Initialize Pygame
pygame.init()

# Screen dimensions
SCREEN_WIDTH = 800
SCREEN_HEIGHT = 800
SCREEN = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT))
pygame.display.set_caption("Checkers")

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (200, 0, 0)
BLUE = (0, 0, 200)
GREY = (128, 128, 128)

# Board dimensions
ROWS = 8
COLS = 8
SQUARE_SIZE = SCREEN_WIDTH // COLS
PAD = 15
OUTLINE = 2

def draw_board(screen, board_obj):
    for row in range(ROWS):
        for col in range(COLS):
            color = WHITE if (row + col) % 2 == 0 else BLACK
            pygame.draw.rect(screen, color, (col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE))
            
            piece = board_obj.get_piece(row, col)
            if piece != 0:
                center_x = col * SQUARE_SIZE + SQUARE_SIZE // 2
                center_y = row * SQUARE_SIZE + SQUARE_SIZE // 2
                
                if piece == 1:
                    pygame.draw.circle(screen, RED, (center_x, center_y), SQUARE_SIZE // 2 - PAD, OUTLINE)
                    pygame.draw.circle(screen, RED, (center_x, center_y), SQUARE_SIZE // 2 - PAD - OUTLINE)
                elif piece == 2:
                    pygame.draw.circle(screen, BLUE, (center_x, center_y), SQUARE_SIZE // 2 - PAD, OUTLINE)
                    pygame.draw.circle(screen, BLUE, (center_x, center_y), SQUARE_SIZE // 2 - PAD - OUTLINE)

def main():
    running = True
    board_obj = Board()
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

        draw_board(SCREEN, board_obj)
        pygame.display.flip()

    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()
