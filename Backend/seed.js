const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const fakeUsers = [
  {
    spotifyId: 'mock-user-1',
    displayName: 'Alex',
    email: 'alex@example.com',
    avatarUrl: 'https://i.pravatar.cc/300?img=1',
    spotifyTier: 'premium',
    accessToken: 'mock-token',
    refreshToken: 'mock-token',
    topArtists: [
      { id: '7Ln80lUS6He07XvHI8qqHH', name: 'Arctic Monkeys', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb7da39dea0a72f581535fb11f', genres: ['garage rock', 'modern rock', 'permanent wave', 'rock', 'sheffield indie'] },
      { id: '1Xyo4u8uXC1ZmMpzMB11gQ', name: 'The Weeknd', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb', genres: ['canadian contemporary r&b', 'canadian pop', 'pop'] },
      { id: '3TVXtAsR1Inumwj472S9r4', name: 'Drake', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9', genres: ['canadian hip hop', 'canadian pop', 'hip hop', 'pop rap', 'rap'] }
    ]
  },
  {
    spotifyId: 'mock-user-2',
    displayName: 'Jordan',
    email: 'jordan@example.com',
    avatarUrl: 'https://i.pravatar.cc/300?img=2',
    spotifyTier: 'premium',
    accessToken: 'mock-token',
    refreshToken: 'mock-token',
    topArtists: [
      { id: '06HL4z0CvFAxyc27GXpf02', name: 'Taylor Swift', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0', genres: ['pop'] },
      { id: '1Xyo4u8uXC1ZmMpzMB11gQ', name: 'The Weeknd', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb214f3cf1cbe7139c1e26ffbb', genres: ['canadian contemporary r&b', 'canadian pop', 'pop'] },
      { id: '6eUKZXaKkcviH0Ku9w2n3V', name: 'Ed Sheeran', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb12a2ef08d00dd7451a6dbed6', genres: ['pop', 'uk pop'] },
      { id: '4q3ewBCX7sLwd24euuV69X', name: 'Bad Bunny', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb9e3ceaeb6cb242d420710608', genres: ['reggaeton', 'reggaeton flow', 'trap latino'] }
    ]
  },
  {
    spotifyId: 'mock-user-3',
    displayName: 'Taylor',
    email: 'taylor@example.com',
    avatarUrl: 'https://i.pravatar.cc/300?img=3',
    spotifyTier: 'premium',
    accessToken: 'mock-token',
    refreshToken: 'mock-token',
    topArtists: [
      { id: '2YZyLoL8N0Wb9xBt1NhZWg', name: 'Kendrick Lamar', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb437b9e2a82505b3d93ff1022', genres: ['conscious hip hop', 'hip hop', 'rap', 'west coast rap'] },
      { id: '3TVXtAsR1Inumwj472S9r4', name: 'Drake', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb4293385d324db8558179afd9', genres: ['canadian hip hop', 'canadian pop', 'hip hop', 'pop rap', 'rap'] },
      { id: '246dkjvS1zLTtiykXe5h60', name: 'Post Malone', imageUrl: 'https://i.scdn.co/image/ab6761610000e5ebbb4e71cc3273e01bcabfd0ac', genres: ['dfw rap', 'melodic rap', 'pop', 'rap'] }
    ]
  },
  {
    spotifyId: 'mock-user-4',
    displayName: 'Sam',
    email: 'sam@example.com',
    avatarUrl: 'https://i.pravatar.cc/300?img=4',
    spotifyTier: 'premium',
    accessToken: 'mock-token',
    refreshToken: 'mock-token',
    topArtists: [
      { id: '6M2wZ9GZgrQXHCFfjv46we', name: 'Dua Lipa', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb604d5fed987f2ff04ccacb2d', genres: ['dance pop', 'pop', 'uk pop'] },
      { id: '06HL4z0CvFAxyc27GXpf02', name: 'Taylor Swift', imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb5a00969a4698c3132a15fbb0', genres: ['pop'] },
      { id: '6qqNVTkY8uBg9cP3Jd7DAH', name: 'Billie Eilish', imageUrl: 'https://i.scdn.co/image/ab6761610000e5ebd8b9980db6727244d2bf7656', genres: ['art pop', 'electropop', 'pop'] }
    ]
  }
];

async function main() {
  console.log('Seeding sandbox users...');
  
  for (const user of fakeUsers) {
    await prisma.user.upsert({
      where: { spotifyId: user.spotifyId },
      update: user,
      create: user,
    });
    console.log(`Seeded user: ${user.displayName}`);
  }
  
  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
