export const GLOSSARY = {
  Dharma: {
    id: 'dharma',
    term: 'Dharma',
    brief: 'Cosmic order, duty, and the right way of living.',
    detail: 'A core concept denoting the moral and natural law that sustains the universe and guides righteous conduct.'
  },
  Maya: {
    id: 'maya',
    term: 'Maya',
    brief: 'Illusion; the power that makes the unreal appear real.',
    detail: 'Refers to the veiling and projecting power that causes the world to be perceived as distinct from the underlying reality.'
  },
  Nyaya: {
    id: 'nyaya',
    term: 'Nyāya',
    brief: 'An orthodox school focused on logic and epistemology.',
    detail: 'Nyāya develops a robust system of inference, debate, and means of valid knowledge (pramāṇas).'
  },
  Pratyaksha: {
    id: 'pratyaksha',
    term: 'Pratyakṣa',
    brief: 'Perception as a means of knowledge.',
    detail: 'Direct sensory cognition considered a primary pramāṇa in Nyāya.'
  },
  Anumana: {
    id: 'anumana',
    term: 'Anumāṇa',
    brief: 'Inference as a means of knowledge.',
    detail: 'Knowledge derived through reasoning from known relations; e.g., seeing smoke and inferring fire.'
  },
  Upamana: {
    id: 'upamana',
    term: 'Upamāna',
    brief: 'Comparison or analogy as knowledge.',
    detail: 'Knowledge gained by recognizing similarities between a known and an unknown object.'
  },
  Sabda: {
    id: 'sabda',
    term: 'Śabda',
    brief: 'Authoritative testimony as knowledge.',
    detail: 'Trustworthy verbal testimony, especially of reliable sources and scriptures, as a valid pramāṇa.'
  },
  Dravyas: {
    id: 'dravyas',
    term: 'Nine Dravyas',
    brief: 'The nine substances in Vaiśeṣika.',
    detail: 'Pṛthvī (Earth), Ap (Water), Tejas (Fire), Vāyu (Air), Ākāśa (Ether), Kāla (Time), Dik (Direction), Ātman (Soul), Manas (Mind).'
  },
  Prthvi: { id: 'prthvi', term: 'Pṛthvī', brief: 'Earth', detail: 'Substance embodying solidity, smell, and form.' },
  Ap: { id: 'ap', term: 'Ap', brief: 'Water', detail: 'Fluid substance associated with taste and cohesion.' },
  Tejas: { id: 'tejas', term: 'Tejas', brief: 'Fire', detail: 'Substance of heat and light; transformation.' },
  Vayu: { id: 'vayu', term: 'Vāyu', brief: 'Air', detail: 'Substance of motion and touch; vital flows.' },
  Akasha: { id: 'akasha', term: 'Ākāśa', brief: 'Ether', detail: 'All-pervasive substratum enabling sound and spatial accommodation.' },
  Kala: { id: 'kala', term: 'Kāla', brief: 'Time', detail: 'The dimension ordering change and sequence.' },
  Dik: { id: 'dik', term: 'Dik', brief: 'Direction', detail: 'Spatial orientation and relational location.' },
  Atman: { id: 'atman', term: 'Ātman', brief: 'Self/Soul', detail: 'The enduring conscious subject, distinct from body and mind.' },
  Manas: { id: 'manas', term: 'Manas', brief: 'Mind', detail: 'Internal organ coordinating senses and intention.' }
};

export function termByText(text) {
  const key = (text || '').trim().toLowerCase();
  const map = Object.values(GLOSSARY).reduce((acc, g) => { acc[g.term.toLowerCase()] = g; return acc; }, {});
  return map[key] || null;
}
