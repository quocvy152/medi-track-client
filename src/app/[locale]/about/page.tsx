"use client";

import { Button } from "@/components/ui/Button";
import {
  BoltIcon,
  ChartBarIcon,
  HeartIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

export default function AboutPage() {
  const t = useTranslations('about');
  const locale = useLocale();
  const brand = 'MediTrack';

  const features = [
    {
      icon: ChartBarIcon,
      title: t('featureAccurate'),
      desc: "Hệ thống của chúng tôi cung cấp phân tích dựa trên dữ liệu từ phiếu xét nghiệm nhằm giúp bạn hiểu rõ hơn về các chỉ số sức khỏe của mình. Mọi nội dung trong báo cáo đều được trình bày theo cách dễ hiểu, dựa trên kiến thức y khoa tổng quan. Tuy nhiên, đây chỉ là kết quả tham khảo và có thể không hoàn toàn chính xác trong mọi trường hợp. Phân tích của hệ thống không thay thế chẩn đoán hay tư vấn chuyên môn từ bác sĩ. Người dùng nên tham khảo ý kiến chuyên gia y tế khi cần đánh giá chính xác tình trạng sức khỏe.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: ShieldCheckIcon,
      title: t('featurePrivacy'),
      desc: "Chúng tôi cam kết đảm bảo an toàn tuyệt đối cho dữ liệu cá nhân và phiếu xét nghiệm của bạn. Mọi thông tin đều được mã hóa và lưu trữ theo tiêu chuẩn bảo mật cao nhằm ngăn chặn truy cập trái phép. Chúng tôi không chia sẻ dữ liệu với bất kỳ bên thứ ba nào nếu không có sự đồng ý của bạn. Đồng thời, vì đây là hệ thống hỗ trợ người dùng, chúng tôi chỉ xử lý dữ liệu để phục vụ việc phân tích chỉ mang tính tham khảo. Mục tiêu của chúng tôi là mang đến trải nghiệm an toàn và minh bạch cho người sử dụng.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: BoltIcon,
      title: t('featureFast'),
      desc: "Hệ thống AI của chúng tôi được tối ưu để phân tích nhanh các chỉ số trong phiếu xét nghiệm, giúp bạn nhận được thông tin tổng quan chỉ trong vài giây. Công nghệ được xây dựng dựa trên nhiều nguồn dữ liệu y khoa phổ biến nhằm hỗ trợ việc nhận diện các chỉ số sức khỏe. Tuy nhiên, tốc độ xử lý nhanh không đồng nghĩa với sự thay thế cho việc thăm khám chuyên môn. Kết quả phân tích chỉ mang tính tham khảo và có thể tồn tại sai lệch. Bạn nên đối chiếu với tư vấn từ bác sĩ để có đánh giá chính xác và đầy đủ nhất.",
      gradient: "from-amber-500 to-orange-500",
    },
  ];

  const values = [
    {
      icon: HeartIcon,
      title: "Dựa trên nhu cầu của người dùng",
      desc: "Chúng tôi đặt sức khỏe và quyền riêng tư của bạn lên hàng đầu",
    },
    {
      icon: UserGroupIcon,
      title: "Dễ dàng sử dụng",
      desc: "Cung cấp thông tin chi tiết về chăm sóc sức khỏe cho mọi người",
    },
    {
      icon: SparklesIcon,
      title: "Công nghệ tiên tiến",
      desc: "Tận dụng AI tiên tiến để có kết quả tốt hơn",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            {t('title', { brand })}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            {t('desc')}
          </p>
            <Link href={`/${locale}/login`}>
              <Button
                size="lg"
                className="text-lg px-8 py-4 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-700 hover:to-emerald-700 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 cursor-pointer"
              >
                {t('getStarted')}
              </Button>
            </Link>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('mission')}
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t('missionDesc')}
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50 hover:border-gray-600/70 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Values Section */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-700/50">
            <h3 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              Giá trị cốt lõi của chúng tôi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => {
                const IconComponent = value.icon;
                return (
                  <div
                    key={index}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/30 mb-4">
                      <IconComponent className="w-7 h-7 text-blue-400" />
                    </div>
                    <h4 className="text-xl font-semibold text-white mb-2">
                      {value.title}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {value.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-br from-blue-600/10 to-purple-600/10 backdrop-blur-sm rounded-3xl p-12 border border-blue-500/20">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Sẵn sàng bắt đầu?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Tham gia hàng nghìn người dùng tin tưởng MediTrack với dữ liệu sức khỏe của họ. Bắt đầu theo dõi kết quả xét nghiệm y tế của bạn ngay hôm nay.
            </p>
            <Link href={`/${locale}/login`}>
              <Button
                size="lg"
                className="text-lg px-8 py-4 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-700 hover:to-emerald-700 text-white border-0 shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300 cursor-pointer"
              >
                {t('getStarted')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 