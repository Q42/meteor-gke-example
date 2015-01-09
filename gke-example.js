if (Meteor.isClient) {

  Meteor.startup(function() {
    Session.setDefault("ips", []);
    Session.setDefault('ip', null);
  });

  Template.address.helpers({
    ips: function() {
      Meteor.call("getIps", function(err, res) {
        if (res)
          Session.set("ips", res);
      });
      return Session.get("ips");
    },
    color: function() {
      //var ip = Session.get("ips")[0].address;
      var ip = Session.get('ip');
      if (ip) {
        var color = "rgba(" + _.tail(ip.split(".")).join(",") + ", .9)";
        var color2 = "rgba(" + _.map(_.tail(ip.split(".")), function(c) { return c - 25}).join(",") + ", .7)";

        var style = "radial-gradient(closest-corner,rgba(16,47,70,0) 60%,rgba(16,47,70,0.26)),linear-gradient(108deg," + color + "," + color2 + " 90%);";
        return style;
      }
    },
    ip: function() {
      Meteor.call('getIp', function(err, res) {
        if (res)
          Session.set('ip', res);
      });
      return Session.get('ip');
    }
  })

}

if (Meteor.isServer) {

  var os = Meteor.npmRequire('os');
  var ifaces = os.networkInterfaces();
  var ip = null;

  Meteor.methods({

    getIps: function() {
      // http://stackoverflow.com/a/8440736/16308
      var result = [];
      Object.keys(ifaces).forEach(function (ifname) {
        ifaces[ifname].forEach(function (iface) {
          if ('IPv4' !== iface.family || iface.internal !== false) {
            // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            return;
          }

          result.push({
            ifname: ifname,
            address: iface.address
          });
          //console.log(result);
          
        });
      });

      return result;
    },
    getIp: function() {
      if (ip) return ip;
      var result = HTTP.get('http://api.ipify.org', {timeout:5000});
      if (result.statusCode == 200) {
        ip = result.content;
        return ip;
      } else {
        console.log('Response issue: ', result.statusCode);
        var errorJson = JSON.parse(result.content);
        throw new Meteor.Error(result.statusCode, errorJson.error);
      }
    }

  });
}
