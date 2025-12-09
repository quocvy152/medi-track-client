"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SocialButton } from "@/components/ui/SocialButton";
import { getFacebookAuthUrl } from "@/lib/facebookAuth";
import { getGoogleAuthUrl } from "@/lib/googleAuth";
import { authService } from "@/services/authService";
import { EnvelopeIcon, LockClosedIcon, UserIcon } from "@heroicons/react/24/outline";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from 'react-hot-toast';

type TabType = "signin" | "signup";

export default function LoginPage() {
  const t = useTranslations('login');
  const locale = useLocale();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("signin");
  const [isLoading, setIsLoading] = useState(false);
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

  const validateForm = () => {
    if (formData.email === "" || formData.password === "") {
      toast.error(t('emailAndPasswordRequired'));
      return false;
    }
    return true;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const { email, password } = formData;

      const response = await authService.login({ email, password });
      const { success, data } = response;

      if (success) {
        localStorage.setItem("authToken", data?.accessToken || '');
        toast.success(t('loginSuccess'));
        
        window.dispatchEvent(new Event('authStateChanged'));
        
        router.replace(`/${locale}`);
      } else {
        toast.error(t('loginError'));
      }
    } catch {
      toast.error(t('loginError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleStart = () => {
    try {
      const url = getGoogleAuthUrl();
      window.location.href = url;
    } catch {
      toast.error('Failed to start Google Sign-In');
    }
  };
  
  const handleFacebookStart = () => {
    try {
      const url = getFacebookAuthUrl();
      window.location.href = url;
    } catch {
      toast.error('Failed to start Facebook Sign-In');
    }
  };

  const validateSignUpForm = () => {
    if (formData.password !== formData.confirmPassword) {
      toast.error(t('passwordMismatch'));
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error(t('passwordTooShort'));
      return;
    }

    return true;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateSignUpForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { name, email, password } = formData;

      const response = await authService.register({ email, password, firstName: name });
      const { success } = response;

      if (success) {
        toast.success(t('signupSuccess'));

        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });

        setActiveTab('signin');
      } else {
        toast.error(t('signupError'));
      }
    } catch {
      toast.error(t('signupError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 relative overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/5 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-6 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-xl animate-pulse-slow" />
              <div className="relative bg-white/10 dark:bg-slate-900/20 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-slate-700/50 shadow-xl">
                <Image
                  src="/images/medi_track_logo.png"
                  alt="MediTrack Logo"
                  width={120}
                  height={120}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 font-heading">
            {t('title')}
          </h1>
          <p className="text-slate-300 text-lg">
            {t('subtitle')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="mb-6 bg-white/10 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-1.5 border border-white/20 dark:border-slate-700/50 shadow-lg">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("signin")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === "signin"
                  ? "bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow-md"
                  : "text-slate-300 dark:text-slate-400 hover:text-white dark:hover:text-slate-200"
              }`}
            >
              {t('signin')}
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === "signup"
                  ? "bg-white dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 shadow-md"
                  : "text-slate-300 dark:text-slate-400 hover:text-white dark:hover:text-slate-200"
              }`}
            >
              {t('signup')}
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-slate-700/50 p-8 md:p-10">
          {activeTab === "signin" ? (
            <>
              {/* Social auth */}
              <div className="space-y-3 mb-6">
                <SocialButton provider="google" onClick={handleGoogleStart}>
                  Continue with Google
                </SocialButton>
                <SocialButton provider="facebook" onClick={handleFacebookStart}>
                  Continue with Facebook
                </SocialButton>
              </div>

              {/* Divider */}
              <div className="flex items-center my-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent" />
                <span className="px-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {t('descriptionBtnLogin')}
                </span>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent via-slate-300 dark:via-slate-600 to-transparent" />
              </div>

              {/* Sign In Form */}
              <form onSubmit={handleSignIn} className="space-y-5">
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('email')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <Input
                      type="email"
                      name="email"
                      id="email"
                      placeholder={t('email')}
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-12 h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-cyan-500/20 dark:focus:ring-cyan-400/20 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('password')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <Input
                      type="password"
                      name="password"
                      id="password"
                      placeholder={t('password')}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-12 h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-cyan-500/20 dark:focus:ring-cyan-400/20 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 rounded-xl" 
                  loading={isLoading}
                >
                  {t('signin')}
                </Button>
              </form>
            </>
          ) : (
            <>
              {/* Social auth */}
              <div className="space-y-3 mb-6">
                <SocialButton provider="google" onClick={handleGoogleStart}>
                  Continue with Google
                </SocialButton>
                <SocialButton provider="facebook" onClick={handleFacebookStart}>
                  Continue with Facebook
                </SocialButton>
              </div>

              {/* Divider */}
              <div className="flex items-center my-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-300 dark:via-slate-600 to-transparent" />
                <span className="px-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {t('descriptionBtnLogin')}
                </span>
                <div className="flex-1 h-px bg-gradient-to-l from-transparent via-slate-300 dark:via-slate-600 to-transparent" />
              </div>

              {/* Sign Up Form */}
              <form onSubmit={handleSignUp} className="space-y-5">
                <div className="space-y-1">
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('name')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <Input
                      type="text"
                      name="name"
                      id="name"
                      placeholder={t('name')}
                      value={formData.name}
                      onChange={handleInputChange}
                      className="pl-12 h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-cyan-500/20 dark:focus:ring-cyan-400/20 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="email-signup" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('email')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <Input
                      type="email"
                      name="email"
                      id="email-signup"
                      placeholder={t('email')}
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-12 h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-cyan-500/20 dark:focus:ring-cyan-400/20 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="password-signup" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('password')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <Input
                      type="password"
                      name="password"
                      id="password-signup"
                      placeholder={t('password')}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-12 h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-cyan-500/20 dark:focus:ring-cyan-400/20 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('confirmPassword')}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-slate-400" />
                    </div>
                    <Input
                      type="password"
                      name="confirmPassword"
                      id="confirmPassword"
                      placeholder={t('confirmPassword')}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-12 h-12 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 focus:border-cyan-500 dark:focus:border-cyan-400 focus:ring-cyan-500/20 dark:focus:ring-cyan-400/20 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                      required
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 rounded-xl" 
                  loading={isLoading}
                >
                  {t('signup')}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
