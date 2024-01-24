# Chess Trainer

Play against a simple chess ai from the start position or several common openings.
Use tools help visualize attacks and defense.

### Features

* Color customization for
  * Dark squares
  * Light squares
  * Defended squares
  * Enemy defended squares
  * Squares defended by both players a.k.a disputed territory (this will only be shown if both defense and enemy defense are toggled on.
* Toggle on or off defense and/or enemy defense
* Long press an owned piece to always show where it can move. Useful for visualizing how multiple pieces can work together.
  * Long pressing on the enemy king will show all squares that you attack surrounding the king, including the kings position. Useful for visualizing proximity to checkmate.
* Hovering or activating a square by click will show the squares name. Useful for gaining understanding of square names.
* Square names displayed via axis labels along all 4 sides of the board (desktop only).
* History navigation using forward and back arrows. You can also click on a move in history to jump to that point in the navigation. Moving is disabled while navigated away from the current move state. While moves are disabled the entire board slightly loses it's color saturation to indicate a navigation to previous states.
* From the main menu, choose from a list of popular openings to be played from both as white or black.
* Load a FEN to be played from by navigating to the url using this format:
   * /trainer/{w|b}/{fen}
   * examples 
      * /trainer/b/rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1
      * /trainer/w/rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/5N2/PPP1PPPP/RN1QKB1R b KQkq - 1 3
