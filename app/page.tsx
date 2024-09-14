"use client";

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Shuffle, SkipBack, Play, Pause, SkipForward, Repeat } from 'lucide-react'

const playlist = [
  { id: 1, title: "19%", src: "/audio/19.mp3" },
  { id: 2, title: "39%", src: "/audio/39.mp3" },
  { id: 3, title: "79%", src: "/audio/79.mp3" },
  { id: 4, title: "99%", src: "/audio/99.mp3" },
  { id: 5, title: "BITE! 咬合力", src: "/audio/BITE! 咬合力.mp3" },
  { id: 6, title: "一颗方糖悬滞的时间", src: "/audio/一颗方糖悬滞的时间.mp3" },
  { id: 7, title: "红透晚烟青", src: "/audio/红透晚烟青.mp3" },
  { id: 8, title: "覆灭重生 Come Alive", src: "/audio/覆灭重生 Come Alive.mp3" },
]

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
      <div className="w-full max-w-3xl bg-zinc-900 rounded-lg shadow-xl overflow-hidden">
        <div className="flex p-6">
          <div className="w-1/2 pr-6 flex items-center">
            <Image
              src="/images/album-cover.jpeg"
              alt="Album cover"
              width={300}
              height={300}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-center">单日常循环</h2>
              {playlist.map((song) => (
                <div
                  key={song.id}
                  className={`p-2 rounded cursor-pointer ${
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
        <div className="p-6 bg-zinc-800">
          <div className="flex justify-between items-center mb-2">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <Slider
            value={[progress]}
            max={duration}
            step={1}
            className="w-full mb-4"
            onValueChange={onProgressChange}
          />
          <div className="flex justify-between items-center mt-4">
          <span className="text-sm">{formatTime(progress)}</span>
          <span className="text-sm">{formatTime(duration)}</span>
        </div>
          <div className="flex justify-center items-center space-x-6">
            <Button variant="ghost" size="icon" onClick={togglePlayMode}>
            {playMode === 'shuffle' ? <Shuffle /> : <Repeat />}
            </Button>
            <Button variant="ghost" size="icon" onClick={playPrevious}>
              <SkipBack className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={togglePlayPause}
              className="text-orange-500"
            >
              {isPlaying ? (
                <Pause className="w-10 h-10" />
              ) : (
                <Play className="w-10 h-10" />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={playNext}>
              <SkipForward className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}