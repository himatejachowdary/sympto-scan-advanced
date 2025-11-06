
import React, { useRef } from 'react';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { SendIcon } from './icons/SendIcon';
import { CameraIcon } from './icons/CameraIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import type { CapturedImage } from '../types';

interface SymptomInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onScan: () => void;
  onVoiceInput: () => void;
  onImageCapture: (file: File) => void;
  onRemoveImage: () => void;
  isListening: boolean;
  isLoading: boolean;
  capturedImage: CapturedImage | null;
}

const SymptomInput: React.FC<SymptomInputProps> = ({
  value,
  onChange,
  onScan,
  onVoiceInput,
  onImageCapture,
  onRemoveImage,
  isListening,
  isLoading,
  capturedImage
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onScan();
    }
  };
  
  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageCapture(file);
    }
     // Reset the input value to allow capturing the same file again
    event.target.value = '';
  };

  return (
    <div className="flex flex-col gap-2 p-2 border-2 border-slate-300 dark:border-slate-600 rounded-xl focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/50 transition-all duration-300">
      <textarea
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder="e.g., 'I have a headache and a sore throat...'"
        className="w-full bg-transparent focus:outline-none p-2 resize-none text-base sm:text-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 min-h-[80px] max-h-48"
        rows={3}
        disabled={isLoading}
      />
      {capturedImage && (
        <div className="relative w-24 h-24 ml-2 mb-2 rounded-lg overflow-hidden">
          <img src={`data:${capturedImage.mimeType};base64,${capturedImage.data}`} alt="Symptom capture" className="w-full h-full object-cover" />
          <button 
            onClick={onRemoveImage}
            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/75 transition-colors"
            aria-label="Remove image"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      )}
      <div className="flex items-center justify-between gap-2 sm:gap-4 pl-2">
        <div className="flex items-center gap-2">
           <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
            className="hidden"
            />
          <button
            onClick={handleCameraClick}
            disabled={isLoading || !!capturedImage}
            className="p-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-cyan-500 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 disabled:opacity-50"
            aria-label="Capture image of symptom"
          >
            <CameraIcon className="h-6 w-6" />
          </button>
           <button
            onClick={onVoiceInput}
            disabled={isLoading}
            className={`p-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-cyan-500 ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300'
            }`}
            aria-label="Use voice input"
          >
            <MicrophoneIcon className="h-6 w-6" />
          </button>
        </div>
        <button
          onClick={onScan}
          disabled={isLoading || (!value.trim() && !capturedImage)}
          className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-400 disabled:dark:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-cyan-500 flex items-center gap-2"
          aria-label="Scan symptoms"
        >
          <span>Scan</span>
          <SendIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default SymptomInput;
