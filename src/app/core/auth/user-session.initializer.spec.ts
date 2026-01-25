import { Component } from '@angular/core';
import { of, Subject, throwError } from 'rxjs';
import { render } from '@testing-library/angular';
import { UserSessionService } from '@app/core/auth';
import { provideUserSessionInitializer } from './user-session.initializer';

@Component({
  standalone: true,
  template: '',
})
class HostComponent {}

function renderHostComponent(authorize: ReturnType<typeof vi.fn>) {
  return render(HostComponent, {
    providers: [
      provideUserSessionInitializer(),
      {
        provide: UserSessionService,
        useValue: { authorize },
      },
    ],
  });
}

describe('provideUserSessionInitializer', () => {
  it('calls authorize on application bootstrap', async () => {
    const authorize = vi.fn().mockReturnValue(of('jwt-token'));

    await renderHostComponent(authorize);

    expect(authorize).toHaveBeenCalledTimes(1);
  });

  it('does not fail bootstrap if authorize errors', async () => {
    const authorize = vi.fn().mockReturnValue(throwError(() => new Error('401')));

    await expect(renderHostComponent(authorize)).resolves.not.toThrow();

    expect(authorize).toHaveBeenCalledTimes(1);
  });

  it('blocks bootstrap until authorize resolves', async () => {
    // The current initializer blocks bootstrap by design because Angular blocks bootstrap if an app
    // initializer returns a Promise until that Promise settles. This is just a regression guard
    const authorizeSubject = new Subject<string>();
    const authorize = vi.fn().mockReturnValue(authorizeSubject.asObservable());

    let completed = false;

    const promise = renderHostComponent(authorize).then(() => {
      completed = true;
    });

    // Yield control to allow the initializer to subscribe to the observable
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Bootstrap must still be blocked (initializer is waiting for authorize to emit)
    expect(completed).toBe(false);

    // Finish authorization
    authorizeSubject.next('token');
    authorizeSubject.complete();
    await promise;

    expect(completed).toBe(true);
    expect(authorize).toHaveBeenCalledTimes(1);
  });
});
