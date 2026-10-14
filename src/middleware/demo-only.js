export function createDemoOnly({ demo }) {
  return (_req, res, next) => {
    if (!demo) return res.status(404).render('error', { message: 'Trang thử giao diện không khả dụng.' });
    next();
  };
}
