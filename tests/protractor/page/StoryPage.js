function StoryPage(port) {
  this.port = port;
  this.root = element(by.css('#newPageForm'));

  this.newPageTab = element(by.cssContainingText('.nav.nav-tabs a', 'New Page'));
  this.storyPageTab = element(by.cssContainingText('.nav.nav-tabs a', 'Story Pages'));

  this.createPageButton = this.root.element(by.css('.create-page'));
  this.newJumpButton = element(by.css('.add-jump-button'));

  this.newPageTitleField = this.root.all(by.model('newPage.title')).first();
  this.newPageBodyField = this.root.all(by.model('newPage.body')).first();
  this.codeSuggestionField = this.root.element(by.css('.code-suggestion'));

  this.addJumpDialog = element(by.css('.add-jump-dialog'));
  this.jumpPrompt = this.addJumpDialog.element(by.model('newJump.prompt'));
  this.jumpPageCode = this.addJumpDialog.element(by.model('newJump.toPageCode'));
  this.createJumpButton = this.addJumpDialog.element(by.css('.save-jump'));

  this.storyListRows = element.all(by.css('.story-list tbody tr'));

  this.newJumpsList = this.root.all('.new_jumps')
}

StoryPage.prototype = {
  openNewPageTab: function () {
    this.newPageTab.click();
  },
  createPage: function () {
    this.createPageButton.click();
  },
  createNewJump: function (prompt, pageCode) {
    this.newJumpButton.click();
    this.jumpPrompt.sendKeys(prompt);
    this.jumpPageCode.sendKeys(pageCode);
  },
  open: function () {
    browser.get('http://localhost:' + this.port + '/stories/edit/15?test_mode=1');
  },
  openStoryPagesTab: function () {
    this.storyPageTab.click();
  }, setNewPageFields: function (title, body) {
    this.newPageTitleField.sendKeys(title);
    if (arguments.length > 1) {
      this.newPageBodyField.sendKeys(body);
    }
  }
};

module.exports = StoryPage;
