/* eslint linebreak-style: ["error", "windows"] */
export const scrollUp = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

export const scrollDown = () => {
  window.scrollTo({
    top: 100,
    behavior: 'smooth',
  });
};

export const scrollTo = (refElemment) => {
  setTimeout(() => refElemment?.current?.scrollIntoView({ behavior: 'smooth' }), 100);
};
