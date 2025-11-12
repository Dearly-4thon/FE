export function navToCompose(nav, target) {
  // 나에게 쓰기 → /compose/form 로 고정
  if (target?.type === "self") {
    return nav("/compose/form?to=self");
  }

  // 친구에게 쓰기 → /compose/form?id&name
  if (target?.type === "friend" && target.id) {
    const { id, name } = target;
    return nav(
      `/compose/form?to=friend&id=${encodeURIComponent(id)}&name=${encodeURIComponent(
        name || ""
      )}`
    );
  }

  // fallback
  return nav("/compose/form?to=self");
}
