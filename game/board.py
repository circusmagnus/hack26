class Board:
    def __init__(self):
        self.board = self.create_board()

    def create_board(self):
        board = []
        for row in range(8):
            board.append([0, 0, 0, 0, 0, 0, 0, 0])
        
        # Place initial pieces
        for row in range(3):
            for col in range(8):
                if (row + col) % 2 != 0:
                    board[row][col] = 1 # Player 1's pieces
        
        for row in range(5, 8):
            for col in range(8):
                if (row + col) % 2 != 0:
                    board[row][col] = 2 # Player 2's pieces
        return board

    def get_piece(self, row, col):
        return self.board[row][col]

    def move_piece(self, start_row, start_col, end_row, end_col):
        piece = self.board[start_row][start_col]
        self.board[start_row][start_col] = 0
        self.board[end_row][end_col] = piece
        self.check_king(end_row, end_col)

    def check_king(self, row, col):
        piece = self.board[row][col]
        if piece == 1 and row == 7:
            self.board[row][col] = 3 # Player 1 King
        elif piece == 2 and row == 0:
            self.board[row][col] = 4 # Player 2 King

    def check_for_win(self):
        player1_pieces = 0
        player2_pieces = 0
        for row in range(8):
            for col in range(8):
                piece = self.board[row][col]
                if piece == 1 or piece == 3:
                    player1_pieces += 1
                elif piece == 2 or piece == 4:
                    player2_pieces += 1
        
        if player1_pieces == 0:
            return 2 # Player 2 wins
        elif player2_pieces == 0:
            return 1 # Player 1 wins
        else:
            return 0 # No win yet

    def is_valid_move(self, start_row, start_col, end_row, end_col, player_turn):
        # For now, a very basic check. Will be expanded in SCRUM-374
        if not (0 <= end_row < 8 and 0 <= end_col < 8):
            return False # Out of bounds
        
        if self.board[end_row][end_col] != 0:
            return False # Target square is not empty

        piece = self.board[start_row][start_col]
        if (player_turn == 1 and (piece == 2 or piece == 4)) or \
           (player_turn == 2 and (piece == 1 or piece == 3)):
            return False # Trying to move opponent's piece

        return True # Placeholder, actual move validation will be complex
