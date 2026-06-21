import { pool } from "../db";
export async function deleteNotification(
  id: string,
  userId: string
) {
  await pool.query(
    `
    DELETE FROM notifications
    WHERE id = $1
      AND user_id = $2
    `,
    [id, userId]
  );
}
export async function createNotification(data: {
  userId: string;
  type: string;
  title: string;
  message: string;
}) {
  const result = await pool.query(
    `
    INSERT INTO notifications (
      user_id,
      type,
      title,
      message
    )
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [data.userId, data.type, data.title, data.message]
  );

  return result.rows[0];
}

export async function getNotificationsByUserId(userId: string) {
  const result = await pool.query(
    `
    SELECT *
    FROM notifications
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT 10
    `,
    [userId]
  );

  return result.rows;
}

export async function getUnreadNotificationCount(userId: string) {
  const result = await pool.query(
    `
    SELECT COUNT(*) AS count
    FROM notifications
    WHERE user_id = $1
    AND is_read = false
    `,
    [userId]
  );

  return Number(result.rows[0].count);
}

export async function markNotificationsAsRead(userId: string) {
  await pool.query(
    `
    UPDATE notifications
    SET is_read = true
    WHERE user_id = $1
    `,
    [userId]
  );
}