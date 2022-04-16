# Telegram Pokedex Bot

This is a Telegram bot that serves as a Pokedex for the first 8 generations.
The DB was taken from [pokemon-json](https://github.com/fanzeyi/pokemon.json.git)

## Pre install
Before installing, create the main database, either with mysql or mariadb, depending on your system. To create the database, give executable permissions to the corresponding `create_db` file inside the `extras` folder.
```
chmod +x create_db.sh
./create_db.sh
```
