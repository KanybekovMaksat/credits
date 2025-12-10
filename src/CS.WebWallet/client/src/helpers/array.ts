export const groupByDate = (rows: any[]) => {
  const map = new Map();
  rows.forEach((item) => {
    const key = item.data;
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
};
