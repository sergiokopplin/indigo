---
title: "Mastering Firebase Notifications"
layout: post
date: 2016-12-30 20:00
image: /assets/images/mastering-firebase.png
headerImage: false
tag:
- firebase
- android development
- notifications
category: blog
author: miquel
description: Learn to use Firebase Cloud Messaging effectively by doing the right thing from the start.
# jemoji: '<img class="emoji" title=":ramen:" alt=":ramen:" src="https://assets.github.com/images/icons/emoji/unicode/1f35c.png" height="20" width="20" align="absmiddle">'
---

![Title](/assets/images/mastering-firebase.png)

This article was featured in [Android Weekly Issue #238](http://androidweekly.net/issues/issue-238).

Originally published in [my Medium blog](https://medium.com/@Miqubel/mastering-firebase-notifications-36a3ffe57c41#.e8lfrcdid).

---

Firebase Notifications can be confusing, there are different ways to implement
them and not all behave the same. We went through that learning process, so I
decided to write this article to help you with this journey.

Note that this is an Android focused guide, but there’s a quick note on iOS at
the end.

---

## Console Notifications

The easiest way to send and receive notifications with Firebase is by using the
build-in console Notifications.

![Firebase Console](/assets/images/firebase-console.png)

A simple notification will be displayed with the following components:

- The Title will be your app name.
- The Text will be what you put on the Message text in the console.
- It will use the default app icon with a grey background.

This is a simple way for your marketing team to increment event conversion and
returning users, but as simple as this gets, it is also very limited.

Besides, there’s a big problem: If you send a notification while the app is in
foreground, it will not be displayed.

We can fix that by implementing a FirebaseMessagingService to handle that case.
But before, let’s move on from the console to a command line tool to send
notifications.

## Sending Notifications via CLI

Take a look at these two documents before proceding: First you need to check
the HTTP protocol [https://firebase.google.com/docs/cloud-messaging/http-server-ref](https://firebase.google.com/docs/cloud-messaging/http-server-ref)
and then how to act like a server: [https://firebase.google.com/docs/cloud-messaging/server](https://firebase.google.com/docs/cloud-messaging/server)

You can send notifications directly from the command line just like your backend
service will do. This way you can provide more parameters than what the
Firebase Console offers.

Let’s jump into it with a quick example.

First get your Auth key from the Settings in the Firebase Console inside
Project Settings and Cloud Messaging. We got the Auth Key from the Firebase
Console, but you also need to get the device token.

Add the following code somewhere in your app to get the token:


{% highlight java %}
String refreshedToken = FirebaseInstanceId.getInstance().getToken();
Log.d("MainActivity", "Token: " + refreshedToken);
{% endhighlight %}

This part is well explained here in the Firebase documentation:
[https://firebase.google.com/docs/notifications/android/console-device](https://firebase.google.com/docs/notifications/android/console-device)

Finally use the following CURL command to send a notification:

{% highlight bash %}
curl https://fcm.googleapis.com/fcm/send -X POST \
--header "Authorization: key=long auth key"\
--Header "Content-Type: application/json" \
-d '
{
  "to": "the device token"
  "notification":{
    "title":"New Notification!",
    "body":"Test"
  },
  "priority":10
}'
{% endhighlight %}

If everything went alright you will receive a plain notification as before. As
well, your notification will be not be displayed if your app is in foreground.

Handling Notifications in Foreground When the app is closed, your notifications
are processed by the Google Service process, which take care of displaying your
notifications as required, including the default click action (opening the app)
and the notification icon.

When the app is in foreground, the received messages are processed by the app,
and since there’s no logic to handle it, nothing will happen!

To fix this, we need our own FirebaseMessagingService, let’s create one. Create
a new class that extends it and implement the onMessageReceived method. Then
get the Notification object from the remoteMessage and create your own Android
Notification.

{% highlight java %}
public class NotificationService extends FirebaseMessagingService {
    @Override
        public void onMessageReceived(RemoteMessage remoteMessage) {
            super.onMessageReceived(remoteMessage);
            Notification notification = new NotificationCompat.Builder(this)
                .setContentTitle(remoteMessage.getNotification().getTitle())
                .setContentText(remoteMessage.getNotification().getBody())
                .setSmallIcon(R.mipmap.ic_launcher)
                .build();
            NotificationManagerCompat manager =
                NotificationManagerCompat.from(getApplicationContext());
            manager.notify(123,
                    notification);
        }
}
{% endhighlight %}


Then add the Service in your AndroidManifest.xml

{% highlight html %}
<service android:name=”.NotificationService”>
  <intent-filter>
    <action
      android:name=”com.google.firebase.MESSAGING_EVENT”/>
  </intent-filter>
</service>
{% endhighlight %}

For more information, follow the official documentation:
[https://firebase.google.com/docs/cloud-messaging/android/client](https://firebase.google.com/docs/cloud-messaging/android/client)

Now if you try again, you will display notifications while your app is in
foreground!

In real life, your onMessageReceived content will be slightly more complex, you
will want different smart actions depending on the type of notification, you
will want to show a nicer large icon (the one that appears on the notification
body) and for sure to change the status bar icon.  The problem you have now is
that your onMessageReceive is ONLY called when the app is in foreground, if you
app if is background, the Google Services will take care of displaying your
message.

<span class="evidence">
The solution? don’t use the `"notification"` message payload and use `"data"`
instead.
</span>

## Using Data

The last step to become a Firebase Cloud Messaging Black
Belt Master is to ditch the notification object from your message payload.

Rather than sending:

{% highlight json %}
{
  "notification":{
    "title": "New Notification!",
    "body": "Test"
  }
}
{% endhighlight %}

Send:

{% highlight json %}
{
  "data":{
    "title": "New Notification!",
    "body": "Test"
  }
}
{% endhighlight %}

This way, your notifications will be always handled by the app, by your
NotificationService, and not by the Google Service process. You will need to
change your code as well to handle the data payload:


{% highlight java %}
.setContentTitle(remoteMessage.getData().get("title"))
.setContentText(remoteMessage.getData().get("body"))
{% endhighlight %}


You can put anything you want in the `"data"` object.  For example a user ID, a
URL to an image… any information that you might want to use to build the
notification or to pass to the click action.

Note that all will be treated as Strings.

{% highlight json %}
{
  "data":{
    "title":"New Notification!",
    "body":"Test",
    "user_id": "1234",
    "avatar_url": "http://www.example.com/avatar.jpg"
  }
}
{% endhighlight %}

This difference is explained somehow in
the Handling Messages section of this document:
[https://firebase.google.com/docs/cloud-messaging/android/receive](https://firebase.google.com/docs/cloud-messaging/android/receive)

Note that if
you keep the `"notification"` object in your payload, it will behave just like
before. You need to get rid of the `"notification"` and only provide the `"data"`
object.

## Let’s talk about iOS

I can’t go in much detail since I am not an iOS
developer, but I can tell you that the solution is different. In iOS you need
to use the “notification” object.

Tell your system architect that your clients
need to receive different notification formats depending on the operating
system. Keep that in mind when registering the device tokens in your system.
Click Actions and other Parameters I did not go further on the different
options that Firebase notifications offers because I don’t recommend using the
`"notification"` JSON object.

Implementing actions by using the `"click_action"`
parameter requires you to add extra filters in the AndroidManifest for each of
the Activities it will open.

My recommendation is to just ignore that part and
go straight to use the `"data"` JSON payload, so you will have better control.

---

## In summary:

- Notifications via Firebase Console are a quick way to send
notifications but lack the options developers need
- Implement your FirebaseMessagingService from the start
- Learn to send messages via command line
- Don’t use the `"notification"` JSON object on Android, only use `"data"`
- But keep it for iOS. So don’t use the same solution for both platforms
