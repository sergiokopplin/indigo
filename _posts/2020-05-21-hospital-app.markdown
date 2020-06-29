---
title: "Creating a Hospital Kiosk Application"
layout: post
date: 2020-05-21 07:00
image: /assets/images/hospitalapp/icon.png
headerImage: true
projects: true
hidden: true
description: "A team of nine other students and I worked on a hospital kiosk application in collaboration with Brigham and Women's Hospital"
category: project
author: ioannis
externalLink: false
---

![Homescreen](/assets/images/hospitalapp/home.jpg)

## Preface
Professor Wong tasked our ten-person group with creating an application
that would be accessed from a kiosk tablet in a hospital. This application had multiple
requirements that our group needed to fulfill. We had to implement a map viewer and map
builder. A pathfinding feature that allows the user to enter their location and a destination
and then shows the shortest path between the two. Finally, each member had to develop their own 
*service request*, which is a section of the application where users can request different
services. Some of the service requests we implemented:
- Internal transport request - request for someone to bring you to your destination with a wheelchair
- Prescription service request - Assign a specific prescription to a patient
- Interpreter service request - request for a language interpreter at a specific location


## First Iteration
Before we started programming the first iteration of our application, we had to gather
"requirements". This consisted of creating surveys and interview questions to see how to best
implement the requirements and features of our application according to potential users, such
as, nurses and hospital visitors. After analyzing the results we obtained from our surveys and
interviews, we created *user stories*, a hypothetical scenario of a user interacting with the
kiosk to use a specific feature. Then, we assigned these user stories to each other and began
programming our application. After a week of daily *scrums* (20-minute meetings where everyone
says what they did the past day, what they're going to do today, and any problems they are 
facing), and almost daily 2-hour work meetings, we finished our *sprint* (goals that we set out
to accomplish in the first week). At the end of our sprint, we finished the first iteration of
our application and presented it to the class. Professor Wong awarded our team with "best
application" after the five other teams in our class presented their own applications. He
also gave our group feedback that we incorporated into the second iteration.

Below is a quick overview of our product at the end of the first iteration.
![Overview of Iteration 1](/assets/images/hospitalapp/iteration1.gif)

## Second Iteration
Our first meeting of the second iteration was our sprint retrospective meeting. In this meeting,
we talked about all of the aspects of our group that went well and went poorly. This meeting
uncovered the fact that some group members felt like they didn't belong. We immediately
addressed this concern and made the group members feel more valuable to the group by giving
them more responsibilities and avenues to contribute to our project. We got back to programming
and ended up with the below product for our kiosk application. We presented this iteration of our
application to Professor Wong and he awarded us with "best application" again.
![Overview of Iteration 2](/assets/images/hospitalapp/iteration2.gif)

### Hashing Passwords
In the first iteration we stored user account information in plain text. Because of my interest in cyber
security, I decided to lead the implementation of secure password storage for this application.
I found a standalone password hashing library for Java called [bcrypt](https://github.com/patrickfav/bcrypt).
We decided to use `bcrypt` because it is based on the blowfish cypher which is one of the slower hashing
algorithms. We wanted a slower hashing algorithm because it would take an attacker longer was trying to brute
force passwords it would take them much longer to crack the passwords.
 

## Third Iteration

