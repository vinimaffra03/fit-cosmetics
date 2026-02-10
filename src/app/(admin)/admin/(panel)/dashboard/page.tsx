import { Metadata } from "next";
import Link from "next/link";
import prisma from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
} from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { OrderStatusBadge } from "@/components/admin/status-badge";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Dashboard | Admin",
};

async function getMonthlySales() {
  const months: { month: string; revenue: number; orders: number }[] = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const label = start.toLocaleDateString("pt-BR", { month: "short" });

    const [agg, count] = await Promise.all([
      prisma.order.aggregate({
        _sum: { total: true },
        where: {
          createdAt: { gte: start, lt: end },
          status: { notIn: ["CANCELLED", "REFUNDED"] },
        },
      }),
      prisma.order.count({
        where: {
          createdAt: { gte: start, lt: end },
          status: { notIn: ["CANCELLED", "REFUNDED"] },
        },
      }),
    ]);

    months.push({
      month: label.charAt(0).toUpperCase() + label.slice(1).replace(".", ""),
      revenue: agg._sum.total ?? 0,
      orders: count,
    });
  }

  return months;
}

async function getDashboardData() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const [
    productCount,
    orderCount,
    customerCount,
    revenueThisMonth,
    revenueLastMonth,
    recentOrders,
    monthlySales,
    ordersByStatus,
    topProducts,
  ] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        createdAt: { gte: startOfMonth },
        status: { notIn: ["CANCELLED", "REFUNDED"] },
      },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: {
        createdAt: { gte: startOfLastMonth, lt: startOfMonth },
        status: { notIn: ["CANCELLED", "REFUNDED"] },
      },
    }),
    prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: { user: true, payment: true },
    }),
    getMonthlySales(),
    prisma.order.groupBy({ by: ["status"], _count: true }),
    prisma.orderItem.groupBy({
      by: ["productName"],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: "desc" } },
      take: 5,
    }),
  ]);

  const thisMonth = revenueThisMonth._sum.total ?? 0;
  const lastMonth = revenueLastMonth._sum.total ?? 0;
  const revenueTrend =
    lastMonth > 0 ? ((thisMonth - lastMonth) / lastMonth) * 100 : 0;

  return {
    productCount,
    orderCount,
    customerCount,
    thisMonth,
    revenueTrend,
    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      customerName: o.user.name || o.user.email,
      status: o.status,
      total: o.total,
      createdAt: o.createdAt.toISOString(),
      paymentMethod: o.payment?.method ?? null,
      paymentStatus: o.payment?.status ?? null,
    })),
    monthlySales,
    ordersByStatus: ordersByStatus.map((s) => ({
      status: s.status,
      count: s._count,
    })),
    topProducts: topProducts.map((p) => ({
      name: p.productName,
      quantity: p._sum.quantity ?? 0,
    })),
  };
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Receita do Mes"
          value={formatCurrency(data.thisMonth)}
          icon={DollarSign}
          color="text-amber-500"
          bg="bg-amber-500/10"
          trend={
            data.revenueTrend !== 0
              ? { value: data.revenueTrend, label: "vs mes anterior" }
              : undefined
          }
        />
        <StatCard
          label="Pedidos"
          value={data.orderCount}
          icon={ShoppingCart}
          color="text-green-500"
          bg="bg-green-500/10"
        />
        <StatCard
          label="Clientes"
          value={data.customerCount}
          icon={Users}
          color="text-purple-500"
          bg="bg-purple-500/10"
        />
        <StatCard
          label="Produtos Ativos"
          value={data.productCount}
          icon={Package}
          color="text-blue-500"
          bg="bg-blue-500/10"
        />
      </div>

      <DashboardCharts
        monthlySales={data.monthlySales}
        ordersByStatus={data.ordersByStatus}
        topProducts={data.topProducts}
      />

      <Card className="mt-8 p-6">
        <h2 className="font-semibold text-lg mb-4">Pedidos Recentes</h2>
        {data.recentOrders.length === 0 ? (
          <p className="text-muted-foreground">Nenhum pedido ainda.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pedido</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link
                      href={`/admin/pedidos/${order.id}`}
                      className="font-mono text-xs hover:underline"
                    >
                      #{order.orderNumber.slice(0, 8)}
                    </Link>
                  </TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(new Date(order.createdAt))}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(order.total)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
