const { pool } = require('../db/dbConnect');

async function createNotificationsTable() {
  try {
    console.log('Creating notifications table...');
    
    // Create sequence
    await pool.query(`
      CREATE SEQUENCE IF NOT EXISTS public.notifications_seq
        INCREMENT 1
        START 1
        MINVALUE 1
        MAXVALUE 9223372036854775807
        CACHE 1;
    `);

    // Create table
    await pool.query(`
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
      );
    `);

    // Set sequence owner
    await pool.query(`
      ALTER SEQUENCE public.notifications_seq
        OWNED BY public.notifications.notification_id;
    `);

    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_notifications_cus_id 
        ON public.notifications (cus_id);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_notifications_is_read 
        ON public.notifications (is_read);
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_notifications_created_at 
        ON public.notifications (created_at DESC);
    `);

    console.log('✅ Notifications table created successfully!');
    
    // Test insert
    console.log('Testing notification creation...');
    const testResult = await pool.query(`
      INSERT INTO notifications (cus_id, order_id, notification, notification_type)
      VALUES (1, 1, 'Test notification - Order #001 status updated to confirmed.', 'order_update')
      RETURNING *;
    `);
    
    console.log('✅ Test notification created:', testResult.rows[0]);
    
  } catch (error) {
    console.error('❌ Error creating notifications table:', error);
  } finally {
    await pool.end();
  }
}

createNotificationsTable();
