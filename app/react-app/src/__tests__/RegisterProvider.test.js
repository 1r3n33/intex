import RegisterProvider from "components/RegisterProvider";

test("Check if provider name is valid", () => {
  const registerProvider = new RegisterProvider();

  const simple = registerProvider.isProviderNameValid("Valid123");
  expect(simple).toBe(true);

  const space = registerProvider.isProviderNameValid("not valid");
  expect(space).toBe(false);

  const empty = registerProvider.isProviderNameValid("");
  expect(empty).toBe(false);

  const special = registerProvider.isProviderNameValid("?!#");
  expect(special).toBe(false);
});
