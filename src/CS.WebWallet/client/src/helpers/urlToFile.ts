// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const urlToFile = (url: string, filename: string, mimeType: string) => {
  return fetch(url)
    .then((res) => {
      return res.arrayBuffer();
    })
    .then((buf) => {
      return new File([buf], filename, { type: mimeType });
    });
};

export default urlToFile;
