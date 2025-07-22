import type { ReactNode } from 'react';

// This is the data structure for the app's state, used for rendering
export interface Sound {
  id: string; // A unique identifier for React key prop
  name: string;
  url: string;
  icon?: ReactNode; // For default SVG icons
  imageUrl?: string; // For generated image URLs (base64)
}

// This is the serializable data structure for storing in localStorage
export interface StorableSound {
  id: string;
  name:string;
  iconIndex?: number; // Fallback for old data or failed generation
  imageUrl?: string; // For generated images
  url?: string; // For web URLs
  dbKey?: string; // For files stored in IndexedDB
}
