import Taro from '@tarojs/taro'

export const requestPermission = async () => {
  return true
}

export const sendNotification = (title, options) => {
  Taro.showToast({
    title: title,
    icon: 'none',
    duration: 2000
  })
}

export const NOTIFICATION_MESSAGES = {
  fastingStarted: {
    title: '断食已开始',
    body: '坚持就是胜利！加油',
  },
  fastingEndingSoon: {
    title: '即将可以进食',
    body: '30分钟后即可进食，准备好你的美食吧！',
  },
  fastingCompleted: {
    title: '断食完成！',
    body: '恭喜你完成了本次断食，继续保持！',
  },
}
