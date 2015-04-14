Meteor Container Engine example app
===================================

This is a simple example Meteor app used with [@q42/meteor-on-gke](http://github.com/q42/meteor-on-gke) to demonstrate [Meteor](http://meteor.com) running on [Google Container Engine](https://cloud.google.com/container-engine/) on [Kubernetes](https://github.com/GoogleCloudPlatform/kubernetes).

It does two things: print the public IP address of the machine the app is
running on, and offer some simple interaction with the MongoDB database to show
there is persistent data irrespective of the machine.
