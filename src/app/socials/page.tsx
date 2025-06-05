export default function SocialsPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">
        Sosyal Medya Hesaplarınız
      </h1>

      <p className="text-gray-400 text-center mb-8 max-w-md">
        Daha doğru sonuçlar için sosyal medya kullanıcı adlarınızı girin.
        İsterseniz boş bırakabilirsiniz, rapor tamamen rastgele olur.
      </p>

      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2">
          <label htmlFor="instagram" className="block text-sm font-medium text-gray-300">
            Instagram Kullanıcı Adı
          </label>
          <input
            type="text"
            id="instagram"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="@kullaniciadi"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="tiktok" className="block text-sm font-medium text-gray-300">
            TikTok Kullanıcı Adı
          </label>
          <input
            type="text"
            id="tiktok"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="@kullaniciadi"
          />
        </div>

        <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-lg transition-colors">
          Devam Et
        </button>
      </div>
    </div>
  );
} 