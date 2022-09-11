export const waitUntil = async function waitUntil(condition: (() => boolean) | number) {
  return new Promise((resolve) => {
    if (typeof condition === 'number') {
      setTimeout(() => {
        resolve(true);
      }, condition);
    } else {
      const iv = setInterval(() => {
        if (condition()) {
          clearInterval(iv);
          resolve(true);
        }
      }, 10);
    }
  });
};
