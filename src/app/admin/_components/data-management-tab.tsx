// app/admin/_components/data-management-tab.tsx
"use client";

import {
  Building,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FileText,
  Filter,
  Mail,
  MoreHorizontal,
  Search,
  Trash2,
  Users
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
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

export default function DataManagementTab() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

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

  return (
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
                <DropdownMenuItem onClick={() => setStatusFilter("SUBMITTED")}>
                  Submitted
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("IN_REVIEW")}>
                  In Review
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("PROCESSED")}>
                  Processed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("COMPLETED")}>
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("REJECTED")}>
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
                    <TableRow key={index} className="hover:bg-slate-50/50">
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
                                onClick={() => handleDelete(consultation.id)}
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
          {consultationsData && consultationsData.pagination.pages > 1 && (
            <div className="mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row">
              {/* Info Data */}
              <div className="text-center text-sm text-slate-700 sm:text-left">
                Menampilkan {(page - 1) * 10 + 1} -{" "}
                {Math.min(page * 10, consultationsData.pagination.total)} dari{" "}
                {consultationsData.pagination.total} data
              </div>

              {/* Navigation */}
              <div className="flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
                {/* Page Input - di atas untuk mobile */}
                <div className="order-1 flex items-center gap-2 text-sm sm:order-2">
                  <span className="xs:inline hidden">Page</span>
                  <input
                    type="number"
                    min="1"
                    max={consultationsData.pagination.pages}
                    value={page}
                    onChange={(e) => {
                      const newPage = parseInt(e.target.value);
                      if (
                        newPage >= 1 &&
                        newPage <= consultationsData.pagination.pages
                      ) {
                        setPage(newPage);
                      }
                    }}
                    onBlur={(e) => {
                      let newPage = parseInt(e.target.value);
                      if (isNaN(newPage) || newPage < 1) newPage = 1;
                      if (newPage > consultationsData.pagination.pages)
                        newPage = consultationsData.pagination.pages;
                      setPage(newPage);
                    }}
                    className="w-16 rounded border border-slate-300 px-2 py-1 text-center"
                  />
                  <span>of {consultationsData.pagination.pages}</span>
                </div>

                {/* Button Group */}
                <div className="order-2 flex items-center gap-1 sm:order-1">
                  {/* First Page */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                    className="xs:flex hidden border-slate-300 hover:bg-slate-50"
                  >
                    <span className="hidden sm:inline">First</span>
                    <ChevronLeft className="h-4 w-4 sm:ml-1" />
                    <ChevronLeft className="xs:block -ml-2 hidden h-4 w-4" />
                  </Button>

                  {/* Previous Page */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="border-slate-300 hover:bg-slate-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="xs:inline ml-1 hidden">Prev</span>
                  </Button>

                  {/* Next Page */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(page + 1)}
                    disabled={page === consultationsData.pagination.pages}
                    className="border-slate-300 hover:bg-slate-50"
                  >
                    <span className="xs:inline mr-1 hidden">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>

                  {/* Last Page */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(consultationsData.pagination.pages)}
                    disabled={page === consultationsData.pagination.pages}
                    className="xs:flex hidden border-slate-300 hover:bg-slate-50"
                  >
                    <ChevronRight className="xs:block -mr-2 hidden h-4 w-4" />
                    <ChevronRight className="mr-1 h-4 w-4" />
                    <span className="hidden sm:inline">Last</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
