-- =====================================================
-- FULL REBUILD: Use customized_odr.order_no (auto) and link recipe.order_no → customized_odr.order_no
-- =====================================================

-- 0) Drop in dependency order
DROP TABLE IF EXISTS public.productions CASCADE;
DROP TABLE IF EXISTS public.req_ingredients CASCADE;
DROP TABLE IF EXISTS public.returns CASCADE;
DROP TABLE IF EXISTS public.recipe CASCADE;
DROP TABLE IF EXISTS public.customized_odr CASCADE;

-- =====================================================
-- 1) customized_odr : add auto order_no (O1001...) via trigger
-- =====================================================
DROP SEQUENCE IF EXISTS public.customized_odr_id_seq;

CREATE SEQUENCE public.customized_odr_id_seq
    INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;
ALTER SEQUENCE public.customized_odr_id_seq OWNER TO postgres;

CREATE TABLE public.customized_odr
(
    id            integer       NOT NULL DEFAULT nextval('customized_odr_id_seq'::regclass),
    order_no      varchar(20)   NOT NULL,     -- auto: O1001, O1002, ...
    customer_name varchar(120)  NOT NULL,
    address       text          NOT NULL,
    email         varchar(160)  NOT NULL,
    fruit         varchar(20)   NOT NULL,
    topping       varchar(30)   NOT NULL,
    bottom        varchar(20)   NOT NULL,
    quantity      integer       NOT NULL,
    order_date    date          NOT NULL,
    status        varchar(20)   NOT NULL DEFAULT 'pending',
    created_at    timestamp     DEFAULT now(),
    CONSTRAINT customized_odr_pkey PRIMARY KEY (id),
    CONSTRAINT customized_odr_order_no_key UNIQUE (order_no),
    CONSTRAINT customized_odr_fruit_check   CHECK (fruit   IN ('strawberry','blueberry','mango')),
    CONSTRAINT customized_odr_topping_check CHECK (topping IN ('chocolate syrup','strawberry syrup','honey syrup')),
    CONSTRAINT customized_odr_bottom_check  CHECK (bottom  IN ('cashew','peanut','armond')),
    CONSTRAINT customized_odr_quantity_check CHECK (quantity > 0),
    CONSTRAINT customized_odr_status_check  CHECK (status IN ('pending','accepted','rejected'))
);
ALTER TABLE public.customized_odr OWNER TO postgres;

-- Generate order_no as 'O' || (id + 1000)
CREATE OR REPLACE FUNCTION public.generate_custom_order_no()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_no := 'O' || (NEW.id + 1000);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_custom_order_no ON public.customized_odr;
CREATE TRIGGER trg_custom_order_no
BEFORE INSERT ON public.customized_odr
FOR EACH ROW
EXECUTE FUNCTION public.generate_custom_order_no();

-- =====================================================
-- 2) recipe : auto recipe_no (R1001...) + FK to customized_odr.order_no
-- =====================================================
DROP SEQUENCE IF EXISTS public.recipe_recipe_id_seq;

CREATE SEQUENCE public.recipe_recipe_id_seq
    INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;
ALTER SEQUENCE public.recipe_recipe_id_seq OWNER TO postgres;

CREATE TABLE public.recipe
(
    recipe_id   integer      NOT NULL DEFAULT nextval('recipe_recipe_id_seq'::regclass),
    recipe_no   varchar(20)  NOT NULL,  -- auto by trigger
    order_no    varchar(20)  NOT NULL,  -- FK to customized_odr(order_no)
    recipe_name varchar(100) NOT NULL,

    strawberry integer DEFAULT 0,
    mango      integer DEFAULT 0,
    blueberry  integer DEFAULT 0,
    milk       integer DEFAULT 0,
    culture    integer DEFAULT 0,
    sugar      integer DEFAULT 0,
    topping1   integer DEFAULT 0,
    topping2   integer DEFAULT 0,
    topping3   integer DEFAULT 0,
    bottom1    integer DEFAULT 0,
    bottom2    integer DEFAULT 0,
    bottom3    integer DEFAULT 0,

    CONSTRAINT recipe_pkey PRIMARY KEY (recipe_id),
    CONSTRAINT recipe_recipe_no_key UNIQUE (recipe_no),
    CONSTRAINT recipe_order_fk FOREIGN KEY (order_no)
        REFERENCES public.customized_odr(order_no)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);
ALTER TABLE public.recipe OWNER TO postgres;

-- Auto-generate recipe_no as 'R' || (recipe_id + 1000)
CREATE OR REPLACE FUNCTION public.generate_recipe_no()
RETURNS TRIGGER AS $$
BEGIN
  NEW.recipe_no := 'R' || (NEW.recipe_id + 1000);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_recipe_no ON public.recipe;
