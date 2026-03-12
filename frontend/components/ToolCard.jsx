'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ToolCard({ tool, index = 0 }) {
  const { name, description, icon, href, category, popular = false } = tool;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={href}>
        <div className="group relative bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-200 dark:border-gray-700 card-hover cursor-pointer overflow-hidden">
          {/* Popular Badge */}
          {popular && (
            <div className="absolute top-4 right-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                ⭐ Popular
              </span>
            </div>
          )}
          
          {/* Icon */}
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-primary-100 to-blue-100 dark:from-primary-900/30 dark:to-blue-900/30 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          </div>
          
          {/* Content */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-500 dark:group-hover:text-primary-400 transition-colors duration-200">
              {name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
              {description}
            </p>
            
            {/* Category Badge */}
            {category && (
              <div className="pt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {category}
                </span>
              </div>
            )}
          </div>
          
          {/* Hover Arrow */}
          <div className="absolute bottom-6 right-6 text-primary-500 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
