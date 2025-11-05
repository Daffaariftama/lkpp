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
  AlertCircle,
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

// Data dummy untuk chart bulanan (statis, tidak perlu loading)
const monthlyData = [
  { name: "Jan", submissions: 45, completed: 32 },
  { name: "Feb", submissions: 52, completed: 38 },
  { name: "Mar", submissions: 48, completed: 35 },
  { name: "Apr", submissions: 60, completed: 45 },
  { name: "May", submissions: 55, completed: 42 },
  { name: "Jun", submissions: 65, completed: 50 },
];

// Skeleton Components
const StatCardSkeleton = () => (
  <Card className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm">
    <CardContent className="p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="h-4 w-20 bg-slate-200 rounded mb-2"></div>
          <div className="h-7 w-12 bg-slate-200 rounded mb-2"></div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 bg-slate-200 rounded"></div>
            <div className="h-3 w-16 bg-slate-200 rounded"></div>
          </div>
        </div>
        <div className="rounded-lg bg-slate-200 p-2 ml-3 flex-shrink-0">
          <div className="h-5 w-5"></div>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ChartSkeleton = () => (
  <div className="h-64 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-2 text-sm text-slate-500">Memuat chart...</p>
    </div>
  </div>
);

const RecentActivitySkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-slate-200 p-1">
            <div className="h-3 w-3"></div>
          </div>
          <div>
            <div className="h-4 w-24 bg-slate-200 rounded mb-1"></div>
            <div className="h-3 w-20 bg-slate-200 rounded"></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
          <div className="h-3 w-12 bg-slate-200 rounded"></div>
        </div>
      </div>
    ))}
  </div>
);

const QuickStatsSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-slate-200 rounded-full"></div>
          <div className="h-3 w-16 bg-slate-200 rounded"></div>
        </div>
        <div className="h-3 w-8 bg-slate-200 rounded"></div>
      </div>
    ))}
  </div>
);

