import { Metadata } from 'next';
import Link from 'next/link';

async function getData(username: string) {
  // Simüle edilmiş veri yükleme
  await new Promise(resolve => setTimeout(resolve, 100));
  return { username };
}

export async function generateMetadata({ 
  params 
}: { 
  params: { username: string } 
}): Promise<Metadata> {
  return {
    title: `${decodeURIComponent(params.username)} - Kim Baktı?`,
    description: `${decodeURIComponent(params.username)} az önce stalk raporunu aldı. Sen de kimler tarafından stalklandığını merak ediyor musun?`,
  };
}

export default async function Page({ 
  params 
}: { 
  params: { username: string } 
}) {
  const data = await getData(params.username);

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen">
      <div className="w-full max-w-md text-center space-y-8">
        <div className="space-y-4">
          <div className="w-24 h-24 mx-auto rounded-full bg-gray-700" />
          <h1 className="text-2xl md:text-3xl font-bold">
            {decodeURIComponent(data.username)} az önce stalk raporunu aldı
          </h1>
          <p className="text-xl text-gray-400">
            Sen de kimler tarafından stalklandığını merak ediyor musun?
          </p>
        </div>

        <div className="space-y-4">
          <Link 
            href="/login"
            className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-full text-xl transition-all duration-300 animate-pulse"
          >
            Raporumu Al
          </Link>

          <p className="text-sm text-gray-500">
            100.000+ kişi raporunu aldı
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">2.5M+</div>
            <div className="text-gray-400 text-sm">Toplam Kullanıcı</div>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4">
            <div className="text-2xl font-bold">4.8/5</div>
            <div className="text-gray-400 text-sm">Kullanıcı Puanı</div>
          </div>
        </div>
      </div>
    </div>
  );
}
