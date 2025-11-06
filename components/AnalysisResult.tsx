import React from 'react';

interface AnalysisResultProps {
  analysisText: string;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysisText }) => {
    const paragraphs = analysisText.split('\n').filter(p => p.trim() !== '');

    return (
        <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">Symptom Analysis</h2>
            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
                {paragraphs.map((p, index) => {
                    if (p.toLowerCase().includes('disclaimer:')) {
                        return (
                            <p key={index} className="bg-amber-100 dark:bg-amber-900/50 border-l-4 border-amber-500 text-amber-800 dark:text-amber-200 p-4 rounded-md font-semibold">
                                {p.replace(/disclaimer:/i, '').trim()}
                            </p>
                        );
                    }
                    if (p.startsWith('**') && p.endsWith('**')) {
                         // Fix: Replaced `replaceAll` with `replace` and a global regex for wider compatibility.
                         return <h3 key={index} className="text-lg font-semibold !mt-6 !mb-2">{p.replace(/\*\*/g, '')}</h3>
                    }
                     if (p.startsWith('* ')) {
                         return <li key={index} className="ml-4">{p.substring(2)}</li>
                    }
                    return <p key={index}>{p}</p>;
                })}
            </div>
        </div>
    );
};

export default AnalysisResult;
