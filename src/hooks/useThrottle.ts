import { useRef, useEffect, useCallback } from 'react'
import { throttle, DebouncedFunc } from 'lodash-es'

/**
 * 节流 Hook
 * @param callback 要节流的回调函数
 * @param delay 节流延迟时间（毫秒）
 * @returns 节流后的函数
 */
export function useThrottle<T extends (...args: any[]) => any>(callback: T, delay: number = 1000) {
  const callbackRef = useRef(callback)
  const throttledRef = useRef<DebouncedFunc<(...args: Parameters<T>) => ReturnType<T>> | null>(null)

  // 更新回调引用
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  // 初始化和更新节流函数
  useEffect(() => {
    throttledRef.current = throttle((...args: Parameters<T>) => {
      return callbackRef.current(...args)
    }, delay)

    // 组件卸载时取消节流
    return () => {
      throttledRef.current?.cancel()
    }
  }, [delay])

  // 返回一个稳定的包装函数
  return useCallback((...args: Parameters<T>) => {
    return throttledRef.current?.(...args)
  }, []) as T
}
