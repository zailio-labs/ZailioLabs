// src/app/components/ui/ServiceCard.jsx
'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ServiceCard({ service, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.3 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      <Link href={`/services/${service.slug}`}>
        <motion.div 
          className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 p-8 h-full border border-gray-100 hover:border-[#2f9158] cursor-pointer hover-lift"
        >
          <div className="flex flex-col items-center text-center">
            {/* Animated Icon */}
            <motion.div 
              className="w-20 h-20 mb-6 bg-gradient-to-br from-[#2f9158] to-[#2969a7] rounded-2xl flex items-center justify-center group-hover:shadow-lg transition-all duration-300"
              whileHover={{ 
                scale: 1.1,
                rotate: 5
              }}
            >
              <span className="text-2xl text-white">{service.icon}</span>
            </motion.div>

            {/* Title */}
            <motion.h3 
              className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-[#2f9158] transition-colors"
            >
              {service.title}
            </motion.h3>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-6">
              {service.shortDescription}
            </p>

            {/* Animated CTA */}
            <motion.div 
              className="flex items-center text-[#2969a7] font-semibold group-hover:text-[#2f9158] transition-colors"
              whileHover={{ x: 5 }}
            >
              Learn more 
              <motion.span
                className="ml-2"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </motion.div>

            {/* Hover Effect Line */}
            <motion.div 
              className="w-0 h-1 bg-gradient-to-r from-[#2f9158] to-[#2969a7] mt-4 rounded-full"
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
