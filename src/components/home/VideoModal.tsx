import { Link } from 'react-router-dom';
import { X, Play } from 'lucide-react';
import videoStoryThumb from '../../assets/videoStoryThumb.webp';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VideoModal({ isOpen, onClose }: VideoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 rounded-3xl max-w-2xl w-full p-6 text-white border border-white/20 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold mb-4">Driver Partner Success Story</h3>
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-white/10">
          <img
            src={videoStoryThumb}
            alt="Video poster"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#FF5B26] flex items-center justify-center shadow-lg text-white animate-pulse">
              <Play className="w-7 h-7 fill-current ml-1" />
            </div>
            <p className="text-xs font-semibold text-slate-200">
              "How I earn ₹80,000+ monthly with Carline Driver App"
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xs text-slate-400">Duration: 3 mins 45 secs • HD 1080p</p>
          <Link
            to="/signup"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#FF5B26] text-white rounded-xl text-xs font-bold hover:opacity-95 transition"
          >
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  );
}
