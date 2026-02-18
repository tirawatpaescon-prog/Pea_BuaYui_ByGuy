
import React, { useState, useEffect } from 'react';
import { SearchState, BranchName, ElectricityUser, UserLocation, SearchType } from './types';
import { searchUserInBranch, preloadBranchData } from './services/dataService';
import { optimizeRoute } from './services/geminiService';
import Logo from './components/Logo';
import ResultCard from './components/ResultCard';
import MapDisplay from './components/MapDisplay';

const App: React.FC = () => {
  const [state, setState] = useState<SearchState>({
    isLoggedIn: false,
    currentUser: null,
    selectedBranch: null,
    query: '',
    searchType: 'all',
    isSearching: false,
    results: [],
    error: null,
    totalRecords: 0,
    routeQueue: [],
    optimizedRoute: null,
    viewMode: 'search',
    activeMapUser: null
  });

  const [pin, setPin] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  useEffect(() => {
    if (pin.length === 6) {
      if (pin === '123456') {
        handleLoginSuccess();
      } else {
        setLoginError('PIN ไม่ถูกต้อง กรุณาลองใหม่');
        if (navigator.vibrate) navigator.vibrate(200);
        setPin('');
        setTimeout(() => setLoginError(''), 3000);
      }
    }
  }, [pin]);

  const handleLoginSuccess = () => {
    setState(prev => ({ ...prev, isLoggedIn: true, currentUser: 'Guy.Pongsakorn' }));
    requestGpsPermission();
  };

  const requestGpsPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          console.log("GPS Location acquired");
        },
        (err) => {
          console.warn("GPS Access Denied or Error");
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  };

  useEffect(() => {
    const performLiveSearch = async () => {
      if (!state.selectedBranch || !state.query.trim()) {
        setState(prev => ({ ...prev, results: [], error: null }));
        return;
      }

      const trimmedQuery = state.query.trim();
      const isNumeric = /^\d+$/.test(trimmedQuery);
      
      // Validation thresholds
      if (state.searchType === 'all' || state.searchType === 'name') {
        if (!isNumeric && trimmedQuery.length < 2) return;
      }
      if (isNumeric && trimmedQuery.length < 3) return;

      setState(prev => ({ ...prev, isSearching: true, error: null }));
      try {
        const { users } = await searchUserInBranch(state.selectedBranch, trimmedQuery, state.searchType);
        setState(prev => ({ 
          ...prev, 
          results: users, 
          isSearching: false,
          error: users.length === 0 ? `ไม่พบข้อมูลสำหรับ "${trimmedQuery}"` : null
        }));
      } catch (err) {
        setState(prev => ({ ...prev, isSearching: false, error: 'เกิดข้อผิดพลาดในการค้นหา' }));
      }
    };

    const timeoutId = setTimeout(performLiveSearch, 400);
    return () => clearTimeout(timeoutId);
  }, [state.query, state.selectedBranch, state.searchType]);

  const handleBranchSelect = async (branch: BranchName) => {
    setIsLoadingData(true);
    try {
      const count = await preloadBranchData(branch);
      setState(prev => ({ 
        ...prev, 
        selectedBranch: branch, 
        totalRecords: count, 
        results: [], 
        query: '', 
        error: null 
      }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'เชื่อมต่อฐานข้อมูลล้มเหลว' }));
    } finally {
      setIsLoadingData(false);
    }
  };

  const addToQueue = (user: ElectricityUser) => {
    if (state.routeQueue.some(u => u.id === user.id)) return;
    setState(prev => ({ 
      ...prev, 
      routeQueue: [...prev.routeQueue, user],
      optimizedRoute: null 
    }));
  };

  const removeFromQueue = (id: string) => {
    setState(prev => ({ 
      ...prev, 
      routeQueue: prev.routeQueue.filter(u => u.id !== id),
      optimizedRoute: null 
    }));
  };

  const handleOptimize = async () => {
    if (state.routeQueue.length === 0) return;
    setIsOptimizing(true);
    const startLoc = userLocation || { lat: 14.97, lng: 102.10 };
    try {
      const orderedIds = await optimizeRoute(startLoc, state.routeQueue);
      setState(prev => ({ 
        ...prev, 
        optimizedRoute: orderedIds,
        viewMode: 'map',
        activeMapUser: prev.routeQueue.find(u => u.id === orderedIds[0]) || null
      }));
    } catch (err) {
      alert("AI จัดเส้นทางล้มเหลว");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleLaunchMaps = () => {
    const targetUsers = state.activeMapUser ? [state.activeMapUser] : 
                      (state.optimizedRoute ? state.optimizedRoute.map(id => state.routeQueue.find(u => u.id === id)).filter(u => !!u) : state.routeQueue);
    
    if (targetUsers.length === 0) return;
    const last = targetUsers[targetUsers.length - 1];
    if (!last) return;

    if (targetUsers.length === 1) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${last.latitude},${last.longitude}`, '_blank');
    } else {
      const waypoints = targetUsers.slice(0, -1).map(w => `${w!.latitude},${w!.longitude}`).join('|');
      const url = `https://www.google.com/maps/dir/?api=1&destination=${last.latitude},${last.longitude}&waypoints=${waypoints}`;
      window.open(url, '_blank');
    }
  };

  const setSearchType = (type: SearchType) => {
    setState(prev => ({ ...prev, searchType: type }));
  };

  if (!state.isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6 text-white overflow-hidden">
        <Logo className="mb-12 animate-in fade-in zoom-in duration-700" />
        
        <div className="w-full max-w-sm bg-white/5 backdrop-blur-2xl p-8 rounded-[3.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
          
          <div className="mb-10 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-purple-500/20 mb-5 transform hover:rotate-6 transition-transform">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">เข้าใช้งาน</h2>
            <p className="text-slate-500 font-bold text-xs mt-2 uppercase tracking-widest">Authentication Required</p>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <p className="text-purple-400 font-black text-sm mb-4">Guy.Pongsakorn</p>
              <div className="relative">
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="••••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                  className="w-full bg-slate-900/50 border-2 border-white/10 rounded-2xl py-5 px-6 text-center text-4xl tracking-[0.8em] font-black focus:outline-none focus:border-purple-500 transition-all placeholder:text-slate-800 placeholder:tracking-normal"
                  autoFocus
                />
                {loginError && (
                  <div className="absolute -bottom-8 left-0 right-0 animate-in slide-in-from-top-2 duration-300">
                    <p className="text-red-400 text-xs font-bold">{loginError}</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="pt-6 text-center">
              <p className="text-[9px] text-slate-600 uppercase font-black tracking-[0.2em]">
                PEA Intelligence Service
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-slate-600 text-[10px] font-bold tracking-widest uppercase">
          Build v2.5.0 • Authorized Personnel Only
        </div>
      </div>
    );
  }

  if (!state.selectedBranch) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-900">
        <Logo className="mb-10" />
        <div className="w-full max-w-md bg-white p-8 rounded-[3.5rem] shadow-2xl border border-white">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">เลือกพื้นที่</h2>
            <div className="text-[10px] font-black bg-purple-100 text-purple-600 px-3 py-1 rounded-full uppercase">Guy.P</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {['กฟส.คง', 'กฟส.บัวลาย', 'กฟส.บ้านเหลื่อม', 'กฟส.ประทาย', 'กฟส.บัวใหญ่', 'กฟส.โนนแดง'].map(b => (
              <button
                key={b}
                onClick={() => handleBranchSelect(b as BranchName)}
                disabled={isLoadingData}
                className="group relative overflow-hidden py-8 px-4 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] text-slate-700 font-bold hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all active:scale-95 disabled:opacity-50 text-sm shadow-sm"
              >
                <div className="relative z-10">{isLoadingData && b === state.selectedBranch ? 'กำลังโหลด...' : b}</div>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (state.viewMode === 'map') {
    return (
      <div className="fixed inset-0 z-50 flex flex-col h-screen overflow-hidden">
        <MapDisplay 
          users={state.routeQueue}
          activeUser={state.activeMapUser}
          onUserSelect={(u) => setState(p => ({...p, activeMapUser: u}))}
          currentUserLocation={userLocation}
          onBack={() => setState(p => ({...p, viewMode: 'search'}))}
          onSearchClick={() => setState(p => ({...p, viewMode: 'search'}))}
          onLaunchGps={handleLaunchMaps}
          onOptimize={handleOptimize}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faff] flex flex-col text-slate-900">
      <header className="bg-white/80 backdrop-blur-xl sticky top-0 z-50 border-b border-purple-100 px-6 py-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl rotate-3">P</div>
            <div>
              <h2 className="font-black text-slate-800 leading-none text-lg">PEA Pro</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{state.selectedBranch}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setState(p => ({...p, selectedBranch: null, routeQueue: [], optimizedRoute: null}))}
              className="text-[10px] font-black text-purple-600 bg-purple-50 px-4 py-2.5 rounded-2xl border border-purple-100"
            >
              เปลี่ยนพื้นที่
            </button>
            <button 
              onClick={() => setState(p => ({...p, isLoggedIn: false, currentUser: null, pin: ''}))}
              className="text-[10px] font-black text-red-600 bg-red-50 px-4 py-2.5 rounded-2xl border border-red-100"
            >
              ออก
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full p-6 flex flex-col gap-6">
        <div className="flex p-1.5 bg-slate-200/50 rounded-3xl w-full max-w-xs mx-auto border border-slate-200 shadow-inner">
          <button 
            onClick={() => setState(p => ({...p, viewMode: 'search'}))}
            className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all ${state.viewMode === 'search' ? 'bg-white shadow-md text-purple-600' : 'text-slate-500'}`}
          >
            ค้นหา ({state.totalRecords})
          </button>
          <button 
            onClick={() => setState(p => ({...p, viewMode: 'map'}))}
            className={`flex-1 py-3 rounded-2xl text-xs font-black transition-all ${state.viewMode === 'map' ? 'bg-white shadow-md text-purple-600' : 'text-slate-500'}`}
          >
            แผนที่ ({state.routeQueue.length})
          </button>
        </div>

        <div className="space-y-6 animate-slide-up pb-40">
          <div className="space-y-4">
            {/* Search Categories Pill Selector */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {[
                { id: 'all', label: 'ทั้งหมด' },
                { id: 'name', label: 'ชื่อ' },
                { id: 'ca', label: 'เลข CA' },
                { id: 'meter', label: 'เลขมิเตอร์' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSearchType(cat.id as SearchType)}
                  className={`px-6 py-2 rounded-2xl text-[11px] font-black whitespace-nowrap transition-all border ${
                    state.searchType === cat.id 
                      ? 'bg-purple-600 text-white border-purple-600 shadow-lg shadow-purple-500/20' 
                      : 'bg-white text-slate-400 border-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="relative group">
              <input 
                type="text"
                placeholder={
                  state.searchType === 'name' ? "ค้นชื่อ..." :
                  state.searchType === 'ca' ? "ค้นเลข CA..." :
                  state.searchType === 'meter' ? "ค้นเลขมิเตอร์..." : "ค้นชื่อ หรือ เลข CA / มิเตอร์..."
                }
                value={state.query}
                onChange={(e) => setState(p => ({...p, query: e.target.value}))}
                className="w-full pl-16 pr-8 py-6 bg-white rounded-[2.5rem] border-2 border-slate-100 shadow-xl focus:outline-none focus:border-purple-500 text-xl font-bold text-slate-900 transition-all placeholder:text-slate-300"
              />
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-purple-500 transition-transform group-focus-within:scale-110">
                {state.isSearching ? <div className="loader !w-6 !h-6 !border-[3px]"></div> : (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {state.results.map(user => (
              <ResultCard 
                key={user.id} 
                user={user} 
                onAddToRoute={addToQueue}
                onRemoveFromRoute={removeFromQueue}
                isInRoute={state.routeQueue.some(q => q.id === user.id)}
              />
            ))}
            {state.query && state.results.length === 0 && !state.isSearching && (
              <div className="text-center py-20 bg-white/50 rounded-[3rem] border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                   <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                   </svg>
                </div>
                <p className="text-slate-400 font-bold">ไม่พบข้อมูลในหมวด "{
                  state.searchType === 'name' ? "ชื่อ" :
                  state.searchType === 'ca' ? "เลข CA" :
                  state.searchType === 'meter' ? "เลขมิเตอร์" : "ทั้งหมด"
                }"</p>
                <p className="text-[10px] text-slate-300 uppercase mt-1">ลองเปลี่ยนหมวดหมู่การค้นหา</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {state.routeQueue.length > 0 && (
        <div className="fixed bottom-8 left-0 right-0 px-6 z-40 animate-in slide-in-from-bottom-10 duration-500">
          <div className="max-w-4xl mx-auto flex gap-3">
            <div className="flex-1 bg-white/95 backdrop-blur-2xl p-5 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white flex items-center justify-between">
              <div className="flex items-center gap-4 pl-3">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-purple-500/20">
                  {state.routeQueue.length}
                </div>
                <div>
                  <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest leading-none mb-1">Queue Active</p>
                  <p className="font-black text-slate-800 text-lg">เลือกไว้ {state.routeQueue.length} รายการ</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setState(p => ({...p, viewMode: 'map'}))}
                  className="px-8 py-4 rounded-2xl font-black text-white text-sm bg-purple-600 shadow-xl shadow-purple-500/20 active:scale-95 transition-all hover:bg-purple-700"
                >
                  เปิดแผนที่
                </button>
                <button 
                  onClick={handleLaunchMaps}
                  className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 active:scale-95 transition-all hover:bg-emerald-600"
                >
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
