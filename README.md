# Overview
A starting project, a twitch bot to learn and to make personified bot.

# Fetures
Basic death counter presented on screen and chat.
Persistence, saves every change on the OBS local storage.
Game list that implements the death counter and a boss list for each game.

# Future features
- Command restriction, for certain commands only moderators or channel owner can use, and not everyone.
- Full customization, the streamer has ALL the power. Use a way to have a user-friendly option management, and changes updated live.

# Instructions
To run the plugin on OBS:
1 - Download bot and extract to a folder.
2 - Configure config.json with the necessary fields.
3 - Make sure you have OBS opend.
4 - Under "Sources" click the "+" button.
5 - Select "Browser" and "Create new" option.
6 - Select the "Local file" box, click "Browse" and find "app.html" from where this bot's folder is located.
7 - Select "Shutdown source when not visible" and "Refresh browser when scene becomes active" for better performance. --Optional--
8 - Click "OK".

# Change log
0.3.0 - Initial release.

0.4.0
Added a game list feature, that implements the death counter, and possibility for other future implementations.

0.5.1
Added Change game name and remove game options, improved game list and is now less propitious to errors.
Fixes some bugs and improved the game and death counter efficiency.

0.6.0
Added new boss commands, fully optional.
These new commands have all base options, similar to "Game" and a few more.
Fixed some bugs.

0.6.1
Most boss commands fixed.

0.7.0
Added stage commands, similar boss commands.
Fixed Game integrity issues.
Some bugs with stage commands, changing into a stage with no current boss duplicates the stages on screen.
Transition when removing Boss on screen is sloppy.

0.7.1
Fixed stage duplicating when appearing on screen with no bosses.
Smoother transitions.

0.8.0
Fixed all bugs caught on test streams.
Final version, for now.

# Commands
!rb cmd

!rb game
!rb game add <Game Name>
!rb game change <Game Name>
!rb game rename <Old Game Name>, <New Game Name>
!rb game delete <Game Name>

!rb boss <Boss name (optional)>
!rb boss show
!rb boss hide
!rb boss add <Boss Name>
!rb boss change <Boss Name>
!rb boss rename <Old Boss Name, New Boss Name>
!rb boss delete <Boss Name>
!rb boss finish

!rb stage <Stage name (optional)>
!rb stage show
!rb stage hide
!rb stage add <Stage Name>
!rb stage change <Stage Name>
!rb stage rename <Old Stage Name, New Stage Name>
!rb stage delete <Stage Name>
!rb stage finish

!rb death
!rb death add
!rb death set <number>

# Creator
Fábio "Jhost" Cardoso