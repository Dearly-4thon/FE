// 최소 토스트: toast("메시지", "success" | "error" | "info")
export function toast(message, type = "info") {
  const el = document.createElement("div");
  el.className = `dearly-toast dearly-toast--${type}`;
  el.textContent = message;
  document.body.appendChild(el);

  // 들어오며 살짝 내려오고, 1.6s 뒤 제거
  requestAnimationFrame(() => el.classList.add("is-show"));
  setTimeout(() => {
    el.classList.remove("is-show");
    setTimeout(() => el.remove(), 250);
  }, 1600);
}
