-- -- =========================
-- -- INGREDIENT TOTALS TABLE
-- -- =========================
-- CREATE SEQUENCE IF NOT EXISTS public.ingredient_totals_total_id_seq
--     INCREMENT 1
--     START 1
--     MINVALUE 1
--     MAXVALUE 2147483647
--     CACHE 1;

-- CREATE TABLE IF NOT EXISTS public.ingredient_totals
-- (
--     total_id integer NOT NULL DEFAULT nextval('ingredient_totals_total_id_seq'::regclass),
--     icode_id integer NOT NULL,
--     total_quantity integer NOT NULL DEFAULT 0,
--     last_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
--     CONSTRAINT ingredient_totals_pkey PRIMARY KEY (total_id),
--     CONSTRAINT ingredient_totals_icode_id_fkey FOREIGN KEY (icode_id)
--         REFERENCES public.icode (ingredient_id)
--         ON UPDATE NO ACTION
--         ON DELETE CASCADE,
--     CONSTRAINT ingredient_totals_unique_icode UNIQUE (icode_id)
-- );

-- ALTER SEQUENCE public.ingredient_totals_total_id_seq
--     OWNED BY public.ingredient_totals.total_id;

-- ALTER TABLE IF EXISTS public.ingredient_totals
--     OWNER TO postgres;


-- -- =========================
-- -- FUNCTIONS FOR AUTOMATIC UPDATES
-- -- =========================

-- -- Function to update totals for a specific icode
-- CREATE OR REPLACE FUNCTION update_ingredient_total(icode_id_param integer)
-- RETURNS void AS $$
-- DECLARE
--     total_qty integer;
-- BEGIN
--     -- Calculate total quantity for this icode
--     SELECT COALESCE(SUM(quantity), 0) INTO total_qty
--     FROM ingredients 
--     WHERE icode_id = icode_id_param;
    
--     -- Update or insert the total
--     INSERT INTO ingredient_totals (icode_id, total_quantity, last_updated)
--     VALUES (icode_id_param, total_qty, CURRENT_TIMESTAMP)
--     ON CONFLICT (icode_id) 
--     DO UPDATE SET 
--         total_quantity = EXCLUDED.total_quantity,
--         last_updated = CURRENT_TIMESTAMP;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- Function to recalculate all totals (for initialization)
-- CREATE OR REPLACE FUNCTION recalculate_all_ingredient_totals()
-- RETURNS void AS $$
-- BEGIN
--     -- Clear existing totals
--     DELETE FROM ingredient_totals;
    
--     -- Insert new totals
--     INSERT INTO ingredient_totals (icode_id, total_quantity, last_updated)
--     SELECT icode_id, SUM(quantity), CURRENT_TIMESTAMP
--     FROM ingredients 
--     WHERE icode_id IS NOT NULL
--     GROUP BY icode_id;
-- END;
-- $$ LANGUAGE plpgsql;


-- -- =========================
-- -- TRIGGERS FOR AUTOMATIC UPDATES
-- -- =========================

-- -- Trigger function for ingredient changes
-- CREATE OR REPLACE FUNCTION trigger_update_ingredient_totals()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     -- Handle INSERT
--     IF TG_OP = 'INSERT' THEN
--         IF NEW.icode_id IS NOT NULL THEN
--             PERFORM update_ingredient_total(NEW.icode_id);
--         END IF;
--         RETURN NEW;
--     END IF;
    
--     -- Handle UPDATE
--     IF TG_OP = 'UPDATE' THEN
--         -- Update totals for both old and new icode (in case icode changed)
--         IF OLD.icode_id IS NOT NULL THEN
--             PERFORM update_ingredient_total(OLD.icode_id);
--         END IF;
--         IF NEW.icode_id IS NOT NULL AND NEW.icode_id != OLD.icode_id THEN
--             PERFORM update_ingredient_total(NEW.icode_id);
--         END IF;
--         RETURN NEW;
--     END IF;
    
--     -- Handle DELETE
--     IF TG_OP = 'DELETE' THEN
--         IF OLD.icode_id IS NOT NULL THEN
--             PERFORM update_ingredient_total(OLD.icode_id);
--         END IF;
--         RETURN OLD;
--     END IF;
    
