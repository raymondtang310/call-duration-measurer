/**
 * Options used to configure how a given function is called.
 */
export default interface InvokeOptions {
  /**
   * The value to use as `this` when calling a given function.
   */
  scope?: unknown;
  /**
   * Arguments to call a given function with.
   */
  args?: unknown[];
}
