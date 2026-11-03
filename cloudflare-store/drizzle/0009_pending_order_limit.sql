CREATE TRIGGER IF NOT EXISTS limit_pending_orders BEFORE INSERT ON orders
WHEN NEW.status='awaiting_payment' AND NEW.customer_id IS NOT NULL
BEGIN
 SELECT CASE WHEN (SELECT COUNT(*) FROM orders WHERE customer_id=NEW.customer_id AND status='awaiting_payment') >= 3 THEN RAISE(ABORT,'pending_order_limit') END;
END;
