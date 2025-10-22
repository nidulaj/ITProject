-- =====================================================
-- PRODUCTS TABLE CREATION SCRIPT
-- =====================================================

-- Drop table if exists (be careful with this in production!)
DROP TABLE IF EXISTS public.products CASCADE;

-- Create products table
CREATE TABLE public.products (
    product_id SERIAL PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    product_image BYTEA,
    final_product_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT products_price_positive CHECK (price >= 0),
    CONSTRAINT products_name_not_empty CHECK (LENGTH(TRIM(product_name)) > 0)
);

-- Add foreign key constraint to final_products table
ALTER TABLE public.products 
ADD CONSTRAINT fk_products_final_product 
FOREIGN KEY (final_product_id) 
REFERENCES public.final_products(fproduct_id)
ON DELETE SET NULL
ON UPDATE CASCADE;

-- Create indexes for better performance
CREATE INDEX idx_products_final_product_id ON public.products(final_product_id);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_created_at ON public.products(created_at);

-- Add comments to explain the fields
COMMENT ON TABLE public.products IS 'Products catalog table linked to final products inventory';
COMMENT ON COLUMN public.products.product_id IS 'Primary key - unique product identifier';
COMMENT ON COLUMN public.products.product_name IS 'Product name displayed to customers';
COMMENT ON COLUMN public.products.product_description IS 'Detailed product description';
COMMENT ON COLUMN public.products.price IS 'Product price in LKR';
COMMENT ON COLUMN public.products.category IS 'Product category for filtering';
COMMENT ON COLUMN public.products.product_image IS 'Product image stored as binary data';
COMMENT ON COLUMN public.products.final_product_id IS 'Foreign key linking to final_products.fproduct_id for inventory stock lookup';
COMMENT ON COLUMN public.products.created_at IS 'Timestamp when product was created';
COMMENT ON COLUMN public.products.updated_at IS 'Timestamp when product was last updated';

-- Set table owner
ALTER TABLE public.products OWNER TO postgres;

-- =====================================================
-- SAMPLE DATA INSERTION (OPTIONAL)
-- =====================================================

-- Insert sample products (uncomment if you want sample data)
/*
INSERT INTO public.products (product_name, product_description, price, category, final_product_id) VALUES
('Strawberry Yogurt', 'Fresh strawberry yogurt with real fruit', 450.00, 'Yogurt', 1),
('Mango Delight', 'Creamy mango yogurt with tropical flavor', 500.00, 'Yogurt', 2),
('Blueberry Bliss', 'Antioxidant-rich blueberry yogurt', 480.00, 'Yogurt', 3),
('Vanilla Classic', 'Traditional vanilla yogurt', 400.00, 'Yogurt', 4),
('Chocolate Dream', 'Rich chocolate yogurt for chocolate lovers', 520.00, 'Yogurt', 5);
*/

-- =====================================================
-- USEFUL QUERIES FOR TESTING
-- =====================================================

-- Query 1: Get all products with stock information
/*
SELECT 
    p.product_id,
    p.product_name,
    p.product_description,
    p.price,
    p.category,
    p.final_product_id,
    COALESCE(fp.quantity, 0) as stock_quantity,
    fp.pname as final_product_name,
    p.created_at
FROM products p
LEFT JOIN final_products fp ON p.final_product_id = fp.fproduct_id
ORDER BY p.product_id;
*/

-- Query 2: Get products by category
/*
SELECT * FROM products 
WHERE category = 'Yogurt' 
ORDER BY price;
*/

-- Query 3: Get products with low stock (less than 10)
/*
SELECT 
    p.product_name,
    p.price,
    COALESCE(fp.quantity, 0) as stock_quantity
FROM products p
LEFT JOIN final_products fp ON p.final_product_id = fp.fproduct_id
WHERE COALESCE(fp.quantity, 0) < 10
ORDER BY stock_quantity;
*/

-- Query 4: Count products by category
/*
SELECT 
    category,
    COUNT(*) as product_count,
    AVG(price) as avg_price
FROM products 
GROUP BY category 
ORDER BY product_count DESC;
*/

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'products' 
ORDER BY ordinal_position;

-- Check foreign key constraints
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'products';

-- Check indexes
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'products';
