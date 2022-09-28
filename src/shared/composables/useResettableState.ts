import { isReactive, reactive } from 'vue';
import type { DeepPartial } from '@qlt2020/frutils';
import { hasOwn } from '@qlt2020/frutils';

type StateTree = Record<string | number, any>;

export function isPlainObject(o: any): o is StateTree {
  return (
    o
    && typeof o === 'object'
    && Object.prototype.toString.call(o) === '[object Object]'
    && typeof o.toJSON !== 'function'
  );
}

function mergeReactiveObjects<T extends StateTree>(
  target: T,
  patchToApply: DeepPartial<T>,
): T {
  for (const key in patchToApply) {
    if (!hasOwn(patchToApply, key))
      continue;
    const subPatch = patchToApply[key];
    const targetValue = target[key];
    if (
      isPlainObject(targetValue)
      && isPlainObject(subPatch)
      && hasOwn(target, key)
      && !isRef(subPatch)
      && !isReactive(subPatch)
    ) {
      target[key] = mergeReactiveObjects(targetValue, subPatch);
    } else {
      // @ts-expect-error: subPatch is a valid value
      target[key] = subPatch;
    }
  }

  return target;
}

/*
 * Example usage
 * const { form, resetForm, patchForm } = useResettableState(() => ({
 *   name: 'Dig Bick',
 *   age: 25,
 *   isAdmin: false,
 *   hobbies: ['skiing', 'reading'],
 * }));
 *
 * form.age = 1;
 * form.name = 'Roberto';
 *
 * resetForm({ isAdmin: true });
 * form.age = 29;
 */
export function useResettableState<S extends StateTree>(state: () => S) {
  function getDefaultState(defaultValues?: Partial<S>) {
    if (!state)
      return ({} as S);

    return Object.assign(state(), defaultValues || {});
  }

  const currentState = reactive(getDefaultState()) as S;

  function patch(partialStateOrMutator: DeepPartial<S> | ((state: S) => void)) {
    if (typeof partialStateOrMutator === 'function')
      partialStateOrMutator(currentState);
    else
      mergeReactiveObjects(currentState, partialStateOrMutator);
  }

  function resetForm(defaultValues?: Partial<S>) {
    const newState = getDefaultState(defaultValues);

    patch(newState);
  }

  function resetField(fieldName: keyof S) {
    const newState = getDefaultState();

    patch((state) => {
      state[fieldName] = newState[fieldName];
    });
  }

  return {
    resetForm,
    resetField,
    patchForm: patch,
    form: currentState,
  };
}
