
import React from 'react';
import type { Place } from '../types';
import { MapPinIcon } from './icons/MapPinIcon';

interface NearbyPlacesProps {
  places: Place[];
}

const NearbyPlaces: React.FC<NearbyPlacesProps> = ({ places }) => {
  return (
    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 h-full">
      <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Nearby Facilities</h2>
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
        {places.map((place, index) => (
          <a
            key={index}
            href={place.uri}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-3 bg-slate-100 dark:bg-slate-700/50 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 rounded-lg transition-colors duration-200 group"
          >
            <div className="flex-shrink-0 bg-cyan-500/10 text-cyan-500 rounded-full p-2">
                 <MapPinIcon className="h-6 w-6" />
            </div>
            <span className="font-medium text-slate-700 dark:text-slate-300 group-hover:text-cyan-800 dark:group-hover:text-cyan-200 flex-grow truncate">
              {place.title}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 dark:text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-transform duration-200 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  );
};

export default NearbyPlaces;
