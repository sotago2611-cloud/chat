// 最初に通知許可を求める
async function enableNotifications() {
  if (!("Notification" in window)) {
    alert("このブラウザは通知に対応していません");
    return;
  }

  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    alert("通知を許可しました");
  }
}

let lastMessageCount = 0;
let firstLoad = true;

async function loadMessages() {
  try {
    const response = await fetch(GAS_URL);
    const messages = await response.json();

    // 初回は通知しない
    if (!firstLoad && messages.length > lastMessageCount) {

      const newMessages =
        messages.slice(lastMessageCount);

      newMessages.forEach(msg => {

        // 自分の発言は通知しない
        if (msg.name !== myName) {
          showNotification(msg.name, msg.message);
        }

      });
    }

    lastMessageCount = messages.length;
    firstLoad = false;

    // ここから下は今までの表示処理
    const chat = document.getElementById("chat");
    chat.innerHTML = "";

    messages.forEach(msg => {
      const div = document.createElement("div");

      div.className =
        "message " +
        (msg.name === myName ? "me" : "other");

      const name = document.createElement("div");
      name.className = "name";
      name.textContent = msg.name;

      const bubble = document.createElement("div");
      bubble.className = "bubble";
      bubble.textContent = msg.message;

      div.appendChild(name);
      div.appendChild(bubble);

      chat.appendChild(div);
    });

  } catch (error) {
    console.error(error);
  }
}

function showNotification(name, message) {

  if (Notification.permission !== "granted") {
    return;
  }

  new Notification(name, {
    body: message
  });
}
