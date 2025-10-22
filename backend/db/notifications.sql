-- ============================
-- Notifications Schema Setup
-- ============================

-- 1. Sequence: notifications_seq
CREATE SEQUENCE IF NOT EXISTS public.notifications_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

-- 2. Table: notifications
CREATE TABLE IF NOT EXISTS public.notifications
(
    notification_id integer NOT NULL DEFAULT nextval('notifications_seq'::regclass),
    cus_id integer NOT NULL,
    order_id integer,
    notification text NOT NULL,
    notification_type character varying(50) DEFAULT 'order_update',
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
    OWNER TO postgres;

-- 3. Attach sequence to column & set owner
ALTER SEQUENCE public.notifications_seq
    OWNED BY public.notifications.notification_id;

ALTER SEQUENCE public.notifications_seq
    OWNER TO postgres;

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_cus_id 
    ON public.notifications (cus_id);

CREATE INDEX IF NOT EXISTS idx_notifications_is_read 
    ON public.notifications (is_read);

CREATE INDEX IF NOT EXISTS idx_notifications_created_at 
    ON public.notifications (created_at DESC);

-- 5. Create trigger function to update updated_at
CREATE OR REPLACE FUNCTION public.update_notifications_updated_at()
    RETURNS trigger
    LANGUAGE plpgsql
AS $BODY$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$BODY$;

ALTER FUNCTION public.update_notifications_updated_at()
    OWNER TO postgres;

-- 6. Create trigger for updated_at
CREATE OR REPLACE TRIGGER trg_notifications_updated_at
    BEFORE UPDATE
    ON public.notifications
    FOR EACH ROW
    EXECUTE FUNCTION public.update_notifications_updated_at();