--     RETURN NULL;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- Create triggers
-- DROP TRIGGER IF EXISTS trigger_ingredients_insert ON ingredients;
-- DROP TRIGGER IF EXISTS trigger_ingredients_update ON ingredients;
-- DROP TRIGGER IF EXISTS trigger_ingredients_delete ON ingredients;

-- CREATE TRIGGER trigger_ingredients_insert
--     AFTER INSERT ON ingredients
--     FOR EACH ROW
--     EXECUTE FUNCTION trigger_update_ingredient_totals();

-- CREATE TRIGGER trigger_ingredients_update
--     AFTER UPDATE ON ingredients
--     FOR EACH ROW
--     EXECUTE FUNCTION trigger_update_ingredient_totals();

-- CREATE TRIGGER trigger_ingredients_delete
--     AFTER DELETE ON ingredients
--     FOR EACH ROW
--     EXECUTE FUNCTION trigger_update_ingredient_totals();


-- -- =========================
-- -- INGREDIENT REQUEST TRIGGERS
-- -- =========================

-- -- Function to reduce ingredient totals when request is accepted
-- CREATE OR REPLACE FUNCTION reduce_totals_on_request_accept()
-- RETURNS TRIGGER AS $$
-- BEGIN
--     -- Only process when status changes to 'accept'
--     IF NEW.status = 'accept' AND (OLD.status IS NULL OR OLD.status != 'accept') THEN
        
--         -- Reduce totals based on ingredient mappings
--         -- ICD002 = Total Milk (icode_id: 2)
--         IF NEW.total_milk > 0 THEN
--             UPDATE ingredient_totals 
--             SET total_quantity = GREATEST(0, total_quantity - NEW.total_milk),
--                 last_updated = CURRENT_TIMESTAMP
--             WHERE icode_id = 2;
--         END IF;
        
--         -- ICD003 = Total Sugar (icode_id: 3)
--         IF NEW.total_sugar > 0 THEN
--             UPDATE ingredient_totals 
--             SET total_quantity = GREATEST(0, total_quantity - NEW.total_sugar),
--                 last_updated = CURRENT_TIMESTAMP
--             WHERE icode_id = 3;
--         END IF;
        
--         -- ICD004 = Total strawberry (icode_id: 4)
--         IF NEW.total_strawberry > 0 THEN
--             UPDATE ingredient_totals 
--             SET total_quantity = GREATEST(0, total_quantity - NEW.total_strawberry),
--                 last_updated = CURRENT_TIMESTAMP
--             WHERE icode_id = 4;
--         END IF;
        
--         -- ICD005 = Total culture (icode_id: 5)
--         IF NEW.total_culture > 0 THEN
--             UPDATE ingredient_totals 
--             SET total_quantity = GREATEST(0, total_quantity - NEW.total_culture),
--                 last_updated = CURRENT_TIMESTAMP
--             WHERE icode_id = 5;
--         END IF;
        
--         -- ICD006 = Total blueberry (icode_id: 6)
--         IF NEW.total_blueberry > 0 THEN
--             UPDATE ingredient_totals 
--             SET total_quantity = GREATEST(0, total_quantity - NEW.total_blueberry),
--                 last_updated = CURRENT_TIMESTAMP
--             WHERE icode_id = 6;
--         END IF;
        
--         -- ICD007 = Total mango (icode_id: 7)
--         IF NEW.total_mango > 0 THEN
--             UPDATE ingredient_totals 
--             SET total_quantity = GREATEST(0, total_quantity - NEW.total_mango),
--                 last_updated = CURRENT_TIMESTAMP
--             WHERE icode_id = 7;
--         END IF;
        
--         -- ICD008 = Total chocolate sirup (icode_id: 8)
--         IF NEW.total_topping1 > 0 THEN
--             UPDATE ingredient_totals 
--             SET total_quantity = GREATEST(0, total_quantity - NEW.total_topping1),
--                 last_updated = CURRENT_TIMESTAMP
--             WHERE icode_id = 8;
--         END IF;
        
--         -- ICD009 = Total strawberry sirup (icode_id: 9)
--         IF NEW.total_topping2 > 0 THEN
--             UPDATE ingredient_totals 
--             SET total_quantity = GREATEST(0, total_quantity - NEW.total_topping2),
--                 last_updated = CURRENT_TIMESTAMP
--             WHERE icode_id = 9;
--         END IF;
        
