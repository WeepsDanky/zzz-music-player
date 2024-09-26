"use client";

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Shuffle, SkipBack, Play, Pause, SkipForward, Repeat } from 'lucide-react'
import playlist from './playlist.json'

function ZenlessZoneZeroVinyl() {
  return (
    <div className="w-full h-full relative">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle cx="100" cy="100" r="100" fill="#fff" />
        {[...Array(40)].map((_, i) => (
          <circle
            key={i}
            cx="100"
            cy="100"
            r={100 - i * 2.5}
            fill="none"
            stroke="#ddd"
            strokeWidth="0.5"
          />
        ))}
        <circle cx="100" cy="100" r="40" fill="#000" />
        <text
          x="100"
          y="95"
          textAnchor="middle"
          fill="#fff"
          fontSize="8"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
        >
          Zenless Zone Zero
        </text>
        <text
          x="100"
          y="110"
          textAnchor="middle"
          fill="#fff"
          fontSize="8"
          fontFamily="Arial, sans-serif"
        >
          三Z Studio
        </text>
      </svg>
      <div className="absolute inset-0 rounded-full shadow-lg pointer-events-none" />
    </div>
  )
}

export default function MusicPlayer() {
  const [currentSong, setCurrentSong] = useState(playlist[0])
  const [isPlaying, setIsPlaying] = useState(false) 
  const [playMode, setPlayMode] = useState('repeat')
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [shuffledPlaylist, setShuffledPlaylist] = useState<typeof playlist>([])

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio(currentSong.src)
    
    const audio = audioRef.current

    const setAudioData = () => {
      setDuration(audio.duration)
      setProgress(audio.currentTime)
    }

    const setAudioProgress = () => {
      setProgress(audio.currentTime)
    }

    const handleSongEnd = () => {
      playNext()
    }

    audio.addEventListener('loadeddata', setAudioData)
    audio.addEventListener('timeupdate', setAudioProgress)
    audio.addEventListener('ended', handleSongEnd)

    if (isPlaying) {
      audio.play()
    }

    return () => {
      audio.removeEventListener('loadeddata', setAudioData)
      audio.removeEventListener('timeupdate', setAudioProgress)
      audio.removeEventListener('ended', handleSongEnd)
      audio.pause()
    }
  }, [currentSong, isPlaying])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  useEffect(() => {
    if (playMode === 'shuffle') {
      setShuffledPlaylist(shuffleArray([...playlist]))
    }
  }, [playMode])

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const togglePlayMode = () => {
    setPlayMode(playMode === 'shuffle' ? 'repeat' : 'shuffle')
  }

  const shuffleArray = (array: typeof playlist) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  const playNext = () => {
    if (playMode === 'repeat') {
      const currentIndex = playlist.findIndex(song => song.id === currentSong.id)
      const nextIndex = (currentIndex + 1) % playlist.length
      setCurrentSong(playlist[nextIndex])
    } else {
      const currentIndex = shuffledPlaylist.findIndex(song => song.id === currentSong.id)
      const nextIndex = (currentIndex + 1) % shuffledPlaylist.length
      setCurrentSong(shuffledPlaylist[nextIndex])
    }
  }

  const playPrevious = () => {
    if (playMode === 'repeat') {
      const currentIndex = playlist.findIndex(song => song.id === currentSong.id)
      const previousIndex = (currentIndex - 1 + playlist.length) % playlist.length
      setCurrentSong(playlist[previousIndex])
    } else {
      const currentIndex = shuffledPlaylist.findIndex(song => song.id === currentSong.id)
      const previousIndex = (currentIndex - 1 + shuffledPlaylist.length) % shuffledPlaylist.length
      setCurrentSong(shuffledPlaylist[previousIndex])
    }
  }

  const onProgressChange = (newProgress: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = newProgress[0]
      setProgress(newProgress[0])
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white">
      <div className="relative w-full max-w-5xl p-6 bg-zinc-700">
        <div className="absolute left-32 top-16 w-1/4 h-1/2 z-10">
          <Image
            src="/images/album-cover-1.jpg"
            alt="Album cover"
            layout="fill"
            objectFit="cover"
            className="rounded-l-lg"
          />
        </div>
        <div className="w-full aspect-video bg-zinc-900 rounded-lg shadow-xl overflow-hidden ml-auto" style={{ width: '80%' }}>
          <div className="h-full flex flex-col">
            <div className="flex-grow overflow-hidden">
              <div className="h-full flex p-4">
                <div className="w-1/2 pr-4 flex items-center justify-center">
                  <div className={`w-48 h-48 relative transition-transform duration-1000 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}>
                    <ZenlessZoneZeroVinyl />
                  </div>
                </div>
                <div className="w-1/2 flex flex-col">
                  <h2 className="text-lg font-bold text-center mb-2">单日常循环</h2>
                  <div className="flex-grow overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-zinc-800">
                    {playlist.map((song) => (
                      <div
                        key={song.id}
                        className={`p-2 text-xs rounded cursor-pointer ${
                          currentSong.id === song.id
                            ? 'bg-zinc-700 text-green-400'
                            : 'hover:bg-zinc-800'
                        }`}
                        onClick={() => setCurrentSong(song)}
                      >
                        {song.title}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="h-1/5 bg-zinc-800 flex flex-col justify-center p-4 py-8">
              <div className="flex justify-between items-center mb-1 text-xs">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <Slider
                value={[progress]}
                max={duration}
                step={1}
                className="w-full mb-2"
                onValueChange={onProgressChange}
              />
              <div className="flex justify-center items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={togglePlayMode} className="p-1">
                  {playMode === 'shuffle' ? <Shuffle className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={playPrevious} className="p-1">
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlayPause}
                  className="text-orange-500 p-1"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                </Button>
                <Button variant="ghost" size="sm" onClick={playNext} className="p-1">
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}