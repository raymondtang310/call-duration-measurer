// Throw an error and break out of Jest tests if tests exist with unhandled promise rejections
if (!process.env.LISTENING_TO_UNHANDLED_REJECTION) {
  process.on('unhandledRejection', reason => {
    process.exitCode = 1;
    throw reason;
  });
  // Avoid memory leak by adding too many listeners
  process.env.LISTENING_TO_UNHANDLED_REJECTION = true;
}

beforeEach(() => {
  expect.hasAssertions();
});
