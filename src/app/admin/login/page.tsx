"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Komponen utama login
function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  // Cek apakah sudah login di localStorage
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      router.push("/admin");
    }
  }, [router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  // Di bagian handleLogin success di file login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate API call delay
    setTimeout(() => {
      if (formData.username === "admin" && formData.password === "admin") {
        // Login successful
        const currentTime = new Date().getTime();
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("username", formData.username);
        localStorage.setItem("loginTime", currentTime.toString()); // Simpan waktu login
        router.push("/admin");
      } else {
        setError("Username atau password salah");
      }
      setIsLoading(false);
    }, 1000);
  };

  // Jika sudah login, jangan render form
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn === "true") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white p-6">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-600"></div>
          <p className="mt-4 text-gray-600">Mengalihkan ke dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Development Banner */}
        <div className="rounded-t-lg bg-amber-500 px-4 py-2 text-center text-white">
          <p className="text-sm font-medium">🚧 MODE DEVELOPMENT</p>
        </div>

        {/* Main Card */}
        <div className="rounded-tr-lg rounded-b-lg border border-gray-200 bg-white p-8 shadow-sm">
          {/* Header */}
          <div className="mb-8 text-center">
            <img
              src="/logo-lkpp.svg"
              alt="LKPP Logo"
              className="mx-auto mb-4 h-12 w-auto"
            />
            <h1 className="text-2xl font-light text-gray-900">Admin Portal</h1>
            <p className="mt-2 text-sm text-gray-500">
              Direktorat Penanganan Permasalahan Hukum
            </p>
          </div>

          {/* Disclaimer Box */}
          <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <svg
                  className="h-5 w-5 text-amber-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="mb-1 text-sm font-medium text-amber-800">
                  Untuk Development Saja
                </h3>
                <p className="text-xs text-amber-700">
                  Gunakan username: <strong>admin</strong> dan password:{" "}
                  <strong>admin</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-gray-500 focus:outline-none"
                placeholder="Masukkan username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-gray-500 focus:outline-none"
                placeholder="Masukkan password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center rounded-lg bg-gray-700 px-4 py-3 font-medium text-white transition-colors hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <svg
                    className="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Memproses...
                </>
              ) : (
                "Masuk"
              )}
            </button>

            {/* Error Message - dipindahkan di bawah button */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-center text-sm text-red-700">{error}</p>
              </div>
            )}
          </form>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <a
            href="/"
            className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700"
          >
            <svg
              className="mr-1 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Kembali ke halaman utama
          </a>
        </div>
      </div>
    </div>
  );
}

// Fallback component untuk loading
function LoginFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-gray-600"></div>
          <p className="mt-4 text-gray-600">Memuat halaman login...</p>
        </div>
      </div>
    </div>
  );
}

// Komponen utama dengan Suspense boundary
export default function AdminLogin() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginContent />
    </Suspense>
  );
}
