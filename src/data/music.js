// Trilhas chiptune originais. Duração em semicolcheias (16 = um compasso 4/4).
const rep = (s, n) => Array(n).fill(s).join(' ');

const arp = {
  Am: 'A3 C4 E4 C4 A3 C4 E4 C4',
  F: 'F3 A3 C4 A3 F3 A3 C4 A3',
  Dm: 'D3 F3 A3 F3 D3 F3 A3 F3',
  E: 'E3 G#3 B3 G#3 E3 G#3 B3 G#3',
};

export const SONGS = {
  title: {
    bpm: 66,
    tracks: [
      {
        inst: 'bell', vol: 0.32,
        notes: `E5:4 A4:4 C5:4 B4:4  A4:6 G4:2 F4:4 E4:4  D4:4 F4:4 A4:4 D5:4  C5:4 B4:4 G#4:8
                E5:4 A5:4 G5:4 E5:4  F5:6 E5:2 D5:4 C5:4  B4:4 D5:4 C5:4 B4:4  A4:12 r:4`,
      },
      { inst: 'sq12', vol: 0.06, len: 2, notes: [arp.Am, arp.F, arp.Dm, arp.E, arp.Am, arp.F, arp.E, arp.Am].join(' ') },
      { inst: 'tri', vol: 0.22, notes: 'A2:16 F2:16 D2:16 E2:16 A2:16 F2:16 E2:16 A2:16' },
    ],
  },

  town: {
    bpm: 112,
    tracks: [
      {
        inst: 'sq25', vol: 0.12, vib: true,
        notes: `D5:6 B4:2 G4:4  E5:4 D5:4 C5:4  A4:6 B4:2 C5:4  B4:8 G4:4
                D5:6 E5:2 D5:4  G5:4 E5:4 C5:4  F#5:4 E5:4 D5:4  G5:12`,
      },
      {
        inst: 'tri', vol: 0.2,
        notes: `G2:4 D3:4 D3:4  C3:4 G3:4 G3:4  D3:4 A3:4 A3:4  G2:4 D3:4 D3:4
                G2:4 D3:4 D3:4  C3:4 G3:4 G3:4  D3:4 A3:4 A3:4  G2:12`,
      },
      {
        inst: 'sq12', vol: 0.05,
        notes: `r:4 B3:4 D4:4  r:4 E4:4 G4:4  r:4 F#4:4 A4:4  r:4 B3:4 D4:4
                r:4 B3:4 D4:4  r:4 E4:4 G4:4  r:4 F#4:4 A4:4  r:4 B3:4 G3:4`,
      },
    ],
  },

  chapel: {
    bpm: 60,
    tracks: [
      { inst: 'pad', vol: 0.07, notes: 'A3:16 F3:16 G3:16 E3:16' },
      { inst: 'pad', vol: 0.06, notes: 'C4:16 A3:16 B3:16 G#3:16' },
      { inst: 'pad', vol: 0.05, notes: 'E4:16 C4:16 D4:16 B3:16' },
      { inst: 'bell', vol: 0.12, notes: 'r:8 E5:8 r:8 C5:8 r:8 D5:8 r:8 B4:8' },
    ],
  },

  forest: {
    bpm: 80,
    tracks: [
      {
        inst: 'tri', vol: 0.2, len: 4,
        notes: rep('D2 A2 D3 A2 Bb1 F2 Bb2 F2 G1 D2 G2 D2 A1 E2 A2 C#3', 2),
      },
      {
        inst: 'sq50', vol: 0.08, vib: true,
        notes: `D4:8 E4:4 F4:4  D4:12 r:4  G4:8 F4:4 E4:4  C#4:12 r:4
                A4:8 G4:4 F4:4  F4:4 E4:4 D4:8  Bb4:6 A4:2 G4:4 F4:4  E4:8 C#4:4 A3:4`,
      },
      { inst: 'bell', vol: 0.1, notes: 'r:12 A5:4 r:16 r:8 F5:2 r:6 r:16 r:12 E5:4 r:16 r:16 r:8 D5:8' },
    ],
  },

  deadforest: {
    bpm: 72,
    tracks: [
      { inst: 'tri', vol: 0.22, notes: 'E2:8 F2:8 E2:8 C2:8 E2:8 F2:8 B1:16 E2:8 F2:8 E2:8 C2:8 A1:8 B1:8 E2:16' },
      {
        inst: 'sq12', vol: 0.09, vib: true,
        notes: `B4:6 C5:2 B4:8  G4:6 A4:2 B4:8  E5:4 D5:4 C5:4 B4:4  A#4:16
                B4:6 C5:2 E5:8  F5:6 E5:2 C5:8  B4:4 A4:4 G4:4 F#4:4  E4:16`,
      },
      { inst: 'noise', vol: 0.12, notes: rep('h:4 r:12', 8) },
    ],
  },

  dungeon: {
    bpm: 60,
    tracks: [
      { inst: 'tri', vol: 0.22, notes: 'A1:32 Bb1:32 A1:32 G#1:32' },
      { inst: 'noise', vol: 0.22, notes: rep('k:2 r:2 k:2 r:10', 8) },
      { inst: 'bell', vol: 0.09, notes: 'r:8 E5:2 r:6 r:16 r:4 F5:2 r:10 r:16 r:8 D#5:2 r:6 r:12 E5:2 r:2 r:16 r:4 A4:8 r:4' },
      { inst: 'sq12', vol: 0.04, notes: 'E3:16 F3:16 E3:16 D#3:16 E3:16 F3:16 E3:16 D#3:16' },
    ],
  },

  battle: {
    bpm: 152,
    tracks: [
      {
        inst: 'tri', vol: 0.24, len: 2,
        notes: [
          'A2 A2 A3 A2 G2 A2 C3 A2', 'A2 A2 A3 A2 G2 A2 C3 A2', 'F2 F2 F3 F2 E2 F2 A2 F2', 'E2 E2 E3 E2 D2 E2 G#2 E2',
          'A2 A2 A3 A2 G2 A2 C3 A2', 'D2 D2 D3 D2 C2 D2 F2 D2', 'F2 F2 F3 F2 E2 F2 A2 F2', 'E2 E2 E3 E2 D2 E2 G#2 E2',
        ].join(' '),
      },
      {
        inst: 'sq25', vol: 0.12,
        notes: `A4:2 C5:2 E5:4 D5:2 C5:2 B4:4  C5:2 B4:2 A4:4 G#4:4 E4:4  F4:2 A4:2 C5:4 B4:2 A4:2 G4:4  E4:4 G#4:4 B4:4 E5:4
                A5:4 G5:2 F5:2 E5:4 C5:4  D5:4 C5:2 B4:2 C5:4 A4:4  F5:4 E5:2 D5:2 C5:4 A4:4  B4:4 G#4:4 E4:8`,
      },
      { inst: 'sq12', vol: 0.05, len: 2, notes: [arp.Am, arp.Am, arp.F, arp.E, arp.Am, arp.Dm, arp.F, arp.E].join(' ') },
      { inst: 'noise', vol: 0.2, notes: rep('k:2 h:2 s:2 h:2 k:2 k:2 s:2 h:2', 8) },
    ],
  },

  boss: {
    bpm: 170,
    tracks: [
      {
        inst: 'tri', vol: 0.25, len: 2,
        notes: [
          'E2 E2 E3 E2 F2 E2 G2 E2', 'E2 E2 E3 E2 F2 E2 G2 E2', 'F2 F2 F3 F2 Gb2 F2 Ab2 F2', 'E2 E2 E3 E2 F2 E2 G2 E2',
          'E2 E2 E3 E2 F2 E2 G2 E2', 'E2 E2 E3 E2 F2 E2 G2 E2', 'D2 D2 D3 D2 Eb2 D2 F2 D2', 'B1 B1 B2 B1 C2 B1 D2 B1',
        ].join(' '),
      },
      {
        inst: 'sq50', vol: 0.1,
        notes: `E5:2 F5:2 E5:2 B4:2 C5:4 B4:4  E5:2 F5:2 G5:2 F5:2 E5:8  F5:2 Gb5:2 F5:2 C5:2 Db5:4 C5:4  B4:4 C5:4 D5:4 F5:4
                E5:4 B5:4 A5:2 G5:2 F5:4  G5:4 F5:2 E5:2 F5:4 C5:4  D5:4 F5:4 Eb5:4 D5:4  B4:6 C5:2 D5:4 D#5:4`,
      },
      {
        inst: 'sq12', vol: 0.05, len: 2,
        notes: [rep('E4 B3', 4), rep('E4 B3', 4), rep('F4 C4', 4), rep('E4 B3', 4), rep('E4 B3', 4), rep('E4 B3', 4), rep('D4 A3', 4), rep('B3 F#3', 4)].join(' '),
      },
      { inst: 'noise', vol: 0.22, notes: rep('k:2 s:2 k:2 s:2 k:2 s:2 k:1 k:1 s:2', 8) },
    ],
  },

  victory: {
    bpm: 132,
    loop: false,
    tracks: [
      { inst: 'sq25', vol: 0.14, notes: 'A4:2 C5:2 E5:2 A5:6 G5:2 E5:2 F5:2 G5:6 E5:2 C5:2 D5:2 E5:12' },
      { inst: 'tri', vol: 0.22, notes: 'A2:6 A2:6 F2:4 G2:8 C3:4 G2:2 C3:12' },
      { inst: 'sq12', vol: 0.06, notes: 'E4:12 C4:4 D4:8 C4:6 G4:12' },
    ],
  },

  gameover: {
    bpm: 56,
    loop: false,
    tracks: [
      { inst: 'sq50', vol: 0.1, vib: true, notes: 'A4:8 G4:8 F4:8 E4:8 D4:8 C#4:8 D4:16' },
      { inst: 'tri', vol: 0.22, notes: 'D3:16 Bb2:16 G2:16 D2:16' },
    ],
  },
};

SONGS.ending = { ...SONGS.title, bpm: 58 };
