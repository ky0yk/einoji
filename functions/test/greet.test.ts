import { greet } from '../src/greet';

test('greets a user', () => {
  expect(greet('Alice')).toBe('Hello, Alice!');
});
