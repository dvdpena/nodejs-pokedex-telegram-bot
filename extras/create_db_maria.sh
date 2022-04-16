## Make sure you are using MariaDb and that the file has permission to be read only by the user.

mysql --defaults-extra-file=~/.pi.cnf --verbose < "dbscripts/create_schema_db.sql";

mysql --defaults-extra-file=~/.pi.cnf --verbose < "dbscripts/add_names.sql";

mysql --defaults-extra-file=~/.pi.cnf --verbose < "dbscripts/add_base_stats.sql";

mysql --defaults-extra-file=~/.pi.cnf --verbose < "dbscripts/add_type_mul.sql";

mysql --defaults-extra-file=~/.pi.cnf --verbose < "dbscripts/add_pokemon.sql";
