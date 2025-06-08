export default function PremiumPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Premium&apos;a Geç
      </h1>

      <p className="text-gray-400 text-center mb-8 max-w-md">
        Gizli Instagram profillerini gör, tam isimlerini öğren ve daha fazla detaya eriş!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {/* 1 Günlük Premium */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 flex flex-col">
          <h3 className="text-xl font-semibold mb-2">1 Günlük Premium</h3>
          <div className="text-3xl font-bold mb-4">4.99 ₺</div>
          <ul className="space-y-2 text-gray-300 flex-grow">
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Gizli Instagram profillerini gör
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Tam isimleri öğren
            </li>
          </ul>
          <button className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Satın Al
          </button>
        </div>

        {/* 3 Günlük Premium */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 flex flex-col relative">
          <div className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-1 rounded-bl-lg text-sm">
            En Popüler
          </div>
          <h3 className="text-xl font-semibold mb-2">3 Günlük Premium</h3>
          <div className="text-3xl font-bold mb-4">9.99 ₺</div>
          <ul className="space-y-2 text-gray-300 flex-grow">
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Tüm gizli Instagram profillerini gör
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Tam isimleri öğren
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              3 gün boyunca sınırsız rapor
            </li>
          </ul>
          <button className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Satın Al
          </button>
        </div>

        {/* Tek Profil */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 flex flex-col">
          <h3 className="text-xl font-semibold mb-2">Tek Profil Aç</h3>
          <div className="text-3xl font-bold mb-4">2.99 ₺</div>
          <ul className="space-y-2 text-gray-300 flex-grow">
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              1 gizli Instagram profilini aç
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Tam ismini öğren
            </li>
          </ul>
          <button className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
            Satın Al
          </button>
        </div>
      </div>

      <p className="mt-8 text-sm text-gray-400 text-center max-w-md">
        Tüm ödemeler güvenli bir şekilde işlenir. 
        İstediğiniz zaman iptal edebilirsiniz.
      </p>
    </div>
  );
} 