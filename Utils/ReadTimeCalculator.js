const calculateTime = (timeTaken) => {
  let readTime;
  if (timeTaken < 1) {
    readTime = Math.floor(timeTaken * 60);
    readTime = `${readTime} seconds`;
    return readTime;
  }
  let minutes = Math.floor(timeTaken);
  let seconds = timeTaken - Math.floor(timeTaken);
  if (seconds > 30) {
    minutes = Math.floor(minutes + 1);
  }
  readTime = `${minutes} minutes`;
  return readTime;
};


const calculateReadTime = (text) => {
  const textlen = text.split(' ').length;
  const timeTaken = textlen / 200;
  const readTime = calculateTime(timeTaken);
  return readTime;
}


export { calculateReadTime as default };
