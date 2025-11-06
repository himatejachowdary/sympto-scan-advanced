
import React from 'react';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { SendIcon } from './icons/SendIcon';

interface SymptomInputProps {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onScan: () => void;
  onVoiceInput: () => void;
  isListening: boolean;
  isLoading: boolean;
}

const SymptomInput: React.FC<SymptomInputProps> = ({
  value,
  onChange,
  onScan,
  onVoiceInput,
  isListening,
  isLoading,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onScan();
    }
  };

  return (
    <div className="flex items-center gap-2 sm:gap-4 p-2 border-2 border-slate-300 dark:border-slate-600 rounded-full focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/50 transition-all duration-300">
      <textarea
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        placeholder="e.g., 'I have a headache and a sore throat...'"
        className="flex-grow bg-transparent focus:outline-none p-2 resize-none text-base sm:text-lg text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 min-h-[50px] max-h-48"
        rows={1}
        disabled={isLoading}
      />
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
      <button
        onClick={onScan}
        disabled={isLoading || !value.trim()}
        className="bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-400 disabled:dark:bg-slate-600 disabled:cursor-not-allowed text-white p-3 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-cyan-500"
        aria-label="Scan symptoms"
      >
        <SendIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default SymptomInput;
