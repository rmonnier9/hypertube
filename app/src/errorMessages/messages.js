import { defineMessages } from 'react-intl';

export const errorValue = defineMessages({
  incorrectPassword: {
    id: 'error.incorrectPassword',
    defaultMessage: 'Incorrect password.',
  },
  noBlankPassword: {
    id: 'error.noBlankPassword',
    defaultMessage: 'Password cannot be blank.',
  },
  noPasswordLength: {
    id: 'error.noPasswordLength',
    defaultMessage: 'Password must be between 4 and 12 characters.',
  },
  noPasswordComplex: {
    id: 'error.noPasswordComplex',
    defaultMessage: 'Password must contain at least one uppercase, one lowercase and one digit.',
  },
  noPasswordMatch: {
    id: 'error.noPasswordMatch',
    defaultMessage: 'Passwords do not match.',
  },
  noFirstNameLength: {
    id: 'error.noFirstNameLength',
    defaultMessage: 'First name can\'t be more than 20 letters long.',
  },
  noLastNameLength: {
    id: 'error.noLastNameLength',
    defaultMessage: 'Last name can\'t be more than 20 letters long.',
  },
  noLoginLength: {
    id: 'error.noLoginLength',
    defaultMessage: 'Login must be between 4 and 12 characters.',
  },
  notEmail: {
    id: 'error.notEmail',
    defaultMessage: 'Email is not valid.',
  },
  emailUsed: {
    id: 'error.emailUsed',
    defaultMessage: 'The email address you have entered is already associated with an account.',
  },
  noEmailUsed: {
    id: 'error.noEmailUsed',
    defaultMessage: 'There is no account with this email.',
  },
  noPassword: {
    id: 'error.noPassword',
    defaultMessage: 'You have no password set up with us. Please connect with one of the websites below and set up your password when connected, or click on "Forgot password?"',
  },
  noUserName: {
    id: 'error.noUserName',
    defaultMessage: 'No account with that name.',
  },
  noUserProfile: {
    id: 'error.noUserProfile',
    defaultMessage: 'This user profile cannot be found or does not exist.',
  },
  imageOnly: {
    id: 'error.imageOnly',
    defaultMessage: 'Please upload an image only.',
  },
  noMovie: {
    id: 'error.noMovie',
    defaultMessage: 'This movie cannot be found or does not exist.',
  },
  noToken: {
    id: 'error.noToken',
    defaultMessage: 'Password reset token is invalid or has expired.',
  },
  invalid: {
    id: 'error.invalid',
    defaultMessage: 'Invalid action requested.',
  },
  dbDiffFileSystem: {
    id: 'error.dbDiffFileSystem',
    defaultMessage: 'File system doesnt match database.',
  },
});

export default errorValue;
