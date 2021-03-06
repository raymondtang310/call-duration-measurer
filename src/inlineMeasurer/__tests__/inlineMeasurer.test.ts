import * as inlineMeasurer from '../inlineMeasurer';

describe('inLineMeasurer', () => {
  const mockStartTime = new Date(0);
  const mockEndTime = new Date(100);
  const mockDuration = mockEndTime.valueOf() - mockStartTime.valueOf();

  beforeEach(() => {
    jest
      .spyOn(global, 'Date')
      .mockImplementationOnce(() => (mockStartTime as unknown) as string)
      .mockImplementationOnce(() => (mockEndTime as unknown) as string);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('invoke', () => {
    describe('when there is a given scope', () => {
      it('should invoke the given function with the given arguments using the given scope', () => {
        const scope = { func: jest.fn().mockName('scope.func') };
        const args = ['arg'];
        jest.spyOn(scope.func, 'apply').mockName('scope.func.apply');

        inlineMeasurer.invoke(scope.func, scope, ...args);

        expect(scope.func.apply).toHaveBeenCalledTimes(1);
        expect(scope.func.apply).toHaveBeenCalledWith(scope, args);
      });

      describe('and the given function returns a promise', () => {
        it('should return a promise containing an object that contains the duration of the call and the resolved value of the promise returned by the function', async () => {
          const resolvedValue = 'resolvedValue';
          const scope = {
            func: (): Promise<string> => Promise.resolve(resolvedValue),
          };

          const result = await inlineMeasurer.invoke(scope.func, scope);

          expect(result).toStrictEqual({ data: resolvedValue, duration: mockDuration });
        });
      });

      describe('and the given function does NOT return a promise', () => {
        it('should return an object that contains the duration of the call and the result of the function', () => {
          const funcResult = 'hello';
          const scope = {
            func: (): string => funcResult,
          };

          const result = inlineMeasurer.invoke(scope.func, scope);

          expect(result).toStrictEqual({ data: funcResult, duration: mockDuration });
        });
      });
    });

    describe('when there is NOT a given scope', () => {
      it('should invoke the given function with the given arguments', () => {
        const func = jest.fn().mockName('func');
        const args = ['arg'];

        inlineMeasurer.invoke(func, null, ...args);

        expect(func).toHaveBeenCalledTimes(1);
        expect(func).toHaveBeenCalledWith(...args);
      });

      describe('and the given function returns a promise', () => {
        it('should return a promise containing an object that contains the duration of the call and the resolved value of the promise returned by the function', async () => {
          const resolvedValue = 'resolvedValue';
          const func = (): Promise<string> => Promise.resolve(resolvedValue);

          const result = await inlineMeasurer.invoke(func);

          expect(result).toStrictEqual({ data: resolvedValue, duration: mockDuration });
        });
      });

      describe('and the given function does NOT return a promise', () => {
        it('should return an object that contains the duration of the call and the result of the function', () => {
          const funcResult = 'hello';
          const func = (): string => funcResult;

          const result = inlineMeasurer.invoke(func);

          expect(result).toStrictEqual({ data: funcResult, duration: mockDuration });
        });
      });
    });
  });

  describe('measurify', () => {
    it('should return a function', () => {
      const func = (): void => {};

      const result = inlineMeasurer.measurify(func);

      expect(result).toStrictEqual(expect.any(Function));
    });

    describe('when the resulting function is invoked', () => {
      describe('and there is a given scope', () => {
        it('should invoke the given function with the given arguments using the given scope', () => {
          const scope = { func: jest.fn().mockName('scope.func') };
          const args = ['arg'];
          jest.spyOn(scope.func, 'apply').mockName('scope.func.apply');

          inlineMeasurer.measurify(scope.func, scope)(...args);

          expect(scope.func.apply).toHaveBeenCalledTimes(1);
          expect(scope.func.apply).toHaveBeenCalledWith(scope, args);
        });

        describe('and the given function returns a promise', () => {
          it('should return a promise containing an object that contains the duration of the call and the resolved value of the promise returned by the function', async () => {
            const resolvedValue = 'resolvedValue';
            const scope = {
              func: (): Promise<string> => Promise.resolve(resolvedValue),
            };

            const result = await inlineMeasurer.measurify(scope.func, scope)();

            expect(result).toStrictEqual({ data: resolvedValue, duration: mockDuration });
          });
        });

        describe('and the given function does NOT return a promise', () => {
          it('should return an object that contains the duration of the call and the result of the function', () => {
            const funcResult = 'hello';
            const scope = {
              func: (): string => funcResult,
            };

            const result = inlineMeasurer.measurify(scope.func, scope)();

            expect(result).toStrictEqual({ data: funcResult, duration: mockDuration });
          });
        });
      });

      describe('and there is NOT a given scope', () => {
        it('should invoke the given function with the given arguments', () => {
          const func = jest.fn().mockName('func');
          const args = ['arg'];

          inlineMeasurer.measurify(func)(...args);

          expect(func).toHaveBeenCalledTimes(1);
          expect(func).toHaveBeenCalledWith(...args);
        });

        describe('and the given function returns a promise', () => {
          it('should return a promise containing an object that contains the duration of the call and the resolved value of the promise returned by the function', async () => {
            const resolvedValue = 'resolvedValue';
            const func = (): Promise<string> => Promise.resolve(resolvedValue);

            const result = await inlineMeasurer.measurify(func)();

            expect(result).toStrictEqual({ data: resolvedValue, duration: mockDuration });
          });
        });

        describe('and the given function does NOT return a promise', () => {
          it('should return an object that contains the duration of the call and the result of the function', () => {
            const funcResult = 'hello';
            const func = (): string => funcResult;

            const result = inlineMeasurer.measurify(func)();

            expect(result).toStrictEqual({ data: funcResult, duration: mockDuration });
          });
        });
      });
    });
  });

  describe('invokeWithOptions', () => {
    describe('when options are given', () => {
      describe('and there is a given scope', () => {
        describe('and there are given arguments', () => {
          it('should invoke the given function with the given arguments using the given scope', () => {
            const scope = { func: jest.fn().mockName('scope.func') };
            const args = ['arg'];
            jest.spyOn(scope.func, 'apply').mockName('scope.func.apply');

            inlineMeasurer.invokeWithOptions(scope.func, { scope, args });

            expect(scope.func.apply).toHaveBeenCalledTimes(1);
            expect(scope.func.apply).toHaveBeenCalledWith(scope, args);
          });
        });

        describe('and there are NOT given arguments', () => {
          it('should invoke the given function without any arguments using the given scope', () => {
            const scope = { func: jest.fn().mockName('scope.func') };
            jest.spyOn(scope.func, 'apply').mockName('scope.func.apply');

            inlineMeasurer.invokeWithOptions(scope.func, { scope });

            expect(scope.func.apply).toHaveBeenCalledTimes(1);
            expect(scope.func.apply).toHaveBeenCalledWith(scope, []);
          });
        });

        describe('and the given function returns a promise', () => {
          it('should return a promise containing an object that contains the duration of the call and the resolved value of the promise returned by the function', async () => {
            const resolvedValue = 'resolvedValue';
            const scope = {
              func: (): Promise<string> => Promise.resolve(resolvedValue),
            };

            const result = await inlineMeasurer.invokeWithOptions(scope.func, { scope });

            expect(result).toStrictEqual({ data: resolvedValue, duration: mockDuration });
          });
        });

        describe('and the given function does NOT return a promise', () => {
          it('should return an object that contains the duration of the call and the result of the function', () => {
            const funcResult = 'hello';
            const scope = {
              func: (): string => funcResult,
            };

            const result = inlineMeasurer.invokeWithOptions(scope.func, { scope });

            expect(result).toStrictEqual({ data: funcResult, duration: mockDuration });
          });
        });
      });

      describe('and there is NOT a given scope', () => {
        describe('and there are given arguments', () => {
          it('should invoke the given function with the given arguments', () => {
            const func = jest.fn().mockName('func');
            const args = ['arg'];

            inlineMeasurer.invokeWithOptions(func, { args });

            expect(func).toHaveBeenCalledTimes(1);
            expect(func).toHaveBeenCalledWith(...args);
          });
        });

        describe('and there are NOT given arguments', () => {
          it('should invoke the given function without any arguments', () => {
            const func = jest.fn().mockName('func');

            inlineMeasurer.invokeWithOptions(func, {});

            expect(func).toHaveBeenCalledTimes(1);
            expect(func).toHaveBeenCalledWith();
          });
        });

        describe('and the given function returns a promise', () => {
          it('should return a promise containing an object that contains the duration of the call and the resolved value of the promise returned by the function', async () => {
            const resolvedValue = 'resolvedValue';
            const func = (): Promise<string> => Promise.resolve(resolvedValue);

            const result = await inlineMeasurer.invokeWithOptions(func, {});

            expect(result).toStrictEqual({ data: resolvedValue, duration: mockDuration });
          });
        });

        describe('and the given function does NOT return a promise', () => {
          it('should return an object that contains the duration of the call and the result of the function', () => {
            const funcResult = 'hello';
            const func = (): string => funcResult;

            const result = inlineMeasurer.invokeWithOptions(func, {});

            expect(result).toStrictEqual({ data: funcResult, duration: mockDuration });
          });
        });
      });
    });

    describe('when options are NOT given', () => {
      it('should invoke the given function without any arguments', () => {
        const func = jest.fn().mockName('func');

        inlineMeasurer.invokeWithOptions(func);

        expect(func).toHaveBeenCalledTimes(1);
        expect(func).toHaveBeenCalledWith();
      });

      describe('and the given function returns a promise', () => {
        it('should return a promise containing an object that contains the duration of the call and the resolved value of the promise returned by the function', async () => {
          const resolvedValue = 'resolvedValue';
          const func = (): Promise<string> => Promise.resolve(resolvedValue);

          const result = await inlineMeasurer.invokeWithOptions(func);

          expect(result).toStrictEqual({ data: resolvedValue, duration: mockDuration });
        });
      });

      describe('and the given function does NOT return a promise', () => {
        it('should return an object that contains the duration of the call and the result of the function', () => {
          const funcResult = 'hello';
          const func = (): string => funcResult;

          const result = inlineMeasurer.invokeWithOptions(func);

          expect(result).toStrictEqual({ data: funcResult, duration: mockDuration });
        });
      });
    });
  });
});
