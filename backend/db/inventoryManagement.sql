-- =========================
-- STORAGE ZONE
-- =========================
CREATE SEQUENCE IF NOT EXISTS public.storage_zone_storage_zone_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

CREATE TABLE IF NOT EXISTS public.storage_zone
(
    storage_zone_id integer NOT NULL DEFAULT nextval('storage_zone_storage_zone_id_seq'::regclass),
    zone_name varchar(100) NOT NULL,
    capacity integer NOT NULL,
    used_capacity integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT storage_zone_pkey PRIMARY KEY (storage_zone_id),
    CONSTRAINT storage_zone_check CHECK (used_capacity <= capacity)
);

ALTER SEQUENCE public.storage_zone_storage_zone_id_seq
    OWNED BY public.storage_zone.storage_zone_id;

ALTER TABLE IF EXISTS public.storage_zone
    OWNER TO postgres;


-- =========================
-- INGREDIENTS
-- =========================
CREATE SEQUENCE IF NOT EXISTS public.ingredients_ingredient_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

CREATE TABLE IF NOT EXISTS public.ingredients
(
    ingredient_id integer NOT NULL DEFAULT nextval('ingredients_ingredient_id_seq'::regclass),
    name text NOT NULL,
    quantity integer NOT NULL,
    expiry_date date NOT NULL,
    storage_zone_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ingredients_pkey PRIMARY KEY (ingredient_id),
    CONSTRAINT ingredients_storage_zone_id_fkey FOREIGN KEY (storage_zone_id)
        REFERENCES public.storage_zone (storage_zone_id)
        ON UPDATE NO ACTION
        ON DELETE SET NULL
);

ALTER SEQUENCE public.ingredients_ingredient_id_seq
    OWNED BY public.ingredients.ingredient_id;

ALTER TABLE IF EXISTS public.ingredients
    OWNER TO postgres;


-- =========================
-- SPECIAL INGREDIENT
-- =========================
CREATE SEQUENCE IF NOT EXISTS public.special_ingredient_special_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

CREATE TABLE IF NOT EXISTS public.special_ingredient
(
    special_id integer NOT NULL DEFAULT nextval('special_ingredient_special_id_seq'::regclass),
    name text NOT NULL,
    quantity integer NOT NULL,
    expiry_date date NOT NULL,
    storage_zone_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT special_ingredient_pkey PRIMARY KEY (special_id),
    CONSTRAINT special_ingredient_storage_zone_id_fkey FOREIGN KEY (storage_zone_id)
        REFERENCES public.storage_zone (storage_zone_id)
        ON UPDATE NO ACTION
        ON DELETE CASCADE
);

ALTER SEQUENCE public.special_ingredient_special_id_seq
    OWNED BY public.special_ingredient.special_id;

ALTER TABLE IF EXISTS public.special_ingredient
    OWNER TO postgres;


-- =========================
-- FINAL PRODUCTS
-- =========================
CREATE SEQUENCE IF NOT EXISTS public.final_products_fproduct_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

CREATE TABLE IF NOT EXISTS public.final_products
(
    fproduct_id integer NOT NULL DEFAULT nextval('final_products_fproduct_id_seq'::regclass),
    pname text NOT NULL,
    batch_no text NOT NULL,
    quantity integer NOT NULL,
    expiry_date date NOT NULL,
    storage_zone_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT final_products_pkey PRIMARY KEY (fproduct_id),
    CONSTRAINT final_products_storage_zone_id_fkey FOREIGN KEY (storage_zone_id)
        REFERENCES public.storage_zone (storage_zone_id)
        ON UPDATE NO ACTION
        ON DELETE SET NULL
);

ALTER SEQUENCE public.final_products_fproduct_id_seq
    OWNED BY public.final_products.fproduct_id;

ALTER TABLE IF EXISTS public.final_products
    OWNER TO postgres;
