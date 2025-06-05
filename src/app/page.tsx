import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
        Seni Kim Stalklıyor?
      </h1>
      
      <p className="text-xl md:text-2xl text-center text-gray-300 mb-8">
        Sosyal medyada seni kim izliyor? Ücretsiz öğren!
      </p>

      <Link 
        href="/login"
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 animate-pulse"
      >
        Stalk Raporumu Al
      </Link>

      <div className="mt-12 text-center space-y-4 text-gray-400">
        <p>✓ Tamamen güvenli ve gizli</p>
        <p>✓ Anında sonuç</p>
        <p>✓ Premium ile daha fazla detay</p>
      </div>
    </div>
  );
}
