"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SocialButton } from "@/components/ui/SocialButton";
import { authService } from "@/services/authService";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';

type TabType = "signin" | "signup";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function LoginModal({ isOpen, onClose, }: LoginModalProps) {
  const t = useTranslations('login');
  const router = useRouter();
  const locale = useLocale();
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
        onClose();
        localStorage.setItem("authToken", data?.accessToken || '');
        toast.success(t('loginSuccess'));
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="border border-gray-300 w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src="/images/medi_track_logo.png"
                  alt="MediTrack Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{t('title')}</h2>
                <p className="text-sm text-gray-600">{t('subtitle')}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
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

          {activeTab === "signin" ? (
            <>
              {/* Social auth */}
              <div className="space-y-3 mb-6">
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
                <span className="px-3 text-sm text-gray-500">Or continue with email</span>
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
              <div className="space-y-3 mb-6">
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
                <span className="px-3 text-sm text-gray-500">Or continue with email</span>
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
