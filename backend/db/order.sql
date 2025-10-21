-- SEQUENCE: public.products_product_id_seq

-- DROP SEQUENCE IF EXISTS public.products_product_id_seq;

-- SEQUENCE: public.products_product_id_seq

-- DROP SEQUENCE IF EXISTS public.products_product_id_seq;

CREATE SEQUENCE IF NOT EXISTS public.products_product_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;




-- Table: public.products

-- DROP TABLE IF EXISTS public.products;

CREATE TABLE IF NOT EXISTS public.products
(
    product_id integer NOT NULL DEFAULT nextval('products_product_id_seq'::regclass),
    product_name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    product_description text COLLATE pg_catalog."default",
    price numeric(10,2) NOT NULL,
    category character varying(100) COLLATE pg_catalog."default",
    product_image bytea,
    final_product_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT products_pkey PRIMARY KEY (product_id),
    CONSTRAINT fk_products_final_product FOREIGN KEY (final_product_id)
        REFERENCES public.final_products (fproduct_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    CONSTRAINT products_name_not_empty CHECK (length(TRIM(BOTH FROM product_name)) > 0),
    CONSTRAINT products_price_positive CHECK (price >= 0::numeric)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.products
    OWNER to postgres;

COMMENT ON TABLE public.products
    IS 'Products catalog table linked to final products inventory';

COMMENT ON COLUMN public.products.product_id
    IS 'Primary key - unique product identifier';

COMMENT ON COLUMN public.products.product_name
    IS 'Product name displayed to customers';

COMMENT ON COLUMN public.products.product_description
    IS 'Detailed product description';

COMMENT ON COLUMN public.products.price
    IS 'Product price in LKR';

COMMENT ON COLUMN public.products.category
    IS 'Product category for filtering';

COMMENT ON COLUMN public.products.product_image
    IS 'Product image stored as binary data';

COMMENT ON COLUMN public.products.final_product_id
    IS 'Foreign key linking to final_products.fproduct_id for inventory stock lookup';

COMMENT ON COLUMN public.products.created_at
    IS 'Timestamp when product was created';

COMMENT ON COLUMN public.products.updated_at
    IS 'Timestamp when product was last updated';
-- Index: idx_products_category

-- DROP INDEX IF EXISTS public.idx_products_category;

CREATE INDEX IF NOT EXISTS idx_products_category
    ON public.products USING btree
    (category COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: idx_products_created_at

-- DROP INDEX IF EXISTS public.idx_products_created_at;

CREATE INDEX IF NOT EXISTS idx_products_created_at
    ON public.products USING btree
    (created_at ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: idx_products_final_product_id

-- DROP INDEX IF EXISTS public.idx_products_final_product_id;

CREATE INDEX IF NOT EXISTS idx_products_final_product_id
    ON public.products USING btree
    (final_product_id ASC NULLS LAST)
    TABLESPACE pg_default;

ALTER SEQUENCE public.products_product_id_seq
    OWNED BY public.products.product_id;

ALTER SEQUENCE public.products_product_id_seq
    OWNER TO postgres;





-- SEQUENCE: public.orders_order_id_seq

-- DROP SEQUENCE IF EXISTS public.orders_order_id_seq;

CREATE SEQUENCE IF NOT EXISTS public.orders_order_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;



    -- Table: public.orders

-- DROP TABLE IF EXISTS public.orders;

CREATE TABLE IF NOT EXISTS public.orders
(
    order_id integer NOT NULL DEFAULT nextval('orders_order_id_seq'::regclass),
    cus_id integer NOT NULL,
    total_price numeric(10,2) NOT NULL,
    order_status character varying(20) COLLATE pg_catalog."default" DEFAULT 'pending'::character varying,
    payment_status character varying(20) COLLATE pg_catalog."default" DEFAULT 'pending'::character varying,
    order_date timestamp without time zone DEFAULT now(),
    discount_id integer,
    discount_amount numeric DEFAULT 0,
    delivery_address text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT orders_pkey PRIMARY KEY (order_id),
    CONSTRAINT orders_discount_id_fkey FOREIGN KEY (discount_id)
        REFERENCES public."Discount" (discount_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.orders
    OWNER to postgres;

COMMENT ON COLUMN public.orders.delivery_address
    IS 'Delivery address for the order - can be customer default address or custom address';


ALTER SEQUENCE public.orders_order_id_seq
    OWNED BY public.orders.order_id;

ALTER SEQUENCE public.orders_order_id_seq
    OWNER TO postgres;

-- FUNCTION: public.sync_payment_status_to_order()

-- DROP FUNCTION IF EXISTS public.sync_payment_status_to_order();

CREATE OR REPLACE FUNCTION public.sync_payment_status_to_order()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
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
$BODY$;

ALTER FUNCTION public.sync_payment_status_to_order()
    OWNER TO postgres;

COMMENT ON FUNCTION public.sync_payment_status_to_order()
    IS 'Syncs payment_status from payments to orders table';



-- SEQUENCE: public.order_items_item_id_seq

-- DROP SEQUENCE IF EXISTS public.order_items_item_id_seq;

CREATE SEQUENCE IF NOT EXISTS public.order_items_item_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;




    
-- Table: public.order_items

-- DROP TABLE IF EXISTS public.order_items;

CREATE TABLE IF NOT EXISTS public.order_items
(
    item_id integer NOT NULL DEFAULT nextval('order_items_item_id_seq'::regclass),
    order_id integer,
    product_id integer NOT NULL,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    CONSTRAINT order_items_pkey PRIMARY KEY (item_id),
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id)
        REFERENCES public.products (product_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id)
        REFERENCES public.orders (order_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.order_items
    OWNER to postgres;




-- Trigger: trg_decrement_final_product_stock

-- DROP TRIGGER IF EXISTS trg_decrement_final_product_stock ON public.order_items;

CREATE OR REPLACE FUNCTION public.decrement_final_product_stock_on_order_item()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
DECLARE
  v_final_product_id INTEGER;
BEGIN
  -- Find the mapped final product for the ordered product
  SELECT final_product_id
  INTO v_final_product_id
  FROM products
  WHERE product_id = NEW.product_id;

  -- If product maps to a final product, decrement its quantity
  IF v_final_product_id IS NOT NULL THEN
    UPDATE final_products
    SET quantity = GREATEST(0, quantity - NEW.quantity)
    WHERE fproduct_id = v_final_product_id;
  END IF;

  RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.decrement_final_product_stock_on_order_item()
    OWNER TO postgres;

CREATE OR REPLACE TRIGGER trg_decrement_final_product_stock
    AFTER INSERT
    ON public.order_items
    FOR EACH ROW
    EXECUTE FUNCTION public.decrement_final_product_stock_on_order_item();


-- FUNCTION: public.decrement_final_product_stock_on_order_item()

-- DROP FUNCTION IF EXISTS public.decrement_final_product_stock_on_order_item();




ALTER SEQUENCE public.order_items_item_id_seq
    OWNED BY public.order_items.item_id;

ALTER SEQUENCE public.order_items_item_id_seq
    OWNER TO postgres;

-- SEQUENCE: public.notifications_seq

-- DROP SEQUENCE IF EXISTS public.notifications_seq;

CREATE SEQUENCE IF NOT EXISTS public.notifications_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;


-- Table: public.notifications

-- DROP TABLE IF EXISTS public.notifications;

CREATE TABLE IF NOT EXISTS public.notifications
(
    notification_id integer NOT NULL DEFAULT nextval('notifications_seq'::regclass),
    cus_id integer NOT NULL,
    order_id integer,
    notification text COLLATE pg_catalog."default" NOT NULL,
    notification_type character varying(50) COLLATE pg_catalog."default" DEFAULT 'order_update'::character varying,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT notifications_pkey PRIMARY KEY (notification_id),
    CONSTRAINT notifications_cus_id_fkey FOREIGN KEY (cus_id)
        REFERENCES public.customers (cus_id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.notifications
    OWNER to postgres;
-- Index: idx_notifications_created_at

-- DROP INDEX IF EXISTS public.idx_notifications_created_at;

CREATE INDEX IF NOT EXISTS idx_notifications_created_at
    ON public.notifications USING btree
    (created_at DESC NULLS FIRST)
    TABLESPACE pg_default;
-- Index: idx_notifications_cus_id

-- DROP INDEX IF EXISTS public.idx_notifications_cus_id;

CREATE INDEX IF NOT EXISTS idx_notifications_cus_id
    ON public.notifications USING btree
    (cus_id ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: idx_notifications_is_read

-- DROP INDEX IF EXISTS public.idx_notifications_is_read;

CREATE INDEX IF NOT EXISTS idx_notifications_is_read
    ON public.notifications USING btree
    (is_read ASC NULLS LAST)
    TABLESPACE pg_default;

-- Trigger: trg_notifications_updated_at

-- DROP TRIGGER IF EXISTS trg_notifications_updated_at ON public.notifications;

CREATE OR REPLACE FUNCTION public.update_notifications_updated_at()
    RETURNS trigger
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE NOT LEAKPROOF
AS $BODY$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.update_notifications_updated_at()
    OWNER TO postgres;


CREATE OR REPLACE TRIGGER trg_notifications_updated_at
    BEFORE UPDATE 
    ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_notifications_updated_at();


-- FUNCTION: public.update_notifications_updated_at()

-- DROP FUNCTION IF EXISTS public.update_notifications_updated_at();


ALTER SEQUENCE public.notifications_seq
    OWNED BY public.notifications.notification_id;

ALTER SEQUENCE public.notifications_seq
    OWNER TO postgres;