// background.js

let color = '#ecf5ff';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color: '#ecf5ff' });
  console.log('Default background color set to %clightBlue', `color: ${color}`);

  // 设置徽章
  // chrome.browserAction.setBadgeText({ text: 'ON' });
  // chrome.browserAction.setBadgeBackgroundColor({ color: '#108eff' });

  // 设置上下文菜单
  chrome.contextMenus.create({
    id: '1',
    title: '扩展菜单测试',
    type: 'normal',
    contexts: ['selection']
  })
});