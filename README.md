# Box-Mathematics



This is a game involving basic arithmetic problems; the twist is that to solve the equations, we need to identify the indices of the highlighted squares and substitute them into the given random equations.

To play the game, you must use the indices shown at the start, which are just like 2D matrix indices but starting with 1. The row traversal is the x-coordinate, and the column traversal is the y-coordinate. You must use these x, y values to substitute into the given equation and type the answer out. Afterward, you will receive feedback on whether your input is right or wrong, and then the next cube will be highlighted. You have to complete the grid and 3 levels in this manner.

The project uses animations that manipulate the DOM for a very good look. What the project does at its core is: Create (creates the boxes and lives) -> add and track time with a timer -> generate random numbers to select random boxes -> generate equations for that box -> wait until the user has given an answer -> repeat until all the boxes are covered. (If achieved before the timer runs out and less than 2 errors committed -> next level; otherwise -> repeat level) -> repeat until all levels are cleared -> Game completed.

To that, I’ve tried to add a lot of flair with animations all over. There is also a local storage system that tracks high scores with a username so that multiple people can keep track of their progress. Scores are calculated as the surplus of time the players had after completing the respective level.

There is still a lot of room to perfect and add to the project. For instance, I want to clean the wave transition more, and I want to add 2 modes: "Maths" and "Typing." The Maths mode is the original, while the Typing mode would require typing letters. I also plan on adding more levels.