--         -- ICD010 = Total honey (icode_id: 10)
--         IF NEW.total_topping3 > 0 THEN
--             UPDATE ingredient_totals 
--             SET total_quantity = GREATEST(0, total_quantity - NEW.total_topping3),
--                 last_updated = CURRENT_TIMESTAMP
--             WHERE icode_id = 10;
--         END IF;
        
--         -- ICD011 = Total cashew (icode_id: 11)
--         IF NEW.total_bottom1 > 0 THEN
--             UPDATE ingredient_totals 
--             SET total_quantity = GREATEST(0, total_quantity - NEW.total_bottom1),
--                 last_updated = CURRENT_TIMESTAMP
--             WHERE icode_id = 11;
--         END IF;
        
--         -- ICD012 = Total peanut (icode_id: 12)
--         IF NEW.total_bottom2 > 0 THEN
--             UPDATE ingredient_totals 
--             SET total_quantity = GREATEST(0, total_quantity - NEW.total_bottom2),
--                 last_updated = CURRENT_TIMESTAMP
--             WHERE icode_id = 12;
--         END IF;
        
--         -- ICD013 = Total almond (icode_id: 13)
--         IF NEW.total_bottom3 > 0 THEN
--             UPDATE ingredient_totals 
--             SET total_quantity = GREATEST(0, total_quantity - NEW.total_bottom3),
--                 last_updated = CURRENT_TIMESTAMP
--             WHERE icode_id = 13;
--         END IF;
        
--     END IF;
    
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- -- Create trigger for ingredient requests
-- -- Note: Replace 'req_ingredients' with your actual table name for ingredient requests
-- DROP TRIGGER IF EXISTS trigger_req_ingredients_accept ON req_ingredients;

-- CREATE TRIGGER trigger_req_ingredients_accept
--     AFTER UPDATE ON req_ingredients
--     FOR EACH ROW
--     EXECUTE FUNCTION reduce_totals_on_request_accept();

-- ============================================================
-- SMART DAIRY DATABASE STRUCTURE
-- ============================================================
-- Author: Ima Nethmi
-- Project: Smart Dairy
-- Description: Database schema for managing ingredients, requests,
--              storage zones, and final products.
-- ============================================================

-- ============================================================
-- CLEANUP OLD TABLES (Optional for fresh setup)
-- ============================================================
DROP TABLE IF EXISTS public.final_products CASCADE;
DROP TABLE IF EXISTS public.special_ingredient CASCADE;
DROP TABLE IF EXISTS public.requestbulk CASCADE;
DROP TABLE IF EXISTS public.ingredients CASCADE;
DROP TABLE IF EXISTS public.ingredient_totals CASCADE;
DROP TABLE IF EXISTS public.icode CASCADE;
DROP TABLE IF EXISTS public.storage_zone CASCADE;

-- ============================================================
-- TABLE: storage_zone
-- ============================================================
CREATE TABLE IF NOT EXISTS public.storage_zone
(
    storage_zone_id SERIAL PRIMARY KEY,
    zone_name VARCHAR(100) NOT NULL,
    capacity INTEGER NOT NULL,
    used_capacity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT storage_zone_check CHECK (used_capacity <= capacity)
);

ALTER TABLE public.storage_zone OWNER TO postgres;

