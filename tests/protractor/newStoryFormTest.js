var local = require('../../config/local');
var port = local.port;

describe('New story form test', function () {

  function StoryPage() {
    this.newPageTab = element(by.cssContainingText('.nav.nav-tabs a', 'New Page'));
    this.createPageTab = element(by.cssContainingText('#newPageForm button', 'Create Page'));
    this.pageButton = element(by.cssContainingText('.nav.nav-tabs a', 'Story Pages'));
    this.newPageTitleField = element.all(by.model('newPage.title')).first();
    this.newPageBodyField = element.all(by.model('newPage.body')).first();
    this.codeSuggestionField = element(by.css('.code-suggestion'));
  }

  StoryPage.prototype = {
    openNewPageTab: function () {
      this.newPageTab.click();
    },
    openCreatePageTab: function () {
      this.createPageTab.click();
    },
    open: function () {
      browser.get('http://localhost:' + port + '/stories/edit/15?test_mode=1');
    },
    saveStory: function () {
      this.pageButton.click();
    }, setNewPageFields: function (title, body) {
      this.newPageTitleField.sendKeys(title);
      if (arguments.length > 1) {
        this.newPageBodyField.sendKeys(body);
      }
    }
  };

    it('should add a story and list it in pages', function (done) {
      var page = new StoryPage();
      page.open();

      page.openNewPageTab();
      page.setNewPageFields('New Test Page Title', 'New Test Page Body');

      var code = element.all(by.model('newPage.code')).first().getAttribute('value');
      expect(code).toBe('newtestpagetitle');
      page.openCreatePageTab();
      page.saveStory();

      setTimeout(function () {
        expect(element.all(by.css('.story-pages .story-row')).last()
          .element(by.css('.story-cell.title')).getText())
          .toBe('New Test Page Title');
        setTimeout(done, 200);
      }, 2500);
    }, 100000);

    it('should reflect unique or non-unique codes', function (done) {
      var page = new StoryPage();
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

});
