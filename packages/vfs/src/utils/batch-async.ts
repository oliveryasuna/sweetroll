const batchAsync = (async <T>(
  tasks: (readonly (() => Promise<T>)[]),
  concurrency: number
): Promise<T[]> => {
  const results = (Array.from<T>({length: tasks.length}));
  let nextIndex = 0;

  const runNext = (async(): Promise<void> => {
    while(nextIndex < tasks.length) {
      const index = nextIndex++;

      const task = tasks[index];

      if(task) {
        // eslint-disable-next-line no-await-in-loop
        results[index] = await task();
      }
    }
  });

  const workers = Array.from(
    {length: Math.min(concurrency, tasks.length)},
    (() => runNext())
  );

  await Promise.all(workers);

  return results;
});

export {
  batchAsync
};
