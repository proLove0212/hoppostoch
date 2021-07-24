import {
  customRef,
  DeepReadonly,
  onBeforeUnmount,
  readonly,
  Ref,
  ref,
  watch,
} from "@nuxtjs/composition-api"
import { Observable, Subscription } from "rxjs"

export function useReadonlyStream<T>(
  stream$: Observable<T>,
  initialValue: T
): Ref<DeepReadonly<T>> {
  let sub: Subscription | null = null

  onBeforeUnmount(() => {
    if (sub) {
      sub.unsubscribe()
    }
  })

  const targetRef = ref(initialValue) as Ref<T>

  sub = stream$.subscribe((value) => {
    targetRef.value = value
  })

  return readonly(targetRef)
}

export function useStream<T>(
  stream$: Observable<T>,
  initialValue: T,
  setter: (val: T) => void
) {
  let sub: Subscription | null = null

  onBeforeUnmount(() => {
    if (sub) {
      sub.unsubscribe()
    }
  })

  return customRef((track, trigger) => {
    let value = initialValue

    sub = stream$.subscribe((val) => {
      value = val
      trigger()
    })

    return {
      get() {
        track()
        return value
      },
      set(value: T) {
        trigger()
        setter(value)
      },
    }
  })
}

export function pluckRef<T, K extends keyof T>(ref: Ref<T>, key: K): Ref<T[K]> {
  return customRef((track, trigger) => {
    const stopWatching = watch(ref, (newVal, oldVal) => {
      if (newVal[key] !== oldVal[key]) {
        trigger()
      }
    })

    onBeforeUnmount(() => {
      stopWatching()
    })

    return {
      get() {
        track()
        return ref.value[key]
      },
      set(value: T[K]) {
        trigger()
        ref.value = Object.assign(ref.value, { [key]: value })
      },
    }
  })
}
