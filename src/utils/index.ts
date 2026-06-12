export const copy = (text: string, cb) => navigator.clipboard.writeText(text).then(cb);