export default function OverviewTab() {
  const { data: statistics, isLoading: statsLoading, error: statsError } = api.admin.getStatistics.useQuery();
  const { data: consultationsData, isLoading: consultationsLoading, error: consultationsError } = api.admin.getConsultations.useQuery({
    page: 1,
    limit: 5,
  });

  const isLoading = statsLoading ?? consultationsLoading;
  const hasError = statsError ?? consultationsError;

  // Safe data dengan default values
  const safeStatistics = statistics ?? {
    total: 0,
    byStatus: {
      submitted: 0,
      inReview: 0,
      processed: 0,
      completed: 0,
      rejected: 0,
    },
  };

  const safeConsultations = consultationsData?.consultations ?? [];

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

  const formatDate = (dateString: string | Date) => {
    try {
      return new Date(dateString).toLocaleDateString("id-ID");
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Data untuk charts
  const statusChartData = [
    { name: "Submitted", value: safeStatistics.byStatus.submitted, color: STATUS_COLORS.SUBMITTED },
    { name: "In Review", value: safeStatistics.byStatus.inReview, color: STATUS_COLORS.IN_REVIEW },
    { name: "Processed", value: safeStatistics.byStatus.processed, color: STATUS_COLORS.PROCESSED },
    { name: "Completed", value: safeStatistics.byStatus.completed, color: STATUS_COLORS.COMPLETED },
    { name: "Rejected", value: safeStatistics.byStatus.rejected, color: STATUS_COLORS.REJECTED },
  ].filter(item => item.value > 0);

  const recentActivities = safeConsultations.slice(0, 5);

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

  // Calculate metrics safely
  const inProgress = safeStatistics.byStatus.inReview + safeStatistics.byStatus.processed;
  const successRate = safeStatistics.total > 0 
    ? Math.round((safeStatistics.byStatus.completed / safeStatistics.total) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {hasError && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-amber-800 text-sm font-medium">
                Terjadi gangguan sementara pada sistem
              </p>
              <p className="text-amber-700 text-xs mt-1">
                Data yang ditampilkan mungkin tidak lengkap. Silakan refresh halaman.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics Cards - Responsive 2 cards per row on mobile */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <StatCardSkeleton key={index} />
          ))
        ) : (
          <>
            <Card className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">
                      Total Konsultasi
                    </p>
                    <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-slate-800">
                      {safeStatistics.total}
                    </p>
                    <div className="mt-1 sm:mt-2 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600 flex-shrink-0" />
                      <span className="text-xs text-emerald-600 truncate">
                        +12% from last month
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg sm:rounded-xl bg-blue-100 p-2 sm:p-3 ml-2 flex-shrink-0">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">
                      In Progress
                    </p>
                    <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-slate-800">
                      {inProgress}
                    </p>
                    <div className="mt-1 sm:mt-2 flex items-center gap-1">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600 flex-shrink-0" />
                      <span className="text-xs text-amber-600 truncate">
                        Need attention
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg sm:rounded-xl bg-amber-100 p-2 sm:p-3 ml-2 flex-shrink-0">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">
                      Completed
                    </p>
                    <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-slate-800">
                      {safeStatistics.byStatus.completed}
                    </p>
                    <div className="mt-1 sm:mt-2 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600 flex-shrink-0" />
                      <span className="text-xs text-emerald-600 truncate">
                        +8% from last month
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg sm:rounded-xl bg-emerald-100 p-2 sm:p-3 ml-2 flex-shrink-0">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm transition-all duration-200 hover:shadow-md">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-slate-600 truncate">
                      Success Rate
                    </p>
                    <p className="mt-1 sm:mt-2 text-xl sm:text-2xl font-bold text-slate-800">
                      {successRate}%
                    </p>
                    <div className="mt-1 sm:mt-2 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 flex-shrink-0" />
                      <span className="text-xs text-purple-600 truncate">
                        Excellent performance
                      </span>
                    </div>
                  </div>
                  <div className="rounded-lg sm:rounded-xl bg-purple-100 p-2 sm:p-3 ml-2 flex-shrink-0">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Status Distribution Chart */}
        <Card className="border-slate-200 bg-white/80 shadow-lg backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-slate-800 text-lg">
              <BarChart3 className="h-4 w-4" />
              Status Distribution
            </CardTitle>
            <CardDescription>
              Distribusi status konsultasi saat ini
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ChartSkeleton />
            ) : statusChartData.length > 0 ? (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {statusChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${value} konsultasi`, "Jumlah"]}
                      labelFormatter={(name) => `Status: ${name}`}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-500">
                <div className="text-center">
                  <BarChart3 className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                  <p className="text-sm">Tidak ada data untuk ditampilkan</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Monthly Trend Chart */}
        <Card className="border-slate-200 bg-white/80 shadow-lg backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-slate-800 text-lg">
              <TrendingUp className="h-4 w-4" />
              Monthly Trend
            </CardTitle>
            <CardDescription>
              Trend pengajuan dan penyelesaian konsultasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="submissions"
                    stroke={CHART_COLORS.primary}
                    strokeWidth={2}
                    dot={{ fill: CHART_COLORS.primary, r: 3 }}
                    name="Pengajuan"
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke={CHART_COLORS.success}
                    strokeWidth={2}
                    dot={{ fill: CHART_COLORS.success, r: 3 }}
                    name="Selesai"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activities & Quick Stats */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Recent Activities */}
        <Card className="border-slate-200 bg-white/80 shadow-lg backdrop-blur-sm lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-slate-800 text-lg">
              <Calendar className="h-4 w-4" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Konsultasi terbaru yang membutuhkan perhatian
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <RecentActivitySkeleton />
            ) : recentActivities.length > 0 ? (
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 transition-colors duration-150 hover:bg-white"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="rounded-lg bg-blue-100 p-1 flex-shrink-0">
                        <FileText className="h-3 w-3 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-800 text-sm truncate">
                          {activity.nama ?? "N/A"}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-slate-600 truncate">
                          <Building className="h-2 w-2 flex-shrink-0" />
                          {activity.instansi ?? "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {getStatusBadge(activity.status ?? "SUBMITTED")}
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {formatDate(activity.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <FileText className="mx-auto h-8 w-8 text-slate-300 mb-2" />
                <p className="text-sm">Tidak ada aktivitas terbaru</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="border-slate-200 bg-white/80 shadow-lg backdrop-blur-sm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-slate-800 text-lg">
              <BarChart3 className="h-4 w-4" />
              Quick Stats
            </CardTitle>
            <CardDescription>
              Ringkasan status konsultasi
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <QuickStatsSkeleton />
            ) : (
              <div className="space-y-3">
                {statusChartData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm font-medium text-slate-700">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-800">{item.value}</span>
                      <span className="text-xs text-slate-500">
                        ({Math.round((item.value / (safeStatistics.total ?? 1)) * 100)}%)
                      </span>
                    </div>
                  </div>
                ))}
                
                {/* Performance Insight */}
                <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-semibold text-slate-800">Performance Insight</p>
                      <p className="text-xs text-slate-600">
                        {safeStatistics.byStatus.completed > 20
                          ? "Excellent performance this month! 🎉"
                          : "Keep up the good work! 💪"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}