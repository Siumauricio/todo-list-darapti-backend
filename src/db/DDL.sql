CREATE DATABASE db_todo_list_app_darapti;

create table if not exists task (
    id serial primary key,
    position integer not null,
    title varchar(255) not null,
    is_completed bool,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
);

select * from task

SELECT MAX(position) FROM task