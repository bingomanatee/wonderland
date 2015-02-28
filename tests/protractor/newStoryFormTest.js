var local = require('../../config/local');
var port = local.port;

describe('New story form test', function () {

  var StoryPage = require('./page/StoryPage');

  xit('should add a story and list it in pages', function (done) {
    var page = new StoryPage(port);
    page.open();

    page.openNewPageTab();
    page.setNewPageFields('New Test Page Title', 'New Test Page Body');

    var code = element.all(by.model('newPage.code')).first().getAttribute('value');
    expect(code).toBe('newtestpagetitle');
    page.createPage();
    page.openStoryPagesTab();

    setTimeout(function () {
      expect(page.storyListRows.last()
        .element(by.css('td.title')).getText())
        .toBe('New Test Page Title');
      setTimeout(done, 200);
    }, 2500);
  }, 100000);

  it('should add a story with jumps and list it in pages', function (done) {
    var page = new StoryPage(port);
    page.open();

    page.openNewPageTab();
    page.setNewPageFields('New Test Page Title', 'A very long New Test Page Body');
    page.createNewJump('back to test page 1', 'testpage1');
    page.createJumpButton.click();

    browser.pause();
    setTimeout(function(){
      page.createPage();
      page.openStoryPagesTab();

      expect(page.storyListRows.last()
        .element(by.css('td.title')).getText())
        .toBe('New Test Page Title');
      setTimeout(done, 10000);
    }, 50000);

  }, 100000);

  xit('should reflect unique or non-unique codes', function (done) {
    var page = new StoryPage(port);
    page.open();

    page.openNewPageTab();
    page.setNewPageFields('Test Page 1');
    expect(page.codeSuggestionField.isDisplayed()).toBe(false);
    setTimeout(function () {
      expect(page.codeSuggestionField.isDisplayed()).toBe(true);
      expect(page.codeSuggestionField.getText()).toBe('Use Code "testpage1_1"');
      setTimeout(done, 200);
    }, 3500);
  }, 100000);

})
;
