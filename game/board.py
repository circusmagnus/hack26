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
