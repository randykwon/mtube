function pauseVI() {
    const video = document.querySelector("#video")
    video.pause();
    return
}
function gogo() {
    console.log('gogo()')
    alert('?????')
}
function playVI() {
    const video = document.querySelector("#video")
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

function getPlayList() {
    const AWS = require('aws-sdk')


    var docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })

    var uuid_v = "0799dbae-a07e-4484-809c-ddbaf500d5de";
    var tableName = "MtubeRegister";

    let params = {
        TableName: tableName,
        Key: {
            "uniqID": uuid_v
        }
    };

    docClient.get(params, function (err, data) {
        if (err) {
            console.error("error to add item", err);
        }
        else {
            console.log("get item: ", data);
        }
    });
}

function viewAlbum() {
    alert('start viewAlubm');
    
      var message = files_upload.length ?
        '<p>Click on the Delete to delete the file</p>' :
        '<p>You do not have any files in this folder. Please add files.</p>';
      var htmlTemplate = [
        '<h2>',
        '<input id="photoupload" type="file" accept="video/*">',
        '<button id="uploadFile" onclick="upLoadFile(\'' + albumName + '\')">',
        'Upload File',
        '</button>',
        '<button onclick="listAlbums()">',
        'Back To Albums',
        '</button>',
        '<div>',
        '</div>'
      ]
      document.getElementById('app').innerHTML = getHtml(htmlTemplate);
    });
  }
  

function getPlaylistAll() {
    var doc = require('aws-sdk');
    var dynamo = new doc.DynamoDB();

    const AWS = require('aws-sdk')
    const docClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })

    let scanningParameters = {
        TableName: 'MtubeRegister',
        //  TableName: 'ContentsTable',
        Limit: 1 //maximum result of 100 items
    };

    // In dynamoDB scan looks through your entire table and fetches all data
    dynamo.scan(scanningParameters, function (err, data) {
        if (err) {
            return err; //callback(err, null);
        }
        else {
            return data
            //callback(null, data);
        }
    });
}

function sendHit() {
    const http = require('http');
    var options = {
        host: 'mtube-fab-blockcha-n4ladbgfun2s-252224141.us-east-1.elb.amazonaws.com',
        path: '/content',
        port: 80,
        method: 'POST',
        headers: {
            'accept': '*/*',
            'X-username': 'a1',
            'X-orgName': 'mdist',
            'Content-Type': 'application/json'
        }
    };
    const data = JSON.stringify({
        "uniqID": uid,
        "regID": regid,
        "infos": srcBucket + srcKey,
        "regDate": timestampOfToday
    });
    options.headers['Content-Length'] = data.length;

    const req = http.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`)

        res.on('data', (d) => {
            process.stdout.write(d)
        })
    })

    req.on('error', (error) => {
        console.error(error)
    })

    req.write(data)
    req.end()
    //
}