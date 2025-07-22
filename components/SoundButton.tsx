import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Sound } from '../types';

interface SoundButtonProps {
  sound: Sound;
}

const SoundButton: React.FC<SoundButtonProps> = ({ sound }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    audioRef.current = new Audio(sound.url);
    const audio = audioRef.current;
    
    audio.preload = 'metadata';

    const handlePlay = () => setIsPlaying(true);
    const handleEnd = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('playing', handlePlay);
    audio.addEventListener('ended', handleEnd);
    audio.addEventListener('pause', handleEnd);
    
    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('playing', handlePlay);
      audio.removeEventListener('ended', handleEnd);
      audio.removeEventListener('pause', handleEnd);
      audio.pause();
    };
  }, [sound.url]);

  const playSound = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(error => console.error(`Error playing sound: ${sound.name}`, error));
    }
  }, [sound.name]);
  
  const activeClasses = isPlaying 
    ? 'ring-2 ring-offset-2 ring-offset-[var(--purple-haze)] ring-[var(--red)] scale-105'
    : 'hover:scale-105 active:scale-100';
    
  const backgroundStyle = sound.imageUrl 
    ? { backgroundImage: `url(${sound.imageUrl})` }
    : {};

  return (
    <button
      onClick={playSound}
      aria-label={`Play sound: ${sound.name}`}
      style={backgroundStyle}
      className={`group relative flex flex-col items-center justify-end p-2 aspect-square rounded-xl text-white transition-all duration-150 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--purple-haze)] focus:ring-[var(--red)] ${activeClasses} ${!sound.imageUrl ? 'bg-black/20 hover:bg-black/40 active:bg-black/50' : 'bg-cover bg-center'}`}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent rounded-xl group-hover:from-black/70 transition-colors" />
      
      <div className="relative z-10 flex flex-col items-center justify-end w-full h-full text-center">
        {!sound.imageUrl && (
          <div className="flex-grow flex items-center justify-center w-full">
            <div className={`w-1/2 h-1/2 max-w-8 max-h-8 transition-colors ${isPlaying ? 'text-[var(--sand-dollar)]' : 'text-[var(--sand-dollar)]/70'}`}>
              {sound.icon}
            </div>
          </div>
        )}
        <span className="text-xs font-bold w-full truncate px-1 pb-1 drop-shadow-lg leading-tight text-white">
          {sound.name}
        </span>
      </div>
    </button>
  );
};

export default SoundButton;
