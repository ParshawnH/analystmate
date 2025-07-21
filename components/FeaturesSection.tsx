'use client'

import { CheckCircle, BookOpen, Download } from 'lucide-react'
import FeatureCard from './FeatureCard'

export default function FeaturesSection() {
  const features = [
    {
      icon: <CheckCircle className="w-6 h-6 text-white" />,
      title: 'Structured Analysis',
      description: 'Extract risks across 8 key categories with JSON formatting',
      iconBgColor: 'bg-primary-500'
    },
    {
      icon: <BookOpen className="w-6 h-6 text-white" />,
      title: 'Natural Language',
      description: 'Get comprehensive summaries in plain English',
      iconBgColor: 'bg-success'
    },
    {
      icon: <Download className="w-6 h-6 text-white" />,
      title: 'Export Ready',
      description: 'Download results as JSON or PDF reports',
      iconBgColor: 'bg-warning'
    }
  ]

  return (
    <section className="w-full px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              iconBgColor={feature.iconBgColor}
            />
          ))}
        </div>
      </div>
    </section>
  )
} 