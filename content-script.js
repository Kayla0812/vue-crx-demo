
// 内容脚本文件注入
chrome.storage.sync.get('background', function(data) {
    document.body.style.backgroundColor = data.background;
    window.postMessage({
        type: 'FROM_PAGE',
        color: color
    })
});