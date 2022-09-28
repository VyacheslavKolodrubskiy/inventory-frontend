// @ts-nocheck

// (Internal) Queues a function to be executed.
export const queue = (function () {
  const pending: Array<(fn: any) => void> = [];

  function next() {
    const fn = pending.shift();
    if (fn)
      fn(next);
  }

  return function (fn) {
    pending.push(fn);
    if (pending.length === 1)
      next();
  };
})();

export function clamp(n, min, max) {
  if (n < min)
    return min;
  if (n > max)
    return max;
  return n;
}

/**
 * (Internal) converts a percentage (`0..1`) to a bar translateX
 * percentage (`-100%..0%`).
 */

export function toBarPerc(n) {
  return (-1 + n) * 100;
}
