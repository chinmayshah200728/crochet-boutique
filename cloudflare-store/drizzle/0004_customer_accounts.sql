CREATE TABLE customers (
 id TEXT PRIMARY KEY NOT NULL,
 name TEXT NOT NULL,
 email TEXT NOT NULL COLLATE NOCASE UNIQUE,
 password_hash TEXT NOT NULL,
 salt TEXT NOT NULL,
 recovery_hash TEXT NOT NULL,
 credential_version INTEGER NOT NULL DEFAULT 1,
 created_at TEXT NOT NULL
);
CREATE TABLE customer_sessions (
 token_hash TEXT PRIMARY KEY NOT NULL,
 customer_id TEXT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
 credential_version INTEGER NOT NULL DEFAULT 1,
 expires INTEGER NOT NULL
);
CREATE INDEX customer_sessions_owner ON customer_sessions(customer_id);
ALTER TABLE orders ADD COLUMN customer_id TEXT REFERENCES customers(id);
CREATE INDEX orders_customer ON orders(customer_id,created_at);
ALTER TABLE order_items ADD COLUMN model_snapshot TEXT NOT NULL DEFAULT '';
