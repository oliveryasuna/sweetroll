import {describe, it, expect} from 'vitest';
import {batchAsync} from '../../src';

describe('batchAsync', (() => {
  it('runs all tasks and returns results in order', (async() => {
    const tasks = [1, 2, 3].map(n => ((): Promise<number> => Promise.resolve(n * 2)));
    const results = await batchAsync(tasks, 2);

    expect(results).toEqual([2, 4, 6]);
  }));

  it('limits concurrency', (async() => {
    let activeTasks = 0;
    let maxConcurrent = 0;

    const tasks = Array.from({length: 10}, (() => (async(): Promise<void> => {
      activeTasks++;
      maxConcurrent = Math.max(maxConcurrent, activeTasks);
      await (new Promise<void>((resolve) => {
        setTimeout(resolve, 10);
      }));
      activeTasks--;
    })));

    await batchAsync(tasks, 3);

    expect(maxConcurrent).toBeLessThanOrEqual(3);
  }));

  it('handles empty task list', (async() => {
    const results = await batchAsync([], 5);

    expect(results).toEqual([]);
  }));
}));
