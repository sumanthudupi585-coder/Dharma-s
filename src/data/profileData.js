// Tattva Survey Questions from Part 1.pdf
export const SURVEY_QUESTIONS = [
  {
    id: 1,
    title: "The Two Paths",
    description: "You discover a hidden chamber. One path is crumbling but direct. The other is longer, safer, and winds through a library of forgotten lore. Which do you choose?",
    illustration: "ancient_chamber",
    choices: [
      { id: 'A', text: "The direct, dangerous path.", guna: 'RAJAS', points: 1, seed: 'शूरमार्गः', transliteration: 'Śūra Mārgaḥ', annotation: "The Hero's Path." },
      { id: 'B', text: "The longer, wiser path.", guna: 'SATTVA', points: 1, seed: 'ज्ञानमार्गः', transliteration: 'Jñāna Mārgaḥ', annotation: 'The Path of Knowledge.' }
    ]
  },
  {
    id: 2,
    title: "The Inert Stone",
    description: "An ancient mechanism is blocked by a massive, inert stone. How do you proceed?",
    illustration: "blocked_mechanism",
    choices: [
      { id: 'A', text: "Attempt to move it by sheer, exhaustive effort.", guna: 'RAJAS', points: 1, seed: 'प्रयत्नबलम्', transliteration: 'Prayatna Balam', annotation: 'The Strength of Effort.' },
      { id: 'B', text: "Search for a complex system of counterweights and levers.", guna: 'SATTVA', points: 1, seed: 'युक्तिकौशलम्', transliteration: 'Yukti Kauśalam', annotation: 'The Skill of Ingenuity.' },
      { id: 'C', text: "Accept it as insurmountable and seek another way forward.", guna: 'TAMAS', points: 1, seed: 'अन्यउपायः', transliteration: 'Anya Upāyaḥ', annotation: 'Another Way.' }
    ]
  },
  {
    id: 3,
    title: "The Guardian Spirit",
    description: "A guardian spirit bars your way, radiating hostility but also pain. How do you proceed?",
    illustration: "guardian_spirit",
    choices: [
      { id: 'A', text: "Offer a calming ritual to soothe its suffering.", gana: 'DEVA', points: 1, seed: 'शान्तिक्रिया', transliteration: 'Śānti Kriyā', annotation: 'An Act of Peace.' },
      { id: 'B', text: "Attempt to reason with it to negotiate passage.", gana: 'MANUSHYA', points: 1, seed: 'तर्कसंवादः', transliteration: 'Tarka Saṃvādaḥ', annotation: 'A Discerning Dialogue.' },
      { id: 'C', text: "Use its aggression against it to create a diversion.", gana: 'RAKSHASA', points: 1, seed: 'छलनीतिः', transliteration: 'Chala Nītiḥ', annotation: 'A Cunning Strategy.' }
    ]
  },
  {
    id: 4,
    title: "The Stolen Manuscript",
    description: "You learn a rival scholar stole a crucial manuscript from a monastery. Do you...",
    illustration: "stolen_manuscript",
    choices: [
      { id: 'A', text: "Inform the monastery's abbot and trust in their process.", guna: 'SATTVA', points: 1, seed: 'धर्मरक्षणम्', transliteration: 'Dharma Rakṣaṇam', annotation: 'The Protection of Duty.' },
      { id: 'B', text: "Confront the scholar directly and demand its return.", guna: 'RAJAS', points: 1, seed: 'प्रत्यक्षप्रतिवादः', transliteration: 'Pratyakṣa Prativādaḥ', annotation: 'A Direct Confrontation.' },
      { id: 'C', text: "Find a way to steal the manuscript back without confrontation.", guna: 'TAMAS', points: 1, seed: 'गुप्तप्रतिकारः', transliteration: 'Gupta Pratikāraḥ', annotation: 'A Secret Remedy.' }
    ]
  },
  {
    id: 5,
    title: "The River's Toll",
    description: "A ferryman demands an exorbitant fee to cross a river, a fee the poor cannot pay. Do you...",
    illustration: "river_crossing",
    choices: [
      { id: 'A', text: "Pay the fee for yourself and for the next family in line.", gana: 'DEVA', points: 1, seed: 'करुणादानम्', transliteration: 'Karuṇā Dānam', annotation: 'The Gift of Compassion.' },
      { id: 'B', text: "Intimidate the ferryman into lowering his price for everyone.", gana: 'RAKSHASA', points: 1, seed: 'भयशासनम्', transliteration: 'Bhaya Śāsanam', annotation: 'Rule by Fear.' },
      { id: 'C', text: "Organize the villagers to build a simple bridge, making the ferryman obsolete.", gana: 'MANUSHYA', points: 1, seed: 'लोकसंग्रहः', transliteration: 'Loka Saṅgrahaḥ', annotation: 'The Welfare of the People.' }
    ]
  },
  {
    id: 6,
    title: "The Flawed Ritual",
    description: "You observe a priest performing a complex ritual with a minor but significant error you recognize. Do you...",
    illustration: "flawed_ritual",
    choices: [
      { id: 'A', text: "Approach him privately after the ritual to gently point out the error.", guna: 'SATTVA', points: 1, seed: 'विवेकवचनम्', transliteration: 'Viveka Vacanam', annotation: 'A Word of Wisdom.' },
      { id: 'B', text: "Say nothing. It is not your place to interfere.", guna: 'TAMAS', points: 1, seed: 'अकर्ताभावः', transliteration: 'Akartā Bhāvaḥ', annotation: 'The State of Non-Doing.' },
      { id: 'C', text: "Interrupt the ritual to correct him, ensuring it is performed perfectly for the benefit of all.", guna: 'RAJAS', points: 1, seed: 'कर्मशुद्धिः', transliteration: 'Karma Śuddhiḥ', annotation: 'The Purity of Action.' }
    ]
  },
  {
    id: 7,
    title: "The Dying Master's Secret",
    description: "Your dying master offers to tell you the ultimate secret of the cosmos, but warns it will bring you great sorrow. Do you...",
    illustration: "dying_master",
    choices: [
      { id: 'A', text: "Listen. Knowledge, no matter the cost, is the goal.", guna: 'SATTVA', points: 1, seed: 'सत्यजिज्ञासा', transliteration: 'Satya Jijñāsā', annotation: 'The Thirst for Truth.' },
      { id: 'B', text: "Refuse. Some knowledge is not meant for mortals.", guna: 'TAMAS', points: 1, seed: 'मर्यादापालनम्', transliteration: 'Maryādā Pālanam', annotation: 'The Observance of Limits.' },
      { id: 'C', text: "Ask him to write it down, to be opened only when you are truly ready.", gana: 'MANUSHYA', points: 1, seed: 'कालप्रतीक्षा', transliteration: 'Kāla Pratīkṣā', annotation: 'Awaiting the Right Time.' }
    ]
  },
  {
    id: 8,
    title: "The Source of Power",
    description: "You discover the source of a temple's mystical power is a rare lotus that is slowly being drained of its life. Do you...",
    illustration: "dying_lotus",
    choices: [
      { id: 'A', text: "Destroy the temple's focusing lens, breaking the drain on the lotus.", guna: 'RAJAS', points: 1, seed: 'तत्क्षणमोक्षः', transliteration: 'Tat-kṣaṇa Mokṣaḥ', annotation: 'An Instant Liberation.' },
      { id: 'B', text: "Reroute the power, allowing the temple to function at reduced capacity while the lotus recovers.", gana: 'MANUSHYA', points: 1, seed: 'समन्वयसमाधानम्', transliteration: 'Samanvaya Samādhānam', annotation: 'A Harmonious Solution.' },
      { id: 'C', text: "Perform a ritual to sacrifice a part of your own life force to heal the lotus.", gana: 'DEVA', points: 1, seed: 'आत्मयज्ञः', transliteration: 'Ātma Yajñaḥ', annotation: 'The Self-Sacrifice.' }
    ]
  },
  {
    id: 9,
    title: "The Unjust Law",
    description: "You arrive in a city where a new law mandates the imprisonment of anyone possessing 'forbidden texts'—the very kind you seek. Do you...",
    illustration: "forbidden_city",
    choices: [
      { id: 'A', text: "Operate in the shadows, avoiding all contact with authorities.", guna: 'TAMAS', points: 1, seed: 'प्रच्छन्नवृत्तिः', transliteration: 'Pracchanna Vṛttiḥ', annotation: 'A Veiled Existence.' },
      { id: 'B', text: "Openly defy the law, believing knowledge should be free.", guna: 'RAJAS', points: 1, seed: 'न्यायआग्रहः', transliteration: 'Nyāya Āgrahaḥ', annotation: 'The Insistence on Justice.' },
      { id: 'C', text: "Seek a patron or official who can grant you special dispensation.", gana: 'MANUSHYA', points: 1, seed: 'राजअनुग्रहः', transliteration: 'Rāja Anugrahaḥ', annotation: 'The Favor of Authority.' }
    ]
  },
  {
    id: 10,
    title: "The Final Choice",
    description: "Before you is a single, perfect pearl. A note explains it can either grant you a vision of a forgotten truth or be crushed to create a panacea that can cure any disease. Do you...",
    illustration: "perfect_pearl",
    choices: [
      { id: 'A', text: "Seek the vision of truth.", guna: 'SATTVA', points: 1, seed: 'सत्यदर्शनम्', transliteration: 'Satya Darśanam', annotation: 'A Vision of Truth.' },
      { id: 'B', text: "Create the panacea for others.", gana: 'DEVA', points: 1, seed: 'सर्वहितम्', transliteration: 'Sarva Hitam', annotation: 'For the Good of All.' },
      { id: 'C', text: "Take the pearl. Such power should be wielded, not consumed.", gana: 'RAKSHASA', points: 1, seed: 'शक्तिधारणम्', transliteration: 'Śakti Dhāraṇam', annotation: 'The Wielding of Power.' }
    ]
  }
];

