import { useState, useEffect } from 'react';

// --- CONFIGURATION ---
// Paste your "Publish to Web" CSV link here.
const GOOGLE_SHEET_URL: string = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSgzWqPstEpxBps7xVg-dSrOy_n7jUIgXLU9aflxWm0EUayjk6qFcDQ5Klhbftmw5aA2l3iElw8nwmG/pub?gid=0&single=true&output=csv'; 

interface LeaderboardEntry {
  id: number;
  name: string;
  
  rank: string;
  score: number;
}

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Default Mock Data (Shown if no Sheet URL is provided)
  const [leaderboardItems, setLeaderboardItems] = useState<LeaderboardEntry[]>([
    { id: 1, name: 'loading...', rank: '1', score: 00 },
    { id: 2, name: 'loading...', rank: '2', score: 00 },
    { id: 3, name: 'loading...', rank: '3', score: 00 },
    { id: 4, name: 'loading...',  rank: '4', score: 00 },
    { id: 5, name: 'loading...', rank: '5', score: 00 }
  ]);

 const parseCSV = (text: string): LeaderboardEntry[] => {
  const lines = text.split(/\r?\n/);
  const result: LeaderboardEntry[] = [];
  
  // We start at index 2 to skip:
  // lines[0] -> "NAME, coins awarded, coins awarded..."
  // lines[1] -> ", 12/02, ..." (The date row)
  for (let i = 2; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const cols = line.split(',');
    
    if (cols.length >= 2) {
      const name = cols[0]?.trim();
      
      // HORIZONTAL SUMMING:
      // We reduce all columns from index 1 to the end into a single total.
      const totalScore = cols.slice(1).reduce((sum, currentVal) => {
        // Clean the string (remove spaces) and convert to number
        const num = parseInt(currentVal.trim());
        // If it's a valid number, add it; otherwise add 0 (for empty weeks)
        return sum + (isNaN(num) ? 0 : num);
      }, 0);

      if (name) {
        result.push({
          id: i,
          name: name.replace(/^"|"$/g, ''),
          rank: '0', 
          score: totalScore
        });
      }
    }
  }
  return result;
};
  const loadDataFromSheet = async () => {
    if (!GOOGLE_SHEET_URL) {
      setErrorMessage("Please add your Google Sheet CSV Link in the code configuration.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch(GOOGLE_SHEET_URL);
      if (!response.ok) throw new Error('Network response was not ok');
      
      const csvText = await response.text();
      const parsedData = parseCSV(csvText);
      
      // Sort by score (descending) and assign ranks
      parsedData.sort((a, b) => b.score - a.score);
      
      const rankedData = parsedData.map((item, index) => ({
        ...item,
        rank: (index + 1).toString()
      }));

      setLeaderboardItems(rankedData);
    } catch (error) {
      console.error('Failed to load sheet:', error);
      setErrorMessage("Failed to load data. Ensure the Sheet is 'Published to Web' as CSV.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (GOOGLE_SHEET_URL) {
      loadDataFromSheet();
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col items-center relative overflow-hidden selection:bg-yellow-300 selection:text-black">
      
      {/* --- BACKGROUND DECORATIONS (HONEYCOMBS) --- */}
      
      {/* 1. Top Right (Original) */}
      <div className="absolute -top-10 -right-10 md:top-0 md:right-0 opacity-90 z-0 pointer-events-none">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
           <path d="M148.5 32L178 49V83L148.5 100L119 83V49L148.5 32Z" fill="#FDE047" />
           <path d="M119 83L148.5 100V134L119 151L89.5 134V100L119 83Z" fill="#FDE047" />
           <path d="M178 83L207.5 100V134L178 151L148.5 134V100L178 83Z" fill="#FDE047" />
           <path d="M148.5 134L178 151V185L148.5 202L119 185V151L148.5 134Z" fill="#FDE047" />
        </svg>
      </div>

      {/* 2. Bottom Left (Original) */}
      <div className="absolute bottom-0 left-0 opacity-90 z-0 pointer-events-none">
         <svg width="150" height="200" viewBox="0 0 150 200" fill="none">
           <path d="M29.5 98L59 115V149L29.5 166L0 149V115L29.5 98Z" fill="#FDE047" />
           <path d="M59 47L88.5 64V98L59 115L29.5 98V64L59 47Z" fill="#FDE047" />
           <path d="M59 149L88.5 166V200L59 217L29.5 200V166L59 149Z" fill="#FDE047" />
        </svg>
      </div>

      {/* 3. NEW: Top Left Cluster */}
      <div className="absolute top-20 -left-12 opacity-40 z-0 pointer-events-none rotate-12 scale-75">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
           <path d="M148.5 32L178 49V83L148.5 100L119 83V49L148.5 32Z" fill="#FDE047" />
           <path d="M119 83L148.5 100V134L119 151L89.5 134V100L119 83Z" fill="#FDE047" />
           <path d="M178 83L207.5 100V134L178 151L148.5 134V100L178 83Z" fill="#FDE047" />
        </svg>
      </div>

      {/* 4. NEW: Center Right Cluster */}
      <div className="absolute top-1/2 -right-16 opacity-30 z-0 pointer-events-none -translate-y-1/2 scale-110 -rotate-12">
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
           <path d="M148.5 32L178 49V83L148.5 100L119 83V49L148.5 32Z" fill="#FDE047" />
           <path d="M119 83L148.5 100V134L119 151L89.5 134V100L119 83Z" fill="#FDE047" />
           <path d="M178 83L207.5 100V134L178 151L148.5 134V100L178 83Z" fill="#FDE047" />
           <path d="M148.5 134L178 151V185L148.5 202L119 185V151L148.5 134Z" fill="#FDE047" />
        </svg>
      </div>

      {/* --- HEADER --- */}
      <header className="w-full max-w-lg flex justify-between items-center py-8 px-6 z-10">
        <div className="flex items-center gap-1">
          <span className="text-3xl font-bold text-yellow-400 tracking-tight">Pg</span>
          <span className="text-3xl font-bold text-black tracking-tight">Bee</span>
        </div>
        
        <div className="flex gap-2">
          {isLoading && (
            <div className="flex items-center gap-2 text-xs font-medium text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-200">
               <span className="block w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
               Syncing Sheet...
            </div>
          )}
          <button 
            onClick={loadDataFromSheet} 
            className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-slate-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
          </button>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="w-full max-w-lg px-4 z-10 mt-2">
        <h1 className="text-3xl font-bold text-center mb-2 tracking-tight text-slate-900">Performance Leaderboard</h1>
        <p className="text-center text-slate-500 text-sm mb-10">Weekly Top Performers</p>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {leaderboardItems.map((item) => (
            <div 
              key={item.id}
              className="relative group bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-12 bg-yellow-400 rounded-r-lg"></div>

              <div className="flex items-center gap-4 pl-3">
                <div className="relative">
                  <div className="w-14 h-14 bg-gray-50 rounded-full border-2 border-yellow-100 flex items-center justify-center overflow-hidden">
                    {item.id % 3 === 0 ? <span className="text-2xl">👻</span> : item.id % 3 === 1 ? <span className="text-2xl">👩‍💼</span> : <span className="text-2xl">👨‍💻</span>}
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-black text-white text-[10px] font-bold flex items-center justify-center rounded-md" style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)' }}>
                    {item.rank}
                  </div>
                </div>
                
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-slate-900 leading-tight">{item.name}</span>
                </div>
              </div>

              <div className="flex flex-col items-end pr-2">
                 <span className="text-2xl font-black text-slate-900">{item.score}</span>
                 <span className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider">Points</span>
              </div>
            </div>
          ))}
        </div>
        
        {/* VIEW FULL REPORT BUTTON */}
        
      </main>

      
    </div>
  );
}
