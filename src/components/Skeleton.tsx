// src/components/Skeleton.tsx
// Main Page
export function GallerySkeleton() {
  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center gap-12 px-10 animate-pulse overflow-hidden">
      <div className="w-[400px] h-[460px] flex-shrink-0 bg-white/10 rounded-2xl backdrop-blur-sm -rotate-10 translate-y-12 shadow-xl opacity-70"></div>
      <div className="w-[420px] h-[480px] flex-shrink-0 bg-white/10 rounded-2xl backdrop-blur-sm -rotate-6 translate-y-4 shadow-xl opacity-80"></div>
      <div className="w-[420px] h-[480px] flex-shrink-0 bg-white/20 rounded-2xl backdrop-blur-md z-30 -translate-y-2 shadow-2xl scale-105"></div>
      <div className="w-[420px] h-[480px] flex-shrink-0 bg-white/10 rounded-2xl backdrop-blur-sm rotate-6 translate-y-4 shadow-xl opacity-80"></div>
      <div className="w-[400px] h-[460px] flex-shrink-0 bg-white/10 rounded-2xl backdrop-blur-sm rotate-10 translate-y-12 shadow-xl opacity-70"></div>     
    </div>
  );
}

// Contact Page
export function PageSkeleton() {
  return (
    <div className="pt-36 pb-12 px-8 max-w-2xl mx-auto min-h-full flex flex-col justify-start animate-pulse">
      <div className="h-14 bg-white/20 rounded-lg w-2/5 mb-8"></div>      
      <div className="flex flex-col gap-4 mb-10">
        <div className="h-5 bg-white/10 rounded w-full"></div>
        <div className="h-5 bg-white/10 rounded w-11/12"></div>
        <div className="h-5 bg-white/10 rounded w-4/5"></div>
        <div className="h-5 bg-white/10 rounded w-full"></div>
        <div className="h-5 bg-white/10 rounded w-3/4"></div>
      </div>

      {/* Sosyal medya/link ikonları iskeleti */}
      <div className="flex gap-6 mt-4">
        <div className="w-10 h-10 bg-white/20 rounded-full"></div>
        <div className="w-10 h-10 bg-white/20 rounded-full"></div>
        <div className="w-10 h-10 bg-white/20 rounded-full"></div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// 1. PROJECTS SKELETON
// --------------------------------------------------------------------------
export function ProjectsSkeleton() {
  return (
    <div className="pt-32 pb-12 px-4 max-w-6xl mx-auto min-h-[80vh] flex flex-col md:flex-row gap-6 animate-pulse">
      
      {/* SOL TARA (Liste) */}
      <div className="w-full md:w-1/3 flex flex-col gap-2">
        {/* Başlık Çizgisi */}
        <div className="h-8 w-32 bg-gray-800 rounded mb-4 border-l-4 border-gray-700" />
        
        {/* Liste Elemanları (3 tane) */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-900 border border-gray-800 rounded-lg p-5 flex flex-col justify-center gap-3">
            <div className="flex justify-between items-center">
              <div className="h-5 w-1/2 bg-gray-800 rounded" /> {/* Proje Adı */}
              <div className="h-4 w-4 bg-gray-800 rounded-full" /> {/* Ok */}
            </div>
            <div className="h-3 w-1/3 bg-gray-800 rounded" /> {/* Kategori */}
          </div>
        ))}
      </div>

      {/* SAĞ TARAF (Detay Kartı) */}
      <div className="w-full md:w-2/3">
        <div className="h-full bg-gray-800 border border-gray-700 rounded-xl p-8 shadow-xl flex flex-col">
          
          {/* Header (Başlık + Status) */}
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-3 w-3/4">
              <div className="h-10 w-2/3 bg-gray-700 rounded" /> {/* Büyük Başlık */}
              <div className="h-6 w-32 bg-gray-900 rounded" /> {/* Kategori Badge */}
            </div>
            <div className="h-8 w-24 bg-gray-700 rounded-lg" /> {/* Status Badge */}
          </div>

          <hr className="border-gray-700 mb-6" />

          {/* Açıklama Satırları */}
          <div className="space-y-4 mb-8">
            <div className="h-4 bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-700 rounded w-11/12" />
            <div className="h-4 bg-gray-700 rounded w-4/5" />
          </div>

          {/* Teknoloji Stack (Alt kısım) */}
          <div className="mt-auto pt-12">
            <div className="h-4 w-40 bg-gray-700 rounded mb-4" /> {/* "Teknolojiler" Başlığı */}
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-8 w-20 bg-gray-900 border border-gray-700 rounded-md" />
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// --------------------------------------------------------------------------
// 2. BLOG SKELETON
// --------------------------------------------------------------------------
export function BlogSkeleton() {
  return (
    <div className="pt-36 pb-12 px-8 max-w-7xl mx-auto text-white min-h-full flex flex-col justify-start animate-pulse">
      
      {/* Header Kısmı */}
      <header className="mb-12 flex flex-col items-center text-center gap-4">
        <div className="h-12 w-96 bg-gray-800 rounded-lg" /> {/* Cinephile Başlığı */}
        <div className="h-6 w-2/3 max-w-lg bg-gray-800 rounded" /> {/* Alt açıklama */}
      </header>

      {/* Ana Konteyner */}
      <div className="flex flex-row gap-6 h-[650px] w-full justify-center">
        
        {/* Sol Panel (Başlangıçta geniş olan Dosya Ağacı) */}
        <div className="w-full max-w-3xl border border-gray-700 rounded-xl bg-gray-900 overflow-hidden flex flex-col shadow-2xl">
          
          {/* Traffic Lights Bar */}
          <div className="w-full h-8 bg-gray-800 border-b border-gray-700 flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-600" />
            <div className="w-3 h-3 rounded-full bg-gray-600" />
            <div className="w-3 h-3 rounded-full bg-gray-600" />
            <div className="ml-4 h-3 w-32 bg-gray-700 rounded" /> {/* ~/archives/root */}
          </div>

          {/* Klasör Yapısı */}
          <div className="p-6 space-y-6">
            {/* Klasör Grubu 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 pl-2">
                <div className="w-6 h-6 bg-gray-700 rounded" /> {/* İkon */}
                <div className="h-5 w-32 bg-gray-700 rounded" /> {/* Klasör Adı */}
              </div>
              {/* İçindeki Dosyalar */}
              <div className="pl-10 space-y-3 border-l border-gray-700 ml-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-800 rounded" />
                  <div className="h-4 w-48 bg-gray-800 rounded" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-800 rounded" />
                  <div className="h-4 w-56 bg-gray-800 rounded" />
                </div>
              </div>
            </div>

            {/* Klasör Grubu 2 */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 pl-2">
                <div className="w-6 h-6 bg-gray-700 rounded" />
                <div className="h-5 w-24 bg-gray-700 rounded" />
              </div>
            </div>

             {/* Klasör Grubu 3 */}
             <div className="space-y-3">
              <div className="flex items-center gap-3 pl-2">
                <div className="w-6 h-6 bg-gray-700 rounded" />
                <div className="h-5 w-28 bg-gray-700 rounded" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}