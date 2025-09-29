CREATE TABLE chat_system (
  id SERIAL PRIMARY KEY,
  user_code VARCHAR(50) NOT NULL,
  sender VARCHAR(50) NOT NULL, -- 'customer' or 'admin'
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);