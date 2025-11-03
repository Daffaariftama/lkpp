// app/admin/page.tsx
"use client";

import {
  BarChart3,
  Building,
  Calendar,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Mail,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
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
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
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

export default function AdminDashboard() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"overview" | "data">("data");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch data
  const {
    data: consultationsData,
    isLoading,
    refetch,
  } = api.admin.getConsultations.useQuery({
    page,
    limit: 10,
    search: debouncedSearch,
    status: statusFilter,
  });

  const { data: statistics } = api.admin.getStatistics.useQuery();

  // Mutations
  const deleteMutation = api.admin.deleteConsultation.useMutation({
    onSuccess: () => refetch(),
  });

  const updateStatusMutation = api.admin.updateStatus.useMutation({
    onSuccess: () => refetch(),
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    try {
      await deleteMutation.mutateAsync({ id });
    } catch (error) {
      alert("Gagal menghapus data");
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({ id, status: newStatus });
    } catch (error) {
      alert("Gagal mengubah status");
    }
  };

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
      statusConfig[status as keyof typeof statusConfig] ||
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

  // Data untuk charts
  const statusChartData = statistics
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

  const recentActivities = consultationsData?.consultations.slice(0, 5) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between py-3 sm:py-4">
            {/* Logo dan Deskripsi - Susunan Vertikal */}
            <div className="flex flex-col items-start gap-1 space-y-1.5">
              <div className="flex-shrink-0">
                <Link href="/">
                  <img
                    src="/logo-lkpp.svg"
                    className="h-auto w-24 sm:w-32 lg:w-42"
                    alt="LKPP Logo"
                  />
                </Link>
              </div>
              <div>
                <p className="text-xs text-slate-600 sm:text-sm lg:text-base">
                  Kelola data konsultasi dengan mudah
                </p>
              </div>
            </div>

            {/* Tombol Form Baru */}
            <Button
              asChild
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg hover:to-cyan-600"
              size="sm"
            >
              <Link href="/" className="flex items-center gap-1 sm:gap-2">
                <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="text-xs sm:text-sm">Form Baru</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Tab Navigation */}
        <div className="mb-8 flex w-fit space-x-1 rounded-2xl border border-slate-200 bg-white/80 p-1 backdrop-blur-sm">
          <button
            onClick={() => setActiveTab("overview")}
            className={`rounded-xl px-6 py-3 text-sm font-medium transition-all duration-200 ${
              activeTab === "overview"
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("data")}
            className={`rounded-xl px-6 py-3 text-sm font-medium transition-all duration-200 ${
              activeTab === "data"
                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
            }`}
          >
            Data Management
          </button>
        </div>

        {activeTab === "overview" ? (
          /* Overview Tab dengan Data Visual */
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
                        {statistics?.total || 0}
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
                        {(statistics?.byStatus.inReview || 0) +
                          (statistics?.byStatus.processed || 0)}
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
                        {statistics?.byStatus.completed || 0}
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
                              (statistics.byStatus.completed /
                                statistics.total) *
                                100,
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
                          data={statusChartData.filter(
                            (item) => item.value > 0,
                          )} // Filter out zero values
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value, percent }) =>
                            `${name}: ${value} (${(percent * 100).toFixed(0)}%)`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusChartData
                            .filter((item) => item.value > 0) // Filter out zero values for cells too
                            .map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => [
                            `${value} konsultasi`,
                            "Jumlah",
                          ]}
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e2e8f0",
                            borderRadius: "8px",
                            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    {/* Tambahkan pesan jika semua data 0 */}
                    {statusChartData.every((item) => item.value === 0) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center text-slate-500">
                          <BarChart3 className="mx-auto mb-2 h-12 w-12 text-slate-300" />
                          <p className="text-sm font-medium">
                            Tidak ada data untuk ditampilkan
                          </p>
                          <p className="text-xs">
                            Semua status memiliki nilai 0
                          </p>
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
                              (item.value / (statistics?.total || 1)) * 100,
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
        ) : (
          /* Data Management Tab */
          <div className="space-y-6">
            {/* Filters and Search */}
            <Card className="border-slate-200 bg-white/80 shadow-lg backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative flex-1">
                    <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-slate-400" />
                    <Input
                      placeholder="Cari berdasarkan nama, instansi, atau jenis permasalahan..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="border-slate-300 pl-10 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 border-slate-300 hover:bg-slate-50"
                      >
                        <Filter className="h-4 w-4" />
                        Status: {statusFilter || "Semua"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="border-slate-200 bg-white/95 backdrop-blur-sm">
                      <DropdownMenuItem onClick={() => setStatusFilter("")}>
                        Semua Status
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatusFilter("SUBMITTED")}
                      >
                        Submitted
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatusFilter("IN_REVIEW")}
                      >
                        In Review
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatusFilter("PROCESSED")}
                      >
                        Processed
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatusFilter("COMPLETED")}
                      >
                        Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setStatusFilter("REJECTED")}
                      >
                        Rejected
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>

            {/* Data Table */}
            <Card className="border-slate-200 bg-white/80 shadow-lg backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-slate-800">
                  <FileText className="h-5 w-5" />
                  Data Konsultasi
                  {consultationsData && (
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-blue-100 text-blue-700"
                    >
                      {consultationsData.pagination.total} items
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <Table>
                    <TableHeader className="bg-slate-50/80">
                      <TableRow>
                        <TableHead className="font-semibold text-slate-700">
                          Tanggal
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700">
                          Nama Pemohon
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700">
                          Instansi
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700">
                          Kontak
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700">
                          Jenis Permasalahan
                        </TableHead>
                        <TableHead className="font-semibold text-slate-700">
                          Status
                        </TableHead>
                        <TableHead className="text-right font-semibold text-slate-700">
                          Aksi
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                          <TableRow
                            key={index}
                            className="hover:bg-slate-50/50"
                          >
                            <TableCell>
                              <Skeleton className="h-4 w-20" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-32" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-24" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-28" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-4 w-36" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="h-6 w-16" />
                            </TableCell>
                            <TableCell>
                              <Skeleton className="ml-auto h-8 w-24" />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : consultationsData?.consultations.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={7}
                            className="py-12 text-center text-slate-500"
                          >
                            <div className="flex flex-col items-center gap-3">
                              <FileText className="h-12 w-12 text-slate-300" />
                              <p className="text-lg font-medium text-slate-600">
                                Tidak ada data yang ditemukan
                              </p>
                              <p className="text-sm text-slate-500">
                                Coba ubah filter pencarian Anda
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        consultationsData?.consultations.map((consultation) => (
                          <TableRow
                            key={consultation.id}
                            className="transition-colors duration-150 hover:bg-slate-50/50"
                          >
                            <TableCell className="whitespace-nowrap text-slate-600">
                              {formatDate(consultation.createdAt.toString())}
                            </TableCell>
                            <TableCell className="font-medium text-slate-800">
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-slate-400" />
                                {consultation.nama}
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-700">
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4 text-slate-400" />
                                {consultation.instansi}
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-600">
                              <div className="space-y-1">
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  <span className="text-xs">
                                    {consultation.noTelp}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-xs text-slate-700">
                              <div className="line-clamp-2 text-sm">
                                {consultation.jenisPermasalahan}
                              </div>
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(consultation.status)}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 hover:bg-slate-100"
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="w-48 border-slate-200 bg-white/95 backdrop-blur-sm"
                                  >
                                    <DropdownMenuItem asChild>
                                      <Link
                                        href={`/admin/consultation/${consultation.id}`}
                                        className="flex cursor-pointer items-center gap-2 text-slate-700"
                                      >
                                        <Edit className="h-4 w-4" />
                                        Edit Data
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <Link
                                        href={`/admin/consultation/${consultation.id}`}
                                        className="flex cursor-pointer items-center gap-2 text-slate-700"
                                      >
                                        <Eye className="h-4 w-4" />
                                        Lihat Detail
                                      </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex cursor-pointer items-center gap-2 text-slate-700">
                                      <Download className="h-4 w-4" />
                                      Export PDF
                                    </DropdownMenuItem>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger className="w-full">
                                        <div className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-100">
                                          <CheckCircle className="h-4 w-4" />
                                          Ubah Status
                                        </div>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent className="border-slate-200 bg-white/95 backdrop-blur-sm">
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleStatusUpdate(
                                              consultation.id,
                                              "SUBMITTED",
                                            )
                                          }
                                        >
                                          Submitted
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleStatusUpdate(
                                              consultation.id,
                                              "IN_REVIEW",
                                            )
                                          }
                                        >
                                          In Review
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleStatusUpdate(
                                              consultation.id,
                                              "PROCESSED",
                                            )
                                          }
                                        >
                                          Processed
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleStatusUpdate(
                                              consultation.id,
                                              "COMPLETED",
                                            )
                                          }
                                        >
                                          Completed
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={() =>
                                            handleStatusUpdate(
                                              consultation.id,
                                              "REJECTED",
                                            )
                                          }
                                        >
                                          Rejected
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        handleDelete(consultation.id)
                                      }
                                      className="flex cursor-pointer items-center gap-2 text-red-600"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                      Hapus Data
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {consultationsData &&
                  consultationsData.pagination.pages > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                      <div className="text-sm text-slate-700">
                        Menampilkan {(page - 1) * 10 + 1} -{" "}
                        {Math.min(
                          page * 10,
                          consultationsData.pagination.total,
                        )}{" "}
                        dari {consultationsData.pagination.total} data
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(page - 1)}
                          disabled={page === 1}
                          className="border-slate-300 hover:bg-slate-50"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {Array.from(
                          {
                            length: Math.min(
                              5,
                              consultationsData.pagination.pages,
                            ),
                          },
                          (_, i) => {
                            const pageNumber = i + 1;
                            return (
                              <Button
                                key={pageNumber}
                                variant={
                                  page === pageNumber ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => setPage(pageNumber)}
                                className={
                                  page === pageNumber
                                    ? "border-transparent bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                                    : "border-slate-300 hover:bg-slate-50"
                                }
                              >
                                {pageNumber}
                              </Button>
                            );
                          },
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(page + 1)}
                          disabled={page === consultationsData.pagination.pages}
                          className="border-slate-300 hover:bg-slate-50"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
