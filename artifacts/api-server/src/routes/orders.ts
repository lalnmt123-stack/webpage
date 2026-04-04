import { Router } from "express";
import { db, ordersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { CreateOrderBody, GetOrderParams } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const orders = await db.select().from(ordersTable).orderBy(ordersTable.createdAt);
    const mapped = orders.map(o => ({
      id: o.id,
      customerName: o.customerName,
      customerEmail: o.customerEmail,
      customerPhone: o.customerPhone,
      address: o.address,
      items: o.items as Array<{ productId: number; productName: string; quantity: number; price: number }>,
      total: parseFloat(o.total),
      status: o.status,
      paymentMethod: o.paymentMethod,
      createdAt: o.createdAt.toISOString(),
    }));
    res.json(mapped);
  } catch (err) {
    req.log.error({ err }, "Error listing orders");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const body = CreateOrderBody.parse(req.body);

    const [order] = await db.insert(ordersTable).values({
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      customerPhone: body.customerPhone,
      address: body.address,
      items: body.items,
      total: body.total.toString(),
      status: "confirmed",
      paymentMethod: body.paymentMethod,
    }).returning();

    res.status(201).json({
      id: order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      address: order.address,
      items: order.items as Array<{ productId: number; productName: string; quantity: number; price: number }>,
      total: parseFloat(order.total),
      status: order.status,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error creating order");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = GetOrderParams.parse({ id: parseInt(req.params.id) });
    const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));

    if (!order) {
      res.status(404).json({ error: "Order not found" });
      return;
    }

    res.json({
      id: order.id,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      address: order.address,
      items: order.items as Array<{ productId: number; productName: string; quantity: number; price: number }>,
      total: parseFloat(order.total),
      status: order.status,
      paymentMethod: order.paymentMethod,
      createdAt: order.createdAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Error getting order");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
