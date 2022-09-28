// @ts-nocheck
import { clamp, queue, toBarPerc } from '@/shared/components/ProgressBar/progress-bar-helpers';

const barPositionCSS = reactive({
  transition: 'all 0ms linear',
  transform: 'translate3d(-100%,0,0)',
});

const progressCSS = reactive({
  transition: 'all 0ms linear',
  opacity: 1,
});

const status = ref(null);
const options = reactive({
  minimum: 0.08,
  speed: 200,
  easing: 'linear',
  trickle: true,
  trickleSpeed: 200,
});

// Increments by a random amount.
function inc(amount?) {
  let n = status.value;

  if (!n)
    return start();

  if (n <= 1) {
    if (typeof amount !== 'number') {
      if (n >= 0 && n < 0.2)
        amount = 0.1;
      else if (n >= 0.2 && n < 0.5)
        amount = 0.04;
      else if (n >= 0.5 && n < 0.8)
        amount = 0.02;
      else if (n >= 0.8 && n < 0.99)
        amount = 0.005;
      else amount = 0;
    }

    n = clamp(n + amount, 0, 0.994);
    return set(n);
  }
}

let timerId;

function start() {
  if (!status.value)
    set(0);

  if (timerId)
    clearTimeout(timerId);

  const work = function () {
    timerId = setTimeout(() => {
      if (!status.value)
        return;
      inc();
      work();
    }, options.trickleSpeed);
  };

  if (options.trickle)
    work();
}

/**
 * Hides the progress bar.
 * This is the *sort of* the same as setting the status to 100%, with the
 * difference being `done()` makes some placebo effect of some realistic motion.
 *
 *     NProgress.done();
 *
 * If `true` is passed, it will show the progress bar even if its hidden.
 *
 *     NProgress.done(true);
 */
function done(force?) {
  if (!force && !status.value)
    return;

  inc(0.3 + 0.5 * Math.random());
  set(1);
}

function set(n) {
  n = clamp(n, options.minimum, 1);
  status.value = (n === 1 ? null : n);
  const speed = options.speed;
  const ease = options.easing;

  barPositionCSS.transform = `translate3d(${toBarPerc(n)}%,0,0)`;
  barPositionCSS.transition = `all ${speed}ms ${ease}`;

  queue((next) => {
    if (n === 1) {
      progressCSS.transition = 'none';
      progressCSS.opacity = 1;

      setTimeout(() => {
        progressCSS.transition = `all ${speed}ms linear`;
        progressCSS.opacity = 0;

        setTimeout(() => {
          barPositionCSS.transform = 'translate3d(-100%,0,0)';
          barPositionCSS.transition = 'all 0ms linear';
          progressCSS.transition = 'none';
          progressCSS.opacity = 1;
          next();
        }, speed);
      }, speed);
    } else {
      setTimeout(next, speed);
    }
  });
}

export function initProgressBar(props) {
  Object.assign(options, props);
  return {
    barPositionCSS,
    progressCSS,
  };
}

export function useProgressBar() {
  return {
    progressSet: set,
    progressStart: start,
    progressDone: done,
  };
}
