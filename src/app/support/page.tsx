export default function SupportPage() {
  return (
    <div className="container mx-auto px-4 py-16 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Destek</h1>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Sık Sorulan Sorular</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-purple-400 mb-2">
                  Rapor gerçek mi?
                </h3>
                <p className="text-gray-300">
                  Hayır, raporlar tamamen eğlence amaçlı üretilmiş simülasyonlardır.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-purple-400 mb-2">
                  Premium üyelik nasıl çalışır?
                </h3>
                <p className="text-gray-300">
                  Premium üyelik satın aldığınızda gizli profillerin tam bilgilerini görebilirsiniz.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-purple-400 mb-2">
                  Verilerim güvende mi?
                </h3>
                <p className="text-gray-300">
                  Evet, tüm verileriniz şifrelenmiş bir şekilde saklanır ve üçüncü taraflarla paylaşılmaz.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">İletişim</h2>
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6">
              <p className="text-gray-300 mb-4">
                Sorularınız veya geri bildirimleriniz için bize ulaşın:
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-300">support@senikimstalkliyor.com</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-gray-300">@senikimstalkliyor</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
} 