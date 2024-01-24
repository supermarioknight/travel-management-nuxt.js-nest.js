import cloneDeep from 'clone-deep';
import {
  ref,
  shallowRef,
  readonly,
  watch,
  type UnwrapRef,
  type DeepReadonly,
  type WatchOptions,
} from 'vue';

import { isFunction, isObject } from '@/utils/check-runtime-types';

type UseRefOptions<T> = {
  deep?: true;
  watcher?: () => T;
  watcherOptions?: WatchOptions;
  emitter?: (value: T) => void;
};

export function useRef<T>(
  value: T,
  options?: UseRefOptions<T>,
): [DeepReadonly<Ref<T>>, (newValue: T | DeepReadonly<T>) => void, () => void] {
  const INITIAL_VALUE = cloneDeep(value);

  const refFn = options?.deep ? ref : shallowRef;
  const customRef = refFn<T>(value);

  const emitCustomRef = (): void => {
    if (isObject(options) && isFunction(options.emitter)) {
      options.emitter(customRef.value);
    }
  };

  const setCustomRefOriginal = (v: T | DeepReadonly<T>): void => {
    customRef.value = v as UnwrapRef<T>;
  };

  const setCustomRef = (v: T | DeepReadonly<T>): void => {
    setCustomRefOriginal(v);
    emitCustomRef();
  };

  const clearCustomRef = (): void => {
    customRef.value = INITIAL_VALUE as UnwrapRef<T>;
    emitCustomRef();
  };

  if (isObject(options) && isFunction(options.watcher)) {
    watch(
      options.watcher,
      setCustomRefOriginal,
      options.watcherOptions ?? { immediate: true },
    );
  }

  return [
    readonly(customRef) as DeepReadonly<Ref<T>>,
    setCustomRef,
    clearCustomRef,
  ];
}
