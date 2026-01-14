
export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="relative flex flex-col items-center">
                {/* Outer Ring */}
                <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>

                {/* Inner Pulse */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-8 h-8 bg-brand-500 rounded-full animate-pulse"></div>
                </div>

                <p className="mt-4 text-brand-700 font-semibold animate-pulse text-sm tracking-widest">MENTALBOOST</p>
            </div>
        </div>
    );
}
