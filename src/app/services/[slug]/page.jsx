// src/app/services/[slug]/page.jsx
'use client';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import { services } from '../../../data/services';
import Link from 'next/link';

export default function ServiceDetailPage() {
  const params = useParams();
  const service = services.find(s => s.slug === params.slug);

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-32 text-center">
          <h1 className="text-4xl font-bold text-gray-800">Service Not Found</h1>
          <Link href="/services" className="text-[#2969a7] hover:text-[#2f9158] mt-4 inline-block">
            Back to Services
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#2f9158]/5 to-[#2969a7]/5">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-r from-[#2f9158] to-[#2969a7] rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <span className="text-3xl text-white">{service.icon}</span>
            </motion.div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
              {service.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {service.fullDescription}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">About This Service</h2>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                {service.longDescription}
              </p>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/contact"
                  className="bg-gradient-to-r from-[#2f9158] to-[#2969a7] text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 inline-block"
                >
                  Get Started
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-xl p-8"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">What We Offer</h3>
              <div className="space-y-4">
                {service.features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-6 h-6 bg-[#2f9158] rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
