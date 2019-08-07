var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.locals.pretty = true;
app.set('view engine', 'jade');
app.set('views', './views');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extened: false}));

app.get('/topic/:id', function(req, res) {
    var topics = [
        'javascript si',
        'nodejs is',
        'Express is...'
    ];
    var output  = `
        <a href="/topic?id=0">JavaScript</a><br>
        <a href="/topic?id=1">Nodejs</a><br>
        <a href="/topic?id=2">Express</a><br><br>
        ${topics[req.query.id]}
    `
    var res_dat = req.params.id;
    res.send(output);
});
app.get('/form', function(req, res) {
    res.render('form');
})
app.get('/form_receiver', function(req, res) {
    var t = req.query.title;
    var d = req.query.description;
    res.send(t + ','+ d);
})
app.post('/form_receiver', function(req, res) {
    var t = req.body.title;
    var d = req.body.description;
    res.send(t + ','+ d);
  
})
app.get('/topic/:id/:mode', function(req, res) {
    res.send(req.params.id+','+req.params.mode);
});

app.get('/template', function(req, res) {
    res.render('temp', {time:Date(), title:'Jade'});
});

app.get('/route', function(req, res) {
    res.send('Hello Router, <img src="/ccc.png">')
});

app.get('/dynamic', function(req, res) {
    var lis = '';
    for(var i=0; i<5; i++) {
        lis = lis + '<li>coding</li>';
    }
    var time = Date();
    var output =  `
    <!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title></title>
    </head>
    <body>
        Hello Static!!
        <ul>
        ${lis}
        </ul>
        ${time}
    </body>
</html>
    `;
    res.send(output);

})

app.get('/', function(req, res) {
    res.send('Mdist Home Page');

});


app.listen(3300, function() {
    console.log('Connected 3300 port!');

});

