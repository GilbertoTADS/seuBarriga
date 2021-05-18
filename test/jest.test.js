test('Devo conhecer as principais assertivas do jest', () => {
  let num = null;
  expect(num).toBeNull();
  num = 10;
  expect(num).not.toBeNull();
  expect(num).toBe(10);
  expect(num).toEqual(10);
  expect(num).toBeGreaterThan(9);
  expect(num).toBeLessThan(11);
});
test('Devo saber trabalhar com objetos', () => {
  const obj = { name: 'John', mail: 'john@mail.com' };
  expect(obj).toHaveProperty('name');
  expect(obj).toHaveProperty('name', 'John');
  expect(obj.name).toBe('John');
  const obj2 = { name: 'John', mail: 'john@mail.com' };

  expect(obj).toEqual(obj2);
  expect(obj).toBe(obj);
});
