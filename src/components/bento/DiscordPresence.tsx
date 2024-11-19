'use client'

import { useMemo, useState, useEffect } from 'react'
import { FaDiscord } from 'react-icons/fa'
import { useLanyard } from 'react-use-lanyard'
import { Skeleton } from '../ui/skeleton'
import { cn, getElapsedTime } from '@/lib/utils'
import AvatarComponent from '@/components/ui/avatar'

// Определение типов данных
interface ActivityAssets {
  large_image?: string
  small_image?: string
}

interface ActivityTimestamps {
  start?: number // UNIX timestamp в миллисекундах
  end?: number
}

interface Activity {
  type: number // 0: Playing, 1: Streaming, и т.д.
  name: string
  details?: string
  state?: string
  application_id?: string
  assets?: ActivityAssets
  timestamps?: ActivityTimestamps
}

interface LanyardData {
  discord_status: 'online' | 'idle' | 'dnd' | 'offline'
  activities?: Activity[]
}

interface LanyardResponse {
  data: LanyardData
}

const DiscordPresence: React.FC = () => {
  const { data: lanyard, isLoading } = useLanyard<LanyardResponse>({
    userId: '876136797695000596',
  })

  // Упрощаем выбор основной активности, убирая проверку на наличие assets
  const mainActivity = useMemo<Activity | null>(() => {
    if (!lanyard?.data?.activities) return null
    return lanyard.data.activities.find(
      (activity) => activity.type === 0, // Только по типу
    ) || null
  }, [lanyard?.data?.activities])

  const hasMainActivity = !!mainActivity

  const [elapsedTime, setElapsedTime] = useState<string>('')

  useEffect(() => {
    if (!mainActivity?.timestamps?.start) return

    const updateElapsedTime = () => {
      if (mainActivity.timestamps?.start) {
        setElapsedTime(getElapsedTime(mainActivity.timestamps.start))
      }
    }

    updateElapsedTime()
    const intervalId = setInterval(updateElapsedTime, 1000)

    return () => clearInterval(intervalId)
  }, [mainActivity])

  if (isLoading) {
    return (
      <div className="relative overflow-hidden sm:aspect-square">
        <div className="grid size-full grid-rows-4">
          <Skeleton className="bg-secondary/50" />
          <div className="row-span-3 flex flex-col gap-3 p-3">
            <div className="flex justify-between gap-x-1">
              <Skeleton className="-mt-[4.5rem] aspect-square size-24 rounded-full" />
              <Skeleton className="h-6 w-[104px] rounded-xl" />
            </div>
            <Skeleton className="h-14 w-full rounded-xl" />
            <Skeleton className="flex grow rounded-xl" />
          </div>
        </div>
        <Skeleton className="absolute right-0 top-0 z-[1] m-3 size-14 rounded-full" />
      </div>
    )
  }

  if (!lanyard || !lanyard.data) {
    return null
  }

  // Функция для получения URL изображения активности
  const getActivityImageUrl = (activity: Activity): string | null => {
    if (!activity.assets) return null

    const largeImage = activity.assets.large_image

    // Проверяем, является ли изображение стандартным или кастомным
    if (largeImage.startsWith('mp:')) {
      // Кастомное изображение (например, Spotify)
      return `https://cdn.discordapp.com/${largeImage.replace('mp:', '')}`
    } else {
      // Стандартное изображение приложения
      return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${largeImage}.png`
    }
  }

  const activityImageUrl = mainActivity ? getActivityImageUrl(mainActivity) : null

  return (
    <div className="relative overflow-hidden sm:aspect-square">
      <div className="grid size-full grid-rows-4">
        <div className="bg-secondary/50"></div>
        <div className="row-span-3 flex flex-col gap-3 p-3">
          <div className="flex justify-between gap-x-1">
            <div className="relative">
              <a
                href="https://discord.com/users/876136797695000596"
                target="_blank"
                rel="noopener noreferrer"
                title={mainActivity ? `${mainActivity.name} - ${mainActivity.details || ''}` : 'Перейти в Discord'}
              >
                <AvatarComponent
                  src="/static/avatar.webp"
                  alt="Avatar"
                  fallback="e"
                  className="-mt-[4.5rem] aspect-square size-24 rounded-full"
                />
              </a>
              {/* Статус пользователя */}
              <div
                className={cn(
                  'absolute bottom-0 right-0 size-6 rounded-full border-4 border-background',
                  {
                    'flex items-center justify-center bg-primary':
                      lanyard.data.discord_status === 'online',
                    'bg-primary': lanyard.data.discord_status === 'idle',
                    'flex items-center justify-center bg-destructive':
                      lanyard.data.discord_status === 'dnd',
                    'flex items-center justify-center bg-muted-foreground':
                      lanyard.data.discord_status === 'offline',
                  },
                )}
              >
                {lanyard.data.discord_status === 'idle' && (
                  <div className="size-[10px] rounded-full bg-background" />
                )}
                {lanyard.data.discord_status === 'dnd' && (
                  <div className="h-[4px] w-[11px] rounded-full bg-background" />
                )}
                {lanyard.data.discord_status === 'offline' && (
                  <div className="size-2 rounded-full bg-background" />
                )}
              </div>
            </div>
            <div className="flex items-center rounded-xl bg-secondary/50 px-2">
              <img
                src="/static/bento/badges.png"
                alt="Discord Badges"
                width={104}
                height={24}
                className="grayscale"
              />
            </div>
          </div>
          <div className="flex flex-col gap-y-1 rounded-xl bg-secondary/50 p-3">
            <span className="text-base leading-none">GPYCTb</span>
            <span className="text-xs leading-none text-muted-foreground">
              @lmdtokyo
            </span>
          </div>
          <div className="flex grow rounded-xl bg-secondary/50 px-3 py-2">
            {hasMainActivity && mainActivity ? (
              <div className="flex w-full items-center gap-x-3">
                {activityImageUrl ? (
                  <div
                    className="relative aspect-square h-16 w-16 flex-shrink-0 rounded-md bg-cover bg-center"
                    style={{
                      backgroundImage: `url('${activityImageUrl}')`,
                    }}
                  >
                    {/* Если есть small_image, отображаем его */}
                    {mainActivity.assets?.small_image && (
                      <img
                        src={`https://cdn.discordapp.com/app-assets/${mainActivity.application_id}/${mainActivity.assets.small_image}.png`}
                        alt="Small Icon"
                        width={20}
                        height={20}
                        className="absolute -bottom-1 -right-1 rounded-full border-2"
                      />
                    )}
                  </div>
                ) : (
                  // Если нет изображения активности, показываем заглушку
                  <div className="h-16 w-16 flex-shrink-0 rounded-md bg-secondary" />
                )}
                <div className="my-2 flex min-w-0 flex-1 flex-col gap-y-1 overflow-hidden">
                  {mainActivity.name && (
                    <div className="mb-0.5 truncate text-xs leading-none">
                      {mainActivity.name}
                    </div>
                  )}
                  {mainActivity.details && (
                    <div className="truncate text-[10px] leading-none text-muted-foreground">
                      {mainActivity.details}
                    </div>
                  )}
                  {mainActivity.state && (
                    <div className="truncate text-[10px] leading-none text-muted-foreground">
                      {mainActivity.state}
                    </div>
                  )}
                  {elapsedTime && (
                    <div className="text-[11px] leading-none text-muted-foreground">
                      {elapsedTime}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex size-full flex-col items-center justify-center gap-1">
                <img
                  src="/static/bento/bento-discord-futon.svg"
                  alt="No Status Image"
                  width={64}
                  height={64}
                  className="h-full w-fit rounded-lg"
                />
                <div className="text-[10px] text-muted-foreground">
                  Не играю ни во что!
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="absolute right-0 top-0 z-[1] m-3 flex size-14 items-center justify-center rounded-full bg-primary">
        <a
          href="https://discord.gg/G5Ky7nFq"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center size-14 rounded-full bg-primary text-background hover:bg-primary/80 transition-transform transform hover:scale-105"
        >
          <FaDiscord className="size-10 text-background" />
        </a>
      </div>
    </div>
  )
}

export default DiscordPresence
