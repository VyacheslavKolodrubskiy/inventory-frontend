import { useCounter } from '@vueuse/core';

export function useSteps(totalSteps = 2) {
  const {
    count: step,
    inc,
    dec,
    set: setStep,
    reset: resetSteps,
  } = useCounter(1);

  function prevStep() {
    if (step.value > 1)
      dec();
  }

  function nextStep() {
    if (step.value < totalSteps)
      inc();
  }

  return {
    step,
    setStep,
    nextStep,
    prevStep,
    resetSteps,
  };
}
