import pygame

# Initialize Pygame
pygame.init()

# Screen dimensions
WIDTH, HEIGHT = 800, 800
SCREEN = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Checkers")

# Colors
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
RED = (200, 0, 0)
BLUE = (0, 0, 200) # For player 2 pieces
GREY = (128, 128, 128)
CROWN = pygame.transform.scale(pygame.image.load('assets/crown.png'), (44, 24))

# Board setup
ROWS, COLS = 8, 8
SQUARE_SIZE = WIDTH // COLS

class Piece:
    PADDING = 15
    OUTLINE = 2

    def __init__(self, row, col, color):
        self.row = row
        self.col = col
        self.color = color
        self.king = False
        self.x = 0
        self.y = 0
        self.calc_pos()

    def calc_pos(self):
        self.x = SQUARE_SIZE * self.col + SQUARE_SIZE // 2
        self.y = SQUARE_SIZE * self.row + SQUARE_SIZE // 2

    def make_king(self):
        self.king = True

    def draw(self, screen):
        radius = SQUARE_SIZE // 2 - self.PADDING
        pygame.draw.circle(screen, GREY, (self.x, self.y), radius + self.OUTLINE)
        pygame.draw.circle(screen, self.color, (self.x, self.y), radius)
        if self.king:
            screen.blit(CROWN, (self.x - CROWN.get_width() // 2, self.y - CROWN.get_height() // 2))

    def move(self, row, col):
        self.row = row
        self.col = col
        self.calc_pos()

    def __repr__(self):
        return str(self.color)


class Board:
    def __init__(self):
        self.board = []
        self.red_left = 12
        self.blue_left = 12
        self.create_board()

    def draw_squares(self, screen):
        screen.fill(BLACK)
        for row in range(ROWS):
            for col in range(row % 2, COLS, 2):
                pygame.draw.rect(screen, WHITE, (col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE))

    def create_board(self):
        for row in range(ROWS):
            self.board.append([])
            for col in range(COLS):
                if col % 2 == ((row + 1) % 2):
                    if row < 3:
                        self.board[row].append(Piece(row, col, RED))
                    elif row > 4:
                        self.board[row].append(Piece(row, col, BLUE))
                    else:
                        self.board[row].append(0)
                else:
                    self.board[row].append(0)

    def draw(self, screen):
        self.draw_squares(screen)
        for row in range(ROWS):
            for col in range(COLS):
                piece = self.board[row][col]
                if piece != 0:
                    piece.draw(screen)

    def get_piece(self, row, col):
        return self.board[row][col]

    def move(self, piece, row, col):
        self.board[piece.row][piece.col], self.board[row][col] = self.board[row][col], self.board[piece.row][piece.col]
        piece.move(row, col)
        if row == ROWS - 1 or row == 0:
            piece.make_king()

    def remove(self, pieces):
        for piece in pieces:
            self.board[piece.row][piece.col] = 0
            if piece.color == RED:
                self.red_left -= 1
            else:
                self.blue_left -= 1

    def winner(self):
        if self.red_left <= 0:
            return BLUE
        elif self.blue_left <= 0:
            return RED
        return None

    def get_valid_moves(self, piece):
        moves = {}
        left = piece.col - 1
        right = piece.col + 1
        row = piece.row

        if piece.color == RED or piece.king:
            moves.update(self._traverse_left(row - 1, max(-1, row - 3), -1, piece.color, left))
            moves.update(self._traverse_right(row - 1, max(-1, row - 3), -1, piece.color, right))
        if piece.color == BLUE or piece.king:
            moves.update(self._traverse_left(row + 1, min(ROWS, row + 3), 1, piece.color, left))
            moves.update(self._traverse_right(row + 1, min(ROWS, row + 3), 1, piece.color, right))
        
        return moves

    def _traverse_left(self, start, stop, step, color, left, skipped=[]):
        moves = {}
        last = []
        for r in range(start, stop, step):
            if left < 0:
                break
            
            current = self.board[r][left]
            if current == 0:
                if not skipped and not last:
                    moves[(r, left)] = last
                elif last and not skipped:
                    if step == -1 and current != 0 and current.color != color:
                        moves[(r, left)] = last + [current]
                    elif step == 1 and current != 0 and current.color != color:
                        moves[(r, left)] = last + [current]
                    
                elif last and not current: # and last: it means it's a jump
                    if not skipped:
                        moves[(r, left)] = last + skipped
                else:
                    break
            elif current.color == color:
                break
            else:
                last = [current]
            
            left -= 1
        
        return moves

    def _traverse_right(self, start, stop, step, color, right, skipped=[]):
        moves = {}
        last = []
        for r in range(start, stop, step):
            if right >= COLS:
                break
            
            current = self.board[r][right]
            if current == 0:
                if not skipped and not last:
                    moves[(r, right)] = last
                elif last and not skipped:
                    if step == -1 and current != 0 and current.color != color:
                        moves[(r, right)] = last + [current]
                    elif step == 1 and current != 0 and current.color != color:
                        moves[(r, right)] = last + [current]
                elif last and not current: # and last: it means it's a jump
                    if not skipped:
                        moves[(r, right)] = last + skipped
                else:
                    break
            elif current.color == color:
                break
            else:
                last = [current]
            
            right += 1

        return moves


class Game:
    def __init__(self, screen):
        self._init()
        self.screen = screen

    def _init(self):
        self.selected = None
        self.board = Board()
        self.turn = RED
        self.valid_moves = {}

    def update(self):
        self.board.draw(self.screen)
        self.draw_valid_moves(self.valid_moves)
        pygame.display.update()

    def reset(self):
        self._init()

    def winner(self):
        return self.board.winner()

    def select(self, row, col):
        if self.selected:
            result = self._move(row, col)
            if not result:
                self.selected = None
                self.select(row, col)
        
        piece = self.board.get_piece(row, col)
        if piece != 0 and piece.color == self.turn:
            self.selected = piece
            self.valid_moves = self.board.get_valid_moves(piece)
            return True
            
        return False

    def _move(self, row, col):
        if self.selected and (row, col) in self.valid_moves:
            self.board.move(self.selected, row, col)
            skipped = self.valid_moves[(row, col)]
            if skipped:
                self.board.remove(skipped)
            self.change_turn()
            return True
        return False

    def draw_valid_moves(self, moves):
        for move in moves:
            row, col = move
            pygame.draw.circle(self.screen, GREY, (col * SQUARE_SIZE + SQUARE_SIZE // 2, row * SQUARE_SIZE + SQUARE_SIZE // 2), 15)

    def change_turn(self):
        self.valid_moves = {}
        if self.turn == RED:
            self.turn = BLUE
        else:
            self.turn = RED

def get_row_col_from_mouse(pos):
    x, y = pos
    row = y // SQUARE_SIZE
    col = x // SQUARE_SIZE
    return row, col

# Main game loop
def main():
    FPS = 60
    clock = pygame.time.Clock()
    game = Game(SCREEN)

    running = True
    while running:
        clock.tick(FPS)

        if game.winner():
            print(game.winner())
            running = False

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

            if event.type == pygame.MOUSEBUTTONDOWN:
                pos = pygame.mouse.get_pos()
                row, col = get_row_col_from_mouse(pos)
                game.select(row, col)
        
        game.update()

    pygame.quit()

if __name__ == "__main__":
    main()
