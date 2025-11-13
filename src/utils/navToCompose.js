// src/utils/navToCompose.js
// "편지쓰기" 화면으로 이동하는 공통 유틸

export function navToCompose(nav, options) {
  if (!nav) return;
  const { type, id, name, handle } = options || {};

  // 1) 나에게 쓰기
  if (type === "self") {
    nav("/write/compose/me", {
      state: {
        to: {
          id: "me",
          handle: "me",
          name: "나에게 쓰는 편지",
          isSelf: true,
        },
      },
    });
    return;
  }

  // 2) 친구에게 쓰기
  const finalHandle = handle || id;
  if (!finalHandle) {
    console.warn("[navToCompose] handle 또는 id가 필요함:", options);
    return;
  }

  nav(`/write/compose/${finalHandle}`, {
    state: {
      to: {
        id: id ?? finalHandle,
        handle: finalHandle,
        name: name ?? "",
      },
    },
  });
}
