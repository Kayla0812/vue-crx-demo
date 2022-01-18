// background.js

let color = '#ecf5ff';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color: '#ecf5ff' });
  console.log('Default background color set to %clightBlue', `color: ${color}`);

  // 设置徽章
  // chrome.browserAction.setBadgeText({ text: 'ON' });
  // chrome.browserAction.setBadgeBackgroundColor({ color: '#108eff' });
});