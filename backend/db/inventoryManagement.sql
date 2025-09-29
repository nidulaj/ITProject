-- =========================
-- INGREDIENT TOTALS TABLE
-- =========================
CREATE SEQUENCE IF NOT EXISTS public.ingredient_totals_total_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

CREATE TABLE IF NOT EXISTS public.ingredient_totals
(
    total_id integer NOT NULL DEFAULT nextval('ingredient_totals_total_id_seq'::regclass),
    icode_id integer NOT NULL,
    total_quantity integer NOT NULL DEFAULT 0,
    last_updated timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ingredient_totals_pkey PRIMARY KEY (total_id),
    CONSTRAINT ingredient_totals_icode_id_fkey FOREIGN KEY (icode_id)
        REFERENCES public.icode (ingredient_id)
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT ingredient_totals_unique_icode UNIQUE (icode_id)
);

ALTER SEQUENCE public.ingredient_totals_total_id_seq
    OWNED BY public.ingredient_totals.total_id;

ALTER TABLE IF EXISTS public.ingredient_totals
    OWNER TO postgres;


-- =========================
-- FUNCTIONS FOR AUTOMATIC UPDATES
-- =========================

-- Function to update totals for a specific icode
CREATE OR REPLACE FUNCTION update_ingredient_total(icode_id_param integer)
RETURNS void AS $$
DECLARE
    total_qty integer;
BEGIN
    -- Calculate total quantity for this icode
    SELECT COALESCE(SUM(quantity), 0) INTO total_qty
    FROM ingredients 
    WHERE icode_id = icode_id_param;
    
    -- Update or insert the total
    INSERT INTO ingredient_totals (icode_id, total_quantity, last_updated)
    VALUES (icode_id_param, total_qty, CURRENT_TIMESTAMP)
    ON CONFLICT (icode_id) 
    DO UPDATE SET 
        total_quantity = EXCLUDED.total_quantity,
        last_updated = CURRENT_TIMESTAMP;
END;
$$ LANGUAGE plpgsql;

-- Function to recalculate all totals (for initialization)
CREATE OR REPLACE FUNCTION recalculate_all_ingredient_totals()
RETURNS void AS $$
BEGIN
    -- Clear existing totals
    DELETE FROM ingredient_totals;
    
    -- Insert new totals
    INSERT INTO ingredient_totals (icode_id, total_quantity, last_updated)
    SELECT icode_id, SUM(quantity), CURRENT_TIMESTAMP
    FROM ingredients 
    WHERE icode_id IS NOT NULL
    GROUP BY icode_id;
END;
$$ LANGUAGE plpgsql;


-- =========================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =========================

-- Trigger function for ingredient changes
CREATE OR REPLACE FUNCTION trigger_update_ingredient_totals()
RETURNS TRIGGER AS $$
BEGIN
    -- Handle INSERT
    IF TG_OP = 'INSERT' THEN
        IF NEW.icode_id IS NOT NULL THEN
            PERFORM update_ingredient_total(NEW.icode_id);
        END IF;
        RETURN NEW;
    END IF;
    
    -- Handle UPDATE
    IF TG_OP = 'UPDATE' THEN
        -- Update totals for both old and new icode (in case icode changed)
        IF OLD.icode_id IS NOT NULL THEN
            PERFORM update_ingredient_total(OLD.icode_id);
        END IF;
        IF NEW.icode_id IS NOT NULL AND NEW.icode_id != OLD.icode_id THEN
            PERFORM update_ingredient_total(NEW.icode_id);
        END IF;
        RETURN NEW;
    END IF;
    
    -- Handle DELETE
    IF TG_OP = 'DELETE' THEN
        IF OLD.icode_id IS NOT NULL THEN
            PERFORM update_ingredient_total(OLD.icode_id);
        END IF;
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trigger_ingredients_insert ON ingredients;
DROP TRIGGER IF EXISTS trigger_ingredients_update ON ingredients;
DROP TRIGGER IF EXISTS trigger_ingredients_delete ON ingredients;

CREATE TRIGGER trigger_ingredients_insert
    AFTER INSERT ON ingredients
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_ingredient_totals();

CREATE TRIGGER trigger_ingredients_update
    AFTER UPDATE ON ingredients
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_ingredient_totals();

CREATE TRIGGER trigger_ingredients_delete
    AFTER DELETE ON ingredients
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_ingredient_totals();


-- =========================
-- INGREDIENT REQUEST TRIGGERS
-- =========================

