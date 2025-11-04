// app/admin/_components/overview-tab.tsx
"use client";

import {
  BarChart3,
  Building,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { api } from "~/trpc/react";

// Warna modern untuk chart
const CHART_COLORS = {
  primary: "#3B82F6",
  secondary: "#8B5CF6",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#06B6D4",
  gray: "#6B7280",
};

const STATUS_COLORS = {
  DRAFT: CHART_COLORS.gray,
  SUBMITTED: CHART_COLORS.primary,
  IN_REVIEW: CHART_COLORS.warning,
  PROCESSED: CHART_COLORS.info,
  COMPLETED: CHART_COLORS.success,
  REJECTED: CHART_COLORS.danger,
};

// Interface untuk data pie chart yang kompatibel dengan Recharts
interface PieChartData {
  name: string;
  value: number;
  color: string;
  [key: string]: string | number; // Tambahkan index signature ini
}

// Type untuk PieChart props
interface PieLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}

export default function OverviewTab() {
  const { data: statistics } = api.admin.getStatistics.useQuery();
  const { data: consultationsData } = api.admin.getConsultations.useQuery({
    page: 1,
    limit: 5,
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: {
        label: "Draft",
        color: "bg-gray-100 text-gray-800 border-gray-200",
      },
      SUBMITTED: {
        label: "Submitted",
        color: "bg-blue-50 text-blue-700 border-blue-200",
      },
      IN_REVIEW: {
        label: "In Review",
        color: "bg-amber-50 text-amber-700 border-amber-200",
      },
      PROCESSED: {
        label: "Processed",
        color: "bg-purple-50 text-purple-700 border-purple-200",
      },
      COMPLETED: {
        label: "Completed",
        color: "bg-emerald-50 text-emerald-700 border-emerald-200",
      },
      REJECTED: {
        label: "Rejected",
        color: "bg-rose-50 text-rose-700 border-rose-200",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ??
      statusConfig.SUBMITTED;
    return (
      <span
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID");
  };

  // Data untuk charts - PERBAIKAN: Gunakan tipe yang benar
  const statusChartData: PieChartData[] = statistics
    ? [
        {
          name: "Submitted",
          value: statistics.byStatus.submitted,
          color: STATUS_COLORS.SUBMITTED,
        },
        {
          name: "In Review", 
          value: statistics.byStatus.inReview,
          color: STATUS_COLORS.IN_REVIEW,
        },
        {
          name: "Processed",
          value: statistics.byStatus.processed,
          color: STATUS_COLORS.PROCESSED,
        },
        {
          name: "Completed",
          value: statistics.byStatus.completed,
          color: STATUS_COLORS.COMPLETED,
        },
        {
          name: "Rejected",
          value: statistics.byStatus.rejected,
          color: STATUS_COLORS.REJECTED,
        },
      ]
    : [];

  const monthlyData = [
    { name: "Jan", submissions: 45, completed: 32 },
    { name: "Feb", submissions: 52, completed: 38 },
    { name: "Mar", submissions: 48, completed: 35 },
    { name: "Apr", submissions: 60, completed: 45 },
    { name: "May", submissions: 55, completed: 42 },
    { name: "Jun", submissions: 65, completed: 50 },
  ];

  const recentActivities = consultationsData?.consultations.slice(0, 5) ?? [];

  // Custom label function untuk pie chart
  // Custom label function untuk pie chart
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  if (percent === 0) return null;
  
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

  return (
    <div className="space-y-8">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Total Konsultasi
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-800">
                  {statistics?.total ?? 0}
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-600">
                    +12% from last month
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-blue-100 p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  In Progress
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-800">
                  {(statistics?.byStatus.inReview ?? 0) +
                    (statistics?.byStatus.processed ?? 0)}
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-medium text-amber-600">
                    Need attention
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-amber-100 p-3">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Completed
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-800">
                  {statistics?.byStatus.completed ?? 0}
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-medium text-emerald-600">
                    +8% from last month
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-emerald-100 p-3">
                <CheckCircle className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">
                  Success Rate
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-800">
                  {statistics?.total
                    ? Math.round(
                        (statistics.byStatus.completed / statistics.total) * 100,
                      )
                    : 0}
                  %
                </p>
                <div className="mt-2 flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-medium text-purple-600">
                    Excellent performance
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-purple-100 p-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Status Distribution Chart */}
        <Card className="border-slate-200 bg-white/80 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <BarChart3 className="h-5 w-5" />
              Status Distribution
            </CardTitle>
            <CardDescription>
              Distribusi status konsultasi saat ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData.filter((item) => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusChartData
                      .filter((item) => item.value > 0)
                      .map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value} konsultasi`, "Jumlah"]}
                    labelFormatter={(name) => `Status: ${name}`}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>

              {statusChartData.every((item) => item.value === 0) && (
                <div className="flex h-80 items-center justify-center">
                  <div className="text-center text-slate-500">
                    <BarChart3 className="mx-auto mb-2 h-12 w-12 text-slate-300" />
                    <p className="text-sm font-medium">
                      Tidak ada data untuk ditampilkan
                    </p>
                    <p className="text-xs">Semua status memiliki nilai 0</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trend Chart */}
        <Card className="border-slate-200 bg-white/80 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <TrendingUp className="h-5 w-5" />
              Monthly Trend
            </CardTitle>
            <CardDescription>
              Trend pengajuan dan penyelesaian konsultasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "8px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="submissions"
                    stroke={CHART_COLORS.primary}
                    strokeWidth={3}
                    dot={{
                      fill: CHART_COLORS.primary,
                      strokeWidth: 2,
                      r: 4,
                    }}
                    name="Pengajuan"
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke={CHART_COLORS.success}
                    strokeWidth={3}
                    dot={{
                      fill: CHART_COLORS.success,
                      strokeWidth: 2,
                      r: 4,
                    }}
                    name="Selesai"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities & Quick Stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent Activities */}
        <Card className="border-slate-200 bg-white/80 shadow-lg backdrop-blur-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Calendar className="h-5 w-5" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Konsultasi terbaru yang membutuhkan perhatian
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4 transition-colors duration-200 hover:bg-white"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">
                        {activity.nama}
                      </p>
                      <p className="flex items-center gap-1 text-sm text-slate-600">
                        <Building className="h-3 w-3" />
                        {activity.instansi}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(activity.status)}
                    <span className="text-sm text-slate-500">
                      {formatDate(activity.createdAt.toString())}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="border-slate-200 bg-white/80 shadow-lg backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <BarChart3 className="h-5 w-5" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusChartData.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-medium text-slate-700">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-800">
                      {item.value}
                    </span>
                    <span className="text-xs text-slate-500">
                      (
                      {Math.round(
                        (item.value / (statistics?.total ?? 1)) * 100,
                      )}
                      %)
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Performance Insight
                  </p>
                  <p className="text-xs text-slate-600">
                    {statistics?.byStatus.completed &&
                    statistics.byStatus.completed > 20
                      ? "Excellent performance this month! 🎉"
                      : "Keep up the good work! 💪"}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}