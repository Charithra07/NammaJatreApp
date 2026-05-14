import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  Search, 
  Info, 
  Phone, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Plus,
  ArrowRight,
  ShieldCheck,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  orderBy, 
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { db, auth } from './lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

// --- Types ---
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'religious' | 'cultural' | 'sports' | 'other';
  status: 'upcoming' | 'ongoing' | 'completed';
  description: string;
}

interface LostFoundItem {
  id: string;
  title: string;
  description: string;
  type: 'lost' | 'found';
  status: 'active' | 'resolved';
  imageUrl: string;
  contactInfo: string;
  createdAt: any;
}

// --- Components ---

const Header = ({ user, onLogin, onProfileClick }: { user: any, onLogin: () => void, onProfileClick: () => void }) => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-[#800000] text-[#FFD700] shadow-lg border-b border-[#FFD700]/30 backdrop-blur-md bg-opacity-95">
    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-[#FFD700] rounded-full flex items-center justify-center shadow-inner border-2 border-[#800000]">
          <span className="text-[#800000] font-black text-lg md:text-xl">NJ</span>
        </div>
        <h1 className="text-lg md:text-2xl font-black tracking-widest uppercase font-serif">Namma Jatre</h1>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <button 
            onClick={onProfileClick}
            className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all active:scale-95"
          >
            <div className="w-6 h-6 rounded-full overflow-hidden border border-[#FFD700]/50">
              <img src={user.photoURL} alt="Avatar" referrerPolicy="no-referrer" />
            </div>
            <span className="text-[10px] font-bold uppercase hidden sm:block text-[#FFD700]">{user.displayName.split(' ')[0]}</span>
          </button>
        ) : (
          <button 
            onClick={onLogin}
            className="px-4 py-2 bg-[#FFD700] text-[#800000] rounded-full text-[10px] font-black uppercase hover:bg-white transition-colors shadow-lg border border-[#800000]/20"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  </header>
);

const ProfileModal = ({ user, onClose, onLogout }: { user: any, onClose: () => void, onLogout: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-4 bg-[#800000]/95 backdrop-blur-2xl"
    >
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="bg-[#FFFDF9] w-full h-full md:h-auto md:max-w-lg md:rounded-[40px] overflow-y-auto shadow-2xl relative border-t-8 md:border-8 border-[#FFD700]"
      >
        {/* Traditional Border Decoration */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-5">
          <svg width="100%" height="100%" viewBox="0 0 100 100">
             <pattern id="profile-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
               <circle cx="10" cy="10" r="1.5" fill="#800000" />
               <path d="M10 0 L20 10 L10 20 L0 10 Z" fill="none" stroke="#800000" strokeWidth="0.5" />
             </pattern>
             <rect width="100%" height="100%" fill="url(#profile-pattern)" />
          </svg>
        </div>

        {/* Top Close Button for Mobile Accessibility */}
        <div className="sticky top-0 right-0 left-0 p-6 flex justify-end z-20 md:absolute">
          <button 
            onClick={onClose}
            className="p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border-2 border-[#FFD700] hover:scale-110 active:scale-95 transition-all"
          >
            <Plus className="w-6 h-6 rotate-45 text-[#800000]" />
          </button>
        </div>

        <div className="p-8 pb-32 pt-4 md:pt-16 md:p-10 flex flex-col items-center text-center relative z-10">
          {/* Traditional Welcome Header */}
          <div className="mb-8">
            <p className="text-[#800000] text-[10px] font-black uppercase tracking-[0.5em] mb-3">|| Shubhamasthu ||</p>
            <h4 className="text-[#800000] text-lg font-black uppercase tracking-[0.2em] mb-2 font-serif px-6">Devatara Swagaatha</h4>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent mx-auto mb-4" />
          </div>

          <div className="w-36 h-36 rounded-full border-4 border-[#FFD700] p-1.5 mb-6 shadow-2xl relative">
            <img 
              src={user.photoURL} 
              alt={user.displayName} 
              className="w-full h-full rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute -bottom-1 -right-1 w-12 h-12 bg-[#FFD700] rounded-full flex items-center justify-center border-4 border-white shadow-xl">
              <ShieldCheck className="w-7 h-7 text-[#800000]" />
            </div>
          </div>

          <h3 className="text-3xl md:text-4xl font-black text-slate-900 uppercase font-serif mb-1 tracking-tight">{user.displayName}</h3>
          <p className="text-slate-500 font-bold uppercase text-[9px] tracking-[0.2em] mb-8">{user.email}</p>

          <div className="w-full bg-[#FFF8E1] p-6 md:p-8 rounded-[40px] border-2 border-[#FFD700] border-dashed mb-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
               <History className="w-24 h-24 text-[#800000]" />
            </div>
            <p className="text-[#800000] font-black uppercase text-[10px] tracking-widest mb-4 opacity-60">Personalized Invitation</p>
            <p className="text-[#800000] text-xl md:text-2xl font-serif leading-relaxed italic drop-shadow-sm">
              "Namaskaara, {user.displayName.split(' ')[0]}! You are warmly invited to witness the divine granduer and traditions of Namma Jatre. May the village deity bless your home with prosperity."
            </p>
            <div className="mt-8 pt-6 border-t border-[#FFD700]/40 flex justify-between items-center bg-white/30 rounded-2xl px-4 py-2">
               <div className="text-left">
                  <p className="text-[8px] font-black text-[#800000] opacity-50 uppercase mb-0.5">Attendee Level</p>
                  <p className="text-xs font-black text-[#800000] uppercase">Honored Guest</p>
               </div>
               <div className="text-right">
                  <p className="text-[8px] font-black text-[#800000] opacity-50 uppercase mb-0.5">Tradition Check</p>
                  <p className="text-xs font-black text-green-700 uppercase">Verified</p>
               </div>
            </div>
          </div>

          {/* Traditional Badges / Achievements */}
          <div className="w-full mb-10 overflow-x-auto no-scrollbar pb-2">
            <div className="flex gap-4 min-w-max px-2">
              {[
                { label: 'Dharmika', color: 'bg-orange-100 text-orange-700 border-orange-200' },
                { label: 'Seva Ratna', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
                { label: 'Village Guest', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
              ].map(badge => (
                <div key={badge.label} className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 ${badge.color} shadow-sm`}>
                  {badge.label}
                </div>
              ))}
            </div>
            <p className="text-[8px] font-bold text-slate-400 uppercase mt-4 tracking-widest">Traditional Participation Badges</p>
          </div>

          <div className="grid grid-cols-1 gap-4 w-full">
            <button 
              onClick={onClose}
              className="w-full py-5 bg-[#800000] text-[#FFD700] rounded-3xl text-sm font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.01] active:scale-95 transition-all border-2 border-[#FFD700]/20"
            >
              Return to Jatre
            </button>
            <button 
              onClick={() => { onLogout(); onClose(); }}
              className="w-full py-4 bg-white border-2 border-red-100 rounded-2xl text-red-600 text-[10px] font-black uppercase tracking-widest hover:bg-red-50 transition-all opacity-80"
            >
              Signing Out?
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const SectionHeader = ({ title, icon: Icon, subtitle }: { title: string, icon: any, subtitle?: string }) => (
  <div className="mb-8 flex flex-col gap-2">
    <div className="flex items-center gap-3">
      <div className="p-3 bg-[#800000]/5 rounded-2xl border border-[#800000]/10">
        <Icon className="w-6 h-6 text-[#800000]" />
      </div>
      <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase leading-none font-serif">{title}</h2>
    </div>
    {subtitle && <p className="text-slate-500 text-sm font-medium ml-14">{subtitle}</p>}
  </div>
);

const EventCard: React.FC<{ event: Event }> = ({ event }) => {
  const isOngoing = event.status === 'ongoing';
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative group p-5 rounded-3xl border-2 transition-all flex flex-col h-full ${
        isOngoing ? 'bg-[#FFF8E1] border-[#FFD700] shadow-xl scale-[1.02]' : 'bg-white border-slate-100 hover:border-[#800000]/20 shadow-sm'
      }`}
    >
      {isOngoing && (
        <div className="absolute -top-3 left-6 px-3 py-1 bg-[#800000] text-[#FFD700] text-[10px] font-black uppercase rounded-full shadow-lg animate-pulse flex items-center gap-1 border border-[#FFD700]/30 z-10">
          <Clock className="w-3 h-3" /> Happening Now
        </div>
      )}
      
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
            event.type === 'religious' ? 'bg-orange-100 text-orange-700' : 
            event.type === 'cultural' ? 'bg-purple-100 text-purple-700' :
            event.type === 'sports' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
          }`}>
            {event.type}
          </span>
          <span className="text-[10px] font-black text-[#800000] bg-[#800000]/5 px-2 py-0.5 rounded-md border border-[#800000]/10">
            {event.date}
          </span>
        </div>
        <h3 className="text-lg font-black text-slate-900 leading-tight uppercase font-serif min-h-[3rem] line-clamp-2">
          {event.title}
        </h3>
      </div>

      <div className="mt-auto space-y-2">
        <div className="flex items-center gap-2 text-slate-700">
          <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 flex-shrink-0">
            <Clock className="w-3.5 h-3.5 text-[#800000]" />
          </div>
          <p className="text-xs font-black text-[#800000] uppercase tracking-tighter">{event.time}</p>
        </div>
        
        <div className="flex items-center gap-2 text-slate-500">
          <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 flex-shrink-0">
            <Info className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wide leading-tight line-clamp-1">{event.location}</span>
        </div>
        
        <p className="text-slate-600 text-[11px] leading-relaxed border-t border-slate-50 pt-3 italic line-clamp-2">
          "{event.description}"
        </p>
      </div>
    </motion.div>
  );
};

const LostFoundCard: React.FC<{ item: LostFoundItem, onToggleStatus: (id: string) => void | Promise<void> }> = ({ item, onToggleStatus }) => {
  const isResolved = item.status === 'resolved';
  const isLost = item.type === 'lost';
  
  return (
    <motion.div 
      layout
      className={`p-5 rounded-[32px] border-2 transition-all overflow-hidden ${
        isResolved ? 'bg-slate-50 border-slate-200 opacity-60 grayscale' : 
        isLost ? 'bg-red-50 border-red-100 shadow-md hover:shadow-lg' : 'bg-green-50 border-green-100 shadow-md hover:shadow-lg'
      }`}
    >
      <div className="flex gap-5">
        <div className={`w-28 h-28 rounded-2xl flex-shrink-0 relative overflow-hidden flex items-center justify-center border-2 ${
          isLost ? 'border-red-200 bg-white' : 'border-green-200 bg-white'
        }`}>
          {item.imageUrl ? (
            <img src={item.imageUrl} className="w-full h-full object-cover" alt={item.title} referrerPolicy="no-referrer" />
          ) : (
            <AlertTriangle className={`w-10 h-10 ${isLost ? 'text-red-300' : 'text-green-300'}`} />
          )}
          <div className={`absolute top-2 left-2 px-2.5 py-1 rounded-full text-[9px] font-black uppercase shadow-lg border border-white/50 ${
            isLost ? 'bg-red-600 text-white' : 'bg-green-600 text-white'
          }`}>
            {item.type}
          </div>
        </div>
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-2 mb-1">
              <h4 className={`text-xl font-black uppercase tracking-tight font-serif truncate ${isLost ? 'text-red-950' : 'text-green-950'}`}>{item.title}</h4>
              {isResolved && <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />}
            </div>
            <p className="text-slate-700 text-xs line-clamp-2 leading-relaxed bg-white/40 p-2 rounded-xl mb-3">{item.description}</p>
          </div>
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full bg-white border ${isLost ? 'text-red-600 border-red-200' : 'text-green-600 border-green-200'}`}>
              <Phone className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">{item.contactInfo}</span>
            </div>
          </div>
        </div>
      </div>
      {!isResolved && (
        <button 
          onClick={() => onToggleStatus(item.id)}
          className={`w-full mt-4 py-3 rounded-2xl text-[10px] font-black uppercase transition-all border-2 ${
            isLost ? 'bg-red-600 text-white border-red-700 hover:bg-red-700' : 'bg-green-600 text-white border-green-700 hover:bg-green-700'
          } shadow-md`}
        >
          Mark as Resolved
        </button>
      )}
    </motion.div>
  );
};

// --- Main App ---

// --- Main App ---

const INITIAL_EVENTS: Event[] = [
  // May 13
  { id: 'may13-1', title: 'Suprabhatha Seva', date: 'May 13', time: '05:30 AM', location: 'Main Temple Sanctum', type: 'religious', status: 'completed', description: 'Early morning prayers to awaken the deity for the festival start.' },
  { id: 'may13-2', title: 'Special Ganesha Pooja', date: 'May 13', time: '08:00 AM', location: 'Temple Inner Circle', type: 'religious', status: 'completed', description: 'Seeking blessings for the overall success of the Namma Jatre.' },
  { id: 'may13-3', title: 'Dhwajarohana (Inauguration)', date: 'May 13', time: '10:00 AM', location: 'Temple Entrance Mast', type: 'religious', status: 'completed', description: 'The ceremonial flag hoisting to mark the official start of the festivities.' },
  { id: 'may13-4', title: 'Mass Annadana Seva', date: 'May 13', time: '01:00 PM', location: 'Bhojana Shale Hall A', type: 'religious', status: 'completed', description: 'Sacred community feast served to all visiting devotees.' },
  { id: 'may13-5', title: 'Religious Discourse', date: 'May 13', time: '04:00 PM', location: 'Pravachana Mantapa', type: 'religious', status: 'completed', description: 'Spiritual talk on the history and significance of the village deity.' },
  { id: 'may13-6', title: 'Folk Music Evening', date: 'May 13', time: '06:30 PM', location: 'Cultural Stage Grounds', type: 'cultural', status: 'completed', description: 'Melodic evening featuring local Sugama Sangeeta artists.' },
  
  // May 14
  { id: 'may14-1', title: 'Mahapooje & Deeparadhane', date: 'May 14', time: '06:00 AM', location: 'Main Temple Sanctum', type: 'religious', status: 'completed', description: 'Special morning prayers and grand lamp offering.' },
  { id: 'may14-2', title: 'Historic Cattle Fair', date: 'May 14', time: '09:30 AM', location: 'Southern Fair Grounds', type: 'other', status: 'completed', description: 'Traditonal livestock exhibition featuring local breeds and bulls.' },
  { id: 'may14-3', title: 'Agricultural Expo', date: 'May 14', time: '11:00 AM', location: 'Exhibition Hall B', type: 'other', status: 'completed', description: 'Showcasing local produce and modern farming equipment.' },
  { id: 'may14-4', title: 'Community Lunch', date: 'May 14', time: '01:00 PM', location: 'Bhojana Shale', type: 'religious', status: 'completed', description: 'Traditional festive meal served to thousands of people.' },
  { id: 'may14-5', title: 'Village Sports (Traditional)', date: 'May 14', time: '04:00 PM', location: 'Open Grounds', type: 'sports', status: 'completed', description: 'Local games and competitions for the youth.' },
  { id: 'may14-6', title: 'Mythological Drama (Nataka)', date: 'May 14', time: '10:00 PM', location: 'Open Air Theatre', type: 'cultural', status: 'completed', description: 'All-night performance of a classic Kannada mythological play.' },

  // May 15 - Rathotsava Day
  { id: 'may15-1', title: 'Rathotsava Mahapooje', date: 'May 15', time: '08:00 AM', location: 'Inner Shrine', type: 'religious', status: 'ongoing', description: 'Special rituals performed leading up to the grand chariot event.' },
  { id: 'may15-2', title: 'Chariot Decoration', date: 'May 15', time: '11:00 AM', location: 'Ratha Beedi Street', type: 'other', status: 'upcoming', description: 'Artisans and devotees decorate the chariot with silk and garlands.' },
  { id: 'may15-3', title: 'Grand Annadana Seva', date: 'May 15', time: '01:00 PM', location: 'Bhojana Shale Hall A', type: 'religious', status: 'upcoming', description: 'The main festival feast for the day of Rathotsava.' },
  { id: 'may15-4', title: 'Wrestling Mahapooje', date: 'May 15', time: '05:00 PM', location: 'Garadi Mane Arena', type: 'sports', status: 'upcoming', description: 'Sacred ritual performed in the wrestling arena before matches.' },
  { id: 'may15-5', title: 'Grand Rathotsava', date: 'May 15', time: '07:00 PM', location: 'Temple High Street (Ratha Beedi)', type: 'religious', status: 'upcoming', description: 'The peak of the Jatre - drawing the wooden chariot by devotees.' },
  { id: 'may15-6', title: 'Grand Wrestling (Kusti)', date: 'May 15', time: '08:30 PM', location: 'Village Akhada', type: 'sports', status: 'upcoming', description: 'The historic Kusti matches featuring champions from across Karnataka.' },

  // May 16
  { id: 'may16-1', title: 'Pallakki Utsava', date: 'May 16', time: '10:00 AM', location: 'Temple Vicinity Path', type: 'religious', status: 'upcoming', description: 'Procession of the deity in a decorated palanquin.' },
  { id: 'may16-2', title: 'Day-3 Annadana', date: 'May 16', time: '01:00 PM', location: 'Bhojana Shale', type: 'religious', status: 'upcoming', description: 'Community lunch following the morning procession.' },
  { id: 'may16-3', title: 'Classical Dance Program', date: 'May 16', time: '06:00 PM', location: 'Cultural Stage', type: 'cultural', status: 'upcoming', description: 'Bharatanatyam and folk dance performances.' },
  { id: 'may16-4', title: 'Awards Ceremony', date: 'May 16', time: '08:00 PM', location: 'Main Stage Ground', type: 'other', status: 'upcoming', description: 'Honoring the winners of the cattle fair and wrestling matches.' },

  // May 17
  { id: 'may17-1', title: 'Vasanthotsava Rituals', date: 'May 17', time: '11:00 AM', location: 'Temple Lake Bank', type: 'religious', status: 'upcoming', description: 'Concluding ritual with sacred colors to cool down the deity.' },
  { id: 'may17-2', title: 'Final Community Feast', date: 'May 17', time: '01:00 PM', location: 'Bhojana Shale', type: 'religious', status: 'upcoming', description: 'The gathering of villagers to share the final festive meal.' },
  { id: 'may17-3', title: 'Dhwajavarohana (Closing)', date: 'May 17', time: '05:00 PM', location: 'Temple Entrance', type: 'religious', status: 'upcoming', description: 'Lowering the flag to signify the formal end of Namma Jatre.' },
];

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [events, setEvents] = useState<Event[]>(INITIAL_EVENTS);
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [activeTab, setActiveTab] = useState<'schedule' | 'lost' | 'safety' | 'stories'>('schedule');
  const [scheduleFilter, setScheduleFilter] = useState<'all' | 'religious' | 'sports' | 'cultural' | 'other'>('all');
  const [showReportForm, setShowReportForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [newReport, setNewReport] = useState({ title: '', description: '', contactInfo: '', type: 'lost' as 'lost' | 'found' });

  const filteredEvents = useMemo(() => {
    if (scheduleFilter === 'all') return events;
    return events.filter(e => e.type === scheduleFilter);
  }, [events, scheduleFilter]);

  useEffect(() => {
    // Auth
    const unsubAuth = auth.onAuthStateChanged((u) => {
      setUser(u);
      setAuthLoading(false);
    });

    // Events - Merging live data with hardcoded if empty
    const qEvents = query(collection(db, 'events')); 
    const unsubEvents = onSnapshot(qEvents, (snap) => {
      console.log("Events Snapshot received, size:", snap.size);
      if (!snap.empty) {
        setEvents(snap.docs.map(d => ({ id: d.id, ...d.data() } as Event)));
      } else {
        setEvents(INITIAL_EVENTS);
      }
    }, (error) => {
      console.warn("Firestore Events Access error, falling back to local data:", error);
      setEvents(INITIAL_EVENTS);
    });

    // Items
    const qItems = query(collection(db, 'items'), orderBy('createdAt', 'desc'));
    const unsubItems = onSnapshot(qItems, (snap) => {
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() } as LostFoundItem)));
    }, (error) => {
      console.error("Items snapshot error", error);
    });

    return () => { unsubAuth(); unsubEvents(); unsubItems(); };
  }, []);

  const seedData = async () => {
    if (!user) {
      handleLogin();
      return;
    }
    try {
      for (const event of INITIAL_EVENTS) {
        const { id, ...data } = event;
        await addDoc(collection(db, 'events'), data);
      }
      alert("Events seeded successfully!");
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'events');
    }
  };

  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (e: any) {
      if (e.code === 'auth/popup-closed-by-user') {
         console.log("Login cancelled by user");
      } else {
         console.error("Login Error:", e);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const markResolved = async (id: string) => {
    try {
      await updateDoc(doc(db, 'items', id), { status: 'resolved' });
    } catch (e) {
      console.error("Firestore Update error", e);
      setItems(prev => prev.map(item => item.id === id ? { ...item, status: 'resolved' } : item));
    }
  };

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      handleLogin();
      return;
    }
    // Form validation check
    if (!newReport.title.trim() || !newReport.description.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      await addDoc(collection(db, 'items'), {
        ...newReport,
        status: 'active',
        createdAt: serverTimestamp(),
        userId: user.uid,
        userName: user.displayName,
        userPhoto: user.photoURL
      });
      setShowReportForm(false);
      setNewReport({ title: '', description: '', contactInfo: '', type: 'lost' });
      alert("Registration Successful! Your item has been listed.");
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'items');
    }
  };

  const ongoingEvent = events.find(e => e.status === 'ongoing') || events.find(e => e.status === 'upcoming');

  return (
    <div className="min-h-screen bg-[#FFFDF9] text-slate-900 font-sans pb-24">
      <Header user={user} onLogin={handleLogin} onProfileClick={() => setShowProfile(true)} />

      <AnimatePresence>
        {showProfile && user && (
          <ProfileModal 
            user={user} 
            onClose={() => setShowProfile(false)} 
            onLogout={() => auth.signOut()} 
          />
        )}
      </AnimatePresence>

      {/* Hero Banner */}
      <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 bg-[#800000] overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1920&auto=format&fit=crop" 
            className="w-full h-full object-cover mix-blend-multiply opacity-40 brightness-50"
            alt="Festival atmosphere"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FFFDF9] via-transparent to-[#800000]/30" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl pt-8 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 md:mb-6 inline-block px-3 py-1.5 bg-[#FFD700] text-[#800000] rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-widest border-2 border-[#800000]/20 shadow-lg"
          >
            Digital Guide to our Traditions
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-9xl font-black text-white leading-none mb-4 md:mb-6 drop-shadow-2xl uppercase tracking-tighter font-serif"
          >
            Namma <br />
            <span className="text-[#FFD700]">Jatre</span>
          </motion.h2>
          <p className="text-[#FFD700] font-black text-sm md:text-2xl uppercase tracking-[0.2em] md:tracking-[0.3em] opacity-90 font-serif drop-shadow-md">
            Cultural Heritage & Celebration
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 -mt-12 md:-mt-16 relative z-20 pb-40">
        
        {/* Ongoing Event Spotlight */}
        {ongoingEvent && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 bg-white rounded-[40px] p-8 shadow-2xl border-4 border-[#FFD700] flex flex-col md:flex-row gap-8 items-center"
          >
            <div className="w-24 h-24 bg-[#800000] rounded-3xl flex items-center justify-center flex-shrink-0 animate-bounce shadow-xl">
              <History className="w-12 h-12 text-[#FFD700]" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
                <p className="text-[10px] font-black uppercase text-red-600 tracking-widest">Active or Upcoming Event</p>
              </div>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 uppercase leading-none mb-3 font-serif line-clamp-2">{ongoingEvent.title}</h3>
              <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">
                <p className="text-[#800000] font-bold text-xs bg-[#FFF8E1] px-4 py-1.5 rounded-full border border-[#FFD700]/30 shadow-sm uppercase tracking-widest">
                   {ongoingEvent.date}
                </p>
                <p className="text-[#800000] font-bold text-sm bg-white px-4 py-1.5 rounded-full border border-[#FFD700]/10 shadow-sm">
                   {ongoingEvent.location}
                </p>
                <p className="text-slate-600 font-black text-sm uppercase tracking-tighter">
                   {ongoingEvent.time}
                </p>
              </div>
            </div>
            <div className="hidden lg:block h-20 w-px bg-slate-100 mx-4" />
            <div className="hidden lg:flex flex-col items-center">
               <span className="text-[10px] font-black text-slate-400 uppercase mb-2">Festive Mood</span>
               <div className="flex gap-1">
                 {[1,2,3,4,5].map(i => <div key={i} className="w-2 h-6 bg-[#800000] rounded-full opacity-60" />)}
               </div>
            </div>
          </motion.div>
        )}

        {/* Content Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          
          {/* Main Feed */}
          <div className="md:col-span-8">
            
            <AnimatePresence mode="wait">
              {activeTab === 'schedule' && (
                <motion.div 
                  key="schedule"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <SectionHeader 
                    title="Jatre Schedule (May 13 - 17)" 
                    icon={Calendar} 
                    subtitle="Our ancient traditions, organized day-by-day. Use filters to find specific events."
                  />

                  {/* Schedule Filters */}
                  <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-100">
                    {[
                      { id: 'all', label: 'All Events' },
                      { id: 'religious', label: 'Religious & Pooja' },
                      { id: 'sports', label: 'Sports & Kusti' },
                      { id: 'cultural', label: 'Entertainment & Drama' }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setScheduleFilter(f.id as any)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          scheduleFilter === f.id 
                            ? 'bg-[#800000] text-[#FFD700] shadow-md' 
                            : 'text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {filteredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredEvents.map(e => <EventCard key={e.id} event={e} />)}
                    </div>
                  ) : (
                    <div className="text-center py-20 bg-white rounded-[40px] border-4 border-dashed border-slate-100">
                      <p className="text-slate-400 font-black uppercase text-xs">No events found</p>
                    </div>
                  )}
                  {user && events === INITIAL_EVENTS && (
                    <button 
                      onClick={seedData}
                      className="mt-8 w-full py-4 border-2 border-[#800000] border-dashed rounded-3xl text-[#800000] font-black uppercase text-[10px] hover:bg-[#800000]/5 transition-all"
                    >
                      Click here to sync template schedule to server
                    </button>
                  )}
                </motion.div>
              )}

              {activeTab === 'lost' && (
                <motion.div 
                  key="lost"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <SectionHeader 
                    title="Lost & Found" 
                    icon={AlertTriangle} 
                    subtitle="Helping our community stay together. Recent reports from the fair grounds."
                  />
                  
                  {showReportForm ? (
                    <motion.div 
                      key="report-form"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-[40px] p-8 md:p-10 border-4 border-[#800000] shadow-2xl mb-12 relative"
                    >
                      <button 
                        onClick={() => setShowReportForm(false)} 
                        className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-all"
                      >
                        <Plus className="w-6 h-6 rotate-45 text-slate-400" />
                      </button>

                      <div className="mb-8">
                        <h4 className="text-3xl font-black text-[#800000] uppercase font-serif mb-1">New Report</h4>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Register lost or found items</p>
                      </div>

                      <form onSubmit={handleCreateReport} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          {['lost', 'found'].map(t => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => setNewReport({...newReport, type: t as any})}
                              className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${
                                newReport.type === t 
                                  ? (t === 'lost' ? 'bg-red-600 text-white border-red-700 shadow-md' : 'bg-green-600 text-white border-green-700 shadow-md')
                                  : 'bg-white text-slate-400 border-slate-100 hover:bg-slate-50'
                              }`}
                            >
                              It's a {t} Item
                            </button>
                          ))}
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-2">Item Name</label>
                            <input 
                              required
                              type="text" 
                              placeholder="What did you find/lose?"
                              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-[#800000] outline-none transition-all"
                              value={newReport.title}
                              onChange={e => setNewReport({...newReport, title: e.target.value})}
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-2">Description</label>
                            <textarea 
                              required
                              placeholder="Describe color, size, and where..."
                              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-[#800000] outline-none transition-all h-28 resize-none"
                              value={newReport.description}
                              onChange={e => setNewReport({...newReport, description: e.target.value})}
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block ml-2">Contact Info</label>
                            <input 
                              required
                              type="tel"
                              placeholder="Your phone number"
                              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:border-[#800000] outline-none transition-all font-mono"
                              value={newReport.contactInfo}
                              onChange={e => setNewReport({...newReport, contactInfo: e.target.value})}
                            />
                          </div>
                        </div>

                        <button 
                          type="submit"
                          className="w-full py-5 bg-[#800000] text-[#FFD700] rounded-[24px] text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all"
                        >
                          Submit Report
                        </button>
                      </form>
                    </motion.div>
                  ) : (
                    <button 
                      onClick={() => setShowReportForm(true)}
                      className="w-full mb-12 py-6 border-4 border-dashed border-[#800000]/20 rounded-[40px] text-[#800000]/60 font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#800000]/5 hover:border-[#800000] hover:text-[#800000] transition-all shadow-sm"
                    >
                      <Plus className="w-6 h-6" /> File a New Report
                    </button>
                  )}

                  <div className="grid grid-cols-1 gap-8">
                    {items.length > 0 ? (
                      items.map(i => <LostFoundCard key={i.id} item={i} onToggleStatus={markResolved} />)
                    ) : (
                      <div className="text-center py-20 bg-white rounded-[40px] border-4 border-dashed border-slate-100">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                          <Search className="w-10 h-10 text-slate-200" />
                        </div>
                        <p className="text-slate-400 font-black uppercase text-sm tracking-[0.2em] leading-loose">
                          No active reports registered<br />
                          <span className="text-[10px] opacity-60">The board is currently clear</span>
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-12 p-10 bg-[#FFF8E1] rounded-[48px] border-4 border-[#FFD700] border-dashed text-center shadow-md">
                    <Info className="w-12 h-12 text-[#800000] mx-auto mb-6" />
                    <h5 className="text-[#800000] text-lg font-black uppercase tracking-tight mb-2">Notice</h5>
                    <p className="text-[#800000]/80 font-bold uppercase text-[11px] tracking-[0.15em] leading-relaxed max-w-lg mx-auto">
                      Found items can be collected from the <br />
                      <span className="text-xl underline decoration-double underline-offset-4">Temple Office</span><br />
                      by giving the correct description of the item.
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'safety' && (
                <motion.div 
                  key="safety"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <SectionHeader 
                    title="Safety Guidelines" 
                    icon={ShieldCheck} 
                    subtitle="Your well-being is our priority. Follow these tips for a smooth celebration."
                  />
                  <div className="bg-[#800000] text-white rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#FFD700]/10 rounded-full -ml-16 -mb-16 blur-2xl" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                      <div>
                        <h4 className="text-2xl font-black uppercase mb-6 tracking-tight text-[#FFD700] font-serif">Quick Safety Tips</h4>
                        <ul className="space-y-6">
                          {[
                            { t: 'Emergency Care', v: 'A dedicated First-Aid post is located near the Temple Entrance.' },
                            { t: 'Lost & Found Center', v: 'Visit the main booth or use this app to report immediately.' },
                            { t: 'Hydration Points', v: 'Free drinking water is served at all Bhojana Shale entries.' },
                            { t: 'Child Safety', v: 'Please keep children nearby and ensure they have your contact info.' }
                          ].map(info => (
                            <li key={info.t} className="border-l-4 border-[#FFD700] pl-6 py-1">
                              <p className="text-[11px] font-black uppercase text-[#FFD700] mb-1 tracking-widest">{info.t}</p>
                              <p className="text-base text-white/80 font-medium leading-relaxed italic">"{info.v}"</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-col justify-between">
                         <div className="bg-white/10 backdrop-blur-md p-8 rounded-[32px] border border-white/20 shadow-xl">
                            <h4 className="text-xl font-black uppercase mb-4 text-[#FFD700] flex items-center gap-3">
                              <Phone className="w-6 h-6" /> Emergency Help
                            </h4>
                            <div className="space-y-4">
                              <div>
                                <p className="text-[9px] font-black uppercase opacity-60 mb-1">Police / Security</p>
                                <p className="text-2xl font-black tracking-widest">100 / 112</p>
                              </div>
                              <div>
                                <p className="text-[9px] font-black uppercase opacity-60 mb-1">Fair Committee Helpline</p>
                                <p className="text-2xl font-black tracking-widest text-[#FFD700]">+91 99887 76655</p>
                              </div>
                            </div>
                         </div>
                         <div className="mt-8 p-6 bg-[#FFD700]/10 rounded-3xl border border-[#FFD700]/20 text-center">
                            <p className="text-xs font-bold text-[#FFD700] uppercase tracking-widest">Stay Safe, Enjoy the Jatre!</p>
                         </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'stories' && (
                <motion.div 
                  key="stories"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <SectionHeader 
                    title="Heritage & Lore" 
                    icon={History} 
                    subtitle="Explore the legends that define this grand celebration."
                  />
                  <div className="bg-white rounded-[40px] p-10 border-4 border-slate-50 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-[#800000]/5 rounded-full -mr-24 -mt-24" />
                    <h4 className="text-3xl font-black text-[#800000] uppercase mb-6 italic font-serif">The Eternal Spirit of Namma Jatre</h4>
                    <p className="text-slate-700 text-lg leading-loose mb-8 font-medium italic first-letter:text-5xl first-letter:font-black first-letter:text-[#800000] first-letter:mr-3 first-letter:float-left">
                      This festival is more than just a fair; it is a sacred thread connecting our ancestors' wisdom with the vibrant energy of the present. For centuries, our village has gathered during the full moon of Vaisakha to celebrate the victory of light over darkness.
                    </p>
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                      <p className="text-slate-600 italic">"The Rathotsava represents the journey of the community, pulled together by the collective faith and strength of thousands."</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Sidebar - Desktop Only Info */}
          <div className="md:col-span-4 gap-8 flex flex-col">
            
            <div className="bg-white rounded-[40px] p-8 shadow-xl border border-slate-100 overflow-hidden relative">
               <div className="absolute top-0 right-0 w-20 h-20 bg-[#800000]/5 -mr-10 -mt-10 rounded-full" />
               <h3 className="text-xl font-black uppercase mb-6 font-serif text-[#800000]">Quick Access</h3>
               <div className="space-y-4">
                  {[
                    { id: 'schedule', label: 'View Full Schedule', icon: Calendar },
                    { id: 'safety', label: 'Safety Information', icon: ShieldCheck },
                    { id: 'stories', label: 'Festival Legends', icon: History }
                  ].map(link => (
                    <button 
                      key={link.id}
                      onClick={() => setActiveTab(link.id as any)}
                      className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-[#FFF8E1] hover:border-[#FFD700] border border-transparent transition-all group"
                    >
                      <div className="flex items-center gap-3">
                         <link.icon className="w-5 h-5 text-[#800000]" />
                         <span className="text-sm font-black uppercase text-slate-700">{link.label}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#800000] group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
               </div>
            </div>

            <div className="bg-[#FFF8E1] border-2 border-[#FFD700] rounded-[40px] p-8 relative overflow-hidden">
               <div className="relative z-10">
                 <h3 className="text-xl font-black uppercase text-[#800000] mb-2 font-serif">Did You Know?</h3>
                 <p className="text-sm text-slate-700 leading-relaxed font-medium">The Namma Jatre Rathotsava wooden chariot is over 150 years old and is meticulously maintained by village artisans every year.</p>
               </div>
            </div>

          </div>

        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-3 py-2.5 bg-slate-900 rounded-full shadow-2xl flex items-center gap-2 border border-white/20 backdrop-blur-2xl bg-opacity-95">
        {[
          { id: 'schedule', icon: Calendar, label: 'Schedule' },
          { id: 'lost', icon: AlertTriangle, label: 'Reports' },
          { id: 'safety', icon: ShieldCheck, label: 'Safety' },
          { id: 'stories', icon: History, label: 'Stories' }
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as any)}
            className={`flex items-center gap-2 px-5 py-3 rounded-full transition-all ${
              activeTab === item.id ? 'bg-[#FFD700] text-[#800000] shadow-lg scale-105' : 'text-white/40 hover:text-white/80'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {activeTab === item.id && <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>}
          </button>
        ))}
      </nav>

    </div>
  );
}
