

import React from 'react';
import type { Sound } from '../types';
import { 
  SpeakerWaveIcon,
  MusicNoteIcon,
  BellIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  FaceSmileIcon
} from '../components/icons';

export const SOUNDS: Sound[] = [
  { id: 'default-0', name: 'Applause', url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_959fe92a6b.mp3', icon: <SpeakerWaveIcon /> },
  { id: 'default-1', name: 'Whoosh', url: 'https://cdn.pixabay.com/download/audio/2022/03/23/audio_313f8b3117.mp3', icon: <SpeakerWaveIcon /> },
  { id: 'default-2', name: 'Correct', url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c3b0923617.mp3', icon: <FaceSmileIcon /> },
  { id: 'default-3', name: 'Wrong', url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c7db2f5079.mp3', icon: <ExclamationTriangleIcon /> },
  { id: 'default-4', name: 'Magic', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_22fa932e8d.mp3', icon: <SparklesIcon /> },
  { id: 'default-5', name: 'Bell', url: 'https://cdn.pixabay.com/download/audio/2022/04/18/audio_7784931a28.mp3', icon: <BellIcon /> },
  { id: 'default-6', name: 'Drum Roll', url: 'https://cdn.pixabay.com/download/audio/2022/11/11/audio_48fa2a6327.mp3', icon: <MusicNoteIcon /> },
  { id: 'default-7', name: 'Cash', url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_45f0a07a1e.mp3', icon: <FaceSmileIcon /> },
  { id: 'default-8', name: 'Click', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_651a808608.mp3', icon: <SpeakerWaveIcon /> },
  { id: 'default-9', name: 'Success', url: 'https://cdn.pixabay.com/download/audio/2022/11/18/audio_298a0b9432.mp3', icon: <SparklesIcon /> },
  { id: 'default-10', name: 'Alarm', url: 'https://cdn.pixabay.com/download/audio/2022/10/26/audio_f533a8837e.mp3', icon: <ExclamationTriangleIcon /> },
  { id: 'default-11', name: 'Horn', url: 'https://cdn.pixabay.com/download/audio/2022/08/13/audio_1897e099e2.mp3', icon: <BellIcon /> },
  { id: 'default-12', name: 'Laser', url: 'https://cdn.pixabay.com/download/audio/2022/03/19/audio_b28c5a4154.mp3', icon: <SpeakerWaveIcon /> },
  { id: 'default-13', name: 'Vinyl Scratch', url: 'https://cdn.pixabay.com/download/audio/2022/05/26/audio_5119934271.mp3', icon: <MusicNoteIcon /> },
  { id: 'default-14', name: 'Punch', url: 'https://cdn.pixabay.com/download/audio/2022/03/20/audio_334516e87f.mp3', icon: <SpeakerWaveIcon /> },
  { id: 'default-15', name: 'Glitch', url: 'https://cdn.pixabay.com/download/audio/2022/03/29/audio_3c30a61a29.mp3', icon: <ExclamationTriangleIcon /> },
  { id: 'default-16', name: 'Boing', url: 'https://cdn.pixabay.com/download/audio/2022/03/04/audio_c395319803.mp3', icon: <FaceSmileIcon /> },
  { id: 'default-17', name: 'Game Over', url: 'https://cdn.pixabay.com/download/audio/2022/09/23/audio_031d2d34b5.mp3', icon: <ExclamationTriangleIcon /> },
  { id: 'default-18', name: 'Level Up', url: 'https://cdn.pixabay.com/download/audio/2022/08/21/audio_472b43977c.mp3', icon: <SparklesIcon /> },
  { id: 'default-19', name: 'Swoosh', url: 'https://cdn.pixabay.com/download/audio/2022/11/17/audio_8217387532.mp3', icon: <SpeakerWaveIcon /> },
  { id: 'default-20', name: 'Notification', url: 'https://cdn.pixabay.com/download/audio/2022/11/21/audio_9501af48e5.mp3', icon: <BellIcon /> },
  { id: 'default-21', name: 'Orchestra Hit', url: 'https://cdn.pixabay.com/download/audio/2022/12/28/audio_245e913a05.mp3', icon: <MusicNoteIcon /> },
  { id: 'default-22', name: 'Pop', url: 'https://cdn.pixabay.com/download/audio/2022/03/07/audio_a54b35f606.mp3', icon: <SpeakerWaveIcon /> },
  { id: 'default-23', name: 'Heartbeat', url: 'https://cdn.pixabay.com/download/audio/2022/06/07/audio_3614917f23.mp3', icon: <SpeakerWaveIcon /> },
  { id: 'default-24', name: 'Laugh', url: 'https://cdn.pixabay.com/download/audio/2021/11/20/audio_d019b8824f.mp3', icon: <FaceSmileIcon /> },
  { id: 'default-25', name: 'UI Confirm', url: 'https://cdn.pixabay.com/download/audio/2022/01/21/audio_ea98c2533c.mp3', icon: <SpeakerWaveIcon /> },
  { id: 'default-26', name: 'Retro Game', url: 'https://cdn.pixabay.com/download/audio/2022/03/17/audio_8c21342f1f.mp3', icon: <MusicNoteIcon /> },
  { id: 'default-27', name: 'Rumble', url: 'https://cdn.pixabay.com/download/audio/2022/08/03/audio_341ef94828.mp3', icon: <ExclamationTriangleIcon /> },
  { id: 'default-28', name: 'Magic Spell', url: 'https://cdn.pixabay.com/download/audio/2022/08/04/audio_55198a287e.mp3', icon: <SparklesIcon /> },
  { id: 'default-29', name: 'Doorbell', url: 'https://cdn.pixabay.com/download/audio/2022/02/22/audio_1c17247547.mp3', icon: <BellIcon /> },
];