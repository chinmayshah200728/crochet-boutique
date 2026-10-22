CREATE INDEX orders_date_idx ON orders(created_at);
--> statement-breakpoint
CREATE INDEX items_order_idx ON order_items(order_id);
--> statement-breakpoint
CREATE INDEX products_status_idx ON products(status);
--> statement-breakpoint
CREATE TRIGGER reserve_inventory BEFORE INSERT ON order_items
BEGIN
 SELECT CASE WHEN NEW.quantity < 1 OR NOT EXISTS (SELECT 1 FROM products WHERE id=NEW.product_id AND status='active' AND stock>=NEW.quantity AND price=NEW.price) THEN RAISE(ABORT,'Product availability changed') END;
 UPDATE products SET stock=stock-NEW.quantity WHERE id=NEW.product_id;
END;
--> statement-breakpoint
CREATE TRIGGER restore_cancelled_inventory AFTER UPDATE OF status ON orders
WHEN NEW.status='cancelled' AND OLD.status!='cancelled'
BEGIN
 UPDATE products SET stock=stock+COALESCE((SELECT SUM(quantity) FROM order_items WHERE order_id=NEW.id AND product_id=products.id),0) WHERE id IN (SELECT product_id FROM order_items WHERE order_id=NEW.id);
END;
--> statement-breakpoint
CREATE TRIGGER cancelled_is_final BEFORE UPDATE OF status ON orders
WHEN OLD.status='cancelled' AND NEW.status!='cancelled'
BEGIN
 SELECT RAISE(ABORT,'Cancelled orders cannot be reopened');
END;
