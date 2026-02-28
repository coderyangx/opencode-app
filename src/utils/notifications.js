export const requestPermission = async () => {
  if (!('Notification' in window)) {
    console.warn('The browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const sendNotification = (title, options) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  const notification = new Notification(title, {
    icon: '/ai-man.png',
    badge: '/ai-man.png',
    ...options,
  });

  notification.onclick = () => {
    window.focus();
    notification.close();
  };

  return notification;
};

export const NOTIFICATION_MESSAGES = {
  fastingStarted: {
    title: '🍽️ 断食已开始',
    body: '坚持就是胜利！加油💪',
  },
  fastingEndingSoon: {
    title: '⏰ 即将可以进食',
    body: '30分钟后即可进食，准备好你的美食吧！',
  },
  fastingCompleted: {
    title: '🎉 断食完成！',
    body: '恭喜你完成了本次断食，继续保持！',
  },
};
