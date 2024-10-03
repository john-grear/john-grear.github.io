---
layout: post
title: Some other name
subtitle: Flutter - Dart
thumbnail-img: /assets/img/punch-clock.png
start_date: 2024-09-01
tags: []
---

I wanted to dip my feet into cross-platform development and figured Flutter would be a good framework to start with. So far I have had a lot of fun working with one language and seeing the differences between web, Windows, and Android (I haven't tested iOS yet).

This is a simple punch clock that calls to an API to securely pass info to and from a Postgres SQL database. Currently, you can clock in and out at will, no limit, except for logical scenarios like already being clocked in, etc. I tried to make it as efficient as possible so that the website wouldn't be bogged down. The longest part was either working with the calendar on the second page or moving it to production as this was a huge step having never touched Flutter beforehand.

I really loved working on this small project, and maybe I'll do more with it in the future. I am likely going to use Flutter again to make more apps that would benefit a lot from utilizing cross-platform functionality. If you have any inputs, please let me know!

NOTE: Currently all users use first user in table. Punches may exist if someone else has used the app within the same day. Will likely add user auth down the line just to clear up loose ends, if nothing else.