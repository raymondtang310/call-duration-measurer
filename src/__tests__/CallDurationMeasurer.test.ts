import CallDurationMeasurer from '../CallDurationMeasurer';

describe('CallDurationMeasurer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('invoke', () => {
    describe('when there is a given scope', () => {
      it('should invoke the given function with the given arguments using the given scope', () => {
        const callDurationMeasurer = new CallDurationMeasurer();
        const scope = { func: jest.fn().mockName('scope.func') };
        const args = ['arg'];
        jest.spyOn(scope.func, 'apply').mockName('scope.func.apply');

        callDurationMeasurer.invoke(scope.func, scope, ...args);

        expect(scope.func.apply).toHaveBeenCalledTimes(1);
        expect(scope.func.apply).toHaveBeenCalledWith(scope, args);
      });
    });

    describe('when there is NOT a given scope', () => {
      it('should invoke the given function with the given arguments', () => {
        const callDurationMeasurer = new CallDurationMeasurer();
        const func = jest.fn().mockName('func');
        const args = ['arg'];

        callDurationMeasurer.invoke(func, null, ...args);

        expect(func).toHaveBeenCalledTimes(1);
        expect(func).toHaveBeenCalledWith(...args);
      });
    });

    describe('when the given function has finished executing', () => {
      describe('and the function returns a promise', () => {
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

      describe('and the function does NOT return a promise', () => {
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
  });

  describe('measurify', () => {
    it('should return a function that invokes the given function', () => {
      const callDurationMeasurer = new CallDurationMeasurer();
      const scope = { func: jest.fn().mockName('scope.func') };
      const args = ['arg'];
      jest.spyOn(callDurationMeasurer, 'invoke').mockName('callDurationMeasurer.invoke');

      callDurationMeasurer.measurify(scope.func, scope)(...args);

      expect(callDurationMeasurer.invoke).toHaveBeenCalledTimes(1);
      expect(callDurationMeasurer.invoke).toHaveBeenCalledWith(scope.func, scope, ...args);
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
});
