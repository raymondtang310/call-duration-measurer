import CallDurationMeasurer from '../CallDurationMeasurer';

describe('CallDurationMeasurer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('invoke', () => {
    describe('when there is a given scope', () => {
      it('should invoke the given function with the given arguments using the given scope', () => {
        const callDurationMeasurer = new CallDurationMeasurer();
        const scope: { func: jest.Mock<void, [string, number]> } = { func: jest.fn().mockName('scope.func') };
        const args: [string, number] = ['hello', 1];
        jest.spyOn(scope.func, 'apply').mockName('scope.func.apply');

        callDurationMeasurer.invoke(scope.func, scope, ...args);

        expect(scope.func.apply).toHaveBeenCalledTimes(1);
        expect(scope.func.apply).toHaveBeenCalledWith(scope, args);
      });

      describe('and the given function returns a promise', () => {
        it('should return a promise containing the resolved value of the promise returned by the function', async () => {
          const callDurationMeasurer = new CallDurationMeasurer();
          const resolvedValue = 'resolvedValue';
          const scope = {
            func: (): Promise<string> => Promise.resolve(resolvedValue),
          };

          const result = await callDurationMeasurer.invoke(scope.func, scope);

          expect(result).toStrictEqual(resolvedValue);
        });
      });

      describe('and the given function does NOT return a promise', () => {
        it('should return the result of the function', () => {
          const callDurationMeasurer = new CallDurationMeasurer();
          const funcResult = 'hello';
          const scope = {
            func: (): string => funcResult,
          };

          const result = callDurationMeasurer.invoke(scope.func, scope);

          expect(result).toStrictEqual(funcResult);
        });
      });
    });

    describe('when there is NOT a given scope', () => {
      it('should invoke the given function with the given arguments', () => {
        const callDurationMeasurer = new CallDurationMeasurer();
        const func: jest.Mock<void, [string, number]> = jest.fn().mockName('func');
        const args: [string, number] = ['hello', 1];

        callDurationMeasurer.invoke(func, null, ...args);

        expect(func).toHaveBeenCalledTimes(1);
        expect(func).toHaveBeenCalledWith(...args);
      });

      describe('and the given function returns a promise', () => {
        it('should return a promise containing the resolved value of the promise returned by the function', async () => {
          const callDurationMeasurer = new CallDurationMeasurer();
          const resolvedValue = 'resolvedValue';
          const func = (): Promise<string> => Promise.resolve(resolvedValue);

          const result = await callDurationMeasurer.invoke(func);

          expect(result).toStrictEqual(resolvedValue);
        });
      });

      describe('and the given function does NOT return a promise', () => {
        it('should return the result of the function', () => {
          const callDurationMeasurer = new CallDurationMeasurer();
          const funcResult = 'hello';
          const func = (): string => funcResult;

          const result = callDurationMeasurer.invoke(func);

          expect(result).toStrictEqual(funcResult);
        });
      });
    });
  });

  describe('measurify', () => {
    it('should return a function', () => {
      const callDurationMeasurer = new CallDurationMeasurer();
      const func = (): void => {};

      const result = callDurationMeasurer.measurify(func);

      expect(result).toStrictEqual(expect.any(Function));
    });

    describe('when the resulting function is invoked', () => {
      describe('and there is a given scope', () => {
        it('should invoke the given function with the given arguments using the given scope', () => {
          const callDurationMeasurer = new CallDurationMeasurer();
          const scope = { func: jest.fn().mockName('scope.func') };
          const args = ['arg'];
          jest.spyOn(scope.func, 'apply').mockName('scope.func.apply');

          callDurationMeasurer.measurify(scope.func, scope)(...args);

          expect(scope.func.apply).toHaveBeenCalledTimes(1);
          expect(scope.func.apply).toHaveBeenCalledWith(scope, args);
        });

        describe('and the given function returns a promise', () => {
          it('should return a promise containing the resolved value of the promise returned by the function', async () => {
            const callDurationMeasurer = new CallDurationMeasurer();
            const resolvedValue = 'resolvedValue';
            const scope = {
              func: (): Promise<string> => Promise.resolve(resolvedValue),
            };

            const result = await callDurationMeasurer.measurify(scope.func, scope)();

            expect(result).toStrictEqual(resolvedValue);
          });
        });

        describe('and the given function does NOT return a promise', () => {
          it('should return the result of the function', () => {
            const callDurationMeasurer = new CallDurationMeasurer();
            const funcResult = 'hello';
            const scope = {
              func: (): string => funcResult,
            };

            const result = callDurationMeasurer.measurify(scope.func, scope)();

            expect(result).toStrictEqual(funcResult);
          });
        });
      });

      describe('and there is NOT a given scope', () => {
        it('should invoke the given function with the given arguments', () => {
          const callDurationMeasurer = new CallDurationMeasurer();
          const func: jest.Mock<void, [string, number]> = jest.fn().mockName('func');
          const args: [string, number] = ['hello', 1];

          callDurationMeasurer.measurify(func)(...args);

          expect(func).toHaveBeenCalledTimes(1);
          expect(func).toHaveBeenCalledWith(...args);
        });

        describe('and the given function returns a promise', () => {
          it('should return a promise containing the resolved value of the promise returned by the function', async () => {
            const callDurationMeasurer = new CallDurationMeasurer();
            const resolvedValue = 'resolvedValue';
            const func = (): Promise<string> => Promise.resolve(resolvedValue);

            const result = await callDurationMeasurer.measurify(func)();

            expect(result).toStrictEqual(resolvedValue);
          });
        });

        describe('and the given function does NOT return a promise', () => {
          it('should return the result of the function', () => {
            const callDurationMeasurer = new CallDurationMeasurer();
            const funcResult = 'hello';
            const func = (): string => funcResult;

            const result = callDurationMeasurer.measurify(func)();

            expect(result).toStrictEqual(funcResult);
          });
        });
      });
    });
  });

  describe('getCallDurations', () => {
    describe('when 0 calls have been invoked', () => {
      it('should return an empty array', () => {
        const callDurationMeasurer = new CallDurationMeasurer();

        const result = callDurationMeasurer.getCallDurations();

        expect(result).toStrictEqual([]);
      });
    });

    describe('when 1 call has been invoked', () => {
      it('should return an array containing the call duration for that call', () => {
        const callDurationMeasurer = new CallDurationMeasurer();
        const func = (): void => {};
        const mockStartTime = new Date(0);
        const mockEndTime = new Date(100);
        const dateSpy = jest
          .spyOn(global, 'Date')
          .mockImplementationOnce(() => (mockStartTime as unknown) as string)
          .mockImplementationOnce(() => (mockEndTime as unknown) as string);

        callDurationMeasurer.invoke(func);
        const result = callDurationMeasurer.getCallDurations();

        expect(result).toStrictEqual([
          {
            name: 'func',
            duration: 100,
          },
        ]);

        dateSpy.mockRestore();
      });
    });

    describe('when multiple calls have been invoked', () => {
      it('should return an array containing the call durations for every call', () => {
        const callDurationMeasurer = new CallDurationMeasurer();
        const func1 = (): void => {};
        const func2 = (): void => {};
        const mockFunc1StartTime = new Date(0);
        const mockFunc1EndTime = new Date(100);
        const mockFunc2StartTime = new Date(100);
        const mockFunc2EndTime = new Date(300);
        const dateSpy = jest
          .spyOn(global, 'Date')
          .mockImplementationOnce(() => (mockFunc1StartTime as unknown) as string)
          .mockImplementationOnce(() => (mockFunc1EndTime as unknown) as string)
          .mockImplementationOnce(() => (mockFunc2StartTime as unknown) as string)
          .mockImplementationOnce(() => (mockFunc2EndTime as unknown) as string);

        callDurationMeasurer.invoke(func1);
        callDurationMeasurer.measurify(func2)();
        const result = callDurationMeasurer.getCallDurations();

        expect(result).toStrictEqual([
          {
            name: 'func1',
            duration: 100,
          },
          {
            name: 'func2',
            duration: 200,
          },
        ]);

        dateSpy.mockRestore();
      });
    });
  });

  describe('clearCallDurations', () => {
    let callDurationMeasurer: CallDurationMeasurer;
    let dateSpy: jest.SpyInstance<string, []>;

    beforeEach(() => {
      callDurationMeasurer = new CallDurationMeasurer();
      const func1 = (): void => {};
      const func2 = (): void => {};
      const mockFunc1StartTime = new Date(0);
      const mockFunc1EndTime = new Date(100);
      const mockFunc2StartTime = new Date(100);
      const mockFunc2EndTime = new Date(300);
      dateSpy = jest
        .spyOn(global, 'Date')
        .mockImplementationOnce(() => (mockFunc1StartTime as unknown) as string)
        .mockImplementationOnce(() => (mockFunc1EndTime as unknown) as string)
        .mockImplementationOnce(() => (mockFunc2StartTime as unknown) as string)
        .mockImplementationOnce(() => (mockFunc2EndTime as unknown) as string);

      callDurationMeasurer.invoke(func1);
      callDurationMeasurer.measurify(func2)();
    });

    it('should remove all call durations', () => {
      callDurationMeasurer.clearCallDurations();
      const result = callDurationMeasurer.getCallDurations();

      expect(result).toStrictEqual([]);

      dateSpy.mockRestore();
    });

    it('should return an array containing all call durations that were removed', () => {
      const result = callDurationMeasurer.clearCallDurations();

      expect(result).toStrictEqual([
        {
          name: 'func1',
          duration: 100,
        },
        {
          name: 'func2',
          duration: 200,
        },
      ]);

      dateSpy.mockRestore();
    });
  });

  describe('invokeWithOptions', () => {
    describe('when options are given', () => {
      describe('and there is a given scope', () => {
        describe('and there are given arguments', () => {
          it('should invoke the given function with the given arguments using the given scope', () => {
            const callDurationMeasurer = new CallDurationMeasurer();
            const scope: { func: jest.Mock<void, [string, number]> } = { func: jest.fn().mockName('scope.func') };
            const args: [string, number] = ['hello', 1];
            jest.spyOn(scope.func, 'apply').mockName('scope.func.apply');

            callDurationMeasurer.invokeWithOptions(scope.func, { scope, args });

            expect(scope.func.apply).toHaveBeenCalledTimes(1);
            expect(scope.func.apply).toHaveBeenCalledWith(scope, args);
          });
        });

        describe('and there are NOT given arguments', () => {
          it('should invoke the given function without any arguments using the given scope', () => {
            const callDurationMeasurer = new CallDurationMeasurer();
            const scope = { func: jest.fn().mockName('scope.func') };
            jest.spyOn(scope.func, 'apply').mockName('scope.func.apply');

            callDurationMeasurer.invokeWithOptions(scope.func, { scope });

            expect(scope.func.apply).toHaveBeenCalledTimes(1);
            expect(scope.func.apply).toHaveBeenCalledWith(scope, []);
          });
        });

        describe('and the given function returns a promise', () => {
          it('should return a promise containing the resolved value of the promise returned by the function', async () => {
            const callDurationMeasurer = new CallDurationMeasurer();
            const resolvedValue = 'resolvedValue';
            const scope = {
              func: (): Promise<string> => Promise.resolve(resolvedValue),
            };

            const result = await callDurationMeasurer.invokeWithOptions(scope.func, { scope });

            expect(result).toStrictEqual(resolvedValue);
          });
        });

        describe('and the given function does NOT return a promise', () => {
          it('should return the result of the function', () => {
            const callDurationMeasurer = new CallDurationMeasurer();
            const funcResult = 'hello';
            const scope = {
              func: (): string => funcResult,
            };

            const result = callDurationMeasurer.invokeWithOptions(scope.func, { scope });

            expect(result).toStrictEqual(funcResult);
          });
        });
      });

      describe('and there is NOT a given scope', () => {
        describe('and there are given arguments', () => {
          it('should invoke the given function with the given arguments', () => {
            const callDurationMeasurer = new CallDurationMeasurer();
            const func: jest.Mock<void, [string, number]> = jest.fn().mockName('func');
            const args: [string, number] = ['hello', 1];

            callDurationMeasurer.invokeWithOptions(func, { args });

            expect(func).toHaveBeenCalledTimes(1);
            expect(func).toHaveBeenCalledWith(...args);
          });
        });

        describe('and there are NOT given arguments', () => {
          it('should invoke the given function without any arguments', () => {
            const callDurationMeasurer = new CallDurationMeasurer();
            const func = jest.fn().mockName('func');

            callDurationMeasurer.invokeWithOptions(func, {});

            expect(func).toHaveBeenCalledTimes(1);
            expect(func).toHaveBeenCalledWith();
          });
        });

        describe('and the given function returns a promise', () => {
          it('should return a promise containing the resolved value of the promise returned by the function', async () => {
            const callDurationMeasurer = new CallDurationMeasurer();
            const resolvedValue = 'resolvedValue';
            const func = (): Promise<string> => Promise.resolve(resolvedValue);

            const result = await callDurationMeasurer.invokeWithOptions(func, {});

            expect(result).toStrictEqual(resolvedValue);
          });
        });

        describe('and the given function does NOT return a promise', () => {
          it('should return the result of the function', () => {
            const callDurationMeasurer = new CallDurationMeasurer();
            const funcResult = 'hello';
            const func = (): string => funcResult;

            const result = callDurationMeasurer.invokeWithOptions(func, {});

            expect(result).toStrictEqual(funcResult);
          });
        });
      });

      describe('and there is a given name for the function call', () => {
        it('should record the call duration using the given name', () => {
          const callDurationMeasurer = new CallDurationMeasurer();
          const func = jest.fn().mockName('func');
          const functionCallName = 'functionCallName';

          callDurationMeasurer.invokeWithOptions(func, { functionCallName });
          const callDurations = callDurationMeasurer.getCallDurations();

          expect(callDurations[0].name).toStrictEqual(functionCallName);
        });
      });

      describe('and there is NOT a given name for the function call', () => {
        it('should record the call duration using the given function’s name', () => {
          const callDurationMeasurer = new CallDurationMeasurer();
          const func = jest.fn().mockName('func');

          callDurationMeasurer.invokeWithOptions(func, {});
          const callDurations = callDurationMeasurer.getCallDurations();

          expect(callDurations[0].name).toStrictEqual(func.name);
        });
      });
    });

    describe('when options are NOT given', () => {
      it('should invoke the given function without any arguments', () => {
        const callDurationMeasurer = new CallDurationMeasurer();
        const func = jest.fn().mockName('func');

        callDurationMeasurer.invokeWithOptions(func);

        expect(func).toHaveBeenCalledTimes(1);
        expect(func).toHaveBeenCalledWith();
      });

      it('should record the call duration using the given function’s name', () => {
        const callDurationMeasurer = new CallDurationMeasurer();
        const func = jest.fn().mockName('func');

        callDurationMeasurer.invokeWithOptions(func);
        const callDurations = callDurationMeasurer.getCallDurations();

        expect(callDurations[0].name).toStrictEqual(func.name);
      });

      describe('and the given function returns a promise', () => {
        it('should return a promise containing the resolved value of the promise returned by the function', async () => {
          const callDurationMeasurer = new CallDurationMeasurer();
          const resolvedValue = 'resolvedValue';
          const func = (): Promise<string> => Promise.resolve(resolvedValue);

          const result = await callDurationMeasurer.invokeWithOptions(func);

          expect(result).toStrictEqual(resolvedValue);
        });
      });

      describe('and the given function does NOT return a promise', () => {
        it('should return the result of the function', () => {
          const callDurationMeasurer = new CallDurationMeasurer();
          const funcResult = 'hello';
          const func = (): string => funcResult;

          const result = callDurationMeasurer.invokeWithOptions(func);

          expect(result).toStrictEqual(funcResult);
        });
      });
    });
  });
});
