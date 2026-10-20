import { describe, it, expect } from 'vitest';
import { buildPipelineStages, defaultPipeline, isClosedStage, slugifyStageKey, stageMeta } from './pipeline-stages';

describe('slugifyStageKey', () => {
  it('lowercases and joins words with underscores', () => {
    expect(slugifyStageKey('Quote Sent!')).toBe('quote_sent');
  });
});

describe('buildPipelineStages', () => {
  it('appends Closed Won and Closed Lost after the open stages', () => {
    const keys = buildPipelineStages(['Lead', 'Contacted']).map(s => s.key);
    expect(keys).toEqual(['lead', 'contacted', 'closed_won', 'closed_lost']);
  });

  it('skips blank labels and duplicates', () => {
    const keys = buildPipelineStages(['Lead', '  ', 'lead', 'Lead!']).map(s => s.key);
    expect(keys).toEqual(['lead', 'closed_won', 'closed_lost']);
  });

  it('ignores labels that collide with the fixed closed stages', () => {
    const stages = buildPipelineStages(['Closed Won']);
    expect(stages.filter(s => !s.is_won && !s.is_lost)).toHaveLength(0);
  });

  it('spreads open-stage probabilities from 10% to 90%', () => {
    const open = buildPipelineStages(['A', 'B', 'C']).filter(s => !s.is_won && !s.is_lost);
    expect(open.map(s => s.probability)).toEqual([10, 50, 90]);
  });

  it('gives a single open stage a 10% probability', () => {
    expect(buildPipelineStages(['Only'])[0].probability).toBe(10);
  });
});

describe('stageMeta', () => {
  it('looks the stage up in the given pipeline', () => {
    const pipeline = { ...defaultPipeline('2026-10-20'), stages: buildPipelineStages(['Lead']) };
    expect(stageMeta('lead', pipeline).label).toBe('Lead');
  });

  it('falls back to the first stage for an unknown key', () => {
    expect(stageMeta('nope').key).toBe('prospect');
  });
});

describe('isClosedStage', () => {
  it('treats won and lost as closed and everything else as open', () => {
    expect([isClosedStage('closed_won'), isClosedStage('closed_lost'), isClosedStage('proposal')]).toEqual([true, true, false]);
  });
});