-- Function to reduce ingredient totals when request is accepted
CREATE OR REPLACE FUNCTION reduce_totals_on_request_accept()
RETURNS TRIGGER AS $$
BEGIN
    -- Only process when status changes to 'accept'
    IF NEW.status = 'accept' AND (OLD.status IS NULL OR OLD.status != 'accept') THEN
        
        -- Reduce totals based on ingredient mappings
        -- ICD002 = Total Milk (icode_id: 2)
        IF NEW.total_milk > 0 THEN
            UPDATE ingredient_totals 
            SET total_quantity = GREATEST(0, total_quantity - NEW.total_milk),
                last_updated = CURRENT_TIMESTAMP
            WHERE icode_id = 2;
        END IF;
        
        -- ICD003 = Total Sugar (icode_id: 3)
        IF NEW.total_sugar > 0 THEN
            UPDATE ingredient_totals 
            SET total_quantity = GREATEST(0, total_quantity - NEW.total_sugar),
                last_updated = CURRENT_TIMESTAMP
            WHERE icode_id = 3;
        END IF;
        
        -- ICD004 = Total strawberry (icode_id: 4)
        IF NEW.total_strawberry > 0 THEN
            UPDATE ingredient_totals 
            SET total_quantity = GREATEST(0, total_quantity - NEW.total_strawberry),
                last_updated = CURRENT_TIMESTAMP
            WHERE icode_id = 4;
        END IF;
        
        -- ICD005 = Total culture (icode_id: 5)
        IF NEW.total_culture > 0 THEN
            UPDATE ingredient_totals 
            SET total_quantity = GREATEST(0, total_quantity - NEW.total_culture),
                last_updated = CURRENT_TIMESTAMP
            WHERE icode_id = 5;
        END IF;
        
        -- ICD006 = Total blueberry (icode_id: 6)
        IF NEW.total_blueberry > 0 THEN
            UPDATE ingredient_totals 
            SET total_quantity = GREATEST(0, total_quantity - NEW.total_blueberry),
                last_updated = CURRENT_TIMESTAMP
            WHERE icode_id = 6;
        END IF;
        
        -- ICD007 = Total mango (icode_id: 7)
        IF NEW.total_mango > 0 THEN
            UPDATE ingredient_totals 
            SET total_quantity = GREATEST(0, total_quantity - NEW.total_mango),
                last_updated = CURRENT_TIMESTAMP
            WHERE icode_id = 7;
        END IF;
        
        -- ICD008 = Total chocolate sirup (icode_id: 8)
        IF NEW.total_topping1 > 0 THEN
            UPDATE ingredient_totals 
            SET total_quantity = GREATEST(0, total_quantity - NEW.total_topping1),
                last_updated = CURRENT_TIMESTAMP
            WHERE icode_id = 8;
        END IF;
        
        -- ICD009 = Total strawberry sirup (icode_id: 9)
        IF NEW.total_topping2 > 0 THEN
            UPDATE ingredient_totals 
            SET total_quantity = GREATEST(0, total_quantity - NEW.total_topping2),
                last_updated = CURRENT_TIMESTAMP
            WHERE icode_id = 9;
        END IF;
        
        -- ICD010 = Total honey (icode_id: 10)
        IF NEW.total_topping3 > 0 THEN
            UPDATE ingredient_totals 
            SET total_quantity = GREATEST(0, total_quantity - NEW.total_topping3),
                last_updated = CURRENT_TIMESTAMP
            WHERE icode_id = 10;
        END IF;
        
        -- ICD011 = Total cashew (icode_id: 11)
        IF NEW.total_bottom1 > 0 THEN
            UPDATE ingredient_totals 
            SET total_quantity = GREATEST(0, total_quantity - NEW.total_bottom1),
                last_updated = CURRENT_TIMESTAMP
            WHERE icode_id = 11;
        END IF;
        
        -- ICD012 = Total peanut (icode_id: 12)
        IF NEW.total_bottom2 > 0 THEN
            UPDATE ingredient_totals 
            SET total_quantity = GREATEST(0, total_quantity - NEW.total_bottom2),
                last_updated = CURRENT_TIMESTAMP
            WHERE icode_id = 12;
        END IF;
        
        -- ICD013 = Total almond (icode_id: 13)
        IF NEW.total_bottom3 > 0 THEN
            UPDATE ingredient_totals 
            SET total_quantity = GREATEST(0, total_quantity - NEW.total_bottom3),
                last_updated = CURRENT_TIMESTAMP
            WHERE icode_id = 13;
        END IF;
        
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for ingredient requests
-- Note: Replace 'req_ingredients' with your actual table name for ingredient requests
DROP TRIGGER IF EXISTS trigger_req_ingredients_accept ON req_ingredients;

CREATE TRIGGER trigger_req_ingredients_accept
    AFTER UPDATE ON req_ingredients
    FOR EACH ROW
    EXECUTE FUNCTION reduce_totals_on_request_accept();