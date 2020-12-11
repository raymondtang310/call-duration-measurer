import CallDurationMeasurer from '../CallDurationMeasurer';

describe('CallDurationMeasurer', () => {
  describe('placeholder', () => {
    it('should return "placeholder"', () => {
      const callDurationMeasurer = new CallDurationMeasurer();

      const result = callDurationMeasurer.placeholder();

      expect(result).toEqual('placeholder');
    });
  });
});