// Nakshatra data organized by Gana
export const NAKSHATRAS = {
  DEVA: [
    {
      name: 'Ashwini',
      description: 'Born under the Star of Healing, you are a guardian of wisdom and a source of restoration to others.',
      skill: "Healer's Grace",
      skillDescription: 'Restorative items and safe havens glow with a gentle light.',
      rashi: 'Mesha',
      element: 'Fire'
    },
    {
      name: 'Mrigashira',
      description: 'Born under the Star of the Seeker, you possess an innate ability to find the right path.',
      skill: "Seeker's Instinct",
      skillDescription: 'The correct path in a maze-like area will occasionally shimmer with a faint, silvery light.',
      rashi: 'Vrishabha',
      element: 'Earth'
    },
    {
      name: 'Punarvasu',
      description: 'Born under the Star of Renewal, you are a guardian of wisdom and a source of comfort to others.',
      skill: "Aditi's Blessing",
      skillDescription: 'Resting at a safe haven provides a temporary bonus to your next dialogue check.',
      rashi: 'Mithuna',
      element: 'Air'
    },
    {
      name: 'Pushya',
      description: 'Born under the Star of Nourishment, you enhance the wisdom of others.',
      skill: "Nourishing Light",
      skillDescription: 'Consumable items provide a slight, temporary boost to your "Sage\'s Insight" ability.',
      rashi: 'Karka',
      element: 'Water'
    },
    {
      name: 'Hasta',
      description: 'Born under the Star of the Skillful Hand, you have an affinity for mechanical solutions.',
      skill: "Golden Hand",
      skillDescription: 'You have a small chance to automatically solve simple mechanical puzzles.',
      rashi: 'Kanya',
      element: 'Earth'
    },
    {
      name: 'Swati',
      description: 'Born under the Star of Independence, you hear the whispers of the wind.',
      skill: "Wind's Whisper",
      skillDescription: 'Acoustic puzzles have clearer, more distinct tones, and wind direction can subtly reveal secrets.',
      rashi: 'Tula',
      element: 'Air'
    },
    {
      name: 'Anuradha',
      description: 'Born under the Star of Friendship, you inspire trust and goodwill in others.',
      skill: "Mitra's Bond",
      skillDescription: 'Friendly NPCs are more likely to offer additional, unsolicited clues or small gifts.',
      rashi: 'Vrishchika',
      element: 'Water'
    },
    {
      name: 'Shravana',
      description: 'Born under the Star of Learning, you can hear echoes of the past.',
      skill: "Sacred Ear",
      skillDescription: 'Faint echoes of past, important conversations can be heard in significant locations.',
      rashi: 'Makara',
      element: 'Earth'
    },
    {
      name: 'Revati',
      description: 'Born under the Star of the Pathfinder, you illuminate the way forward.',
      skill: "Pathfinder's Light",
      skillDescription: 'The in-game map reveals slightly more detail around your current location.',
      rashi: 'Meena',
      element: 'Water'
    }
  ],
  MANUSHYA: [
    {
      name: 'Bharani',
      description: 'Born under the Star of Restraint, you can see the echoes of death and transformation.',
      skill: "Yama's Gaze",
      skillDescription: 'Allows you to occasionally see the \'death echo\' of an object, revealing its past use in a brief, ghostly vision.',
      rashi: 'Mesha',
      element: 'Fire'
    },
    {
      name: 'Rohini',
      description: 'Born under the Star of Creation, you possess natural charm and persuasive abilities.',
      skill: "Creator's Charm",
      skillDescription: 'Dialogue checks related to bartering, trade, or gaining access to restricted areas are more likely to succeed.',
      rashi: 'Vrishabha',
      element: 'Earth'
    },
    {
      name: 'Ardra',
      description: 'Born under the Star of Storms, you find clarity in chaos.',
      skill: "Rudra's Tear",
      skillDescription: 'When a puzzle is causing confusion, you gain a brief moment of clarity where all UI distractions fade.',
      rashi: 'Mithuna',
      element: 'Air'
    },
    {
      name: 'Purva Phalguni',
      description: 'Born under the Star of Fortune, luck favors your endeavors.',
      skill: "Bhaga's Fortune",
      skillDescription: 'You have a small chance to find extra currency or a minor consumable item in containers.',
      rashi: 'Simha',
      element: 'Fire'
    },
    {
      name: 'Uttara Phalguni',
      description: 'Born under the Star of Patronage, you excel at forming beneficial relationships.',
      skill: "Aryaman's Pact",
      skillDescription: 'Dialogue choices based on making contracts or promises have a higher chance of success.',
      rashi: 'Simha',
      element: 'Fire'
    },
    {
      name: 'Purva Ashadha',
      description: 'Born under the Star of Invincibility, you flow like an unstoppable current.',
      skill: "Invincible Current",
      skillDescription: 'Gain a temporary speed boost after successfully solving a water-based puzzle.',
      rashi: 'Dhanu',
      element: 'Fire'
    },
    {
      name: 'Uttara Ashadha',
      description: 'Born under the Star of Victory, you possess universal sight.',
      skill: "Universal Sight",
      skillDescription: 'Once per major area, you can activate an ability to reveal all interactable objects in your immediate vicinity.',
      rashi: 'Dhanu',
      element: 'Fire'
    },
    {
      name: 'Purva Bhadrapada',
      description: 'Born under the Star of Burning, pain reveals hidden truths.',
      skill: "Penitent's Fire",
      skillDescription: 'Taking damage has a small chance to briefly reveal a hidden weakness in an environmental trap.',
      rashi: 'Kumbha',
      element: 'Air'
    },
    {
      name: 'Uttara Bhadrapada',
      description: 'Born under the Star of the Deep, you perceive hidden depths.',
      skill: "Serpent's Depth",
      skillDescription: 'Hidden passages or secret doors have a slightly more noticeable visual or auditory cue.',
      rashi: 'Meena',
      element: 'Water'
    }
  ],
  RAKSHASA: [
    {
      name: 'Krittika',
      description: 'Born under the Star of Fire, you command the cutting edge of illumination.',
      skill: "Agni's Edge",
      skillDescription: 'You can interact with certain fire sources to create a brighter, wider light, revealing more of the environment.',
      rashi: 'Mesha',
      element: 'Fire'
    },
    {
      name: 'Ashlesha',
      description: 'Born under the Star of the Serpent, poisons hold no power over you.',
      skill: "Naga's Coil",
      skillDescription: 'You can automatically bypass simple poison or venom-based traps without harm.',
      rashi: 'Karka',
      element: 'Water'
    },
    {
      name: 'Magha',
      description: 'Born under the Star of Ancestry, you commune with the echoes of the dead.',
      skill: "Ancestor's Echo",
      skillDescription: 'Interacting with skeletal remains or tombs might trigger a ghostly vision of the person\'s last moments.',
      rashi: 'Simha',
      element: 'Fire'
    },
    {
      name: 'Chitra',
      description: 'Born under the Star of the Divine Architect, you see the flaws in all constructions.',
      skill: "Divine Architect",
      skillDescription: 'You can spot structural weaknesses in walls or floors, sometimes revealing shortcuts or hidden areas.',
      rashi: 'Kanya',
      element: 'Earth'
    },
    {
      name: 'Vishakha',
      description: 'Born under the Star of Purpose, your goals burn clear and bright.',
      skill: "Focused Goal",
      skillDescription: 'The main objective marker on your map is always visible, even when scrambled by other effects.',
      rashi: 'Tula',
      element: 'Air'
    },
    {
      name: 'Jyeshtha',
      description: 'Born under the Star of the Elder, your presence commands respect through strength.',
      skill: "Indra's Pride",
      skillDescription: 'Successfully intimidating an NPC provides a temporary bonus to your next persuasion attempt.',
      rashi: 'Vrishchika',
      element: 'Water'
    },
    {
      name: 'Mula',
      description: 'Born under the Star of the Root, you excel at destruction that clears the way for new growth.',
      skill: "Root of Ruin",
      skillDescription: 'You can interact with certain decaying structures to bring them down, clearing a path or blocking pursuers.',
      rashi: 'Dhanu',
      element: 'Fire'
    },
    {
      name: 'Dhanishta',
      description: 'Born under the Star of Prosperity, you move to the rhythm of cosmic music.',
      skill: "Rhythmic Heart",
      skillDescription: 'Timed puzzles that rely on rhythm have a slightly more generous timing window.',
      rashi: 'Makara',
      element: 'Earth'
    },
    {
      name: 'Shatabhisha',
      description: 'Born under the Star of a Hundred Healers, you work from the shadows.',
      skill: "Veiled Healer",
      skillDescription: 'Once per area, you can create a \'shroud\' of shadows, making you harder to detect by non-magical guardians for a short time.',
      rashi: 'Kumbha',
      element: 'Air'
    }
  ]
};

