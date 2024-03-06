const bcyrpt = require("bcrypt");

function buildResponse(data, errorMessage) {
  return {
    error: errorMessage ?? null,
    data,
  };
}

const hashPassword = async (pw) => {
  const saltRounds = 10;
  const salt = await bcyrpt.genSalt(saltRounds);
  return await bcyrpt.hash(pw, salt);
};

const first = ["다람쥐의", "코끼리의", "침팬치의", "여우의", "햄스터의", "고라니의", "강아지의", "고양이의", "비둘기의", "개구리의"];
const middle = ["소중한", "엄청난", "달콤한", "굉장한", "시원한", "작은", "커다란", "매콤한", "짭짤한", "바삭바삭한"];
const last = ["복숭아", "수박", "멜론", "바나나", "귤", "파인애플", "사과", "도토리", "두리안", "후라이드치킨"];

const randomName = () => {
  const randomName = first[Math.floor(Math.random() * 10)] + " " + middle[Math.floor(Math.random() * 10)] + " " + last[Math.floor(Math.random() * 10)];
  return randomName;
};

module.exports = {
  buildResponse,
  hashPassword,
  randomName,
};
