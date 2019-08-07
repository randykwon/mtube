var albumBucketName = 'mtube-watchfolder';
var bucketRegion = 'us-east-1';
var IdentityPoolId = 'us-east-1:dae3d21d-76dd-4de6-ab66-d503ca815bc6';
// Initialize the Amazon Cognito credentials provider
// Initialize the Amazon Cognito credentials provider
// AWS.config.region = 'us-east-1'; // Region
// AWS.config.credentials = new AWS.CognitoIdentityCredentials({
//     IdentityPoolId: 'us-east-1:dae3d21d-76dd-4de6-ab66-d503ca815bc6',
// });


// AWS.config.update({
//   region: bucketRegion,
//   credentials: new AWS.CognitoIdentityCredentials({
//     IdentityPoolId: IdentityPoolId
//   })
// });

// Initialize the Amazon Cognito credentials provider
AWS.config.region = 'us-east-1'; // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: 'us-east-1:65b7ec88-579a-4a04-8647-c4c019703bc4',
});


var s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: {
    Bucket: albumBucketName
  }
});

function listAlbums() {
  s3.listObjects({
    Delimiter: '/'
  }, function (err, data) {
    if (err) {
      return alert('There was an error listing your albums: ' + err.message);
    } else {
      console.log('Catetory', data.CommonPrefixes)
      var albums = data.CommonPrefixes.map(function (commonPrefix) {
        var prefix = commonPrefix.Prefix;
        var albumName = decodeURIComponent(prefix.replace('/', ''));
        return getHtml([
          '<li>',
          '<span onclick="viewAlbum(\'' + albumName + '\')">',
          '<button style="color:red" onclick="deleteAlbum(\'' + albumName + '\')"> Delete </button>',
          albumName,
          '</span>',
          '</li>'
        ]);
      });
      var message = albums.length ?
        getHtml([
          '<p>Click on an album name to view it.</p>',
          '<p>Click on the "DELETE" to delete the album.</p>'
        ]) :
        '<p>You do not have any albums. Please Create album.';
      var htmlTemplate = [
        '<h2>Albums</h2>',
        message,
        '<ul>',
        getHtml(albums),
        '</ul>',
        '<button onclick="createAlbum(prompt(\'Enter Album Name:\'))">',
        'Create New Album',
        '</button>'
      ]
      document.getElementById('app').innerHTML = getHtml(htmlTemplate);
    }
  });
}

function createAlbum(albumName) {
  albumName = albumName.trim();
  if (!albumName) {
    return alert('Album names must contain at least one non-space character.');
  }
  if (albumName.indexOf('/') !== -1) {
    return alert('Album names cannot contain slashes.');
  }
  var albumKey = encodeURIComponent(albumName) + '/';
  s3.headObject({
    Key: albumKey
  }, function (err, data) {
    if (!err) {
      return alert('Album already exists.');
    }
    if (err.code !== 'NotFound') {
      return alert('There was an error creating your album: ' + err.message);
    }
    s3.putObject({
      Key: albumKey
    }, function (err, data) {
      if (err) {
        return alert('There was an error creating your album: ' + err.message);
      }
      alert('Successfully created album.');
      viewAlbum(albumName);
    });
  });
}

function viewAlbum(albumName) {
  var albumFilesKey = encodeURIComponent(albumName) + '/';
  s3.listObjects({
    Prefix: albumFilesKey
  }, function (err, data) {
    if (err) {
      return alert('There was an error viewing your album: ' + err.message);
    }
    // 'this' references the AWS.Response instance that represents the response
    var href = this.request.httpRequest.endpoint.href;
    var bucketUrl = href + albumBucketName + '/';
    console.log('Category', data.Contents)

    var files_upload = data.Contents.map(function (file) {
      var fileKey = file.Key;
      var fileUrl = bucketUrl + encodeURIComponent(fileKey);

      return getHtml([
        '<span>',
        '<div>',
        '<iframe width="="768" height="241" src="' + fileUrl +'" frameborder="0" allowfullscreen></iframe>',
        '</div>',
        '<div>',
        '<button onclick="deleteFile(\'' + albumName + "','" + fileKey + '\')">',
        '<p>[DELETE]</p>',
        '</button>',
        '<span>',
       fileKey.replace(albumFilesKey, ''),
        '</span>',
        '</div>',
        '</span>',
      ]);
    });
    var message = files_upload.length ?
      '<p>Click on the Delete to delete the file</p>' :
      '<p>You do not have any files in this folder. Please add files.</p>';
    var htmlTemplate = [
      '<h2>',
      'Folder Name : ' + albumName,
      '</h2>',
      message,
      '<input id="photoupload" type="file" accept="video/*">',
      '<button id="uploadFile" onclick="upLoadFile(\'' + albumName + '\')">',
      'Upload File',
      '</button>',
      '<button onclick="listAlbums()">',
      'Back To Albums',
      '</button>',
      '<div>',
      getHtml(files_upload),
      '</div>'
    ]
    document.getElementById('app').innerHTML = getHtml(htmlTemplate);
  });
}

function upLoadFile(albumName) {
  var files = document.getElementById('photoupload').files;
  if (!files.length) {
    return alert('Please choose a file to upload first.');
  }
  var file = files[0];
  var fileName = file.name;
  var albumFilesKey = encodeURIComponent(albumName) + '/';

  var fileKey = albumFilesKey + fileName;
  s3.upload({
    Key: fileKey,
    Body: file,
    ACL: 'public-read'
  }, function (err, data) {
    if (err) {
      console.log(err)
      return alert('There was an error uploading your file: ', err.message);
    }
    alert('Successfully uploaded file.');
    viewAlbum(albumName);
  });
}


function deleteFile(albumName, fileKey) {
  s3.deleteObject({
    Key: fileKey
  }, function (err, data) {
    if (err) {
      return alert('There was an error deleting your file: ', err.message);
    }
    alert('Successfully deleted file.');
    viewAlbum(albumName);
  });
}

function deleteAlbum(albumName) {
  var albumKey = encodeURIComponent(albumName) + '/';
  s3.listObjects({
    Prefix: albumKey
  }, function (err, data) {
    if (err) {
      return alert('There was an error deleting your album: ', err.message);
    }
    var objects = data.Contents.map(function (object) {
      return {
        Key: object.Key
      };
    });
    s3.deleteObjects({
      Delete: {
        Objects: objects,
        Quiet: true
      }
    }, function (err, data) {
      if (err) {
        return alert('There was an error deleting your album: ', err.message);
      }
      alert('Successfully deleted album.');
      listAlbums();
    });
  });
}