"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Komponen utama login
function LoginContent() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  // Cek apakah sudah di client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Cek apakah sudah login di localStorage - hanya di client
  useEffect(() => {
    if (isClient) {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (isLoggedIn === "true") {
        router.push("/admin");
      }
    }
  }, [isClient, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

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
        localStorage.setItem("loginTime", currentTime.toString());
        router.push("/admin");
      } else {
        setError("Username atau password salah");
      }
      setIsLoading(false);
    }, 1000);
  };

  // Jika belum di client, jangan render apapun yang menggunakan localStorage
  if (!isClient) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat...</p>
        </div>
      </div>
    );
  }

  // Jika sudah login, jangan render form
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn === "true") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Mengalihkan ke dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        
        {/* Development Banner */}
        <div className="bg-amber-500 text-white py-2 px-4 rounded-t-lg text-center">
          <p className="text-sm font-medium">🚧 MODE DEVELOPMENT</p>
        </div>

        {/* Main Card */}
        <div className="bg-white border border-gray-200 rounded-b-lg rounded-tr-lg shadow-sm p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <img 
              src="/logo-lkpp.svg" 
              alt="LKPP Logo" 
              className="h-12 w-auto mx-auto mb-4"
            />
            <h1 className="text-2xl font-light text-gray-900">Admin Portal</h1>
            <p className="text-gray-500 mt-2 text-sm">
              Direktorat Penanganan Permasalahan Hukum
            </p>
          </div>

          {/* Disclaimer Box */}
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800 mb-1">
                  Untuk Development Saja
                </h3>
                <p className="text-xs text-amber-700">
                  Gunakan username: <strong>admin</strong> dan password: <strong>admin</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Masukkan username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                placeholder="Masukkan password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </>
              ) : (
                "Masuk"
              )}
            </button>

            {/* Error Message - dipindahkan di bawah button */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-700 text-center">
                  {error}
                </p>
              </div>
            )}
          </form>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <a 
            href="/" 
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto"></div>
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