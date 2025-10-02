// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    // Database
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://zailiolabs:zailiolabs@cluster0.bxtjsvf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    
    // Authentication
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || '',
    
    // Zoho Mail Configuration
    ZOHO_EMAIL: process.env.ZOHO_EMAIL || '',
    ZOHO_PASSWORD: process.env.ZOHO_PASSWORD || '',
    ZOHO_HOST: process.env.ZOHO_HOST || 'smtp.zoho.com',
    ZOHO_PORT: process.env.ZOHO_PORT || '587',
    
    // Admin Credentials
    ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin123',
  },
}

module.exports = nextConfig
