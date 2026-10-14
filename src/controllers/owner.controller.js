export function createOwnerController() {
  return {
    loginPage(_req, res) {
      res.render('owner-login');
    },
  };
}
