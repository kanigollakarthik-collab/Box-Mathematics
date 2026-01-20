# Box-Mathematics



This is a game involving basic arithmetic problems, the twist is that to solve the given equations we need to identify the index's of the highlighted square's and substitute them in the given random equations.

To play the game you must use the indexes shown at the starting which are just like a 2d matrix indexes but starting with 1 and row traversal is the x coordinate and column traversal is the y-coordinate you must use these x, y values and substitute in the equation given and type the answer out after which you will have feedback as to ur input is wrong or right and then the next cube will be highlighted u have to complete the grid and 3 levels in this manner.

The project uses animations that manipulate the dom for a very good look, what the project does at its core is
create(creates the boxes and lives) -> add and track time with a timer-> generate random numbers to select random boxes -> generate equations for that box -> wait until the user has given an answer -> repeat until all the boxes are covered (if achieved before timer runs out and less than 2 errors committed -> next level or -> repeat level) ->repeat until all levels are cleared -> Game completed


To that ive tried to add alot of flair with animations all over and also there is local storage system that keeps track with a username so that multiple people can keep track of their highscores. scores are calculated as the surplus of time the players had after completing the respective level.

