import React, { useEffect } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { View, Input, Icon, Checkbox, Button } from '@tarojs/components';
import { FastingProvider } from '../../hooks/useFasting';
import Timer from '../../components/Timer';
import FastingPlanSelector from '../../components/FastingPlanSelector';
import Stats from '../../components/Stats';
import './index.scss';

export default function Index() {
  useDidShow(() => {
    console.log('useDidShow: 页面显示');
  });

  return (
    <FastingProvider>
      {/* <Button
        onClick={() => {
          console.log('Taro', Taro);
          Taro.getLocation().then((res) => {
            console.log('Taro.getLocation', res);
          });
          Taro.chooseAddress({
            success: (res) => {
              console.log('Taro.chooseAddress', res);
            },
          });
        }}
      >
        Taro
      </Button> */}
      <View className='fasting-page'>
        <View className='fasting-main'>
          <Timer />
          <FastingPlanSelector />
          <Stats />
        </View>
      </View>
    </FastingProvider>
  );
}
