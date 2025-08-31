import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SceneProgressMap from '../SceneProgressMap';
import ProgressiveNarrative from '../ProgressiveNarrative';

describe('SceneProgressMap', () => {
  it('disables future scenes beyond next allowed index', () => {
    const scenes = ['A','B','C','D'];
    const completed = ['A','B'];
    const current = 'C';
    const onSelect = jest.fn();
    render(<div style={{ height: 200 }}><SceneProgressMap scenes={scenes} current={current} completed={completed} onSelect={onSelect} /></div>);
    const buttons = screen.getAllByRole('button');
    // Last node (D) should be disabled (only up to C allowed)
    expect(buttons[3]).toBeDisabled();
  });
});

describe('ProgressiveNarrative', () => {
  it('calls onComplete when the last block is shown', () => {
    const onComplete = jest.fn();
    render(<ProgressiveNarrative blocks={[<div key="1">Only</div>]} autoAdvance={false} onComplete={onComplete} />);
    // onComplete fires after initial render because there is 1 block (already at last index)
    expect(onComplete).toHaveBeenCalled();
  });
});
