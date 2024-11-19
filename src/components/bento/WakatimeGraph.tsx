'use client'

import React, { useState, useEffect } from 'react'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Skeleton } from '@/components/ui/skeleton'
import { getLanguageIcon } from '@/components/bento/LanguageIcons'

interface Language {
  name: string
  hours: number
  fill: string
}

interface Props {
  omitLanguages?: string[]
}

const colors = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(var(--chart-6))',
  'hsl(var(--chart-7))',
]

const chartConfig: ChartConfig = {
  hours: {
    label: 'Hours',
    color: 'hsl(var(--primary))',
  },
  label: {
    color: 'hsl(var(--muted-foreground))',
  },
  ...colors.reduce(
    (acc, color, index) => ({
      ...acc,
      [`language${index}`]: { label: `Language ${index + 1}`, color },
    }),
    {},
  ),
}

const WakatimeGraph = ({ omitLanguages = [] }: Props) => {
  const [languages, setLanguages] = useState<Language[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Manually define the languages data
    const manualLanguages: Language[] = [
      { name: 'C++', hours: 50, fill: colors[0] },
      { name: 'Python', hours: 40, fill: colors[1] },
      { name: 'C#', hours: 30, fill: colors[2] },
      { name: 'TypeScript (tsx)', hours: 20, fill: colors[3] },
      { name: 'Kali Linux', hours: 10, fill: colors[4] },
    ]

    // Filter out omitted languages
    const filteredLanguages = manualLanguages.filter(
      (lang) => !omitLanguages.includes(lang.name),
    )

    setLanguages(filteredLanguages)
    setIsLoading(false)
  }, [omitLanguages])

  const CustomYAxisTick = ({ x, y, payload }: any) => {
    const icon = getLanguageIcon(payload.value.toLowerCase())
    return (
      <g transform={`translate(${x},${y})`}>
        <title>{payload.value}</title>
        <circle cx="-18" cy="0" r="14" fill="#1A1A1A" />
        <foreignObject width={16} height={16} x={-26} y={-8}>
          {icon ? (
            React.cloneElement(icon, { size: 16, color: '#E9D3B6' })
          ) : (
            <text
              x={8}
              y={12}
              fill="#E9D3B6"
              fontSize="12"
              textAnchor="middle"
              dominantBaseline="central"
            >
              {payload.value.charAt(0).toUpperCase()}
            </text>
          )}
        </foreignObject>
      </g>
    )
  }

  if (isLoading)
    return (
      <div className="size-full rounded-3xl p-4">
        <div className="space-y-1.5">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center gap-x-4">
              <Skeleton className="size-7 rounded-full" />
              <div className="flex-1">
                <Skeleton
                  className="h-8 w-full rounded-lg"
                  style={{ width: `${100 * Math.pow(0.6, index)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  if (error) return <div>Error: {error}</div>

  return (
    <ChartContainer config={chartConfig} className="h-full w-full p-4">
      <BarChart
        accessibilityLayer
        data={languages}
        layout="vertical"
        margin={{ left: -10, right: 10 }}
      >
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="name"
          type="category"
          tickLine={false}
          axisLine={false}
          width={80}
          tick={<CustomYAxisTick />}
        />
        <XAxis type="number" hide />
        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
        <Bar
          dataKey="hours"
          fill="var(--color-hours)"
          radius={[8, 8, 8, 8]}
          isAnimationActive={false}
        >
          <LabelList
            dataKey="hours"
            position="right"
            formatter={(value: number) => `${Math.round(value)}h`}
            className="fill-foreground"
            fontSize={12}
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}

export default WakatimeGraph
