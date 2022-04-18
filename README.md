# Telegram Pokedex Bot

This is a Telegram bot that serves as a Pokedex for the first 8 generations.
The DB was taken from [pokemon-json](https://github.com/fanzeyi/pokemon.json.git)

## Pre install
Before installing, create the main database, either with mysql or mariadb, depending on your system. To create the database, give executable permissions to the corresponding `create_db` file inside the `extras` folder.
```
chmod +x create_db.sh
./create_db.sh
```
## .env file
Create a file called `.env` and add the following lines:
```
# .env file
PORT=8443 #Check list of Telegram allowed ports and modifý accordingly
POKEDEX_BOT_TOKEN="YOURTELEGRAMBOTTOKENGOESHERE"
NGROK_ENDPOINT="https://YOURURLGOESHERE/" #Could use ngrok to test because it expects an https address
DB = "mysql" #can be "maria" if using mariadb
```