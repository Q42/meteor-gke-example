if (Meteor.isClient) {

  Meteor.startup(function() {
    Session.setDefault("address", null);
  });

  Template.address.helpers({
    address: function() {
      Meteor.call("getAddress", function(err, res) {
        if (res)
          Session.set("address", res.address);
      })
      return Session.get("address");
    },
    color: function() {
      var ip = Session.get("address");
      if (ip) {
        var color = "rgba(" + _.tail(ip.split(".")).join(",") + ", .9)";
        var color2 = "rgba(" + _.map(_.tail(ip.split(".")), function(c) { return c - 25}).join(",") + ", .7)";

        var style = "radial-gradient(closest-corner,rgba(16,47,70,0) 60%,rgba(16,47,70,0.26)),linear-gradient(108deg," + color + "," + color2 + " 90%);";
        return style;
      }
    }
  })

}

if (Meteor.isServer) {

  var os = Meteor.npmRequire('os');
  var ifaces = os.networkInterfaces();

  Meteor.methods({

    getAddress: function() {
      // http://stackoverflow.com/a/8440736/16308
      var result = null;
      Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;

        ifaces[ifname].forEach(function (iface) {
          if ('IPv4' !== iface.family || iface.internal !== false) {
            // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            return;
          }

          if (alias >= 1) {
            // this single interface has multiple ipv4 addresses
            result = {
              ifname: ifname,
              alias: alias,
              address: iface.address
            };
            //console.log(ifname + ':' + alias, iface.address);
          } else {
            // this interface has only one ipv4 adress
            result = {
              ifname: ifname,
              address: iface.address
            };
            //console.log(ifname, iface.address);
          }
        });
      });

      return result;
    }

  });
}
