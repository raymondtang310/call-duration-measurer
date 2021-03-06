/**
 * A `MeasurementResult` contains the duration and result of a function call or promise.
 */
export default interface MeasurementResult<T> {
  /**
   * The result of the function or promise.
   */
  data: T;
  /**
   * The time in milliseconds that it took for the function call or promise to complete.
   */
  duration: number;
}
