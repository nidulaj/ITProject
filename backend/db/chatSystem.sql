-- Table: public.chat_system

-- DROP TABLE IF EXISTS public.chat_system;

CREATE TABLE IF NOT EXISTS public.chat_system
(
    id integer NOT NULL DEFAULT nextval('chat_system_id_seq'::regclass),
    user_code character varying(50) COLLATE pg_catalog."default" NOT NULL,
    sender character varying(50) COLLATE pg_catalog."default" NOT NULL,
    message text COLLATE pg_catalog."default" NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_read boolean DEFAULT false,
    CONSTRAINT chat_system_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.chat_system
    OWNER to postgres;