import InvokeOptions from 'types/InvokeOptions';

/**
 * Options used to configure how a given function is called and/or recorded.
 */
export default interface CallDurationRecordingOptions extends InvokeOptions {
  /**
   * Custom `name` that is used when recording the {@link CallDuration} for a given function.
   */
  functionCallName?: string;
}
