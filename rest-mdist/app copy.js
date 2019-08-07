var express = require("express");
var bodyParser = require("body-parser");
var http = require("http");
var fs = require("fs");

var app = express();
//aws
var albumBucketName = "mtube-watchfolder";
var bucketRegion = "us-east-1";
const AWS = require("aws-sdk");
// Initialize the Amazon Cognito credentials provider
AWS.config.region = bucketRegion; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: "us-east-1:65b7ec88-579a-4a04-8647-c4c019703bc4"
});
var s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: {
    Bucket: albumBucketName
  }
});

app.locals.pretty = true;
app.set("view engine", "jade");
app.set("views", "./views_file");
app.use(bodyParser.urlencoded({ extened: false }));
app.use(express.static('public'));
app.locals.pretty = true;

//
//
//
app.get("/listfolder", function(req, res) {
  let lists = [];
  var bucket_media = "mtube-mediabucket";
  var bucket_watch = "mtube-watchfolder";
  s3.listObjectsV2(
    {
      Bucket: bucket_media
    },
    (err, data) => {
      if (err) {
        throw err;
      }
      let contents = data.Contents;
      contents.forEach(content => {
        lists.push(content.Key); // "ex) content.Key => assets/images/1.png"
      });
      console.log(lists);
    }
  );
});
//
// root
//
app.get("/", function(req, res) {
  var albumName = "inputs";
  var albumFilesKey = encodeURIComponent(albumName) + "/";
  var files = new Array();
  s3.listObjects(
    {
      Prefix: albumFilesKey
    },
    function(err, data) {
      if (err) {
        return alert("There was an error viewing your album: " + err.message);
      }
      // 'this' references the AWS.Response instance that represents the response
      var href = this.request.httpRequest.endpoint.href;
      var bucketUrl = href + albumBucketName + "/";
      //console.log("Category", data.Contents);

      var files_upload = data.Contents.map(function(file) {
        var fileKey = file.Key;
        var fileUrl = bucketUrl + encodeURIComponent(fileKey);
        console.log("fileUrl=" + fileUrl);
        files.push(fileUrl);
      });
    }
  );

  //var files = ["123", "324"];
  console.log(files);
  var data = ["nodejs", "dffdfdfdf"];
  var id = 1;
  res.render("home", { topics: files, title: id, description: data });
});
//
//
//
app.get("/mp4", function(req, res) {
    
    data = '<video id="video" controls width="320" height="240" >'
     + '<source src="https://s3.amazonaws.com/mtube-watchfolder/inputs%2F10-sec-beach.mp4" type="video/mp4">'
    + '</video>'
    res.send(data);
});

