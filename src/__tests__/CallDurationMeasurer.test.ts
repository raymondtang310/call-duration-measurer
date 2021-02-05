import CallDurationMeasurer from '../CallDurationMeasurer';

describe('CallDurationMeasurer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('invoke', () => {
    describe('when there is a given scope', () => {
      it('should invoke the given function with the given arguments using the given scope', () => {
        const callDurationMeasurer = new CallDurationMeasurer();
        const scope = { fn: jest.fn().mockName('fn') };
        const args = ['arg'];
        jest.spyOn(scope.fn, 'apply').mockName('scope.fn.apply');

        callDurationMeasurer.invoke(scope.fn, scope, ...args);

        expect(scope.fn.apply).toHaveBeenCalledTimes(1);
        expect(scope.fn.apply).toHaveBeenCalledWith(scope, args);
      });
    });

    describe('when there is NOT a given scope', () => {
      it('should invoke the given function with the given arguments', () => {
        const callDurationMeasurer = new CallDurationMeasurer();
        const fn = jest.fn().mockName('fn');
        const args = ['arg'];

        callDurationMeasurer.invoke(fn, null, ...args);

        expect(fn).toHaveBeenCalledTimes(1);
        expect(fn).toHaveBeenCalledWith(...args);
      });
    });

    describe('when the given function has finished executing', () => {
      describe('and the function returns a promise', () => {
        it('should return a promise containing the resolved value of the promise returned by the function', async () => {
          const callDurationMeasurer = new CallDurationMeasurer();
          const resolvedValue = 'resolvedValue';
          const scope = {
            fn: (): Promise<string> => Promise.resolve(resolvedValue),
          };

          const result = await callDurationMeasurer.invoke(scope.fn, scope);

          expect(result).toStrictEqual(resolvedValue);
        });
      });

      describe('and the function does NOT return a promise', () => {
        it('should return the result of the function', () => {
          const callDurationMeasurer = new CallDurationMeasurer();
          const fnResult = 'hello';
          const scope = {
            fn: (): string => fnResult,
          };

          const result = callDurationMeasurer.invoke(scope.fn, scope);

          expect(result).toStrictEqual(fnResult);
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
        const fn = (): void => {};
        const mockStartTime = new Date(0);
        const mockEndTime = new Date(100);
        const dateSpy = jest
          .spyOn(global, 'Date')
          .mockImplementationOnce(() => (mockStartTime as unknown) as string)
          .mockImplementationOnce(() => (mockEndTime as unknown) as string);

        callDurationMeasurer.invoke(fn);
        const result = callDurationMeasurer.getCallDurations();

        expect(result).toStrictEqual([
          {
            name: 'fn',
            duration: 100,
          },
        ]);

        dateSpy.mockRestore();
      });
    });

    describe('when multiple calls have been invoked', () => {
      it('should return an array containing the call durations for every call', () => {
        const callDurationMeasurer = new CallDurationMeasurer();
        const fn1 = (): void => {};
        const fn2 = (): void => {};
        const mockFn1StartTime = new Date(0);
        const mockFn1EndTime = new Date(100);
        const mockFn2StartTime = new Date(100);
        const mockFn2EndTime = new Date(300);
        const dateSpy = jest
          .spyOn(global, 'Date')
          .mockImplementationOnce(() => (mockFn1StartTime as unknown) as string)
          .mockImplementationOnce(() => (mockFn1EndTime as unknown) as string)
          .mockImplementationOnce(() => (mockFn2StartTime as unknown) as string)
          .mockImplementationOnce(() => (mockFn2EndTime as unknown) as string);

        callDurationMeasurer.invoke(fn1);
        callDurationMeasurer.invoke(fn2);
        const result = callDurationMeasurer.getCallDurations();

        expect(result).toStrictEqual([
          {
            name: 'fn1',
            duration: 100,
          },
          {
            name: 'fn2',
            duration: 200,
          },
        ]);

        dateSpy.mockRestore();
      });
    });
  });
});
