import { Config } from './config';

const { defaultPwd } = Config;

const WAIT_ELEMENT_TIMEOUT = 10000;

/**
 * 检查是否需要登录 - test 环境
 */
export const checkLogin = async (page, mis, repeatCount) => {
  if (repeatCount > 0) return;
  try {
    // 是否需要重新登录
    await page.waitForSelector('#btn-login-nopwd', {
      visible: true,
      timeout: 5000
    });
    await page.type('#login-username', mis);
    console.log('开始登陆，mis：', mis);
    try {
      const btnLoginNoPwd = await page.$('#btn-login-nopwd');
      await btnLoginNoPwd.click();
      await page.waitForNavigation();
    } catch (e) {
      const btnLogin = await page.$('#btn-login');
      if (btnLogin) {
        await page.type('#login-username', mis);
        await page.type('#login-password', defaultPwd);
        await btnLogin.click();
      } else {
        throw e;
      }
    }

    // await takePicture(page, { name: 'login.png' })
    //  登录成功，页面中包含头像元素
    // await page.waitForSelector('.page-edit-header-save', { timeout: 300000 });
    // await page.waitForSelector('.avatar', { timeout: 300000 });
    // 用户信息变更，刷新页面
    // await page.reload()
    // await page.waitForTimeout(2000)
  } catch (e) {
    // await takePicture(page, { name: 'login-failed.png' })
    console.error('模拟登录失败，或不需要登录', e);
  }
};

// st 环境登录
export const checkLoginST = async (page, mis, pwd) => {
  try {
    // 是否需要重新登录
    await page.waitForSelector('.login-type-qrcode #form-img', {
      visible: true,
      timeout: WAIT_ELEMENT_TIMEOUT
    });
    // eslint-disable-next-line no-console
    console.log('start to select login type');
    await page.click('.login-type-qrcode #form-img');
    try {
      await page.waitForSelector('#login-username', {
        visible: true,
        timeout: WAIT_ELEMENT_TIMEOUT / 2
      });
    } catch (e) {
      // 发现有时点不到，重新尝试
      await page.click('.login-type-qrcode #form-img');
      await page.waitForSelector('#login-username', {
        visible: true,
        timeout: WAIT_ELEMENT_TIMEOUT / 2
      });
    }
    // eslint-disable-next-line no-console
    console.log('start to input login info');
    await page.type('#login-username', mis);
    await page.type('#login-password', pwd);
    await page.click('#btn-login');
    // 登录成功，页面中包含用户头像
    await page.waitForSelector('.avatar', { timeout: WAIT_ELEMENT_TIMEOUT });
  } catch (e) {
    console.error('模拟登录失败，或不需要登录', e);
    await checkLoginST(page, mis, pwd);
  }
};
