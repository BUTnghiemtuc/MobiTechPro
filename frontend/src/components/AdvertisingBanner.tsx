import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface AdvertisingBannerProps {
  campaign?: 'gaming' | 'ecosystem';
}

const AdvertisingBanner = ({ campaign = 'gaming' }: AdvertisingBannerProps) => {
  const campaigns = {
    gaming: {
      title: 'Gaming Phone',
      subtitle: 'Hiệu năng đỉnh cao',
      description: 'Trải nghiệm chơi game mượt mà với chip xử lý mạnh mẽ và màn hình 144Hz',
      buttonText: 'Khám phá ngay',
      image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&q=80',
      gradient: 'from-purple-900 via-violet-900 to-purple-800',
      link: '/phones?search=gaming'
    },
    ecosystem: {
      title: 'Hệ sinh thái hoàn hảo',
      subtitle: 'Kết nối mọi thiết bị',
      description: 'Đồng hồ thông minh, tai nghe không dây và nhiều hơn nữa. Tất cả kết nối liền mạch.',
      buttonText: 'Xem bộ sưu tập',
      image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&q=80',
      gradient: 'from-blue-900 via-cyan-900 to-blue-800',
      link: '/accessories'
    }
  };

  const data = campaigns[campaign];

  return (
    <section className="py-8 md:py-12 bg-slate-950">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${data.gradient} shadow-2xl`}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center min-h-[400px]">
            {/* Left: Content */}
            <div className="p-12 md:p-16 z-10">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <span className="inline-block text-blue-300 text-sm font-semibold uppercase tracking-wider mb-4 bg-blue-500/20 px-4 py-1.5 rounded-full">
                  {data.subtitle}
                </span>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  {data.title}
                </h2>
                <p className="text-slate-300 text-lg mb-8 leading-relaxed max-w-md">
                  {data.description}
                </p>
                <Link
                  to={data.link}
                  className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-slate-100 transition-all duration-300 hover:scale-105 shadow-xl group"
                >
                  <span>{data.buttonText}</span>
                  <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            </div>

            {/* Right: Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="relative h-full min-h-[400px] overflow-hidden"
            >
              <img
                src={data.image}
                alt={data.title}
                className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-700 hover:scale-110"
              />
              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${data.gradient} opacity-40`} />
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </motion.div>
      </div>
    </section>
  );
};

export default AdvertisingBanner;
