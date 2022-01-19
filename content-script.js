
// 内容脚本文件注入
chrome.runtime.sendMessage({
    greeting: 'hello',
    function(res) {
        console.log(res.farewell)
    }
})
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      console.log("接收到来自扩展的消息");
      if (request.greeting == "hello")
        sendResponse({farewell: "goodbye"});
      }
);

// 长连接
let port = chrome.runtime.connect({
    name: 'long'
});
port.postMessage({
    testName: 'hahahahaha'
});
port.onMessage.addListener((msg) => {
    if (msg.question == 'A') {
        alert('A')
        port.postMessage({ answer: 'A-B'})
    } else if (msg.question == 'B') {
        alert('B')
        port.postMessage({ answer: 'B-C'})
    }
})