// background.js

let color = '#ecf5ff';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ color: '#ecf5ff' });
  console.log('Default background color set to %clightBlue', `color: ${color}`);
  // 设置徽章
  // chrome.browserAction.setBadgeText({ text: 'ON' });
  // chrome.browserAction.setBadgeBackgroundColor({ color: '#108eff' });
});

// 测试消息传递
function test() {
  alert('你好,这里是后台页');
  let pop = chrome.extension.getViews({ type: 'popup' }) || [];
  alert(pop[0].location);
}

// 长连接
chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((msg) => {
    if (msg.testName == 'hahahahaha') {
      port.postMessage({question: 'A'})
    } else if (msg.answer == 'A-B') {
      port.postMessage({ question: 'B'})
    }
  })
})