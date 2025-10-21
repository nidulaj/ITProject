-- 1. Create sequence first (no OWNED BY yet)
/*CREATE SEQUENCE IF NOT EXISTS public."Discount_discount_id_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER SEQUENCE public."Discount_discount_id_seq"
    OWNER TO postgres;

-- 2. Create table using that sequence as default
CREATE TABLE IF NOT EXISTS public."Discount"
(
    discount_id integer NOT NULL DEFAULT nextval('"Discount_discount_id_seq"'::regclass),
    discount_name character varying COLLATE pg_catalog."default" NOT NULL,
    discount_type character varying COLLATE pg_catalog."default" NOT NULL,
    value numeric NOT NULL,
    eligibility_criteria character varying COLLATE pg_catalog."default" NOT NULL,
    valid_from date NOT NULL,
    valid_to date NOT NULL,
    CONSTRAINT "Discount_pkey" PRIMARY KEY (discount_id)
);

ALTER TABLE IF EXISTS public."Discount"
    OWNER to postgres;

-- 3. Finally, bind sequence to column
ALTER SEQUENCE public."Discount_discount_id_seq"
    OWNED BY public."Discount".discount_id;

-- 1. Create sequence first (no OWNED BY yet)
CREATE SEQUENCE IF NOT EXISTS public.payments_payment_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER SEQUENCE public.payments_payment_id_seq
    OWNER TO postgres;

-- 2. Create table using that sequence as default
CREATE TABLE IF NOT EXISTS public.payments
(
    payment_id integer NOT NULL DEFAULT nextval('payments_payment_id_seq'::regclass),
    customer_name character varying COLLATE pg_catalog."default" NOT NULL,
    amount numeric,
    payment_status character varying COLLATE pg_catalog."default",
    payment_date date,
    payment_proof character varying(255) COLLATE pg_catalog."default",
    CONSTRAINT payments_pkey PRIMARY KEY (payment_id)
);

ALTER TABLE IF EXISTS public.payments
    OWNER to postgres;

-- 3. Finally, bind sequence to column
ALTER SEQUENCE public.payments_payment_id_seq
    OWNED BY public.payments.payment_id;*/







-- ===========================================================
-- 1️⃣  SEQUENCES
-- ===========================================================

-- Sequence for Discount Table
CREATE SEQUENCE IF NOT EXISTS public."Discount_discount_id_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER SEQUENCE public."Discount_discount_id_seq"
    OWNER TO postgres;

-- Sequence for Payments Table
CREATE SEQUENCE IF NOT EXISTS public.payments_payment_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1;

ALTER SEQUENCE public.payments_payment_id_seq
    OWNER TO postgres;



-- ===========================================================
-- 2️⃣  TABLES
-- ===========================================================

-- Table: public.Discount
CREATE TABLE IF NOT EXISTS public."Discount"
(
    discount_id integer NOT NULL DEFAULT nextval('"Discount_discount_id_seq"'::regclass),
    discount_name character varying NOT NULL,
    discount_type character varying NOT NULL,
    value numeric NOT NULL,
    eligibility_criteria character varying NOT NULL,
    valid_from date NOT NULL,
    valid_to date NOT NULL,
    discount_code character varying(20),
    CONSTRAINT "Discount_pkey" PRIMARY KEY (discount_id),
    CONSTRAINT "Discount_discount_code_key" UNIQUE (discount_code)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Discount"
    OWNER TO postgres;



-- Table: public.payments
CREATE TABLE IF NOT EXISTS public.payments
(
    payment_id integer NOT NULL DEFAULT nextval('payments_payment_id_seq'::regclass),
    customer_name character varying NOT NULL,
    amount numeric,
    payment_status character varying,
    payment_date date,
    payment_proof character varying(255),
    order_id integer,
    CONSTRAINT payments_pkey PRIMARY KEY (payment_id),
    CONSTRAINT fk_payments_order_id FOREIGN KEY (order_id)
        REFERENCES public.orders (order_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.payments
    OWNER TO postgres;



-- ===========================================================
-- 3️⃣  INDEXES
-- ===========================================================

-- Index for Discount Code
CREATE INDEX IF NOT EXISTS idx_discount_code
    ON public."Discount" USING btree
    (discount_code ASC NULLS LAST)
    TABLESPACE pg_default;

-- Index for Payment Order ID
CREATE INDEX IF NOT EXISTS idx_payments_order_id
    ON public.payments USING btree
    (order_id ASC NULLS LAST)
    TABLESPACE pg_default;



-- ===========================================================
-- 4️⃣  TRIGGERS
-- ===========================================================

-- Trigger: trg_sync_payment_status
CREATE OR REPLACE TRIGGER trg_sync_payment_status
    AFTER UPDATE OF payment_status
    ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_payment_status_to_order();
