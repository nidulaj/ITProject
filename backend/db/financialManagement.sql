-- 1. Create sequence first (no OWNED BY yet)
CREATE SEQUENCE IF NOT EXISTS public."Discount_discount_id_seq"
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
    OWNED BY public.payments.payment_id;