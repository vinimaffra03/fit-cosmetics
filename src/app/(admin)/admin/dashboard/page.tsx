import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Dashboard | Admin",
};

async function getDashboardData() {
  const [productCount, orderCount, userCount, recentOrders] =
    await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: true },
      }),
    ]);

  return { productCount, orderCount, userCount, recentOrders };
}

export default async function AdminDashboard() {
  const { productCount, orderCount, userCount, recentOrders } =
    await getDashboardData();

  const stats = [
    {
      label: "Produtos",
      value: productCount,
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Pedidos",
      value: orderCount,
      icon: ShoppingCart,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Clientes",
      value: userCount,
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: "Receita",
      value: formatCurrency(0),
      icon: DollarSign,
      color: "text-gold",
      bg: "bg-gold/10",
    },
  ];

  return (
    <div className="p-6 lg:p-8">
      <h1 className="font-display text-3xl font-semibold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl p-6">
        <h2 className="font-semibold text-lg mb-4">Pedidos Recentes</h2>
        {recentOrders.length === 0 ? (
          <p className="text-muted-foreground">Nenhum pedido ainda.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2">Pedido</th>
                  <th className="text-left py-3 px-2">Cliente</th>
                  <th className="text-left py-3 px-2">Status</th>
                  <th className="text-right py-3 px-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="py-3 px-2 font-mono text-xs">
                      {order.orderNumber.slice(0, 8)}...
                    </td>
                    <td className="py-3 px-2">{order.user.name || order.user.email}</td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-1 rounded-full text-xs bg-muted">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right font-medium">
                      {formatCurrency(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
