/**
 * Check input entries
 */

const checkReq = async (req) => {
  if (req.body.email !== undefined) {
    req.checkBody('email', 'error.notEmail').isEmail();
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
  }
  if (req.body.login !== undefined) {
    req.checkBody('login', 'error.noLoginLength').len({ min: 4, max: 12 });
  }
  if (req.body.password !== undefined) {
    req.checkBody('password', 'error.noBlankPassword').notEmpty();
  }
  if (req.body.newPassword !== undefined) {
    req.checkBody('newPassword', 'error.noPasswordLength').len({ min: 4, max: 12 });
    req.checkBody('newPassword', 'error.noPasswordComplex')
      .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/);
  }
  if (req.body.confirmPassword !== undefined) {
    req.checkBody('confirmPassword', 'error.noPasswordMatch').equals(req.body.newPassword);
  }
  if (req.body.firstName !== undefined) {
    req.checkBody('firstName', 'error.noFirstNameLength').len({ max: 20 });
  }
  if (req.body.lastName !== undefined) {
    req.checkBody('lastName', 'error.noLastNameLength').len({ max: 20 });
  }

  const validationObj = await req.getValidationResult();
  const error = validationObj.array();

  return (error.length) ? error : [];
};

module.exports = checkReq;
