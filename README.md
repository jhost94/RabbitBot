# Overview
A starting project, a twitch bot to learn and to make personified bot.

# Fetures
Basic death counter presented on screen and chat.
Persistence, saves every change on the OBS local storage.
Game list that implements the death counter, and possibility for other future implementations.

# Future features
- Command restriction, for certain commands only moderators or channel owner can use, and not everyone.
- Full customization, the streamer has ALL the power. Use a way to have a user-friendly option management, and changes updated live.
- More on screen elements, like subs alert, donations, etc. AND BETTER.

# Instructions
To run the plugin on OBS:
1 - Download bot and extract to a folder.
2 - Configure config.json with the necessary fields.
3 - Make sure you have OBS opend.
4 - Under "Sources" click the "+" button.
5 - Select "Browser" and "Create new" option.
6 - Select the "Local fole" box, click "Browse" and find "app.js" from where this bot's folder is located.
7 - Select "Shutdown source when not visible" and "Refresh browser when scene becomes active" for better performance. --Optional--
8 - Click "OK".

# Change log
0.3.0 - Initial release.

0.4.0
Added a game list feature, that implements the death counter, and possibility for other future implementations.

0.5.1
Added Change game name and remove game options, improved game list and is now less propitious to errors.
Fixes some bugs and improved the game and death counter efficiency.

# Commands
!rb commands - WIP
!rb game add <Game Name>
!rb game change <Game Name>
!rb game rename <Old Game Name>, <New Game Name>
!rb game delete <Game Name>
!rb death
!rb death add
!rb death set <number>

# Creator
Fábio "Jhost" Cardoso