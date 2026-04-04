import { Router } from "express";
import { db, productsTable, ordersTable, categoriesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/summary", async (req, res) => {
  try {
    const [productCount] = await db.select({ count: sql<number>`count(*)` }).from(productsTable);
    const [orderCount] = await db.select({ count: sql<number>`count(*)` }).from(ordersTable);
    const [revenueResult] = await db.select({ total: sql<number>`coalesce(sum(total::numeric), 0)` }).from(ordersTable);
    const [featuredCount] = await db.select({ count: sql<number>`count(*)` }).from(productsTable).where(eq(productsTable.featured, true));
    const [categoryCount] = await db.select({ count: sql<number>`count(*)` }).from(categoriesTable);

    res.json({
      totalProducts: Number(productCount?.count ?? 0),
      totalOrders: Number(orderCount?.count ?? 0),
      totalRevenue: Number(revenueResult?.total ?? 0),
      featuredCount: Number(featuredCount?.count ?? 0),
      categories: Number(categoryCount?.count ?? 0),
    });
  } catch (err) {
    req.log.error({ err }, "Error getting store summary");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
