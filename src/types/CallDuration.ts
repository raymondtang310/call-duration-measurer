/**
 * A `CallDuration` contains data for a completed function call, including a name referring to the function call and the duration of the call.
 */
export default interface CallDuration {
  /**
   * The name referring to the function call.
   */
  name: string;
  /**
   * The time in milliseconds that it took for the call to complete.
   */
  duration: number;
}
