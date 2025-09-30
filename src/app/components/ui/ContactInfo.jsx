// src/app/components/ui/ContactInfo.jsx
'use client';
import { motion } from 'framer-motion';
import { contactInfo, socialMedia } from '../../data/contact';

export default function ContactInfo() {
  return (
    <div className="space-y-8">
      {/* Email */}
      <motion.div 
        className="flex items-start space-x-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="w-10 h-10 bg-[#2f9158] rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-semibold">@</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Email</h3>
          <a 
            href={`mailto:${contactInfo.email}`}
            className="text-[#2969a7] hover:text-[#2f9158] transition-colors"
          >
            {contactInfo.email}
          </a>
        </div>
      </motion.div>

      {/* Phone */}
      <motion.div 
        className="flex items-start space-x-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="w-10 h-10 bg-[#2969a7] rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-semibold">📞</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Phone</h3>
          <a 
            href={`tel:${contactInfo.phone}`}
            className="text-[#2969a7] hover:text-[#2f9158] transition-colors"
          >
            {contactInfo.phone}
          </a>
        </div>
      </motion.div>

      {/* WhatsApp */}
      <motion.div 
        className="flex items-start space-x-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-semibold">💬</span>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800">WhatsApp</h3>
          <a 
            href={`https://wa.me/${contactInfo.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2969a7] hover:text-[#2f9158] transition-colors"
          >
            Chat with us on WhatsApp
          </a>
        </div>
      </motion.div>

      {/* Social Media */}
      <motion.div 
        className="pt-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Follow Us</h3>
        <div className="flex space-x-4">
          {socialMedia.map((social, index) => (
            <motion.a
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.2, rotate: 5 }}
              className="w-10 h-10 bg-gray-100 hover:bg-[#2f9158] rounded-full flex items-center justify-center transition-colors duration-200 group"
              aria-label={social.name}
            >
              <span className="text-gray-600 group-hover:text-white transition-colors">
                {social.icon}
              </span>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
