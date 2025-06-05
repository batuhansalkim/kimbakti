type Stalker = {
  id: string;
  name: string;
  location: string;
  source: 'Instagram' | 'TikTok';
  time: string;
  isPremium?: boolean;
  isTopStalker?: boolean;
};

const names = [
  'Ayşe', 'Fatma', 'Zeynep', 'Elif', 'Merve',
  'Ahmet', 'Mehmet', 'Ali', 'Can', 'Burak'
];

const surnames = [
  'K.', 'M.', 'Y.', 'S.', 'T.',
  'A.', 'B.', 'C.', 'D.', 'E.'
];

const locations = [
  'Kadıköy/İstanbul', 'Beşiktaş/İstanbul', 'Şişli/İstanbul',
  'Çankaya/Ankara', 'Konak/İzmir', 'Nilüfer/Bursa'
];

const actions = [
  'profiline baktı',
  'hikayeni izledi',
  'gönderini beğendi',
  'profilini ziyaret etti',
  'fotoğrafını kaydetti'
];

const generateRandomTime = () => {
  const now = new Date();
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  now.setHours(hours);
  now.setMinutes(minutes);
  return now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
};

const generateSimilarName = (username: string): string => {
  if (!username) return `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
  
  // Kullanıcı adından isim türetme
  const cleanUsername = username.replace('@', '').toLowerCase();
  const randomNames = names.filter(name => 
    name.toLowerCase().includes(cleanUsername.slice(0, 2)) ||
    cleanUsername.includes(name.toLowerCase().slice(0, 2))
  );

  if (randomNames.length > 0) {
    return `${randomNames[Math.floor(Math.random() * randomNames.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
  }

  return `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
};

export const generateStalkerNotification = (): string => {
  const name = `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`;
  const action = actions[Math.floor(Math.random() * actions.length)];
  const timeAgo = Math.floor(Math.random() * 5) + 1;

  return `${name} az önce ${action}`;
};

export const generateStalkReport = (instagram?: string, tiktok?: string): Stalker[] => {
  const stalkers: Stalker[] = [];
  const totalStalkers = 4; // Toplam stalker sayısı
  const premiumCount = 2; // Premium ile görülebilecek stalker sayısı

  for (let i = 0; i < totalStalkers; i++) {
    const isPremium = i >= (totalStalkers - premiumCount);
    const source = Math.random() > 0.5 ? 'Instagram' as const : 'TikTok' as const;
    const username = source === 'Instagram' ? instagram : tiktok;

    const stalker: Stalker = {
      id: `stalker-${i}`,
      name: isPremium ? 'Gizli Profil' : generateSimilarName(username || ''),
      location: isPremium ? '???' : locations[Math.floor(Math.random() * locations.length)],
      source,
      time: generateRandomTime(),
      isPremium,
      isTopStalker: i === 0
    };

    stalkers.push(stalker);
  }

  return stalkers;
}; 