import { Router } from "express";
import { db, productsTable } from "@workspace/db";
import { eq, ilike, and } from "drizzle-orm";
import { CreateProductBody, ListProductsQueryParams, GetProductParams, UpdateProductParams, UpdateProductBody, DeleteProductParams } from "@workspace/api-zod";
import { z } from "zod/v4";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const query = ListProductsQueryParams.parse(req.query);
    const conditions = [];

    if (query.category) {
      conditions.push(eq(productsTable.category, query.category));
    }
    if (query.search) {
      conditions.push(ilike(productsTable.name, `%${query.search}%`));
    }
    if (query.featured !== undefined) {
      conditions.push(eq(productsTable.featured, query.featured));
    }

    const products = conditions.length > 0
      ? await db.select().from(productsTable).where(and(...conditions))
      : await db.select().from(productsTable);

    const mapped = products.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: parseFloat(p.price),
      originalPrice: p.originalPrice ? parseFloat(p.originalPrice) : null,
      category: p.category,
      imageUrl: p.imageUrl,
      stock: p.stock,
      unit: p.unit,
      featured: p.featured,
      createdAt: p.createdAt.toISOString(),
    }));

    res.json(mapped);
  } catch (err) {
    req.log.error({ err }, "Error listing products");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = CreateProductBody.parse(req.body);
    const [product] = await db.insert(productsTable).values({
      name: body.name,
      description: body.description,
      price: body.price.toString(),
      originalPrice: body.originalPrice != null ? body.originalPrice.toString() : null,
      category: body.category,
      imageUrl: body.imageUrl,
      stock: body.stock,
      unit: body.unit,
      featured: body.featured,
    }).returning();

    res.status(201).json({
      ...product,
      price: parseFloat(product.price),
      originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null,
      createdAt: product.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error creating product");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = GetProductParams.parse({ id: parseInt(req.params.id) });
    const [product] = await db.select().from(productsTable).where(eq(productsTable.id, id));

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json({
      ...product,
      price: parseFloat(product.price),
      originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null,
      createdAt: product.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error getting product");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = UpdateProductParams.parse({ id: parseInt(req.params.id) });
    const body = UpdateProductBody.parse(req.body);

    const updateData: Partial<typeof productsTable.$inferInsert> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.price !== undefined) updateData.price = body.price.toString();
    if (body.originalPrice !== undefined) updateData.originalPrice = body.originalPrice != null ? body.originalPrice.toString() : null;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.imageUrl !== undefined) updateData.imageUrl = body.imageUrl;
    if (body.stock !== undefined) updateData.stock = body.stock;
    if (body.unit !== undefined) updateData.unit = body.unit;
    if (body.featured !== undefined) updateData.featured = body.featured;

    const [product] = await db.update(productsTable)
      .set(updateData)
      .where(eq(productsTable.id, id))
      .returning();

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json({
      ...product,
      price: parseFloat(product.price),
      originalPrice: product.originalPrice ? parseFloat(product.originalPrice) : null,
      createdAt: product.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error updating product");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = DeleteProductParams.parse({ id: parseInt(req.params.id) });
    await db.delete(productsTable).where(eq(productsTable.id, id));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Error deleting product");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
