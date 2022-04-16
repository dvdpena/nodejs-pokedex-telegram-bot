## Make sure the ~.mylogin.cnf file has been created by mysql_config_editor. If not, set the correct values with "set --login-path=mypath --host=myhost --user=myuser --password", using the password for myuser. 

mysql --login-path=pokedex_user --verbose < "dbscripts/create_schema_db.sql";

mysql --login-path=pokedex_user --verbose < "dbscripts/add_names.sql";

mysql --login-path=pokedex_user --verbose < "dbscripts/add_base_stats.sql";

mysql --login-path=pokedex_user --verbose < "dbscripts/add_type_mul.sql";

mysql --login-path=pokedex_user --verbose < "dbscripts/add_pokemon.sql";