app.get("/mp4list", function(req, res) {
    // var lis = '';
    // for(var i=0; i<5; i++) {
    //     lis = lis + '<li>coding</li>';
    // }
    
    var javascript = '"<script src="./utils.js"></script>"';
    var video_start = '<ul> <video id="video"  width="320" height="240" >'
    var video ="";
    var uniqID = "";
    var video_end =  '</video>'
   + '<input type="button" id="button2" onclick="playVI()" value="play"/>'
   + '<input type="button" id="button1" onclick="pauseVI()" value="pause"/>'
   +'';
    //    + ' <p>  <input type="button" id="button2" onclick="playVI();" value="play"/>'
  // + '<input type="button" id="button1" onclick="pauseVI();" value="pause" />'
//<button type="Button" style="background-color: lightgreen; height: 25px; width: 100px">Small Button</button>
//<button type="Button" style="background-color:#00CCFF; height: 50px; width: 100px">Big Button</button>

    // console.log(playListArray)
    // playListArray.forEach(function (item, index, array) { console.log(item, index); });
    console.log('---------------------------------------');
    var doc = require('aws-sdk');
    var dynamo = new doc.DynamoDB();

    const AWS = require('aws-sdk')
    const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })

    let scanningParameters = {
        TableName: 'MtubeRegister',
        //  TableName: 'ContentsTable',
        Limit: 10 //maximum result of 100 items
    };

  
    // In dynamoDB scan looks through your entire table and fetches all data
    dynamo.scan(scanningParameters, function (err, data) {
        if (err) {
            console.log(err)
            return err; //callback(err, null);
        }
        else {
            data.Items.forEach(function(v) {
                    let type = 'type="video/mp4">'
                    let _src =  '<source src="https://s3.amazonaws.com/'   +   v.infos.S   + '" '  + type ;
                    video += video_start + _src + video_end;
                    uniqID = v.uniqID.S;
                    console.log(v.infos.S)
            });
         
            console.log('======' + video)
            //
            // html make
            //
            var output =  `
            <!DOCTYPE html>
        <html>
            <head>
            <script src="https://sdk.amazonaws.com/js/aws-sdk-2.283.1.min.js"></script>
            <script src="./utils.js"></script>
            <script> 
            function pauseVI() {
                const video = document.querySelector("#video")
                video.pause();
                return
            }
            function test() {
                alert('!!!!!!')
            }
            function playVI() {
                const video = document.querySelector("#video")
                console.log('play')
                video.play();
                return
            }

            //
            //
            //
            function countCall() {
                const http = require('http');
                var options = {
                    host: 'mtube-fab-blockcha-n4ladbgfun2s-252224141.us-east-1.elb.amazonaws.com',
                    path: '/count',
                    port: 80,
                    method: 'POST',
                    headers: {
                        'accept': '*/*',
                        'X-username': 'a1',
                        'X-orgName': 'mdist',
                        'Content-Type': 'application/json'
                    }
                };

                var regid = 'reg_AAA'
                var count_date = newDate();
                //
                var uid = ${uniqID};
        
                console.log('uid=' + uid );


                const data = JSON.stringify({
                    "uniqID": uid,
                    "userID": 'userABC',
                    "date": '',
                    "sellerID": 'sellerCompanyA'
                });
                 options.headers['Content-Length'] = data.length;

                 const req = http.request(options, (res) => {
                    
            
                    res.on('data', (d) => {
                        process.stdout.write(d)
                    })
                })
            
                req.on('error', (error) => {
                    console.error(error)
                })
            
                req.write(data)
                req.end()


                
            }
            //
            //
            //

            </script>
   
                <meta charset="utf-8">
                <title></title>
            </head>
            <body>
                <h1> Video Play list </h>
                ${video}
            </body>
        </html>
            `;
            
            res.send(output);

        }
       
    });


    // data.Items.forEach(function(v) {
    //         s =  '<source src="https://s3.amazonaws.com/'  +   v.infos.S + '" type="video/mp4">' 
    //         //": " + v.uniqID.S
    //     });
    

    // var video2 = '<video id="video"  width="320" height="240" >'
    //  + '<source src="https://s3.amazonaws.com/mtube-watchfolder/inputs%2F10-sec-beach.mp4" type="video/mp4">'
    // + '</video>'
    // + ' <p>  <input type="button" id="button2" onclick="playVI();" value="play"/>'
    // + '<input type="button" id="button1" onclick="pauseVI();" value="pause" />'
    // +' ';
  

})
//
//
//
app.get("/topic/new", function(req, res) {
  var files = ["123", "324"];
  res.render("new", { topics: files });
});

//
//
//
app.get("/topic", function(req, res) {
  var files = ["123", "324"];
  res.render("view", { topics: files });
});

app.get("/topic/:id", function(req, res) {
  var id = req.params.id;

  var files = ["123", "324"];
  var data = ["nodejs", "dffdfdfdf"];
  res.render("view", { topics: files, title: id, description: data });
  // res.send('id is :' + id);
});

app.post("/topic", function(res, req) {
  var t = req.body.title;
  var d = req.body.description;
  res.send("hi" + req.body.title);
});

app.listen(3400, function() {
  console.log("Connected 3400 port!");
});



function getPlaylistAll() {
    console.log('---------------------------------------');
    var doc = require('aws-sdk');
    var dynamo = new doc.DynamoDB();

    const AWS = require('aws-sdk')
    const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })

    let scanningParameters = {
        TableName: 'MtubeRegister',
        //  TableName: 'ContentsTable',
        Limit: 3 //maximum result of 100 items
    };

    var playListArray = new Array();

    // In dynamoDB scan looks through your entire table and fetches all data
    dynamo.scan(scanningParameters, function (err, data) {
        if (err) {
            console.log(err)
            return err; //callback(err, null);
        }
        else {
            data.Items.forEach(function(v) {
                console.log(
                    'dynamoDB>>>>' + v.infos.S + ": "+ v.uniqID.S);
                    let __value = v.infos.S;
                    playListArray.push(__value)
                });
            console.log(JSON.stringify(data.Items));
           return JSON.stringify(data.Items);
        //    return playListArray;
            //callback(null, data);
        }
    });
}