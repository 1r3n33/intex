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

test("Get error message from Rpc exception", () => {
  const registerProvider = new RegisterProvider();

  const workingException = {
    message:
      'Head{"value":{"data":{"message":"VM Exception while processing transaction: revert Error message"}}}Tail',
  };
  const errorMessage = registerProvider.getErrorMessageFromRpcException(
    workingException
  );
  expect(errorMessage).toEqual("Error message");

  const badException = {
    message: "",
  };
  const unknownError = registerProvider.getErrorMessageFromRpcException(
    badException
  );
  expect(unknownError).toEqual("Unknown error");
});
