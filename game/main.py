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
GOLD = (255, 215, 0) # Color for kings

# Board dimensions
ROWS = 8
COLS = 8
SQUARE_SIZE = SCREEN_WIDTH // COLS
PAD = 15
OUTLINE = 2

# Font for messages
FONT = pygame.font.SysFont('comicsans', 70)

def draw_board(screen, board_obj):
    for row in range(ROWS):
        for col in range(COLS):
            color = WHITE if (row + col) % 2 == 0 else BLACK
            pygame.draw.rect(screen, color, (col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE))
            
            piece = board_obj.get_piece(row, col)
            if piece != 0:
                center_x = col * SQUARE_SIZE + SQUARE_SIZE // 2
                center_y = row * SQUARE_SIZE + SQUARE_SIZE // 2
                
                if piece == 1 or piece == 3: # Player 1 or Player 1 King
                    pygame.draw.circle(screen, RED, (center_x, center_y), SQUARE_SIZE // 2 - PAD, OUTLINE)
                    pygame.draw.circle(screen, RED, (center_x, center_y), SQUARE_SIZE // 2 - PAD - OUTLINE)
                elif piece == 2 or piece == 4: # Player 2 or Player 2 King
                    pygame.draw.circle(screen, BLUE, (center_x, center_y), SQUARE_SIZE // 2 - PAD, OUTLINE)
                    pygame.draw.circle(screen, BLUE, (center_x, center_y), SQUARE_SIZE // 2 - PAD - OUTLINE)

                if piece == 3 or piece == 4: # Draw a crown for kings
                    pygame.draw.circle(screen, GOLD, (center_x, center_y), 10)

def display_message(screen, message):
    text = FONT.render(message, 1, WHITE)
    screen.blit(text, (SCREEN_WIDTH // 2 - text.get_width() // 2, SCREEN_HEIGHT // 2 - text.get_height() // 2))
    pygame.display.flip()
    pygame.time.wait(3000) # Display message for 3 seconds

def main():
    running = True
    board_obj = Board()
    player_turn = 1 # Player 1 starts
    game_over = False

    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

        if not game_over:
            draw_board(SCREEN, board_obj)
            pygame.display.flip()
            
            winner = board_obj.check_for_win()
            if winner != 0:
                if winner == 1:
                    display_message(SCREEN, "Player 1 Wins!")
                else:
                    display_message(SCREEN, "Player 2 Wins!")
                game_over = True

            # For demonstration, alternating turns without actual moves
            # In a real game, this would be triggered after a valid move
            # player_turn = 3 - player_turn # Switch turns (1 -> 2, 2 -> 1)

    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()
