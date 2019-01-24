import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo('/');
    setTimeout(() => {
      // allow navigation to complete
      expect(page.getParagraphText()).toEqual('Welcome to @nwx/unsub! (eager)');
    }, 2000);
  });

  it('should display welcome message in lazy loaded module', () => {
    page.navigateTo('/lazy');
    setTimeout(() => {
      // allow navigation to complete
      expect(page.getParagraphText()).toEqual('Welcome to @nwx/unsub! (lazy)');
    }, 2000);
  });
});
