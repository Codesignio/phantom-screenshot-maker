var express = require('express');
var bodyParser = require('body-parser');
var phantom = require('phantom');

var app = express();
app.use(bodyParser.json());
var public_dir = __dirname + '/public';
app.use(express.static(public_dir));

app.post('/process_url', function (req, res) {
  var url_to_process = req.body.url;
  if (!url_to_process) {
    res.status(404).send({error: "please send correct url"})
  }
  phantom.create(function(ph){
    ph.createPage(function(page){
      page.open(url_to_process, function(status){
        if (status == "success") {
          var image_file_name = url_to_process.replace(/\W/g, '_') + "-" + (+new Date()) + ".png";
          var image_path = public_dir + "/" + image_file_name;
          page.render(image_path, function(){
            res.send({url: image_path, name: image_file_name});
          });
        } else {
          res.status(500).send({error: "internal error"})
        }
        page.close();
        ph.exit();
      });
    });
  });

});

var server = app.listen(3000, function() {
  console.log('Listening..');
});