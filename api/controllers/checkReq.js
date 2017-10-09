/**
 * Check input entries
 */

const checkReq = async (req) => {

  if (req.body.email !== undefined) {
    req.checkBody('email', 'Email is not valid').isEmail();
    req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
  }
  if (req.body.password !== undefined) {
    req.checkBody('password', 'Password cannot be blank').notEmpty();
  }
  if (req.body.newPassword !== undefined) {
    req.checkBody('newPassword', 'Password must be between 4 and 12 characters').len({ min: 4, max: 12 });
    req.checkBody('newPassword', 'Password must contain at least one uppercase, one lowercase and one digit.')
      .matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/);
  }
  if (req.body.confirmPassword !== undefined) {
    req.checkBody('confirmPassword', 'Passwords do not match').equals(req.body.newPassword);
  }
  if (req.body.firstName !== undefined) {
    req.checkBody('firstName', 'First name can\'t be more than 20 letters long').len({ max: 20 });
  }
  if (req.body.lastName !== undefined) {
    req.checkBody('lastName', 'Last name can\'t be more than 20 letters long').len({ max: 20 });
  }

  const validationObj = await req.getValidationResult();
  const error = validationObj.array();

  return (error.length) ? error : [];

};

export default checkReq;
