'use client';

import { createClient } from '../../lib/supabase';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebook } from 'react-icons/fa';
import { HiOutlineSparkles, HiOutlineChartBar, HiOutlineShieldCheck } from 'react-icons/hi';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleOAuthLogin = async (provider) => {
    setLoading(true);
    // Use NEXT_PUBLIC_APP_URL if available, otherwise fallback to window.location.origin
    const origin = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });
    if (error) {
      console.error('Login error:', error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary mb-4 shadow-glow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">ExpenseFlow</h1>
          <p className="text-gray-400 text-sm">Smart expense tracking with powerful insights</p>
        </div>

        {/* Login Card */}
        <div className="glass-card rounded-2xl p-8">
          <h2 className="text-xl font-semibold text-white text-center mb-2">Welcome Back</h2>
          <p className="text-gray-400 text-sm text-center mb-8">Sign in to manage your expenses</p>

          <div className="space-y-4">
            <button
              onClick={() => handleOAuthLogin('google')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 
                         text-gray-800 font-medium py-3.5 px-6 rounded-xl transition-all duration-200 
                         disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]
                         shadow-lg shadow-white/5"
            >
              <FcGoogle className="w-5 h-5" />
              Continue with Google
            </button>

            <button
              onClick={() => handleOAuthLogin('facebook')}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-[#1877F2] hover:bg-[#166FE5] 
                         text-white font-medium py-3.5 px-6 rounded-xl transition-all duration-200 
                         disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]
                         shadow-lg shadow-blue-500/10"
            >
              <FaFacebook className="w-5 h-5" />
              Continue with Facebook
            </button>
          </div>

          {loading && (
            <div className="mt-6 flex items-center justify-center gap-2 text-gray-400 text-sm">
              <div className="w-4 h-4 border-2 border-accent-primary border-t-transparent rounded-full animate-spin" />
              Redirecting to provider...
            </div>
          )}
        </div>

        {/* Feature highlights */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-dark-700 mb-2">
              <HiOutlineSparkles className="w-5 h-5 text-accent-primary" />
            </div>
            <p className="text-xs text-gray-500">Smart Insights</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-dark-700 mb-2">
              <HiOutlineChartBar className="w-5 h-5 text-accent-success" />
            </div>
            <p className="text-xs text-gray-500">Visual Charts</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-dark-700 mb-2">
              <HiOutlineShieldCheck className="w-5 h-5 text-accent-secondary" />
            </div>
            <p className="text-xs text-gray-500">Secure Data</p>
          </div>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          By signing in, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
