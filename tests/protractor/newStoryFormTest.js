describe('new Story Form Test', function () {
  it('should add a story and list it in pages', function (done) {
    browser.get('http://localhost:1337/stories/edit/15?test_mode=1');

    element(by.cssContainingText('.nav.nav-tabs a', 'New Page')).click();
    element.all(by.model('newPage.title')).first().sendKeys('New Test Page Title');
    element.all(by.model('newPage.body')).first().sendKeys('New Test Page Body');
    var code = element.all(by.model('newPage.code')).first().getAttribute('value');
    expect(code).toBe('newtestpagetitle');
    element(by.cssContainingText('#newPageForm button', 'Create Page')).click();

    element(by.cssContainingText('.nav.nav-tabs a', 'Story Pages')).click();

    setTimeout(function () {
      expect(element.all(by.css('.story-pages .story-row')).last()
        .element(by.css('.story-cell.title')).getText())
        .toBe('New Test Page Title');
      setTimeout(done, 200);
    }, 2500);
  }, 100000);
});
