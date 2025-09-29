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