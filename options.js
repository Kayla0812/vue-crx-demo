let page = document.getElementById("buttonDiv");
let selectedClassName = "current";
const presetButtonColors = ["#e1f3d8", "#f4f4f5", "#faecd8", "#fef0f0"];

function handleButtonClick(event) {
  let current = event.target.parentElement.querySelector(
    `.${selectedClassName}`
  );
  if (current && current !== event.target) {
    current.classList.remove(selectedClassName);
  }
    
  let color = event.target.dataset.color;
  event.target.classList.add(selectedClassName);
  chrome.storage.sync.set({ color });
}

function constructOptions(buttonColors) {
  chrome.storage.sync.get("color", (data) => {
    let currentColor = data.color;
    for (let buttonColor of buttonColors) {
      let button = document.createElement("button");
      button.dataset.color = buttonColor;
        button.style.backgroundColor = buttonColor;
        button.innerText = '点击更换'

      if (buttonColor === currentColor) {
        button.classList.add(selectedClassName);
      }

      button.addEventListener("click", handleButtonClick);
      page.appendChild(button);
    }
  });
}

constructOptions(presetButtonColors);