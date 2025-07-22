import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import SoundButton from './components/SoundButton';
import { defaultSounds } from './constants/sounds';
import type { Sound, StorableSound } from './types';
import { getSound, setSound, clearSounds } from './db';
import {
  SpeakerWaveIcon, MusicNoteIcon, BellIcon, ExclamationTriangleIcon, SparklesIcon, FaceSmileIcon,
  FolderOpenIcon, ArrowPathIcon, LinkIcon, KeyIcon, XCircleIcon
} from './components/icons';

const ICONS = [
  <SpeakerWaveIcon />, <MusicNoteIcon />, <BellIcon />,
  <ExclamationTriangleIcon />, <SparklesIcon />, <FaceSmileIcon />
];

const getIconForIndex = (index: number) => ICONS[index % ICONS.length];
const LOCAL_STORAGE_KEY_SOUNDS = 'soundboard-sounds';
const LOCAL_STORAGE_KEY_API_KEY = 'soundboard-api-key';

const App: React.FC = () => {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Loading Sounds...');
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  const folderInputRef = useRef<HTMLInputElement>(null);
  const urlListInputRef = useRef<HTMLInputElement>(null);
  const apiKeyInputRef = useRef<HTMLInputElement>(null);
  const soundBlobUrls = useRef<string[]>([]);

  // Effect to load API key and sounds from storage on initial mount
  useEffect(() => {
    const storedApiKey = localStorage.getItem(LOCAL_STORAGE_KEY_API_KEY);
    if (storedApiKey) {
      setApiKey(storedApiKey);
    }
    
    const restoreSounds = async () => {
      setLoadingMessage('Loading sounds from storage...');
      const storedSoundsJSON = localStorage.getItem(LOCAL_STORAGE_KEY_SOUNDS);
      let restoredSounds: Sound[] = [];
      const blobUrls: string[] = [];

      if (storedSoundsJSON) {
        try {
          const storableSounds = JSON.parse(storedSoundsJSON) as StorableSound[];
          for (const s of storableSounds) {
            let soundUrl: string | undefined;
            if (s.url) {
              soundUrl = s.url;
            } else if (s.dbKey) {
              const fileBlob = await getSound(s.dbKey);
              if (fileBlob) {
                soundUrl = URL.createObjectURL(fileBlob);
                blobUrls.push(soundUrl);
              }
            }
            if (soundUrl) {
              restoredSounds.push({
                id: s.id, name: s.name, url: soundUrl,
                imageUrl: s.imageUrl,
                icon: s.imageUrl ? undefined : getIconForIndex(s.iconIndex ?? 0)
              });
            }
          }
        } catch (error) {
          console.error("Failed to restore sounds from localStorage:", error);
          restoredSounds = [...defaultSounds];
        }
      } else {
        restoredSounds = [...defaultSounds];
      }
      
      soundBlobUrls.current = blobUrls;
      setSounds(restoredSounds);
      setIsLoading(false);
    };

    restoreSounds();

    return () => {
      soundBlobUrls.current.forEach(URL.revokeObjectURL);
    };
  }, []);

  const cleanupAndSaveSounds = async (newSounds: Sound[], storableSounds: StorableSound[]) => {
    soundBlobUrls.current.forEach(URL.revokeObjectURL);
    soundBlobUrls.current = newSounds.filter(s => s.url.startsWith('blob:')).map(s => s.url);
    localStorage.setItem(LOCAL_STORAGE_KEY_SOUNDS, JSON.stringify(storableSounds));
    setSounds(newSounds);
  }

  const generateImageForSoundName = async (soundName: string, apiKeyForCall: string): Promise<string> => {
    if (!apiKeyForCall) throw new Error("API key is missing.");
    if (!soundName) throw new Error("Sound name is missing.");
    
    const client = new GoogleGenAI({ apiKey: apiKeyForCall });
    const prompt = `A simple, clean, modern, flat, vector-style icon for a sound effect named '${soundName}'. Centered on a solid, non-white, vibrant background color. No text.`;
    
    const response = await client.models.generateImages({
      model: 'imagen-3.0-generate-002',
      prompt: prompt,
      config: { numberOfImages: 1, outputMimeType: 'image/jpeg', aspectRatio: '1:1' },
    });

    if (!response.generatedImages?.[0]?.image?.imageBytes) {
      throw new Error("API response did not contain a valid image.");
    }

    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  };

  const processAndSaveNewSounds = async (soundSources: { name: string; file?: File, url?: string }[], keyForGeneration: string | null) => {
    if (soundSources.length === 0) {
      alert('No valid audio sources found.');
      return;
    }
  
    setIsLoading(true);
    await clearSounds();
    const newSounds: Sound[] = [];
    const storableSounds: StorableSound[] = [];
  
    let imageUrls: (string | null)[] = [];
    if (keyForGeneration) {
      setLoadingMessage(`Generating ${soundSources.length} thumbnails... (may take a moment)`);
      const imageGenerationPromises = soundSources.map(src => generateImageForSoundName(src.name, keyForGeneration));
      const imageGenerationResults = await Promise.allSettled(imageGenerationPromises);
      
      const firstRejected = imageGenerationResults.find(r => r.status === 'rejected') as PromiseRejectedResult | undefined;
      if (firstRejected) {
        const errorMessage = (firstRejected.reason as Error)?.message || 'An unknown error occurred.';
        console.error("Image generation error:", firstRejected.reason);
        if (errorMessage.toLowerCase().includes('quota')) {
          setApiError('You have exceeded the free daily quota for image generation. Please try again later.');
        } else {
          setApiError(`An API error occurred: ${errorMessage}`);
        }
      }

      imageUrls = imageGenerationResults.map(result => result.status === 'fulfilled' ? result.value : null);
    } else {
      setLoadingMessage('No API key set. Skipping thumbnail generation.');
    }
  
    setLoadingMessage('Saving sounds...');
  
    for (const [index, source] of soundSources.entries()) {
      const { name } = source;
      const imageUrl = keyForGeneration ? imageUrls[index] : null;
      const id = `${Date.now()}-${name}-${index}`;
      const iconIndex = index % ICONS.length;
      
      const soundData: Omit<Sound, 'url' | 'id'> = { name, imageUrl: imageUrl ?? undefined, icon: !imageUrl ? getIconForIndex(iconIndex) : undefined };
      const storableSoundData: Omit<StorableSound, 'id'> = { name, imageUrl: imageUrl ?? undefined, iconIndex: !imageUrl ? iconIndex : undefined };

      if (source.file) {
        const dbKey = `local-${id}`;
        await setSound(dbKey, source.file);
        newSounds.push({ ...soundData, id, url: URL.createObjectURL(source.file) });
        storableSounds.push({ ...storableSoundData, id, dbKey });
      } else if (source.url) {
        newSounds.push({ ...soundData, id, url: source.url });
        storableSounds.push({ ...storableSoundData, id, url: source.url });
      }
    }
  
    await cleanupAndSaveSounds(newSounds, storableSounds);
    setIsLoading(false);
  };
  
  const handleApiKeyLoad = async (file: File) => {
    try {
        const key = (await file.text()).trim();
        if (key) {
            setApiKey(key);
            localStorage.setItem(LOCAL_STORAGE_KEY_API_KEY, key);
            alert('API Key has been set and saved.');
            return key;
        }
    } catch (e) {
        console.error("Could not read API key file", e);
        alert('Could not read the provided API key file.');
    }
    return null;
  }
  
  const handleClearApiKey = () => {
    setApiKey(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY_API_KEY);
    alert('API Key has been cleared.');
  };

  const handleFolderLoad = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    let keyForGeneration: string | null = apiKey;
    const keyFile = Array.from(files).find(f => f.name.toLowerCase() === 'key.txt');
    if (keyFile) {
        setLoadingMessage('Reading API key...');
        const loadedKey = await handleApiKeyLoad(keyFile);
        if (loadedKey) {
            keyForGeneration = loadedKey;
        }
    }

    setLoadingMessage('Processing files...');
    const audioFiles = Array.from(files).filter(file => file.type.startsWith('audio/'));
    const soundSources = audioFiles.map(file => ({
        name: file.name.replace(/\.[^/.]+$/, "") || 'Untitled',
        file: file
    }));
    await processAndSaveNewSounds(soundSources, keyForGeneration);
    event.target.value = '';
  };

  const handleUrlListLoad = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsLoading(true);
    setLoadingMessage('Reading URL list...');
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result;
      if (typeof text !== 'string') {
        alert('Could not read file content.');
        setIsLoading(false);
        return;
      }
      const urls = text.split('\n').map(url => url.trim()).filter(url => url.startsWith('http'));
      const soundSources = urls.map(url => {
        let name = 'Untitled';
        try {
          const path = new URL(url).pathname;
          name = decodeURIComponent(path.substring(path.lastIndexOf('/') + 1).replace(/\.[^/.]+$/, '') || 'Untitled');
        } catch { /* use default name */ }
        return { name, url };
      });
      await processAndSaveNewSounds(soundSources, apiKey);
    };
    reader.onerror = () => { alert('Failed to read the file.'); setIsLoading(false); };
    reader.readAsText(file);
    event.target.value = '';
  };

  const resetToDefault = async () => {
    setIsLoading(true);
    setLoadingMessage('Resetting sounds...');
    await clearSounds();
    localStorage.removeItem(LOCAL_STORAGE_KEY_SOUNDS);
    soundBlobUrls.current.forEach(URL.revokeObjectURL);
    soundBlobUrls.current = [];
    setSounds([...defaultSounds]);
    setIsLoading(false);
  };
  
  const ControlButton: React.FC<{
    onClick: () => void,
    disabled?: boolean,
    children: React.ReactNode,
    variant?: 'primary' | 'secondary' | 'danger'
  }> = ({ onClick, disabled, children, variant = 'secondary' }) => {
    const variantClasses = {
      primary: 'bg-red hover:brightness-110 text-white',
      secondary: 'bg-purple-haze hover:bg-black/20 text-sand-dollar border border-sand-dollar/30',
      danger: 'bg-burgundy hover:brightness-110 text-white',
    };
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-purple-haze focus:ring-red transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]}`}
      >
        {children}
      </button>
    );
  };

  const ApiErrorToast: React.FC<{ message: string; onDismiss: () => void; }> = ({ message, onDismiss }) => (
    <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-burgundy text-white p-4 rounded-lg shadow-2xl flex items-start gap-3 animate-fade-in-down" role="alert">
      <div className="w-6 h-6 flex-shrink-0 mt-0.5">
        <ExclamationTriangleIcon />
      </div>
      <div className="flex-grow">
        <p className="font-bold">Image Generation Failed</p>
        <p className="text-sm opacity-90">{message}</p>
      </div>
      <button onClick={onDismiss} aria-label="Dismiss" className="p-1 rounded-full hover:bg-white/20 -m-1">
        <div className="w-5 h-5"><XCircleIcon /></div>
      </button>
    </div>
  );

  return (
    <main className="min-h-screen flex flex-col items-center p-2 sm:p-4 md:p-6">
      {apiError && <ApiErrorToast message={apiError} onDismiss={() => setApiError(null)} />}
      <div className="w-full max-w-7xl mx-auto">
        <header className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white">Virtual Soundboard</h1>
          <p className="mt-2 text-md sm:text-lg text-sand-dollar opacity-80">Load sounds, get AI-generated icons, and create your perfect board.</p>
        </header>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
          <ControlButton onClick={() => apiKeyInputRef.current?.click()} disabled={isLoading} variant="primary">
            <div className="w-5 h-5"><KeyIcon/></div>
            <span>{apiKey ? 'Change API Key' : 'Set API Key'}</span>
          </ControlButton>
          {apiKey && (
            <ControlButton onClick={handleClearApiKey} disabled={isLoading} variant="danger">
              <div className="w-5 h-5"><XCircleIcon /></div>
              <span>Clear Key</span>
            </ControlButton>
          )}
          <ControlButton onClick={() => folderInputRef.current?.click()} disabled={isLoading}>
            <div className="w-5 h-5"><FolderOpenIcon/></div>
            <span>Load Folder</span>
          </ControlButton>
          <ControlButton onClick={() => urlListInputRef.current?.click()} disabled={isLoading}>
            <div className="w-5 h-5"><LinkIcon/></div>
            <span>Load URLs</span>
          </ControlButton>
          <ControlButton onClick={resetToDefault} disabled={isLoading}>
            <div className="w-5 h-5"><ArrowPathIcon/></div>
            <span>Reset</span>
          </ControlButton>
        </div>
        
        <div className="text-center text-sand-dollar/70 text-xs sm:text-sm mb-6 max-w-4xl mx-auto space-y-1">
            <p>
                <strong className="text-white">How to Load Sounds:</strong> Use the buttons above to load from a <strong className="text-white">Folder</strong> or a <strong className="text-white">.txt list of URLs</strong>.
            </p>
            <p>
                <strong className="text-red">Pro Tip:</strong> Place a file named <code className="bg-black/40 text-white/90 px-1.5 py-0.5 rounded-md text-xs">key.txt</code> in your folder to automatically set your API key for thumbnail generation.
            </p>
        </div>
        
        {/* @ts-ignore */}
        <input type="file" webkitdirectory="" directory="" multiple ref={folderInputRef} onChange={handleFolderLoad} className="hidden" accept="audio/*,text/plain" />
        <input type="file" accept=".txt,text/plain" ref={urlListInputRef} onChange={handleUrlListLoad} className="hidden" />
        <input type="file" accept=".txt,text/plain" ref={apiKeyInputRef} onChange={(e) => e.target.files && handleApiKeyLoad(e.target.files[0])} className="hidden" />

        <div className="bg-black/20 p-3 sm:p-4 rounded-2xl shadow-2xl border border-sand-dollar/20">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-sand-dollar animate-pulse">{loadingMessage}</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3">
              {sounds.length > 0 ? sounds.map((sound) => (
                <SoundButton key={sound.id} sound={sound} />
              )) : (
                <div className="col-span-full flex items-center justify-center h-64 text-center text-sand-dollar/60">
                  <p>No sounds loaded. <br/>Load some sounds or reset to default.</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-8 p-4 sm:p-6 bg-black/20 rounded-2xl shadow-lg border border-sand-dollar/20">
            <h2 className="text-xl font-bold text-white text-center mb-4">How to Get a Free API Key</h2>
            <ol className="list-decimal list-inside space-y-2 text-sand-dollar/90 max-w-2xl mx-auto">
                <li>
                    Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-red font-semibold hover:underline">Google AI Studio</a> and sign in with your Google account.
                </li>
                <li>
                    Click the <span className="font-semibold text-white">"Get API key"</span> button, followed by <span className="font-semibold text-white">"Create API key in new project"</span>.
                </li>
                <li>
                    Copy your new key. It will look like a long string of random characters.
                </li>
                <li>
                    Paste the key into a new, plain text file (e.g., using Notepad or TextEdit) and save it with a `.txt` extension (make it `key.txt`).
                </li>
                <li>
                    Click the <span className="font-semibold text-white">"Set API Key"</span> button above and choose the `.txt` file you just saved.
                </li>
            </ol>
        </div>

        <footer className="mt-8 text-center text-sand-dollar/60 text-sm">
          <p>Thumbnails generated with the Google AI platform.</p>
        </footer>
      </div>
    </main>
  );
};

export default App;