import { pool   } from "../db";
export async function getWishlistItemsWithProgress(userId: string) {
    const result = await pool.query(
      `
      SELECT 
        w.*,
        fp.monthly_salary,
        fp.current_savings,
        ar.salary_percentage,
        ar.savings_percentage
      FROM wishlist_items w
      LEFT JOIN financial_profiles fp
        ON w.user_id = fp.user_id
      LEFT JOIN affordability_rules ar
        ON w.user_id = ar.user_id
      WHERE w.user_id = $1
      ORDER BY w.created_at DESC
      `,
      [userId]
    );
  
    return result.rows.map((item) => {
      const price = Number(item.target_price);
  
      const salaryAllowance =
        Number(item.monthly_salary || 0) *
        (Number(item.salary_percentage || 0) / 100);
  
      const savingsAllowance =
        Number(item.current_savings || 0) *
        (Number(item.savings_percentage || 0) / 100);
  
      const safeLimit = salaryAllowance + savingsAllowance;
  
      const affordabilityPercentage =
        price === 0
          ? 0
          : Math.min(100, Math.round((safeLimit / price) * 100));
  
      const amountToGo = Math.max(0, price - safeLimit);
  
      const monthlySavingsEstimate =
      Number(item.monthly_salary || 0) * 0.1;
    
    const weeklySavingsRate =
      monthlySavingsEstimate / 4;
    
    const estimatedWeeks =
      amountToGo <= 0
        ? 0
        : weeklySavingsRate > 0
        ? Math.ceil(amountToGo / weeklySavingsRate)
        : null;
  
      return {
        ...item,
        target_price: price,
        affordabilityPercentage,
        amountToGo,
        estimatedWeeks,
      };
    });
  }
export async function createWishlistItem(data: {
  userId: string;
  productName: string;
  productUrl?: string;
  category: string;
  targetPrice: number;
  priority: "low" | "medium" | "high";
}) {
  const result = await pool.query(
    `
    INSERT INTO wishlist_items (
      user_id,
      product_name,
      product_url,
      category,
      target_price,
      priority
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [
      data.userId,
      data.productName,
      data.productUrl || "",
      data.category,
      data.targetPrice,
      data.priority,
    ]
  );

  return result.rows[0];
}

export async function getWishlistItems(userId: string) {
  const result = await pool.query(
    `
    SELECT *
    FROM wishlist_items
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;
}

export async function deleteWishlistItem(id: string, userId: string) {
  const result = await pool.query(
    `
    DELETE FROM wishlist_items
    WHERE id = $1 AND user_id = $2
    RETURNING *
    `,
    [id, userId]
  );

  return result.rows[0];
}
export async function updateWishlistDecision(data: {
    id: string;
    userId: string;
    affordabilityStatus: string;
    affordabilityScore: number;
    affordabilityPercentage: number;
    stockStatus: string;
    stockRisk: string;
    stockMessage: string;
    stockQuantity: number | null;
  }) {
    const result = await pool.query(
      `
      UPDATE wishlist_items
      SET
        affordability_status = $3,
        affordability_score = $4,
        affordability_percentage = $5,
        stock_status = $6,
        stock_risk = $7,
        stock_message = $8,
        stock_quantity = $9,
        last_checked_at = NOW(),
        updated_at = NOW()
      WHERE id = $1 AND user_id = $2
      RETURNING *
      `,
      [
        data.id,
        data.userId,
        data.affordabilityStatus,
        data.affordabilityScore,
        data.affordabilityPercentage,
        data.stockStatus,
        data.stockRisk,
        data.stockMessage,
        data.stockQuantity,
      ]
    );
  
    return result.rows[0];
  }