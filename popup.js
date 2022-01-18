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
        // chrome.tabs.executeScript({
        //   file: 'content-script.js'
        // });
      
        // 与扩展自身通信
      chrome.storage.sync.set({'background': color })
    });
};

window.addEventListener("message", function (event) {
  if (event.source != window) {
      return;
  }
  if (event.data.type && (event.data.type == "FROM_PAGE")) {
    changeColor.style.backgroundColor = '#e1f3d8'
    changeColor.innerText = '更改成功!'
  }
})