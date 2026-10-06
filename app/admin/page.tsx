import Link from 'next/link';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export default function AdminNoticePage() {
  return (
    <div className="min-h-[70vh] bg-cream flex items-center justify-center p-6">
      <div className="bg-white border-3 border-black rounded-lg p-8 max-w-md w-full shadow-neo text-center flex flex-col items-center gap-4">
        <div className="w-14 h-14 bg-black text-neo-yellow border-2 border-black rounded-lg flex items-center justify-center shadow-neo-sm">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black uppercase text-black">ADMIN STANDALONE APP</h2>
        <p className="text-xs font-bold text-gray-700 leading-relaxed">
          The Admin Portal has been separated into its own standalone application.
          Run the admin app in the <span className="font-mono bg-cream px-1.5 py-0.5 border border-black rounded font-black">admin/</span> folder on port 3002.
        </p>
        <a
          href="http://localhost:3002"
          className="mt-2 flex items-center gap-2 px-5 py-3 bg-neo-yellow text-black border-2 border-black rounded-lg font-black text-xs uppercase shadow-neo hover:scale-105 transition-all"
        >
          <span>OPEN ADMIN PORTAL (PORT 3002)</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