// Guna bonuses
export const GUNA_BONUSES = {
  SATTVA: {
    name: "Sage's Insight",
    description: 'Interactable objects shimmer with a faint golden light. Text-based puzzles may have certain keywords highlighted.'
  },
  RAJAS: {
    name: "Scion's Vigor",
    description: 'You can move heavy objects 25% faster and have a slightly longer sprint duration.'
  },
  TAMAS: {
    name: "Shadow's Patience",
    description: 'Environmental hazards (e.g., poison darts, gas) deal 50% less damage. You can hold your breath twice as long.'
  }
};

// Profile calculation functions
export function buildAtmanVakya(surveyAnswers) {
  const seeds = [];
  surveyAnswers.forEach(ans => {
    const q = SURVEY_QUESTIONS.find(q => q.id === ans.questionId);
    if (!q) return;
    const c = q.choices.find(c => c.id === ans.choiceId);
    if (c && c.seed) seeds.push({ seed: c.seed, transliteration: c.transliteration, annotation: c.annotation });
  });
  return seeds;
}

export function calculatePlayerProfile(surveyAnswers) {
  const scores = {
    guna: { SATTVA: 0, RAJAS: 0, TAMAS: 0 },
    gana: { DEVA: 0, MANUSHYA: 0, RAKSHASA: 0 }
  };
  
  // Calculate scores from survey answers
  surveyAnswers.forEach(answer => {
    if (answer.guna) scores.guna[answer.guna] += answer.points;
    if (answer.gana) scores.gana[answer.gana] += answer.points;
  });
  
  // Determine primary Guna and Gana
  const primaryGuna = Object.keys(scores.guna).reduce((a, b) => 
    scores.guna[a] > scores.guna[b] ? a : b
  );
  
  const primaryGana = Object.keys(scores.gana).reduce((a, b) => 
    scores.gana[a] > scores.gana[b] ? a : b
  );
  
  // Calculate secondary scores for Nakshatra selection
  const secondaryGunaScore = Math.max(...Object.values(scores.guna).filter(score => score !== scores.guna[primaryGuna]));
  const secondaryGuna = Object.keys(scores.guna).find(guna => scores.guna[guna] === secondaryGunaScore);
  
  // Select Nakshatra based on primary Gana and secondary Guna
  const availableNakshatras = NAKSHATRAS[primaryGana];
  let selectedNakshatra;
  
  if (secondaryGuna === 'SATTVA') {
    selectedNakshatra = availableNakshatras[Math.floor(availableNakshatras.length * 0.33)];
  } else if (secondaryGuna === 'RAJAS') {
    selectedNakshatra = availableNakshatras[Math.floor(availableNakshatras.length * 0.66)];
  } else {
    selectedNakshatra = availableNakshatras[0];
  }
  
  const atmanVakya = buildAtmanVakya(surveyAnswers);

  return {
    primaryGuna,
    primaryGana,
    nakshatra: selectedNakshatra,
    rashi: selectedNakshatra.rashi,
    skills: [
      GUNA_BONUSES[primaryGuna],
      {
        name: selectedNakshatra.skill,
        description: selectedNakshatra.skillDescription
      }
    ],
    scores,
    atmanVakya,
    atmanVakyaText: atmanVakya.map(s => s.seed).join(' · ')
  };
}
