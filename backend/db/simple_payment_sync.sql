-- =========================
-- Simple Payment Status Sync
-- =========================

-- This script creates a simple trigger to sync payment_status 
-- from payments table to orders table

-- 1. First, add order_id to payments table if it doesn't exist
ALTER TABLE public.payments 
ADD COLUMN IF NOT EXISTS order_id integer;

-- 2. Create a function to sync payment status to orders
CREATE OR REPLACE FUNCTION sync_payment_status_to_order()
RETURNS TRIGGER AS $$
BEGIN
    -- When payment_status is updated in payments table,
    -- update the corresponding order's payment_status
    IF NEW.order_id IS NOT NULL THEN
        UPDATE public.orders 
        SET payment_status = NEW.payment_status
        WHERE order_id = NEW.order_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Create trigger to automatically sync payment status
DROP TRIGGER IF EXISTS trg_sync_payment_status ON public.payments;
CREATE TRIGGER trg_sync_payment_status
    AFTER UPDATE OF payment_status ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION sync_payment_status_to_order();

-- 4. Add comment for documentation
COMMENT ON FUNCTION sync_payment_status_to_order() IS 'Syncs payment_status from payments to orders table';
