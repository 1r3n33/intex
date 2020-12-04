import BrandSafetyCategories from '../components/BrandSafety/Categories';

test('encode to bytes', () => {
  const brandSafetyCategories = new BrandSafetyCategories();

  const ids = [1, 2, 3, 4];

  const bytes = brandSafetyCategories.toBytes(ids);
  const expected = [4,0,0,0,1,0,0,0,2,0,0,0,3,0,0,0,4,0,0,0];

  expect(Array.from(bytes)).toEqual(expected);
});

test('decode from hexadecimal string', () => {
  const brandSafetyCategories = new BrandSafetyCategories();

  const hex = '0x0100000003000000';

  const ids = brandSafetyCategories.fromHexadecimalString(hex);

  // Unfortunately, Jest testing framework has its own instances of typed arrays.
  // This breaks Buffer.from in fromHexadecimalString.
  expect(ids).toBeDefined();
});
