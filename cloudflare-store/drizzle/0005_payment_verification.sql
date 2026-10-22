ALTER TABLE orders ADD COLUMN bank_reference TEXT;
--> statement-breakpoint
ALTER TABLE orders ADD COLUMN verified_amount INTEGER;
--> statement-breakpoint
ALTER TABLE orders ADD COLUMN verified_at TEXT;
--> statement-breakpoint
CREATE UNIQUE INDEX unique_bank_credit ON orders(bank_reference) WHERE bank_reference IS NOT NULL;
--> statement-breakpoint
CREATE TRIGGER payment_required_for_fulfilment BEFORE UPDATE OF status ON orders
WHEN NEW.status IN ('paid','making','shipped','completed') AND
 (NEW.verified_at IS NULL OR NEW.bank_reference IS NULL OR NEW.verified_amount IS NULL OR NEW.verified_amount != NEW.total)
BEGIN
 SELECT RAISE(ABORT,'Verify the bank credit before fulfilment');
END;
--> statement-breakpoint
CREATE TRIGGER verified_payment_is_fixed BEFORE UPDATE OF bank_reference,verified_amount,verified_at ON orders
WHEN OLD.verified_at IS NOT NULL AND
 (NEW.bank_reference IS NOT OLD.bank_reference OR NEW.verified_amount IS NOT OLD.verified_amount OR NEW.verified_at IS NOT OLD.verified_at)
BEGIN
 SELECT RAISE(ABORT,'Verified credit cannot be replaced');
END;
