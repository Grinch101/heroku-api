CREATE DATABASE heroku_logs;
CREATE TABLE logs(id SERIAL, dyno TEXT, status TEXT, time TIMESTAMP);

INSERT INTO logs(dyno, status, time) VALUES('sef_1', '_', '2000-01-01 00:00:00' );