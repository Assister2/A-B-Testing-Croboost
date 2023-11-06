export const getRandomNum = () =>
  String(Math.floor(Math.random() * 100)).padStart(2, "0");
