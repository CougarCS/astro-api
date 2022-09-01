/* core.sql */

-- DROP DATABASE cougarcs;
-- CREATE DATABASE cougarcs;
USE cougarcs;

/* Contact */

CREATE TABLE shirt_size (
	shirt_size_id VARCHAR(16) NOT NULL PRIMARY KEY,
    message VARCHAR(64) NOT NULL
);

CREATE TABLE contact (
	contact_id VARCHAR(36) NOT NULL PRIMARY KEY,
    uh_id VARCHAR(7),
    email VARCHAR(128) NOT NULL UNIQUE,
    first_name VARCHAR(64) NOT NULL,
    last_name VARCHAR(64),
    phone_number VARCHAR(32),
    shirt_size_id VARCHAR(16),
    `timestamp` DATETIME NOT NULL DEFAULT NOW(),
    FOREIGN KEY (shirt_size_id) REFERENCES shirt_size(shirt_size_id)
);

/* Membership */

CREATE TABLE membership_code (
	membership_code_id VARCHAR(16) NOT NULL PRIMARY KEY,
    message VARCHAR(64) NOT NULL
);

CREATE TABLE membership (
	membership_id VARCHAR(36) NOT NULL PRIMARY KEY,
    contact_id VARCHAR(36) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    membership_code_id VARCHAR(16) NOT NULL,
    FOREIGN KEY (contact_id) REFERENCES contact(contact_id),
    FOREIGN KEY (membership_code_id) REFERENCES membership_code(membership_code_id)
);

CREATE TABLE member_point_transaction_reason (
	member_point_transaction_reason_id VARCHAR(16) NOT NULL PRIMARY KEY,
    message VARCHAR(128) NOT NULL
);

CREATE TABLE member_point_transaction (
	member_point_transaction_id VARCHAR(36) NOT NULL PRIMARY KEY,
    member_point_transaction_reason_id VARCHAR(16) NOT NULL,
    contact_id VARCHAR(36) NOT NULL,
    point_value INT NOT NULL,
	`timestamp` DATETIME NOT NULL DEFAULT NOW(),
    FOREIGN KEY (contact_id) REFERENCES contact(contact_id),
    FOREIGN KEY (member_point_transaction_reason_id) REFERENCES member_point_transaction_reason(member_point_transaction_reason_id)
);

/* Events */

CREATE TABLE `event` (
	event_id VARCHAR(36) NOT NULL PRIMARY KEY,
    title VARCHAR(128) NOT NULL,
    `description` TEXT(1024),
    `datetime` DATETIME NOT NULL,
    duration FLOAT,
    point_value INT NOT NULL DEFAULT 0
);

CREATE TABLE `event_attendance` (
	event_attendance_id VARCHAR(36) NOT NULL PRIMARY KEY,
    event_id VARCHAR(36) NOT NULL,
    contact_id VARCHAR(36),
    `timestamp` DATETIME NOT NULL DEFAULT NOW(),
    swag BOOL NOT NULL DEFAULT false,
	FOREIGN KEY (event_id) REFERENCES `event`(event_id),
    FOREIGN KEY (contact_id) REFERENCES contact(contact_id)
);

/* Auth */

CREATE TABLE `user` (
	user_id VARCHAR(36) NOT NULL PRIMARY KEY,
	email VARCHAR(64) NOT NULL UNIQUE,
	password_hash VARCHAR(64) NOT NULL,
	`role` VARCHAR(16) NOT NULL,
	first_name VARCHAR(64) NOT NULL,
	last_name VARCHAR(64) NOT NULL
);

/* LOAD STATIC DATA */

INSERT INTO shirt_size
    (shirt_size_id, message)
VALUES
	("xxxs", "Triple Extra Small"),
    ("xxs", "Double Extra Small"),
	("xs", "Extra Small"),
	("sm", "Small"),
	("med", "Medium"),
	("lg", "Large"),
	("xl", "Extra Large"),
    ("xxl", "Double Extra Large"),
    ("xxxl", "Triple Extra Large");

INSERT INTO membership_code
    (membership_code_id, message)
VALUES
	("mc-p", "Payment"),
	("mc-ps", "Payment via Stripe"),
	("mc-pv", "Payment via Venmo"),
    ("mc-pc", "Payment via Cash"),
	("mc-i", "Involvement"),
	("mc-io", "Involvement as Officer"),
	("mc-iv", "Involvement as Volunteer"),
    ("mc-it", "Involvement as Tutor");
    
INSERT INTO member_point_transaction_reason
    (member_point_transaction_reason_id, message)
VALUES
	("mpt-general", "Point Grant"),
	("mpt-purchase", "Points Spent"),
	("mpt-event", "Attended Event");