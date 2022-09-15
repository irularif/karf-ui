export class CancellablePromise<T = unknown> extends Promise<T> {
  private onCancel = () => {};
  constructor(
    executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void
  ) {
    let _onCancel = () => {};
    super((rs, rj) => {
      executor(rs, rj);
      _onCancel = rj;
    });

    this.onCancel = _onCancel;
  }

  public cancel = () => {
    this.onCancel.bind(null, {
      canceled: true,
    });
  };
}
