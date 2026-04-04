import { Router } from "express";
import { db, categoriesTable, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const categories = await db.select().from(categoriesTable);

    const result = await Promise.all(
      categories.map(async (cat) => {
        const [countResult] = await db.select({ count: sql<number>`count(*)` })
          .from(productsTable)
          .where(eq(productsTable.category, cat.slug));

        return {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          icon: cat.icon,
          productCount: Number(countResult?.count ?? 0),
        };
      })
    );

    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Error listing categories");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
