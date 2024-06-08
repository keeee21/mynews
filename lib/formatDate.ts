export function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 日付をUTCからJSTに変換するヘルパー関数
export function convertToJST(date: Date) {
  const offset = 9 * 60; // JSTはUTC+9
  const jstDate = new Date(date.getTime() + offset * 60 * 1000);
  return jstDate;
}
