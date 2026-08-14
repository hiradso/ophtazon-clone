import AdminLayout from "@/Layouts/AdminLayout";
import { Head, usePage } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {
    TrendingUp,
    TrendingDown,
    ShoppingCart,
    Package,
    Users,
    Receipt,
    Printer,
    Download,
} from "lucide-react";
import { at } from "@/lib/admin-i18n";
import { formatPrice, currencySymbol } from "@/lib/pricing";
import { toFa, groupNumber } from "@/lib/toFa";
import { useCurrency } from "@/lib/currency-provider";

export default function Dashboard({
    stats,
    salesChart,
    topProducts,
    salesByStore,
    currency: baseCurrency,
}) {
    const { locale: uiLocale } = usePage().props;
    const { convert } = useCurrency();

    const displayPrice = (amount) => {
        const converted = convert(amount, baseCurrency);
        return `${formatPrice(converted.amount, uiLocale)} ${currencySymbol(converted.currency, uiLocale)}`;
    };

    const TrendBadge = ({ percent }) => {
        if (percent === null || percent === undefined) return null;
        const isUp = percent >= 0;
        const Icon = isUp ? TrendingUp : TrendingDown;
        return (
            <span
                className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                    isUp ? "text-status-available" : "text-destructive"
                }`}
            >
                <Icon className="size-3" />
                {toFa(Math.abs(percent), uiLocale)}%
            </span>
        );
    };

    const statCards = [
        {
            key: "totalRevenue",
            label: at("total_revenue", uiLocale),
            value: displayPrice(stats.totalRevenue),
            icon: TrendingUp,
            color: "text-status-available",
            bg: "bg-status-available/10",
            trend: stats.revenueChangePercent,
        },
        {
            key: "totalOrders",
            label: at("total_orders", uiLocale),
            value: toFa(stats.totalOrders, uiLocale),
            icon: ShoppingCart,
            color: "text-status-reserved",
            bg: "bg-status-reserved/10",
            trend: stats.ordersChangePercent,
        },
        {
            key: "averageOrderValue",
            label: at("average_order_value", uiLocale),
            value: displayPrice(stats.averageOrderValue),
            icon: Receipt,
            color: "text-status-pending",
            bg: "bg-status-pending/10",
        },
        {
            key: "totalProducts",
            label: at("total_products_stat", uiLocale),
            value: toFa(stats.totalProducts, uiLocale),
            icon: Package,
            color: "text-primary",
            bg: "bg-primary/10",
        },
        {
            key: "totalCustomers",
            label: at("total_customers", uiLocale),
            value: toFa(stats.totalCustomers, uiLocale),
            icon: Users,
            color: "text-muted-foreground",
            bg: "bg-muted",
        },
    ];

    const chartData = salesChart.map((d) => ({
        ...d,
        dateLabel: new Date(d.date).toLocaleDateString(
            uiLocale === "fa" ? "fa-IR" : "en-US",
            { month: "short", day: "numeric" },
        ),
    }));

    const hasSales = salesChart.some((d) => d.revenue > 0);

    const handlePrint = () => window.print();

    const handleExportCsv = () => {
        const header = ["Date", "Revenue", "Orders"];
        const rows = salesChart.map((d) => [d.date, d.revenue, d.orders]);
        const csvContent = [header, ...rows]
            .map((row) => row.join(","))
            .join("\n");
        const blob = new Blob([csvContent], {
            type: "text/csv;charset=utf-8;",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `sales-report-${new Date().toISOString().slice(0, 10)}.csv`;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <AdminLayout
            breadcrumbs={[{ label: at("dashboard", uiLocale) }]}
            header={
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                        {at("dashboard", uiLocale)}
                    </h2>
                    <div className="flex items-center gap-2 print:hidden">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExportCsv}
                        >
                            <Download className="me-1.5 size-4" />
                            {at("export_csv", uiLocale)}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePrint}
                        >
                            <Printer className="me-1.5 size-4" />
                            {at("print", uiLocale)}
                        </Button>
                    </div>
                </div>
            }
        >
            <Head title={at("dashboard", uiLocale)} />

            <div className="py-8">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    {/* کارت‌های آماری */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                        {statCards.map((card) => (
                            <Card key={card.key}>
                                <CardContent className="flex items-center gap-4 p-5">
                                    <div
                                        className={`flex size-11 shrink-0 items-center justify-center rounded-lg ${card.bg}`}
                                    >
                                        <card.icon
                                            className={`size-5 ${card.color}`}
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">
                                            {card.label}
                                        </p>
                                        <p className="text-xl font-semibold tracking-tight text-foreground">
                                            {card.value}
                                        </p>
                                        {card.trend !== undefined && (
                                            <div className="mt-0.5 flex items-center gap-1">
                                                <TrendBadge
                                                    percent={card.trend}
                                                />
                                                {card.trend !== null &&
                                                    card.trend !==
                                                        undefined && (
                                                        <span className="text-[11px] text-muted-foreground">
                                                            {at(
                                                                "vs_previous_period",
                                                                uiLocale,
                                                            )}
                                                        </span>
                                                    )}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* نمودار روند فروش */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {at("sales_last_30_days", uiLocale)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {hasSales ? (
                                <div className="h-72 w-full" dir="ltr">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <AreaChart
                                            data={chartData}
                                            margin={{
                                                top: 5,
                                                right: 10,
                                                left: 0,
                                                bottom: 0,
                                            }}
                                        >
                                            <defs>
                                                <linearGradient
                                                    id="revenueGradient"
                                                    x1="0"
                                                    y1="0"
                                                    x2="0"
                                                    y2="1"
                                                >
                                                    <stop
                                                        offset="5%"
                                                        stopColor="var(--color-primary)"
                                                        stopOpacity={0.35}
                                                    />
                                                    <stop
                                                        offset="95%"
                                                        stopColor="var(--color-primary)"
                                                        stopOpacity={0}
                                                    />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="var(--color-border)"
                                                vertical={false}
                                            />
                                            <XAxis
                                                dataKey="dateLabel"
                                                tick={{
                                                    fontSize: 11,
                                                    fill: "var(--color-muted-foreground)",
                                                }}
                                                tickLine={false}
                                                axisLine={{
                                                    stroke: "var(--color-border)",
                                                }}
                                                interval="preserveStartEnd"
                                            />
                                            <YAxis
                                                tick={{
                                                    fontSize: 11,
                                                    fill: "var(--color-muted-foreground)",
                                                }}
                                                tickLine={false}
                                                axisLine={false}
                                                width={50}
                                                tickFormatter={(value) =>
                                                    groupNumber(
                                                        value,
                                                        uiLocale,
                                                    )
                                                }
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor:
                                                        "var(--color-popover)",
                                                    border: "1px solid var(--color-border)",
                                                    borderRadius: "8px",
                                                    fontSize: "12px",
                                                }}
                                                labelStyle={{
                                                    color: "var(--color-foreground)",
                                                }}
                                                formatter={(value) => [
                                                    displayPrice(value),
                                                    at("revenue", uiLocale),
                                                ]}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="revenue"
                                                stroke="var(--color-primary)"
                                                strokeWidth={2}
                                                fill="url(#revenueGradient)"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="flex h-72 items-center justify-center text-sm text-muted-foreground">
                                    {at("no_sales_yet", uiLocale)}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* پرفروش‌ترین محصولات */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {at("top_selling_products", uiLocale)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {topProducts.length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="h-56 w-full" dir="ltr">
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >
                                                <BarChart
                                                    data={topProducts}
                                                    layout="vertical"
                                                    margin={{
                                                        top: 5,
                                                        right: 20,
                                                        left: 10,
                                                        bottom: 0,
                                                    }}
                                                >
                                                    <CartesianGrid
                                                        strokeDasharray="3 3"
                                                        stroke="var(--color-border)"
                                                        horizontal={false}
                                                    />
                                                    <XAxis
                                                        type="number"
                                                        tick={{
                                                            fontSize: 11,
                                                            fill: "var(--color-muted-foreground)",
                                                        }}
                                                        tickLine={false}
                                                        axisLine={{
                                                            stroke: "var(--color-border)",
                                                        }}
                                                        tickFormatter={(
                                                            value,
                                                        ) =>
                                                            groupNumber(
                                                                value,
                                                                uiLocale,
                                                            )
                                                        }
                                                    />
                                                    <YAxis
                                                        type="category"
                                                        dataKey="title"
                                                        tick={{
                                                            fontSize: 11,
                                                            fill: "var(--color-muted-foreground)",
                                                        }}
                                                        tickLine={false}
                                                        axisLine={false}
                                                        width={120}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor:
                                                                "var(--color-popover)",
                                                            border: "1px solid var(--color-border)",
                                                            borderRadius: "8px",
                                                            fontSize: "12px",
                                                        }}
                                                        labelStyle={{
                                                            color: "var(--color-foreground)",
                                                        }}
                                                        formatter={(value) => [
                                                            displayPrice(value),
                                                            at(
                                                                "revenue",
                                                                uiLocale,
                                                            ),
                                                        ]}
                                                    />
                                                    <Bar
                                                        dataKey="revenue"
                                                        fill="var(--color-primary)"
                                                        radius={[0, 4, 4, 0]}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>

                                        <div className="divide-y divide-border border-t border-border">
                                            {topProducts.map((product) => (
                                                <div
                                                    key={product.reference}
                                                    className="flex items-center justify-between py-2.5 text-sm"
                                                >
                                                    <span className="truncate font-medium text-foreground">
                                                        {product.title}
                                                    </span>
                                                    <span className="shrink-0 text-muted-foreground">
                                                        {toFa(
                                                            product.units_sold,
                                                            uiLocale,
                                                        )}{" "}
                                                        {at(
                                                            "units_sold",
                                                            uiLocale,
                                                        )}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                                        {at("no_sales_yet", uiLocale)}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* فروش بر اساس فروشگاه */}
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {at("sales_by_store", uiLocale)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {salesByStore.length > 0 ? (
                                    <div className="space-y-4">
                                        <div className="h-56 w-full" dir="ltr">
                                            <ResponsiveContainer
                                                width="100%"
                                                height="100%"
                                            >
                                                <BarChart
                                                    data={salesByStore}
                                                    layout="vertical"
                                                    margin={{
                                                        top: 5,
                                                        right: 20,
                                                        left: 10,
                                                        bottom: 0,
                                                    }}
                                                >
                                                    <CartesianGrid
                                                        strokeDasharray="3 3"
                                                        stroke="var(--color-border)"
                                                        horizontal={false}
                                                    />
                                                    <XAxis
                                                        type="number"
                                                        tick={{
                                                            fontSize: 11,
                                                            fill: "var(--color-muted-foreground)",
                                                        }}
                                                        tickLine={false}
                                                        axisLine={{
                                                            stroke: "var(--color-border)",
                                                        }}
                                                        tickFormatter={(
                                                            value,
                                                        ) =>
                                                            groupNumber(
                                                                value,
                                                                uiLocale,
                                                            )
                                                        }
                                                    />
                                                    <YAxis
                                                        type="category"
                                                        dataKey="store"
                                                        tick={{
                                                            fontSize: 11,
                                                            fill: "var(--color-muted-foreground)",
                                                        }}
                                                        tickLine={false}
                                                        axisLine={false}
                                                        width={120}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{
                                                            backgroundColor:
                                                                "var(--color-popover)",
                                                            border: "1px solid var(--color-border)",
                                                            borderRadius: "8px",
                                                            fontSize: "12px",
                                                        }}
                                                        labelStyle={{
                                                            color: "var(--color-foreground)",
                                                        }}
                                                        formatter={(value) => [
                                                            displayPrice(value),
                                                            at(
                                                                "revenue",
                                                                uiLocale,
                                                            ),
                                                        ]}
                                                    />
                                                    <Bar
                                                        dataKey="revenue"
                                                        fill="var(--color-primary)"
                                                        radius={[0, 4, 4, 0]}
                                                    />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>

                                        <div className="divide-y divide-border border-t border-border">
                                            {salesByStore.map((store) => (
                                                <div
                                                    key={store.store}
                                                    className="flex items-center justify-between py-2.5 text-sm"
                                                >
                                                    <span className="truncate font-medium text-foreground">
                                                        {store.store}
                                                    </span>
                                                    <span className="shrink-0 text-muted-foreground">
                                                        {toFa(
                                                            store.orders,
                                                            uiLocale,
                                                        )}{" "}
                                                        {at("orders", uiLocale)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                                        {at("no_sales_yet", uiLocale)}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
