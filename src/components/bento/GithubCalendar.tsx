'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import Calendar, {
  type Props as ActivityCalendarProps,
} from 'react-activity-calendar'

// Типы данных для API ответа
interface Activity {
  date: string
  count: number
  level: 0 | 1 | 2 | 3 | 4
}

interface ApiResponse {
  total: {
    [year: number]: number
    [year: string]: number
  }
  contributions: Array<Activity>
}

interface ApiErrorResponse {
  error: string
}

// Типы пропсов компонента
interface Props extends Omit<ActivityCalendarProps, 'data' | 'theme'> {}

// Функция для выбора последних N дней
const selectLastNDays = (contributions: Activity[], days: number): Activity[] => {
  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(today.getDate() - days)

  return contributions.filter((activity) => {
    const activityDate = new Date(activity.date)
    return activityDate >= startDate && activityDate <= today
  })
}

// Функция для получения данных календаря
const fetchCalendarData = async (username: string): Promise<ApiResponse> => {
  const response = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
  )
  const data: ApiResponse | ApiErrorResponse = await response.json()

  if (!response.ok) {
    throw new Error(
      `Fetching GitHub contribution data for "${username}" failed: ${
        (data as ApiErrorResponse).error
      }`,
    )
  }

  return data as ApiResponse
}

// Компонент GithubCalendar с фиксированным username
const GithubCalendar: React.FC<Props> = (props) => {
  const username = 'LMDtokyo' // Ваш GitHub username
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchCalendarData(username)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }, [username])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <img
          src="/static/images/bento/bento-discord-futon.svg"
          alt="Error"
          width={192} // Изменил ширину для отображения изображения
          height={192} // Изменил высоту для отображения изображения
          className="bento-lg:w-48 h-auto w-24"
        />
        <p className="bento-lg:w-64 w-48 text-center text-sm text-muted-foreground">
          This component is down. Please email me!
        </p>
      </div>
    )
  }

  if (loading || !data) {
    return <Skeleton className="h-[70%] w-[85%] rounded-3xl" />
  }

  return (
    <>
      <div className="m-4 hidden sm:block">
        <Calendar
          data={selectLastNDays(data.contributions, 133)}
          theme={{
            dark: ['#1A1A1A', '#E9D3B6'],
          }}
          colorScheme="dark"
          blockSize={20}
          blockMargin={6}
          blockRadius={7}
          {...props}
          maxLevel={4}
          hideTotalCount
          hideColorLegend
        />
      </div>
      <div className="m-4 scale-110 sm:hidden">
        <Calendar
          data={selectLastNDays(data.contributions, 60)}
          theme={{
            dark: ['#1A1A1A', '#E9D3B6'],
          }}
          colorScheme="dark"
          blockSize={20}
          blockMargin={6}
          blockRadius={7}
          {...props}
          maxLevel={4}
          hideTotalCount
          hideColorLegend
        />
      </div>
    </>
  )
}

export default GithubCalendar
