create table if not exists test(
id int not null AUTO_INCREMENT,
name varchar(32) not null,
primary key(id),
unique(name)
);

create table if not exists user(
    id int not null AUTO_INCREMENT,
    sub varchar(128) not null,
    email varchar(64) not null,
    country varchar(32) not null,
    primary key(id),
    unique(sub)
);
