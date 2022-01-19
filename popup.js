let changeColor = document.getElementById('changeColor');

chrome.storage.sync.get('color', function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute('value', data.color);
});

changeColor.onclick = function(element) {
    let color = element.target.value;
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        // 内容脚本代码注入
        // chrome.tabs.executeScript(
        //     tabs[0].id,
        //   { code: 'document.body.style.backgroundColor = "' + color + '";' }
        // );
      
        // 内容脚本文件注入
        chrome.tabs.executeScript({
          file: 'content-script.js'
        });
      
        // 与扩展自身通信
      // let bg = chrome.extension.getBackgroundPage();
      // bg.test();

      // 与内容脚本通信
      chrome.tabs.sendMessage(tabs[0].id, { greeting: "hello" }, function (res) {
        console.log(res.farewell)
      })
    });
};

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    alert("接收到内容脚本的消息:" + sender.tab.url)
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
  }
);