import type { Page } from 'puppeteer';
import { ComponentName, TComponentKey, TComponentName } from './type';

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export class CaseUtil {
  static sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }
}

/** 组件添加基线 */
export const baseLineMapAdd = {
  100: 90,
  200: 180,
  300: 300,
  400: 300,
  500: 300
};
/** 组件选中基线 */
export const baseLineMapSelect = {
  100: 90,
  200: 180,
  300: 300,
  400: 300,
  500: 300
};
/** 属性编辑基线 */
export const baseLineMapSetterEdit = {
  100: 90,
  200: 210,
  300: 300,
  400: 300,
  500: 300
};
/** 表单解析基线 */
export const baseLineMapRenderParse = {
  100: 15,
  200: 23,
  300: 30,
  400: 39,
  500: 48
};
//  https://github.com/puppeteer/puppeteer/blob/main/packages/puppeteer-core/src/common/PredefinedNetworkConditions.ts
export const PredefinedNetworkConditions = Object.freeze({
  Slow3G: {
    download: ((500 * 1000) / 8) * 0.8, // 50kb/s
    upload: ((500 * 1000) / 8) * 0.8,
    latency: 400 * 5
  },
  Fast3G: {
    download: ((1.6 * 1000 * 1000) / 8) * 0.9, // 180kb/s
    upload: ((750 * 1000) / 8) * 0.9,
    latency: 150 * 3.75
  },
  Regular4G: {
    download: ((1.6 * 5 * 1000 * 1000) / 8) * 0.9, // 900kb/s
    upload: ((750 * 5 * 1000) / 8) * 0.9,
    latency: 30 * 3.75
  },
  Fast4G: {
    download: ((1.6 * 10 * 1000 * 1000) / 8) * 0.9, // 1800kb/s = 1.8mb/s
    upload: ((750 * 10 * 1000) / 8) * 0.9,
    latency: 15 * 3.75
  },
  WIFI: {
    download: ((1.6 * 20 * 1000 * 1000) / 8) * 0.9, // 3600kb/s  = 3.6mb/s
    upload: ((750 * 20 * 1000) / 8) * 0.9,
    latency: 7.5 * 3.75
  }
});

/**
 * 当前画布中的节点数量
 */
export const getNodeCount = async (page: Page): Promise<number> => {
  const itemList = await page.$$('.jm-form-item');
  return itemList.length;
};

/**
 * 随机选中一个节点
 */
export const selectNode = async (page: Page, comName?: TComponentKey) => {
  const nodes = await page.$$('.jm-form-item');
  if (!nodes || !nodes.length) {
    console.log('画布中没有节点，无法选中');
    return;
  }
  const index = Math.floor(Math.random() * nodes.length);
  if (comName) {
    const node = await page.waitForSelector(`div[data-jimu-id^="${comName}"]`);
    if (!node) {
      throw Error(`${comName} 组件未准备好`);
    }
    console.log(node);
    await node.click();
  } else {
    await nodes[index]?.click();
  }
  await sleep(200);
};

/**
 * 往画布中添加节点，不传comName则随机添加
 */
export const addNode = async (page: Page, num: number, comName?: TComponentName) => {
  // 将 ComponentName 中reaction 为1的去除
  // if (['Table', 'Card', 'Captions', 'ColumnsGrid', 'AssociatedQuery'].includes(_comName!))
  const array = Object.values(ComponentName);
  const comArray = array.filter((item) => !['Table', 'Card', 'Captions', 'ColumnsGrid', 'AssociatedQuery'].includes(item));
  for (let i = 0; i < num; i++) {
    const index = Math.floor(Math.random() * comArray.length);
    const _comName = comName || comArray[index];
    // reaction 为1的去除
    // if (['Table', 'Card', 'Captions', 'ColumnsGrid', 'AssociatedQuery'].includes(_comName!)) continue;
    const com = await page.$(`div[data-jimu-key="${_comName}"]`);
    if (!com) {
      throw Error(`${com}组件未准备好`);
    }
    await com.click();
    // await sleep(200);
  }
};

/**
 * 从画布中删除节点
 */
export const delNode = async (page: Page, num: number, comName?: TComponentKey) => {
  let curNode;
  if (comName) {
    const comNode = await page.waitForSelector(`div[data-jimu-id^="${comName}_"]`);
    if (!comNode) throw Error(`${comName}组件未找到`);
    curNode = comNode;
  } else {
    const nodes = await page.$$('.jm-form-item');
    if (!nodes || !nodes.length) return;
    const index = Math.floor(Math.random() * nodes.length);
    curNode = nodes[index];
  }

  for (let i = 0; i < num; i++) {
    await curNode!.click();
    const delIcon = await page.waitForSelector('.jimu-mantle-icon > .mtdicon-delete-o');
    await delIcon!.click(); // 点击删除icon
    const confirmBtn = await page.waitForSelector('.mtd-confirm-btns > .mtd-button-danger');
    await confirmBtn?.click(); // 确定删除
  }
};

/**
 * 随机复制一个节点
 */
export const copyNode = async (page: Page, comName?: 'select' | 'selectdd') => {
  let curNode;
  if (comName) {
    const comNode = await page.waitForSelector(`div[data-jimu-id^="${comName}_"]`);
    if (!comNode) {
      throw Error(`${comName}组件未找到`);
    }
    curNode = comNode;
  } else {
    const nodes = await page.$$('.jm-form-item');
    if (!nodes || !nodes.length) {
      console.log('画布中没有节点，无法复制');
      return;
    }
    const index = Math.floor(Math.random() * nodes.length);
    curNode = nodes[index];
  }

  await curNode!.click();
  const copy = await page.waitForSelector('.jimu-mantle-icon > .mtdicon-copy-o');
  await copy?.click();
  // await sleep(200);
};
