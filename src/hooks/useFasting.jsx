import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { getStorageData, saveStorageData, addHistoryRecord } from '../utils/storage'
import { sendNotification, NOTIFICATION_MESSAGES } from '../utils/notifications'
import { PLANS } from '../constants'

const FastingContext = createContext(null)

const REMINDER_BEFORE_END = 30 * 60 * 1000

export const FastingProvider = ({ children }) => {
  const [data, setData] = useState(() => getStorageData())
  const [now, setNow] = useState(Date.now())
  const notifiedEndSoonRef = useRef(false)
  const notifiedCompleteRef = useRef(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    saveStorageData(data)
    return () => saveStorageData(data)
  }, [data])

  useEffect(() => {
    if (!data.isFasting || !data.fastingEndTime) {
      notifiedEndSoonRef.current = false
      notifiedCompleteRef.current = false
      return
    }

    const timeRemaining = data.fastingEndTime - now

    if (timeRemaining <= REMINDER_BEFORE_END && timeRemaining > 0 && !notifiedEndSoonRef.current) {
      sendNotification(
        NOTIFICATION_MESSAGES.fastingEndingSoon.title,
        NOTIFICATION_MESSAGES.fastingEndingSoon,
      )
      notifiedEndSoonRef.current = true
    }

    if (timeRemaining <= 0 && !notifiedCompleteRef.current) {
      sendNotification(
        NOTIFICATION_MESSAGES.fastingCompleted.title,
        NOTIFICATION_MESSAGES.fastingCompleted,
      )
      notifiedCompleteRef.current = true
    }
  }, [data.isFasting, data.fastingEndTime, now])

  const currentPlan = data.currentPlan || '16:8'
  const planConfig = PLANS[currentPlan] || PLANS['16:8']

  const startFasting = useCallback(() => {
    const startTime = Date.now()
    setData((prev) => ({
      ...prev,
      isFasting: true,
      fastingStartTime: startTime,
      fastingEndTime: startTime + planConfig.fastingHours * 60 * 60 * 1000,
    }))
    sendNotification(
      NOTIFICATION_MESSAGES.fastingStarted.title,
      NOTIFICATION_MESSAGES.fastingStarted,
    )
  }, [planConfig])

  const endFasting = useCallback(() => {
    const endTime = Date.now()
    const newHistory = [...data.history]
    if (data.fastingStartTime) {
      const record = {
        plan: currentPlan,
        startTime: data.fastingStartTime,
        endTime: endTime,
        duration: endTime - data.fastingStartTime,
        completed: data.fastingEndTime && endTime >= data.fastingEndTime,
      }
      newHistory.unshift(record)
      if (newHistory.length > 100) {
        newHistory.pop()
      }
    }
    setData((prev) => ({
      ...prev,
      isFasting: false,
      fastingStartTime: null,
      fastingEndTime: null,
      history: newHistory,
    }))
  }, [data.fastingStartTime, data.fastingEndTime, data.history, currentPlan])

  const setPlan = useCallback(
    (plan) => {
      if (!data.isFasting) {
        setData((prev) => ({
          ...prev,
          currentPlan: plan,
        }))
      }
    },
    [data.isFasting],
  )

  const clearHistory = useCallback(() => {
    setData((prev) => ({
      ...prev,
      history: [],
    }))
  }, [])

  const elapsed = data.isFasting && data.fastingStartTime ? now - data.fastingStartTime : 0
  const targetDuration = planConfig.fastingHours * 60 * 60 * 1000
  const progress = Math.min((elapsed / targetDuration) * 100, 100)

  const remainingTime =
    data.isFasting && data.fastingEndTime ? Math.max(data.fastingEndTime - now, 0) : 0

  const value = {
    isFasting: data.isFasting,
    currentPlan,
    planConfig,
    progress,
    elapsed,
    remainingTime,
    startFasting,
    endFasting,
    setPlan,
    clearHistory,
    history: data.history,
  }

  return <FastingContext.Provider value={value}>{children}</FastingContext.Provider>
}

export const useFastingContext = () => {
  const context = useContext(FastingContext)
  if (!context) {
    throw new Error('useFastingContext must be used within a FastingProvider')
  }
  return context
}
