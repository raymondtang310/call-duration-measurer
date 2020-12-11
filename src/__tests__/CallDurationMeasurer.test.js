import CallDurationMeasurer from '../CallDurationMeasurer';

describe('CallDurationMeasurer', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('invoke', () => {
    describe('when there is a given scope', () => {
      it('should invoke the given callback with the given arguments using the given scope', () => {
        const callDurationMeasurer = new CallDurationMeasurer();
        const scope = { callback: jest.fn().mockName('callback') };
        const args = ['arg'];

        scope.callback.apply = jest.fn().mockName('callback.apply');

        callDurationMeasurer.invoke(scope.callback, scope, ...args);

        expect(scope.callback.apply).toHaveBeenCalledTimes(1);
        expect(scope.callback.apply).toHaveBeenCalledWith(scope, args);
      });
    });

    describe('when there is NOT a given scope', () => {
      it('should invoke the given callback with the given arguments', () => {
        const callDurationMeasurer = new CallDurationMeasurer();
        const callback = jest.fn().mockName('callback');
        const args = ['arg'];

        callDurationMeasurer.invoke(callback, null, ...args);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(...args);
      });
    });

    describe('when the given callback has finished executing', () => {
      describe('and the callback returns a promise', () => {
        it('should return a promise containing the resolved value of the promise returned by the callback', async () => {
          const callDurationMeasurer = new CallDurationMeasurer();
          const resolvedValue = 'resolvedValue';
          const scope = {
            // We need to use mockReturnValue here with a resolved promise rather than mockResolvedValue due
            // to the "instanceof Promise" check used in the implementation.
            callback: jest.fn().mockName('callback').mockReturnValue(Promise.resolve(resolvedValue)),
          };

          const result = await callDurationMeasurer.invoke(scope.callback, scope);

          expect(result).toEqual(resolvedValue);
        });
      });

      describe('and the callback does NOT return a promise', () => {
        it('should return the result of the callback', () => {
          const callDurationMeasurer = new CallDurationMeasurer();
          const callbackReturnValue = 'hello';
          const scope = {
            callback: jest.fn().mockName('callback').mockReturnValue(callbackReturnValue),
          };

          const result = callDurationMeasurer.invoke(scope.callback, scope);

          expect(result).toEqual(callbackReturnValue);
        });
      });
    });
  });

  describe('getCallDurations', () => {
    describe('when 0 calls have been invoked', () => {
      it('should return an empty array', () => {
        const callDurationMeasurer = new CallDurationMeasurer();

        const result = callDurationMeasurer.getCallDurations();

        expect(result).toEqual([]);
      });
    });

    describe('when 1 call has been invoked', () => {
      it('should return an array containing the call duration for that call', () => {
        const callDurationMeasurer = new CallDurationMeasurer();
        const callback = () => {};
        const mockStartTime = new Date(0);
        const mockEndTime = new Date(100);
        const dateSpy = jest
          .spyOn(global, 'Date')
          .mockImplementationOnce(() => mockStartTime)
          .mockImplementationOnce(() => mockEndTime);

        callDurationMeasurer.invoke(callback);
        const result = callDurationMeasurer.getCallDurations();

        expect(result).toEqual([
          {
            name: 'callback',
            duration: 100,
          },
        ]);

        dateSpy.mockRestore();
      });
    });

    describe('when multiple calls have been invoked', () => {
      it('should return an array containing the call durations for every call', () => {
        const callDurationMeasurer = new CallDurationMeasurer();
        const callback1 = () => {};
        const callback2 = () => {};
        const mockCallback1StartTime = new Date(0);
        const mockCallback1EndTime = new Date(100);
        const mockCallback2StartTime = new Date(100);
        const mockCallback2EndTime = new Date(300);
        const dateSpy = jest
          .spyOn(global, 'Date')
          .mockImplementationOnce(() => mockCallback1StartTime)
          .mockImplementationOnce(() => mockCallback1EndTime)
          .mockImplementationOnce(() => mockCallback2StartTime)
          .mockImplementationOnce(() => mockCallback2EndTime);

        callDurationMeasurer.invoke(callback1);
        callDurationMeasurer.invoke(callback2);
        const result = callDurationMeasurer.getCallDurations();

        expect(result).toEqual([
          {
            name: 'callback1',
            duration: 100,
          },
          {
            name: 'callback2',
            duration: 200,
          },
        ]);

        dateSpy.mockRestore();
      });
    });
  });
});