CREATE TRIGGER trg_recipe_no
BEFORE INSERT ON public.recipe
FOR EACH ROW
EXECUTE FUNCTION public.generate_recipe_no();

-- =====================================================
-- 3) req_ingredients : FK to recipe.recipe_no (unchanged)
-- =====================================================
DROP SEQUENCE IF EXISTS public.req_ingredients_req_id_seq;

CREATE SEQUENCE public.req_ingredients_req_id_seq
    INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;
ALTER SEQUENCE public.req_ingredients_req_id_seq OWNER TO postgres;

CREATE TABLE public.req_ingredients
(
    req_id integer NOT NULL DEFAULT nextval('req_ingredients_req_id_seq'::regclass),
    recipe_no varchar(20) NOT NULL,
    quantity integer NOT NULL,

    total_strawberry integer DEFAULT 0,
    total_mango      integer DEFAULT 0,
    total_blueberry  integer DEFAULT 0,
    total_milk       integer DEFAULT 0,
    total_culture    integer DEFAULT 0,
    total_sugar      integer DEFAULT 0,
    total_topping1   integer DEFAULT 0,
    total_topping2   integer DEFAULT 0,
    total_topping3   integer DEFAULT 0,
    total_bottom1    integer DEFAULT 0,
    total_bottom2    integer DEFAULT 0,
    total_bottom3    integer DEFAULT 0,

    status varchar(20) NOT NULL DEFAULT 'pending',

    CONSTRAINT req_ingredients_pkey PRIMARY KEY (req_id),
    CONSTRAINT fk_recipe FOREIGN KEY (recipe_no)
        REFERENCES public.recipe(recipe_no)
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);
ALTER TABLE public.req_ingredients OWNER TO postgres;

-- =====================================================
-- 4) returns : unchanged
-- =====================================================
DROP SEQUENCE IF EXISTS public.returns_id_seq;

CREATE SEQUENCE public.returns_id_seq
    INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1;
ALTER SEQUENCE public.returns_id_seq OWNER TO postgres;

CREATE TABLE public.returns
(
    id       integer      NOT NULL DEFAULT nextval('returns_id_seq'::regclass),
    product  varchar(12)  NOT NULL,
    customer varchar(120) NOT NULL,
    phone    varchar(30),
    reason   varchar(20)  NOT NULL,
    image_url text,
    status   varchar(10)  NOT NULL DEFAULT 'pending',
    created_at timestamp  DEFAULT now(),
    CONSTRAINT returns_pkey PRIMARY KEY (id),
    CONSTRAINT returns_product_check CHECK (product IN ('customized','normal')),
    CONSTRAINT returns_reason_check  CHECK (reason  IN ('damaged','wrong_item','quality')),
    CONSTRAINT returns_status_check  CHECK (status  IN ('pending','accept','reject'))
);
ALTER TABLE public.returns OWNER TO postgres;

-- =====================================================
-- 5) productions : FK to recipe.recipe_no (unchanged)
-- =====================================================
CREATE TABLE public.productions
(
    id SERIAL PRIMARY KEY,
    batch_id VARCHAR(10) UNIQUE NOT NULL,
    recipe_no VARCHAR(20) NOT NULL REFERENCES public.recipe(recipe_no),
    quantity INT NOT NULL,
    progress_est INT DEFAULT 40,
    status VARCHAR(20) DEFAULT 'in production',
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.generate_batch_id()
RETURNS TRIGGER AS $$
BEGIN
    NEW.batch_id := 'B' || (NEW.id + 1000);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_batch_id ON public.productions;
CREATE TRIGGER trg_batch_id
BEFORE INSERT ON public.productions
FOR EACH ROW
EXECUTE FUNCTION public.generate_batch_id();

ALTER TABLE public.productions OWNER TO postgres;

-- =====================================================
-- SMOKE TEST (optional)
-- =====================================================
-- -- 1) Create a customized order (order_no auto → O1001)
-- INSERT INTO public.customized_odr (customer_name,address,email,fruit,topping,bottom,quantity,order_date)
-- VALUES ('Nimal','Colombo','nimal@example.com','mango','honey syrup','cashew',10,CURRENT_DATE);

-- -- 2) Create a recipe linked to that order_no (recipe_no auto → R1001)
-- INSERT INTO public.recipe (order_no, recipe_name, strawberry, milk, sugar)
-- SELECT order_no, 'Mango Delight', 0, 5, 1 FROM public.customized_odr ORDER BY id LIMIT 1;

-- -- 3) Create a production against that recipe
-- INSERT INTO public.productions (recipe_no, quantity)
-- SELECT recipe_no, 100 FROM public.recipe ORDER BY recipe_id LIMIT 1;