-- ============================================================
-- TABLE: icode  (Ingredient Codes)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.icode
(
    ingredient_id SERIAL PRIMARY KEY,
    ingredient_code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.icode OWNER TO postgres;

-- ============================================================
-- TABLE: ingredient_totals
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ingredient_totals
(
    total_id SERIAL PRIMARY KEY,
    icode_id INTEGER NOT NULL UNIQUE,
    total_quantity INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ingredient_totals_icode_id_fkey FOREIGN KEY (icode_id)
        REFERENCES public.icode (ingredient_id)
        ON DELETE CASCADE
        ON UPDATE NO ACTION
);

ALTER TABLE public.ingredient_totals OWNER TO postgres;

-- ============================================================
-- TABLE: ingredients
-- ============================================================
CREATE TABLE IF NOT EXISTS public.ingredients
(
    ingredient_id SERIAL PRIMARY KEY,
    icode_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    expiry_date DATE NOT NULL,
    storage_zone_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT ingredients_icode_id_fkey FOREIGN KEY (icode_id)
        REFERENCES public.icode (ingredient_id)
        ON DELETE CASCADE
        ON UPDATE NO ACTION,
    CONSTRAINT ingredients_storage_zone_fkey FOREIGN KEY (storage_zone_id)
        REFERENCES public.storage_zone (storage_zone_id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);

ALTER TABLE public.ingredients OWNER TO postgres;

-- ============================================================
-- FUNCTION: trigger_update_ingredient_totals()
-- ============================================================
CREATE OR REPLACE FUNCTION public.trigger_update_ingredient_totals()
RETURNS TRIGGER AS $$
DECLARE
    total_qty INTEGER;
BEGIN
    -- Recalculate total quantity for the ingredient
    SELECT COALESCE(SUM(quantity), 0)
    INTO total_qty
    FROM public.ingredients
    WHERE icode_id = COALESCE(NEW.icode_id, OLD.icode_id);

    -- If the ingredient exists in totals, update it
    IF EXISTS (SELECT 1 FROM public.ingredient_totals WHERE icode_id = COALESCE(NEW.icode_id, OLD.icode_id)) THEN
        UPDATE public.ingredient_totals
        SET total_quantity = total_qty,
            last_updated = CURRENT_TIMESTAMP
        WHERE icode_id = COALESCE(NEW.icode_id, OLD.icode_id);
    ELSE
        -- Otherwise, insert new record
        INSERT INTO public.ingredient_totals (icode_id, total_quantity)
        VALUES (COALESCE(NEW.icode_id, OLD.icode_id), total_qty);
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- TRIGGERS ON ingredients
-- ============================================================
CREATE OR REPLACE TRIGGER trigger_ingredients_insert
AFTER INSERT ON public.ingredients
FOR EACH ROW
EXECUTE FUNCTION public.trigger_update_ingredient_totals();

CREATE OR REPLACE TRIGGER trigger_ingredients_update
AFTER UPDATE ON public.ingredients
FOR EACH ROW
EXECUTE FUNCTION public.trigger_update_ingredient_totals();

CREATE OR REPLACE TRIGGER trigger_ingredients_delete
AFTER DELETE ON public.ingredients
FOR EACH ROW
EXECUTE FUNCTION public.trigger_update_ingredient_totals();

-- ============================================================
-- TABLE: requestbulk  (Production requests for ingredients)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.requestbulk
(
    request_id SERIAL PRIMARY KEY,
    icd002 INTEGER DEFAULT 0,
    icd003 INTEGER DEFAULT 0,
    icd004 INTEGER DEFAULT 0,
    icd005 INTEGER DEFAULT 0,
    icd006 INTEGER DEFAULT 0,
    icd007 INTEGER DEFAULT 0,
    icd008 INTEGER DEFAULT 0,
    icd009 INTEGER DEFAULT 0,
    icd010 INTEGER DEFAULT 0,
    icd011 INTEGER DEFAULT 0,
    icd012 INTEGER DEFAULT 0,
    icd013 INTEGER DEFAULT 0,
    actions VARCHAR(255) DEFAULT 'Pending'
);

ALTER TABLE public.requestbulk OWNER TO postgres;

-- ============================================================
-- TABLE: special_ingredient
-- ============================================================
CREATE TABLE IF NOT EXISTS public.special_ingredient
(
    special_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    expiry_date DATE NOT NULL,
    storage_zone_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT special_ingredient_storage_zone_fkey FOREIGN KEY (storage_zone_id)
        REFERENCES public.storage_zone (storage_zone_id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);

ALTER TABLE public.special_ingredient OWNER TO postgres;

-- ============================================================
-- TABLE: final_products
-- ============================================================
CREATE TABLE IF NOT EXISTS public.final_products
(
    fproduct_id SERIAL PRIMARY KEY,
    pname TEXT NOT NULL,
    batch_no TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    expiry_date DATE NOT NULL,
    storage_zone_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT final_products_storage_zone_id_fkey FOREIGN KEY (storage_zone_id)
        REFERENCES public.storage_zone (storage_zone_id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION
);

ALTER TABLE public.final_products OWNER TO postgres;

-- ============================================================
-- END OF SMART DAIRY DATABASE
-- ============================================================

