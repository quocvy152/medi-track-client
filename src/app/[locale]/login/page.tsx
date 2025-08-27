"use client";

import { Button } from "@/components/ui/Button";
import { SocialButton } from "@/components/ui/SocialButton";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type TabType = "signin" | "signup";

export default function LoginPage() {
  const t = useTranslations('login');
  const locale = useLocale();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("signin");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.email === "admin@gmail.com" && formData.password === "123456") {
      localStorage.setItem("authToken", "123456");
      router.replace(`/${locale}`);
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto bg-white-600 rounded-full flex items-center justify-center mb-4 overflow-hidden">
            <Image
              src="/images/medi_track_logo.png"
              alt="MediTrack Logo"
              width={150}
              height={150}
              className="object-contain"
              priority
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('welcome')}</h2>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("signin")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "signin"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {t('tabSignin')}
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "signup"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            {t('tabSignup')}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
          {activeTab === "signin" ? (
            <>
              {/* Social auth */}
              <div className="space-y-3">
                <SocialButton provider="google" onClick={() => {}}>
                  Continue with Google
                </SocialButton>
                <SocialButton provider="facebook" onClick={() => {}}>
                  Continue with Facebook
                </SocialButton>
              </div>

              {/* Divider */}
              <div className="flex items-center my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="px-3 text-xs uppercase tracking-wide text-gray-500">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Email/password form */}
              <form onSubmit={handleSignIn} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('email')}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="name@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('password')}
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      {t('remember')}
                    </label>
                  </div>
                  <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
                    {t('forgot')}
                  </a>
                </div>

                <Button type="submit" className="w-full">
                  {t('signin')}
                </Button>
              </form>
            </>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('name')}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('email')}
                </label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label htmlFor="signup-password" className="block text.sm font-medium text-gray-700 mb-2">
                  {t('password')}
                </label>
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('confirmPassword')}
                </label>
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center">
                <input id="terms" name="terms" type="checkbox" required className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  {t('termsPrefix')}
                  <a href="#" className="text-blue-600 hover:text-blue-500">{t('terms')}</a>
                  {t('and')}
                  <a href="#" className="text-blue-600 hover:text-blue-500">{t('privacy')}</a>
                </label>
              </div>

              <Button type="submit" className="w-full">
                {t('signup')}
              </Button>
            </form>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            {activeTab === "signin" ? (
              <>
                {t('noAccount')} {" "}
                <button onClick={() => setActiveTab("signup")} className="text-blue-600 hover:text-blue-500 font-medium">
                  {t('switchToSignup')}
                </button>
              </>
            ) : (
              <>
                {t('haveAccount')} {" "}
                <button onClick={() => setActiveTab("signin")} className="text-blue-600 hover:text-blue-500 font-medium">
                  {t('switchToSignin')}
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
} 