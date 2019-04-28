const getFirstName = (name) => {
  const firstName = name.split('')[0];
  return firstName;
};

const isValidPassword = (password) => {
  return password.length >= 8 && !password.toLowerCase().includes('password');
};


export { getFirstName, isValidPassword }