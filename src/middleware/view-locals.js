export function createViewLocals({ demo }) {
  return (_req, res, next) => {
    res.locals.demo = demo;
    res.locals.currency = value => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    next();
  };
}
