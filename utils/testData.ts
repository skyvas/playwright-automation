export const credentials = {
  validUser: {
    username: process.env.TEST_USERNAME || 'standard_user',
    password: process.env.TEST_PASSWORD || 'secret_sauce',
  },
  lockedOutUser: {
    username: 'locked_out_user',
    password: process.env.TEST_PASSWORD || 'secret_sauce',
  },
  problemUser: {
    username: 'problem_user',
    password: process.env.TEST_PASSWORD || 'secret_sauce',
  },
  invalidUser: {
    username: 'invalid_user',
    password: 'wrong_password',
  },
  // Backward compatibility alias
  username: process.env.TEST_USERNAME || 'standard_user',
  password: process.env.TEST_PASSWORD || 'secret_sauce',
};

export const products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTShirt: 'Sauce Labs Bolt T-Shirt',
};