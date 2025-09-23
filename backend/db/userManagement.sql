-- ============================
-- User Management Schema Setup
-- ============================

-- 1. Sequence: customer_seq
-- DROP SEQUENCE IF EXISTS public.customer_seq;

CREATE SEQUENCE IF NOT EXISTS public.customer_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

-- 2. Table: customers
CREATE TABLE IF NOT EXISTS public.customers
(
    cus_id integer NOT NULL DEFAULT nextval('customer_seq'::regclass),
    customer_code character varying COLLATE pg_catalog."default" NOT NULL,
    first_name character varying COLLATE pg_catalog."default" NOT NULL,
    last_name character varying COLLATE pg_catalog."default",
    email character varying COLLATE pg_catalog."default" NOT NULL,
    phone character varying COLLATE pg_catalog."default",
    address text COLLATE pg_catalog."default",
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    password character varying COLLATE pg_catalog."default" NOT NULL,
    "is_2FA_enabled" boolean DEFAULT false,
    is_email_verified boolean DEFAULT false,
    is_phone_verified boolean DEFAULT false,
    is_active boolean DEFAULT true,
    deleted_at timestamp without time zone,
    delete_type character varying COLLATE pg_catalog."default",
    permanent_delete_at timestamp without time zone,
    verification_code integer,
    verification_code_expires timestamp without time zone,
    google_id text COLLATE pg_catalog."default",
    CONSTRAINT customers_pkey PRIMARY KEY (cus_id),
    CONSTRAINT customer_email_unique UNIQUE (email)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.customers
    OWNER TO postgres;

-- 3. Index: customers_google_id_unique
-- DROP INDEX IF EXISTS public.customers_google_id_unique;

CREATE UNIQUE INDEX IF NOT EXISTS customers_google_id_unique
    ON public.customers USING btree
    (google_id COLLATE pg_catalog."default" ASC NULLS LAST)
    TABLESPACE pg_default
    WHERE google_id IS NOT NULL;

-- 4. Trigger Function: set_customer_code
-- DROP FUNCTION IF EXISTS public.set_customer_code();

CREATE OR REPLACE FUNCTION public.set_customer_code()
    RETURNS trigger
    LANGUAGE plpgsql
    AS $BODY$
BEGIN
    NEW.customer_code := 'CUS' || LPAD(NEW.cus_id::text, 4, '0');
    RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.set_customer_code()
    OWNER TO postgres;

-- 5. Trigger: trg_customer_code
-- DROP TRIGGER IF EXISTS trg_customer_code ON public.customers;

CREATE OR REPLACE TRIGGER trg_customer_code
    BEFORE INSERT
    ON public.customers
    FOR EACH ROW
    EXECUTE FUNCTION public.set_customer_code();

-- 6. Set Sequence Owner
ALTER SEQUENCE public.customer_seq
    OWNER TO postgres;



-- ============================
-- user roles Schema Setup
-- ============================

-- 1. Sequence: role_seq
-- DROP SEQUENCE IF EXISTS public.role_seq;

CREATE SEQUENCE IF NOT EXISTS public.role_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

-- 2. Table: user_roles
-- DROP TABLE IF EXISTS public.user_roles;

CREATE TABLE IF NOT EXISTS public.user_roles
(
    role_id integer NOT NULL DEFAULT nextval('role_seq'::regclass),
    role_name character varying COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    description text COLLATE pg_catalog."default",
    CONSTRAINT user_roles_pkey PRIMARY KEY (role_id)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_roles
    OWNER TO postgres;

-- 3. Attach sequence to column & set owner
ALTER SEQUENCE public.role_seq
    OWNED BY public.user_roles.role_id;

ALTER SEQUENCE public.role_seq
    OWNER TO postgres;




-- ============================
-- Audit Logs Schema Setup
-- ============================

-- 1. Sequence: audit_logs_seq
-- DROP SEQUENCE IF EXISTS public.audit_logs_seq;

CREATE SEQUENCE IF NOT EXISTS public.audit_logs_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

-- 2. Table: audit_logs
-- DROP TABLE IF EXISTS public.audit_logs;

CREATE TABLE IF NOT EXISTS public.audit_logs
(
    log_id integer NOT NULL DEFAULT nextval('audit_logs_seq'::regclass),
    user_id character varying COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    action character varying COLLATE pg_catalog."default" NOT NULL,
    ip_address character varying COLLATE pg_catalog."default",
    CONSTRAINT audit_logs_pkey PRIMARY KEY (log_id)
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.audit_logs
    OWNER TO postgres;

-- 3. Attach sequence to column & set owner
ALTER SEQUENCE public.audit_logs_seq
    OWNED BY public.audit_logs.log_id;

ALTER SEQUENCE public.audit_logs_seq
    OWNER TO postgres;




-- ============================
-- Staff Management Schema Setup
-- ============================

-- 1. Sequence: staff_seq
-- DROP SEQUENCE IF EXISTS public.staff_seq;

CREATE SEQUENCE IF NOT EXISTS public.staff_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

-- 2. Table: staff
-- DROP TABLE IF EXISTS public.staff;

CREATE TABLE IF NOT EXISTS public.staff
(
    staff_id integer NOT NULL DEFAULT nextval('staff_seq'::regclass),
    staff_code character varying COLLATE pg_catalog."default" NOT NULL,
    first_name character varying COLLATE pg_catalog."default" NOT NULL,
    last_name character varying COLLATE pg_catalog."default",
    email character varying COLLATE pg_catalog."default" NOT NULL,
    phone character varying COLLATE pg_catalog."default",
    password character varying COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    is_active boolean DEFAULT true,
    is_email_verified boolean DEFAULT true,
    is_phone_verified boolean DEFAULT false,
    "is_2FA_enabled" boolean DEFAULT false,
    verification_code integer,
    verification_code_expires timestamp without time zone,
    role integer NOT NULL,
    deactivated_until timestamp without time zone,
    CONSTRAINT staff_pkey PRIMARY KEY (staff_id),
    CONSTRAINT unique_email UNIQUE (email),
    CONSTRAINT role_in_staff FOREIGN KEY (role)
        REFERENCES public.user_roles (role_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
        NOT VALID
)
TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.staff
    OWNER TO postgres;

-- 3. Attach sequence to staff_id & set owner
ALTER SEQUENCE public.staff_seq
    OWNED BY public.staff.staff_id;

ALTER SEQUENCE public.staff_seq
    OWNER TO postgres;

-- 4. Trigger Function: set_staff_code
-- DROP FUNCTION IF EXISTS public.set_staff_code();

CREATE OR REPLACE FUNCTION public.set_staff_code()
    RETURNS trigger
    LANGUAGE plpgsql
AS $BODY$
BEGIN
    -- Set staff_code as 'STF' + zero-padded staff_id
    NEW.staff_code := 'STF' || LPAD(NEW.staff_id::TEXT, 3, '0');
    RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.set_staff_code()
    OWNER TO postgres;

-- 5. Trigger: trg_staff_code
-- DROP TRIGGER IF EXISTS trg_staff_code ON public.staff;

CREATE OR REPLACE TRIGGER trg_staff_code
    BEFORE INSERT
    ON public.staff
    FOR EACH ROW
    EXECUTE FUNCTION public.set_staff_code();
