insert into users(id, username, email, password, created_at, updated_at, currency) values (
                                                                                              1, 'John Brown', 'john@example.com', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
                                                                                              to_timestamp('2025/06/10 11:15', 'YYYY/MM/DD hh:mi'), to_timestamp('2025/06/10 11:15', 'YYYY/MM/DD hh:mi'),'USD'
                                                                                          ) on CONFLICT DO NOTHING;

insert into transactions (id, user_id, amount, created_at, updated_at, category, date_of_transaction, description) values
    (1, 1, 4500, to_timestamp('2025/06/15 11:15', 'YYYY/MM/DD hh:mi'), to_timestamp('2025/06/15 11:15', 'YYYY/MM/DD hh:mi')
    , 'INCOME', to_timestamp('2025/06/15 11:15', 'YYYY/MM/DD hh:mi'), 'Salary') on CONFLICT DO NOTHING;

insert into transactions (id, user_id, amount, created_at, updated_at, category, date_of_transaction, description) values
    (2, 1, 4500, to_timestamp('2025/07/15 11:15', 'YYYY/MM/DD hh:mi'), to_timestamp('2025/07/15 11:15', 'YYYY/MM/DD hh:mi')
    , 'INCOME', to_timestamp('2025/07/15 11:15', 'YYYY/MM/DD hh:mi'), 'Salary') on CONFLICT DO NOTHING;

insert into transactions (id, user_id, amount, created_at, updated_at, category, date_of_transaction, description) values
    (3, 1, 275.50, to_timestamp('2025/07/15 11:15', 'YYYY/MM/DD hh:mi'), to_timestamp('2025/07/15 11:15', 'YYYY/MM/DD hh:mi')
    , 'GROCERIES', to_timestamp('2025/07/15 11:15', 'YYYY/MM/DD hh:mi'), 'Groceries at local shop') on CONFLICT DO NOTHING;
insert into transactions (id, user_id, amount, created_at, updated_at, category, date_of_transaction, description) values
    (4, 1, 400, to_timestamp('2025/07/20 11:15', 'YYYY/MM/DD hh:mi'), to_timestamp('2025/07/20 11:15', 'YYYY/MM/DD hh:mi')
    , 'OIL', to_timestamp('2025/07/20 11:15', 'YYYY/MM/DD hh:mi'), 'Oil for car') on CONFLICT DO NOTHING;

insert into transactions (id, user_id, amount, created_at, updated_at, category, date_of_transaction, description) values
    (5, 1, 215, to_timestamp('2025/07/27 11:15', 'YYYY/MM/DD hh:mi'), to_timestamp('2025/07/27 11:15', 'YYYY/MM/DD hh:mi')
    , 'ENTERTAINMENT', to_timestamp('2025/07/27 11:15', 'YYYY/MM/DD hh:mi'), 'Cinema night with friends.') on CONFLICT DO NOTHING;


insert into transactions (id, user_id, amount, created_at, updated_at, category, date_of_transaction, description) values
    (6, 1, 4500, to_timestamp('2025/09/15 11:15', 'YYYY/MM/DD hh:mi'), to_timestamp('2025/09/15 11:15', 'YYYY/MM/DD hh:mi')
    , 'INCOME', to_timestamp('2025/09/15 11:15', 'YYYY/MM/DD hh:mi'), 'Salary') on CONFLICT DO NOTHING;

insert into transactions (id, user_id, amount, created_at, updated_at, category, date_of_transaction, description) values
    (7, 1, 2000, to_timestamp('2025/07/27 11:15', 'YYYY/MM/DD hh:mi'), to_timestamp('2025/07/27 11:15', 'YYYY/MM/DD hh:mi')
    , 'ENTERTAINMENT', to_timestamp('2025/07/27 11:15', 'YYYY/MM/DD hh:mi'), 'Trip with family to Germany.') on CONFLICT DO NOTHING;

insert into transactions (id, user_id, amount, created_at, updated_at, category, date_of_transaction, description) values
    (12, 1, 350, to_timestamp('2025/07/28 11:15', 'YYYY/MM/DD hh:mi'), to_timestamp('2025/07/28 11:15', 'YYYY/MM/DD hh:mi')
    , 'FOOD', to_timestamp('2025/07/28 11:15', 'YYYY/MM/DD hh:mi'), 'Food during trip in Germany.') on CONFLICT DO NOTHING;

insert into transactions (id, user_id, amount, created_at, updated_at, category, date_of_transaction, description) values
    (15, 1, 750, to_timestamp('2025/11/15 11:15', 'YYYY/MM/DD hh:mi'), to_timestamp('2025/11/15 11:15', 'YYYY/MM/DD hh:mi')
    , 'INCOME', to_timestamp('2025/11/15 11:15', 'YYYY/MM/DD hh:mi'), 'From Michael') on CONFLICT DO NOTHING;

insert into transactions (id, user_id, amount, created_at, updated_at, category, date_of_transaction, description) values
    (27, 1, 1000, to_timestamp('2025/11/15 11:15', 'YYYY/MM/DD hh:mi'), to_timestamp('2025/11/15 11:15', 'YYYY/MM/DD hh:mi')
    , 'HOUSE', to_timestamp('2025/11/15 11:15', 'YYYY/MM/DD hh:mi'), 'Rent') on CONFLICT DO NOTHING;

insert into transactions (id, user_id, amount, created_at, updated_at, category, date_of_transaction, description) values
    (32, 1, 1500, to_timestamp('2025/12/12 11:15', 'YYYY/MM/DD hh:mi'), to_timestamp('2025/12/12 11:15', 'YYYY/MM/DD hh:mi')
    , 'OTHERS', to_timestamp('2025/12/12 11:15', 'YYYY/MM/DD hh:mi'), 'Gifts for Christmas.') on CONFLICT DO NOTHING;

insert into transactions (id, user_id, amount, created_at, updated_at, category, date_of_transaction, description) values
    (42, 1, 1000, to_timestamp('2025/12/15  12:00', 'YYYY/MM/DD hh:mi'), to_timestamp('2025/12/15 11:15', 'YYYY/MM/DD hh:mi')
    , 'HOUSE', to_timestamp('2025/12/15 12:00', 'YYYY/MM/DD hh:mi'), 'Rent') on CONFLICT DO NOTHING;

insert into transactions (id, user_id, amount, created_at, updated_at, category, date_of_transaction, description) values
    (55, 1, 275, to_timestamp('2026/01/02 11:15', 'YYYY/MM/DD hh:mi'), to_timestamp('2026/01/02 11:15', 'YYYY/MM/DD hh:mi')
    , 'ENTERTAINMENT', to_timestamp('2026/01/02 11:15', 'YYYY/MM/DD hh:mi'), 'New year party') on CONFLICT DO NOTHING;

