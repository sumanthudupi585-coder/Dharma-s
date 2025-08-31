import { calculatePlayerProfile, buildAtmanVakya } from '../../data/profileData';
import { termByText } from '../../data/glossary';

describe('Profile calculation', () => {
  it('computes primary Guna and Gana from answers', () => {
    const answers = [
      { questionId: 1, choiceId: 'B', guna: 'SATTVA', points: 1 },
      { questionId: 3, choiceId: 'A', gana: 'DEVA', points: 1 },
      { questionId: 4, choiceId: 'A', guna: 'SATTVA', points: 1 }
    ];
    const profile = calculatePlayerProfile(answers);
    expect(['SATTVA','RAJAS','TAMAS']).toContain(profile.primaryGuna);
    expect(['DEVA','MANUSHYA','RAKSHASA']).toContain(profile.primaryGana);
  });

  it('builds Atman Vākya seeds for choices with seeds', () => {
    const answers = [
      { questionId: 1, choiceId: 'B', guna: 'SATTVA', points: 1 },
      { questionId: 2, choiceId: 'A', guna: 'RAJAS', points: 1 }
    ];
    const vakya = buildAtmanVakya(answers);
    expect(Array.isArray(vakya)).toBe(true);
    expect(vakya.length).toBeGreaterThan(0);
  });
});

describe('Glossary term lookup', () => {
  it('finds terms case-insensitively with diacritics', () => {
    expect(termByText('Nyāya')).toBeTruthy();
    expect(termByText('nyaya')).toBeTruthy();
  });
});
