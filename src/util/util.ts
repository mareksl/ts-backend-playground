// TODO annotate this
interface PickObject<T> {
  [key: string]: T;
}
export function pick<U>(object: PickObject<U>, properties: string[]) {
  return properties.reduce((acc: PickObject<U>, prop: string) => {
    if (object[prop]) {
      acc[prop] = object[prop];
    }
    return acc;
  }, {});
}