UserConnections = new Mongo.Collection("user_status_sessions");

if (Meteor.isClient) {

  Meteor.startup(function() {
    Session.setDefault("ips", []);
    Session.setDefault('ip', null);
  });

  Template.address.events({
    'click #body': function() {
    }
  })

  Template.address.helpers({
    user: function() {
      return UserConnections.find({userId: {$exists: false}});
    },
    x: function() {
      return ~~(Math.random() * $(window).width());
    },
    y: function() {
      return ~~(Math.random() * $(window).height());
    },
    color: function() {
      var ip = Session.get('ip');
      if (ip) {
        var color = "rgba(" + _.tail(ip.split(".")).join(",") + ", .9)";
        var color2 = "rgba(" + _.map(_.tail(ip.split(".")), function(c) { return c - 25}).join(",") + ", .9)";

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

  Tracker.autorun(function(c) {
    try {
      UserStatus.startMonitor({
        threshold: 30000,
        idleOnBlur: true
      });
      c.stop();
    } catch(e) {}
  });

}

if (Meteor.isServer) {
  var ip = null;

  Meteor.publish(null, function() {
    return UserStatus.connections.find();
  });

  Meteor.methods({
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
