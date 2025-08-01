"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import publicAxios from "../../../lib/publicApi";


export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const setCookie = (name, value, days = 7) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; path=/; expires=${expires}; SameSite=Strict`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await publicAxios.post("/user/login", {
        email: form.email,
        password: form.password,
      });

      if (res.data.success && res.data.data.token) {
        setCookie("jwt", res.data.data.token);
        localStorage.setItem(
          "persist:auth",
          JSON.stringify({ token: JSON.stringify(res.data.data.token) })
        );
        router.push("/dashboard");
      } else {
        setError(res.data.message || "Login failed.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50">
      <section className="w-full max-w-sm px-6 py-8 bg-white border border-neutral-200 rounded-lg shadow-sm">
        <h1 className="text-2xl font-semibold text-neutral-900 mb-6 text-center tracking-tight">
          Sign in to your account
        </h1>
        <form className="space-y-5" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              className="block w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition text-neutral-900 placeholder-neutral-400"
              placeholder="you@email.com"
              value={form.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                autoComplete="current-password"
                className="block w-full rounded-md border border-neutral-300 bg-neutral-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-neutral-900 transition text-neutral-900 placeholder-neutral-400"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-xs text-neutral-500 focus:outline-none"
                onClick={() => setShowPassword((v) => !v)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md bg-neutral-900 text-white font-semibold hover:bg-neutral-700 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </section>
    </main>
  );
}