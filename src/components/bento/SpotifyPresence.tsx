'use client'

import { useEffect, useState } from 'react'
import { FaSpotify } from 'react-icons/fa'
import { Skeleton } from '@/components/ui/skeleton'
import { MoveUpRight } from 'lucide-react'

interface Track {
  name: string
  artist: { '#text': string; name?: string }
  album: { '#text': string }
  image: { '#text': string; size: string }[]
  url: string
  '@attr'?: { nowplaying: string }
}

const SpotifyPresence = () => {
  const [displayData, setDisplayData] = useState<Track | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = () => {
      fetch(
        `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=lmdtokyo&api_key=4a8861a4fd5d179abab3d786cc349e81&format=json&limit=1`
      )
        .then((response) => response.json())
        .then((data) => {
          const track = data.recenttracks?.track?.[0]
          setDisplayData(track)
          setIsLoading(false)
        })
        .catch((error) => {
          console.error('Error fetching latest song:', error)
          setIsLoading(false)
        })
    }

    fetchData()
    const intervalId = setInterval(fetchData, 30000) // Обновляем данные каждые 30 секунд

    return () => clearInterval(intervalId)
  }, [])

  if (isLoading) {
    return (
      <div className="relative flex h-full w-full flex-col justify-between rounded-3xl p-6">
        <Skeleton className="mb-2 h-[55%] w-[55%] rounded-xl" />
        <div className="flex min-w-0 flex-1 flex-col justify-end overflow-hidden">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        </div>
        <div className="absolute right-0 top-0 m-3 text-primary">
          <FaSpotify size={56} />
        </div>
        <Skeleton className="absolute bottom-0 right-0 m-3 h-10 w-10 rounded-full" />
      </div>
    )
  }

  if (!displayData) return <p>Нет данных о треке</p>

  const { name: song, artist, album, image, url } = displayData

  return (
    <div className="relative flex h-full w-full flex-col justify-between p-6">
      <img
        src={image?.[3]?.['#text'] || '/placeholder-image.jpg'}
        alt="Обложка альбома"
        width={128}
        height={128}
        className="mb-2 w-[55%] rounded-xl border border-border grayscale"
      />
      <div className="flex min-w-0 flex-1 flex-col justify-end overflow-hidden">
        <div className="flex flex-col">
          <span className="mb-2 flex gap-2">
            <img
              src="/static/bento/bento-now-playing.svg"
              alt="Сейчас играет"
              width={16}
              height={16}
            />
            <span className="text-sm text-primary">
              {displayData['@attr']?.nowplaying === 'true'
                ? 'Сейчас играет...'
                : 'Последний трек...'}
            </span>
          </span>
          <span className="text-md mb-2 truncate font-bold leading-none">
            {song}
          </span>
          <span className="w-[85%] truncate text-xs text-muted-foreground">
            <span className="font-semibold text-secondary-foreground">
              исполнитель
            </span>{' '}
            {artist['#text'] || artist.name}
          </span>
          <span className="w-[85%] truncate text-xs text-muted-foreground">
            <span className="font-semibold text-secondary-foreground">
              альбом
            </span>{' '}
            {album['#text']}
          </span>
        </div>
      </div>
      <div className="absolute right-0 top-0 m-3 text-primary">
        <FaSpotify size={56} />
      </div>
      <a
        href={url}
        aria-label="Просмотреть на Last.fm"
        title="Просмотреть на Last.fm"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-0 right-0 m-3 flex w-fit items-end rounded-full border bg-secondary/50 p-3 text-primary transition-all duration-300 hover:rotate-12 hover:ring-1 hover:ring-primary"
      >
        <MoveUpRight size={16} />
      </a>
    </div>
  )
}

export default SpotifyPresence
