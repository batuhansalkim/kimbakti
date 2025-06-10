interface Stalker {
  username: string;
  probability: number;
  isPremium?: boolean;
}

export const generateStalkReport = (instagramUsername?: string): Stalker[] => {
  // Bu fonksiyon şu an için örnek veri döndürüyor
  // Gerçek uygulamada Instagram API veya başka bir veri kaynağı kullanılacak
  const sampleStalkers: Stalker[] = [
    { username: 'user123', probability: 0.95 },
    { username: 'stalker456', probability: 0.85 },
    { username: 'viewer789', probability: 0.75 },
    { username: 'follower321', probability: 0.65, isPremium: true },
    { username: 'watcher654', probability: 0.55, isPremium: true },
    { username: 'profile987', probability: 0.45, isPremium: true }
  ];

  // Instagram kullanıcı adı varsa, kişiselleştirilmiş sonuçlar üretilebilir
  if (instagramUsername) {
    console.log(`Generating report for Instagram user: ${instagramUsername}`);
  }

  return sampleStalkers;
}; 