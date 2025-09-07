"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SocialButton } from "@/components/ui/SocialButton";
import { authService } from "@/services/authService";
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
      const { state, data } = response;

      if (state) {
        localStorage.setItem("authToken", data.accessToken);
        toast.success(t('loginSuccess'));
        
        // Dispatch custom event to notify Navigation component
        window.dispatchEvent(new Event('authStateChanged'));
        
        router.replace(`/${locale}`);
      } else {
        toast.error(t('loginError'));
      }
    } catch (error) {
      console.log({ error })
      toast.error(t('loginError'));
    } finally {
      setIsLoading(false);
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

    const { name, email, password } = formData;

    const response = await authService.register({ email, password, firstName: name });
    const { state, } = response;

    if (state) {
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

    setIsLoading(false);
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h2>
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
            {t('signin')}
          </button>
          <button
            onClick={() => setActiveTab("signup")}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === "signup"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            {t('signup')}
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
                <span className="px-3 text-sm text-gray-500">{t('descriptionBtnLogin')}</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Sign In Form */}
              <form onSubmit={handleSignIn} className="space-y-4">
                <Input
                  type="email"
                  name="email"
                  placeholder={t('email')}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="password"
                  name="password"
                  placeholder={t('password')}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <Button type="submit" className="w-full" loading={isLoading}>
                  {t('signin')}
                </Button>
              </form>
            </>
          ) : (
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
                <span className="px-3 text-sm text-gray-500">{t('descriptionBtnLogin')}</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Sign Up Form */}
              <form onSubmit={handleSignUp} className="space-y-4">
                <Input
                  type="text"
                  name="name"
                  placeholder={t('name')}
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="email"
                  name="email"
                  placeholder={t('email')}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="password"
                  name="password"
                  placeholder={t('password')}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  type="password"
                  name="confirmPassword"
                  placeholder={t('confirmPassword')}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                />
                <Button type="submit" className="w-full">
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
