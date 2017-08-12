import { Brp4ComponentPage } from './app.po';

describe('brp4-component App', () => {
  let page: Brp4ComponentPage;

  beforeEach(() => {
    page = new Brp4ComponentPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
