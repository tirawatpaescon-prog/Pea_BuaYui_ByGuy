
import React, { useEffect, useRef } from 'react';
import { ElectricityUser, UserLocation } from '../types';

interface MapDisplayProps {
  users: ElectricityUser[];
  activeUser: ElectricityUser | null;
  onUserSelect: (user: ElectricityUser) => void;
  currentUserLocation: UserLocation | null;
  onBack: () => void;
  onSearchClick: () => void;
  onLaunchGps: () => void;
  onOptimize: () => void;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ 
  users, 
  activeUser, 
  onUserSelect, 
  currentUserLocation,
  onBack,
  onSearchClick,
  onLaunchGps,
  onOptimize
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = (window as any).L.map(mapContainerRef.current, {
      zoomControl: false,
      attributionControl: false,
      maxZoom: 20,
      minZoom: 8
    });

    (window as any).L.tileLayer('https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    }).addTo(map);

    mapRef.current = map;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;
    const map = mapRef.current;
    const L = (window as any).L;

    Object.values(markersRef.current).forEach((m: any) => m.remove());
    markersRef.current = {};

    const markerList: any[] = [];

    users.forEach(user => {
      const isActive = activeUser?.id === user.id;
      const marker = L.marker([user.latitude, user.longitude], {
        icon: L.divIcon({
          className: 'custom-pin',
          html: `<div style="
            width: 36px; height: 36px; 
            background: #ea4335; 
            border-radius: 50% 50% 50% 0; 
            transform: rotate(-45deg); 
            display: flex; align-items: center; justify-content: center;
            border: 2px solid white;
            box-shadow: 0 4px 8px rgba(0,0,0,0.4);
            transition: all 0.2s;
            ${isActive ? 'scale(1.2); border-width: 3px;' : ''}
          ">
            <div style="width: 10px; height: 10px; background: white; border-radius: 50%;"></div>
          </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 36]
        })
      }).addTo(map);

      marker.on('click', () => onUserSelect(user));
      markersRef.current[user.id] = marker;
      markerList.push(marker);
    });

    if (activeUser) {
      map.setView([activeUser.latitude, activeUser.longitude], 18, { animate: true });
    } else if (markerList.length > 0) {
      const group = L.featureGroup(markerList);
      map.fitBounds(group.getBounds().pad(0.2), { maxZoom: 18 });
    } else if (currentUserLocation) {
      map.setView([currentUserLocation.lat, currentUserLocation.lng], 16);
    }
  }, [users, activeUser, currentUserLocation, onUserSelect]);

  return (
    <div className="relative w-full h-full bg-[#1a1c1e] overflow-hidden">
      {/* ส่วนบน: แถบค้นหาแบบ Dark */}
      <div className="absolute top-4 left-0 right-0 px-4 z-[1000]">
        <div className="max-w-md mx-auto bg-[#212121]/95 backdrop-blur-md h-14 rounded-xl flex items-center px-4 shadow-2xl border border-white/5 text-white">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors mr-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 text-slate-300 font-medium cursor-pointer" onClick={onSearchClick}>
            ค้นหาที่นี่
          </div>
        </div>
      </div>

      {/* แผนที่ */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* ปุ่มลอยด้านขวา */}
      <div className="absolute top-24 right-4 flex flex-col gap-4 z-[1000]">
        <button 
          onClick={onLaunchGps}
          className="w-14 h-14 bg-[#22c55e] rounded-2xl flex items-center justify-center text-white shadow-xl active:scale-90 transition-transform"
          title="เปิด GPS นำทาง"
        >
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
          </svg>
        </button>
        <button 
          onClick={onOptimize}
          className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-700 shadow-xl active:scale-90 transition-transform border border-slate-100"
          title="จัดเส้นทาง AI"
        >
          <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>

      {/* การ์ดรายละเอียดด้านล่าง (Dark Theme) */}
      {activeUser && (
        <div className="absolute bottom-6 left-0 right-0 px-4 z-[1000] animate-slide-up">
          <div className="max-w-md mx-auto bg-[#1e1e1e]/95 backdrop-blur-lg text-white p-6 rounded-[2.5rem] shadow-2xl border border-white/10">
            <div className="flex gap-5">
              <div className="w-20 h-20 bg-[#ea4335] rounded-3xl flex items-center justify-center shadow-lg flex-shrink-0">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-black truncate leading-tight tracking-tight">{activeUser.firstName} {activeUser.lastName}</h3>
                    <div className="flex gap-3 mt-1">
                      <p className="text-red-400 font-black uppercase tracking-widest text-[10px]">CA: {activeUser.caNumber}</p>
                      <p className="text-cyan-400 font-black uppercase tracking-widest text-[10px]">METER: {activeUser.peaMeter}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                    <span className="text-xs">📍</span>
                    <p className="text-[11px] text-slate-300 font-medium truncate">{activeUser.address}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                    <span className="text-xs">⚡</span>
                    <p className="text-[11px] text-slate-300 font-black">{activeUser.amperhour} • {activeUser.phase} Phase</p>
                  </div>
                </div>

                <div className="mt-4">
                  <button onClick={onLaunchGps} className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-cyan-400 font-black text-xs transition-colors flex items-center gap-2">
                    ดูคำอธิบายแผนที่
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapDisplay;
