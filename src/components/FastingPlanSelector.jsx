import React from 'react'
import { View, Text, Button } from '@tarojs/components'
import { useFastingContext } from '../hooks/useFasting'
import { PLANS } from '../constants'
import './FastingPlanSelector.scss'

export default function FastingPlanSelector() {
  const { currentPlan, setPlan, isFasting } = useFastingContext()

  const plans = Object.keys(PLANS)

  return (
    <View className='plan-selector'>
      <Text className='plan-selector-title'>选择断食方案</Text>
      <View className='plan-options'>
        {plans.map((plan) => (
          <Button
            key={plan}
            className={`plan-option ${currentPlan === plan ? 'active' : ''} ${isFasting ? 'disabled' : ''}`}
            onClick={() => !isFasting && setPlan(plan)}
            disabled={isFasting}
          >
            <Text className='plan-name'>{plan}</Text>
            <Text className='plan-desc'>
              {PLANS[plan].fastingHours}h 断食 / {PLANS[plan].eatingHours}h 进食
            </Text>
          </Button>
        ))}
      </View>
    </View>
  )
}
