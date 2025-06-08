export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Gizlilik Politikası</h1>
        
        <div className="prose prose-invert">
          <p className="text-gray-300 mb-6">
            Bu gizlilik politikası, &quot;Seni Kim Stalklıyor?&quot; uygulamasının kullanıcı verilerini nasıl topladığını ve kullandığını açıklar.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">Toplanan Bilgiler</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Google hesap bilgileri (giriş yapanlar için)</li>
            <li>Sosyal medya kullanıcı adları (isteğe bağlı)</li>
            <li>Uygulama kullanım istatistikleri</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">Veri Kullanımı</h2>
          <ul className="list-disc pl-6 space-y-2 text-gray-300">
            <li>Kullanıcı deneyimini kişiselleştirmek</li>
            <li>Hizmet kalitesini artırmak</li>
            <li>Güvenliği sağlamak</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">Veri Güvenliği</h2>
          <p className="text-gray-300 mb-6">
            Verileriniz Firebase altyapısında güvenli bir şekilde saklanmaktadır. 
            Üçüncü taraflarla paylaşılmaz.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">İletişim</h2>
          <p className="text-gray-300">
            Sorularınız için: support@senikimstalkliyor.com
          </p>
        </div>
      </div>
    </div>
  );
} 