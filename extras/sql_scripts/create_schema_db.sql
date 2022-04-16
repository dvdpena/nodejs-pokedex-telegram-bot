-- Drop database if it exists
DROP DATABASE IF EXISTS pokedex;

-- Create database
CREATE DATABASE pokedex;
USE pokedex;

-- Create tables as needed

CREATE TABLE IF NOT EXISTS names (
	id SMALLINT NOT NULL AUTO_INCREMENT, 
	english VARCHAR(20) NOT NULL,
    japanese VARCHAR(20) NOT NULL,
    chinese VARCHAR(20) NOT NULL,
    french VARCHAR(20) NOT NULL,
	PRIMARY KEY (id))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS base_stats (
	id SMALLINT NOT NULL AUTO_INCREMENT, 
    hp SMALLINT NOT NULL,
    attack SMALLINT NOT NULL,
    defense SMALLINT NOT NULL,
    special_attack SMALLINT NOT NULL,
    special_defense SMALLINT NOT NULL,
    speed SMALLINT NOT NULL,
    PRIMARY KEY (id))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS type_mul (
	id TINYINT NOT NULL AUTO_INCREMENT,
    tname VARCHAR(20) NOT NULL,
	normal DECIMAL(2,1) DEFAULT 1.0,
    fire DECIMAL(2,1) DEFAULT 1.0,
    water DECIMAL(2,1) DEFAULT 1.0,
    electric DECIMAL(2,1) DEFAULT 1.0,
    grass DECIMAL(2,1) DEFAULT 1.0, 
    ice DECIMAL(2,1) DEFAULT 1.0, 
    fighting DECIMAL(2,1) DEFAULT 1.0, 
    poison DECIMAL(2,1) DEFAULT 1.0,
    ground DECIMAL(2,1) DEFAULT 1.0,
    flying DECIMAL(2,1) DEFAULT 1.0,
    psychic DECIMAL(2,1) DEFAULT 1.0,
    bug DECIMAL(2,1) DEFAULT 1.0,
    rock DECIMAL(2,1) DEFAULT 1.0,
    ghost DECIMAL(2,1) DEFAULT 1.0,
    dragon DECIMAL(2,1) DEFAULT 1.0,
    dark DECIMAL(2,1) DEFAULT 1.0,
    steel DECIMAL(2,1) DEFAULT 1.0,
    fairy DECIMAL(2,1) DEFAULT 1.0,
	PRIMARY KEY (id))
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS pokemon (
	id SMALLINT NOT NULL AUTO_INCREMENT, 
    primary_type_id TINYINT NOT NULL,
    secondary_type_id TINYINT,
    base_stats_id SMALLINT NOT NULL,
    name_id SMALLINT NOT NULL, 
    image_file_id VARCHAR(150),   
	PRIMARY KEY (id),
    INDEX fkPokemonType1_idx  (primary_type_id ASC),
    INDEX fkPokemonType2_idx (secondary_type_id ASC),
    INDEX fkPokemonStats_idx (base_stats_id ASC),
    INDEX fkPokemonName_idx (name_id ASC),
    CONSTRAINT fkPokemonType1
		FOREIGN KEY (primary_type_id)
		REFERENCES type_mul (id)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION,
	CONSTRAINT fkPokemonType2
		FOREIGN KEY (secondary_type_id)
		REFERENCES type_mul (id)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION,
	CONSTRAINT fkPokemonStats
		FOREIGN KEY (base_stats_id)
		REFERENCES base_stats (id)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION,
	CONSTRAINT fkPokemonName
		FOREIGN KEY (name_id)
		REFERENCES names (id)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
    )
ENGINE = InnoDB;


-- Create indexes for the tables

CREATE UNIQUE INDEX uq_name ON names(english);
CREATE UNIQUE INDEX uq_tname ON type_mul(tname);

-- Create the most useful views (as the pokedex entries are not mutable, there is no problem with this)

-- Creates the main view to display a pokedex entry. Merges all tables and labels the selected values accordingly
CREATE VIEW pokedex_entries AS
    SELECT 
        p.id,
        n.english,
        n.japanese,
        n.chinese,
        n.french,
        p.image_file_id,
        t.tname AS 'primary_type',
        t2.tname AS 'secondary_type',
        b.hp,
        b.attack,
        b.defense,
        b.special_attack,
        b.special_defense,
        b.speed
    FROM
        pokemon AS p
            INNER JOIN
        names AS n ON p.name_id = n.id
            INNER JOIN
        type_mul AS t ON p.primary_type_id = t.id
            LEFT JOIN
        type_mul AS t2 ON p.secondary_type_id = t2.id
            INNER JOIN
        base_stats AS b ON p.base_stats_id = b.id;



-- Due to some pokemon having dual typing, there is a need to adjust their type multipliers, to reflect their real behavior.

CREATE VIEW adjusted_type_mulpipliers AS
    SELECT 
        p.id,
        n.english,
        t.tname AS primary_type,
        t2.tname AS secondary_type,
        IF(p.secondary_type_id IS NULL,
            t.normal,
            t.normal * t2.normal) AS Normal,
        IF(p.secondary_type_id IS NULL,
            t.fire,
            t.fire * t2.fire) AS Fire,
        IF(p.secondary_type_id IS NULL,
            t.water,
            t.water * t2.water) AS Water,
        IF(p.secondary_type_id IS NULL,
            t.electric,
            t.electric * t2.electric) AS Electric,
        IF(p.secondary_type_id IS NULL,
            t.grass,
            t.grass * t2.grass) AS Grass,
        IF(p.secondary_type_id IS NULL,
            t.ice,
            t.ice * t2.ice) AS Ice,
        IF(p.secondary_type_id IS NULL,
            t.fighting,
            t.fighting * t2.fighting) AS Fighting,
        IF(p.secondary_type_id IS NULL,
            t.poison,
            t.poison * t2.poison) AS Poison,
        IF(p.secondary_type_id IS NULL,
            t.ground,
            t.ground * t2.ground) AS Ground,
        IF(p.secondary_type_id IS NULL,
            t.flying,
            t.flying * t2.flying) AS Flying,
        IF(p.secondary_type_id IS NULL,
            t.psychic,
            t.psychic * t2.psychic) AS Psychic,
        IF(p.secondary_type_id IS NULL,
            t.bug,
            t.bug * t2.bug) AS Bug,
        IF(p.secondary_type_id IS NULL,
            t.rock,
            t.rock * t2.rock) AS Rock,
        IF(p.secondary_type_id IS NULL,
            t.ghost,
            t.ghost * t2.ghost) AS Ghost,
        IF(p.secondary_type_id IS NULL,
            t.dragon,
            t.dragon * t2.dragon) AS Dragon,
        IF(p.secondary_type_id IS NULL,
            t.dark,
            t.dark * t2.dark) AS Dark,
        IF(p.secondary_type_id IS NULL,
            t.steel,
            t.steel * t2.steel) AS Steel,
        IF(p.secondary_type_id IS NULL,
            t.fairy,
            t.fairy * t2.fairy) AS Fairy
    FROM
        pokemon AS p
            INNER JOIN
        names AS n ON p.name_id = n.id
            INNER JOIN
        type_mul AS t ON p.primary_type_id = t.id
            LEFT JOIN
        type_mul AS t2 ON p.secondary_type_id = t2.id