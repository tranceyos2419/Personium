var request = require("request")

var appCellUrl = "https://demo.personium.io/u-aizu-100",
engineEndPoint = "https://demo.personium.io/app-aizu-health-store/__/html/Engine/getAppAuthToken",
github = "https://api.github.com/repos/request/request";

var options00 = {
  url: github,
  headers:{
    'User-Agent' : 'art'
  }
}

function callback(error, response, body){
  if(!error && response.statusCode == 200){
    var info = JSON.parse(body)
    console.log(info);
  }
}

request(options00, callback);

// request(engineEndPoint, function (err,res,body) {
//   if (!err && res.statusCode == 200) {
//     console.log(body);
//     // console.log(parsedData["query"]);
//     // console.log(typeof body);
//   }
// })

// var options = {
//   url: engineEndPoint,
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'x-personium-cors': 'true'
//   },
//   json: {
//     p_target: appCellUrl
//   },
// };
//
// request(options, function(err, res, body) {
//   if (err) {
//     console.log(err);
//   } else {
//     if (res && (res.statusCode === 200 || res.statusCode === 201)) {
//       // var parsedData = JSON.parse(body)
//       console.log(parsedData);
//     }
//   }
// });

// request("https://query.yahooapis.com/v1/public/yql?q=select%20astronomy.sunset%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22maui%2C%20hi%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys", function (err,res,body) {
//   if (!err && res.statusCode == 200) {
//     var parsedData = JSON.parse(body)
//         console.log(parsedData["query"]["results"]['channel']["astronomy"]["sunset"]);
//     // console.log(parsedData["query"]);
//     // console.log(typeof body);
//   }
// })

// Login
function(request){
    var rootUrl = "https://demo.personium.io";
    var appCellName = "app-aizu-health-store";
    var appCellUrl = [ rootUrl, appCellName ].join("/");

    var refererUrl = request["headers"]["referer"];
    var debug = request["headers"]["x-personium-cors"] == "true";
    /*
     * Usually only your App's URL is enough.
     * However, if you can allow other Apps to call your function to get Authentication Token.
     */


    var refererUrlList = [appCellUrl];
    var urlAllowed = false;
    for (i = 0; i < refererUrlList.length; i++) {
        if (refererUrl && refererUrl.indexOf(refererUrlList[i]) == 0) {
            urlAllowed = true;
            break;
        }
    }
    if (!debug && !urlAllowed) {
        return {
            status : 500,
            headers : {"Content-Type":"application/json"},
            body: [JSON.stringify({"code": "500", "message": "Cross-domain request not allowed."})]
        };
    }

    var bodyAsString = request["input"].readAll();
    if (bodyAsString === "") {
        return {
            status : 400,
            headers : {"Content-Type":"application/json"},
            body: [JSON.stringify({"code": "400", "message": "Request body is empty."})]
        };
    }
    var params = dc.util.queryParse(bodyAsString);

    if (!params.p_target) {
        return {
            status : 400,
            headers : {"Content-Type":"application/json"},
            body: [JSON.stringify({"code": "400", "message": "Required paramter [p_target] missing."})]
        };
    }

    // Get App Token
    var appCellAuthInfo = {
        "cellUrl": appCellUrl,
        "userId": "tokenAcc",
        "password": "personium"
    };
    var ret;
    try {
        var appCell = dc.as(appCellAuthInfo).cell(params.p_target);
        ret = appCell.getToken();
    } catch (e) {
        return {
            status: 500,
            headers: {"Content-Type":"application/json"},
            body: [JSON.stringify({"code": "500", "message": e})]
        };
    }


    // Return App Token
    return {
        status: 200,
        headers: {"Content-Type":"application/json"},
        body: [JSON.stringify(ret)]
    };
}
