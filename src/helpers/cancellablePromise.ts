export class CancellablePromise<T = unknown> extends Promise<T> {
  constructor(
    executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void
  ) {
    let _onCancel = () => {};
    super((rs, rj) => {
      executor(rs, rj);
      _onCancel = rj;
    });

    this.cancel = _onCancel;
  }

  public cancel: () => void;
}
