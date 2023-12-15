### Seed
There is a single seed in the project representing the othello but all other default seeds are also available.

### Plugin
There are three plugins in this studio to showcase the currently available languages for interpretations.
- CreateGame: this plugin is written in python and responsible for creating a game in the proper folder with the start state.
- CheckWinCondition: this plugin is written in javascript and simply checks if one of the players has won the game.
- BuildDescriptor: this plugin is written in javascript and shows how a structured data representing the model for the visualization can be created with a plugin - which allows for a more generalized approach and minimizes the need for learning all the different APIs of the system.
- Counting: to count the amount of the pieces it has on the board at that time.
- HighlightValidTiles: to highlight the valid tiles which can be put into steps.
- PlayerMoves: to make the movement of players.

## Installation
To install this design studio, you have two options. You can either choose the preferred docker based deployment
 or you can stick to the standard way that involves more installation.


## Development
If you are using this repository as an example and would like to 'recreate' it or add further components to it, you are
going to need additional software:
- [NodeJS](https://nodejs.org/en/)
- [WebGME-CLI](https://www.npmjs.com/package/webgme-cli)

You are going to use nodejs to bring in potentially new components or dependencies while the CLI is there to generate or import design studio components with handling the necessary config updates as well.

## Components
We are going to list the available components in this studio as well as describing how they can be created or what 
needs to be set for them to work as intended.



