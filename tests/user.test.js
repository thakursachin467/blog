import { getFirstName, isValidPassword } from '../Utils/User';

test('should return first name when given full name', () => {
  const firstName = getFirstName('Sachin Thakur');
  expect(firstName).toBe('Sachin');
});

test('should return first name when given fistName', () => {
  const firstName = getFirstName('Sachin');
  expect(firstName).toBe('Sachin');
})


test('should be a valid password', () => {
  const isValid = isValidPassword('helloworld');
  expect(isValid).toBe(true);
})


test('should reject a  password less the 8 characters', () => {
  const isValid = isValidPassword('hello');
  expect(isValid).toBe(false);
})

test('should reject a  password that is password', () => {
  const isValid = isValidPassword('passwordispassword');
  expect(isValid).toBe(false);
})



