var system = require('system');
var args = system.args;

var page = new WebPage();
page.open(args[1], function (status) {
  page.render(args[2]);
  phantom.exit();
});