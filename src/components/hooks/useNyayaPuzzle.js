import { useMemo, useState, useCallback } from 'react';

// Nyāya five-member syllogism slots
const SLOTS = [
  { id: 'pratijna', title: 'Pratijñā (Proposition)' },
  { id: 'hetu', title: 'Hetu (Reason)' },
  { id: 'udaharana', title: 'Udāharaṇa (Example)' },
  { id: 'upanaya', title: 'Upanaya (Application)' },
  { id: 'nigamana', title: 'Nigamana (Conclusion)' }
];

export default function useNyayaPuzzle() {
  // Cards include one correct set and some distractors to allow meaningful validation
  const cards = useMemo(() => ([
    { id: 'c-prop-fire-hill', text: 'The hill is fire-possessed.' },
    { id: 'c-reason-smoke', text: 'Because smoke is perceived there.' },
    { id: 'c-rule-correct', text: 'Wherever there is smoke, there is fire (as in a kitchen).' },
    { id: 'c-apply-hill', text: 'Smoke is present on the hill, matching the rule.' },
    { id: 'c-conclude-fire', text: 'Therefore, the hill is fire-possessed.' },
    // Distractors
    { id: 'd-rule-reversed', text: 'Wherever there is fire, there is smoke.' },
    { id: 'd-reason-weak', text: 'Because the hill is large.' },
    { id: 'd-example-wrong', text: 'As in a lake where there is smoke but no fire.' }
  ]), []);

  const [selected, setSelected] = useState(null); // card id
  const [placed, setPlaced] = useState({}); // slotId -> cardId
  const [message, setMessage] = useState('Arrange the five members of the argument in order.');
  const [complete, setComplete] = useState(false);

  const slots = SLOTS;

  const pick = useCallback((cardId) => setSelected(cardId), []);

  const unplaceFromSlot = useCallback((slotId) => {
    setPlaced(prev => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
  }, []);

  const placeOnSlot = useCallback((slotId) => {
    if (!selected) return;
    setPlaced(prev => {
      // Prevent the same card being in multiple slots
      const takenBy = Object.entries(prev).find(([_, cid]) => cid === selected);
      const next = { ...prev };
      if (takenBy) delete next[takenBy[0]];
      next[slotId] = selected;
      return next;
    });
  }, [selected]);

  const reset = useCallback(() => {
    setPlaced({});
    setSelected(null);
    setMessage('Arrange the five members of the argument in order.');
    setComplete(false);
  }, []);

  const ids = {
    pratijna: 'c-prop-fire-hill',
    hetu: 'c-reason-smoke',
    udaharana: 'c-rule-correct',
    upanaya: 'c-apply-hill',
    nigamana: 'c-conclude-fire'
  };

  function analyzeFallacy(p) {
    // p is slot->card mapping
    const chosen = new Set(Object.values(p));
    if (chosen.has('d-rule-reversed')) {
      return 'Irregular concomitance (savyabhicāra): the rule is reversed; fire does not always imply smoke.';
    }
    if (chosen.has('d-example-wrong')) {
      return 'Counter-example (satpratipakṣa): the example contradicts the rule.';
    }
    if (chosen.has('d-reason-weak')) {
      return 'Unproved reason (asiddha hetu): the stated reason does not establish the conclusion.';
    }
    return 'Invalid arrangement. Review the five members and try again.';
  }

  const canSubmit = Object.keys(placed).length === 5;

  const submit = useCallback(() => {
    if (!canSubmit) return { ok: false };
    const ok = placed.pratijna === ids.pratijna &&
              placed.hetu === ids.hetu &&
              placed.udaharana === ids.udaharana &&
              placed.upanaya === ids.upanaya &&
              placed.nigamana === ids.nigamana;
    if (ok) {
      setMessage('The iris unlocks with a resonant click. Your reasoning aligns with Nyāya.');
      setComplete(true);
      return { ok: true };
    } else {
      const why = analyzeFallacy(placed);
      setMessage(why);
      setComplete(false);
      return { ok: false, why };
    }
  }, [canSubmit, placed]);

  return {
    cards,
    slots,
    selected,
    placed,
    message,
    complete,
    pick,
    placeOnSlot,
    unplaceFromSlot,
    reset,
    submit,
    canSubmit
  };
}
