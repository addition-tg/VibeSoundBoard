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

export const SOUNDS: Omit<Sound, 'id' | 'url'>[] = [
  { name: 'You\'re welcome', icon: <SpeakerWaveIcon /> },
  { name: 'to love', icon: <SpeakerWaveIcon /> },
  { name: 'society', icon: <FaceSmileIcon /> },
  { name: 'hello', icon: <ExclamationTriangleIcon /> },
  { name: 'nice to meet you', icon: <SparklesIcon /> },
  { name: 'beautiful', icon: <BellIcon /> },
  { name: 'potato', icon: <MusicNoteIcon /> },
  { name: 'bicycle', icon: <FaceSmileIcon /> },
  { name: 'amphitheater', icon: <SpeakerWaveIcon /> }
];

const SOUND_URLS = [
  'https://upload.wikimedia.org/wikipedia/commons/transcoded/3/36/En-uk-you%27re_welcome.ogg/En-uk-you%27re_welcome.ogg.mp3',
  'https://upload.wikimedia.org/wikipedia/commons/transcoded/e/e7/En-uk-to_love.ogg/En-uk-to_love.ogg.mp3',
  'https://upload.wikimedia.org/wikipedia/commons/transcoded/5/52/En-uk-society.ogg/En-uk-society.ogg.mp3',
  'https://upload.wikimedia.org/wikipedia/commons/transcoded/9/96/En-uk-thank_you.ogg/En-uk-thank_you.ogg.mp3',
  'https://upload.wikimedia.org/wikipedia/commons/transcoded/4/48/En-uk-hello.ogg/En-uk-hello.ogg.mp3',
  'https://upload.wikimedia.org/wikipedia/commons/transcoded/6/62/En-uk-nice_to_meet_you.ogg/En-uk-nice_to_meet_you.ogg.mp3',
  'https://upload.wikimedia.org/wikipedia/commons/transcoded/e/ea/En-uk-beautiful.ogg/En-uk-beautiful.ogg.mp3',
  'https://upload.wikimedia.org/wikipedia/commons/transcoded/f/ff/En-uk-potato.ogg/En-uk-potato.ogg.mp3',
  'https://upload.wikimedia.org/wikipedia/commons/transcoded/9/93/En-uk-a_bicycle.ogg/En-uk-a_bicycle.ogg.mp3',
  'https://upload.wikimedia.org/wikipedia/commons/transcoded/c/cc/En-uk-amphitheatre.ogg/En-uk-amphitheatre.ogg.mp3'
];

export const defaultSounds: Sound[] = SOUNDS.map((sound, index) => ({
  ...sound,
  id: `default-${index}`,
  url: SOUND_URLS[index],
}));
