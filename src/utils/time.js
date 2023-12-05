
export const sleep = (sleepSeconds) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(sleepSeconds);
    }, sleepSeconds * 1000);
  });
};
