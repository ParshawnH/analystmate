'use client'

import { ReactNode } from 'react'

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  iconBgColor: string
}

export default function FeatureCard({ icon, title, description, iconBgColor }: FeatureCardProps) {
  return (
    <div className="bg-dark-800 rounded-lg p-6 hover:bg-dark-700 transition-colors duration-300">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${iconBgColor}`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
    </div>
  )
} 