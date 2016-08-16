---
title: "Lessons Learned working with Nintex"
layout: post
date: 2016-08-16 11:00
tag: tips-and-tricks
blog: true
draft: true
author: artiannaswamy
summary: "Lessons learned from developing Nintex O365 workflows"
permalink: nintex-workflows
---

Earlier this year, I started as a project manager / business analyst consultant on a SharePoint implementation project. We needed to transition over several sub-sites containing complex approval workflows from an older document sharing platform, and since InfoPath is being deprecated, we ended up going with Nintex O365 as our workflow add-on of choice for SharePoint.

The journey has been interesting, to say the least. Nintex behaves in very unexpected ways, and with our workflows being fairly complex, we've had to cross a lot of hurdles and come up with workarounds, hacks and a fair amount of research to solve these problems. The Nintex forums have also been a great resource and I'm including links to any helpful solutions posted there as well. I'm recording these below as a reference for myself and anyone else facing the same hurdles.

## Hiding the Task Outcome field 

Within the Nintex workflow, we are able to set up task assignments that have one of several outcomes (Approve / Reject / On Hold etc). These task outcome options show up as a visible radio-button field on the custom task form that can be created for the approvers. This field refuses to elegantly hide or be switched off in any way - in fact, it's a requirement that the field be enabled/rendered on the form for the approvers to successfully select an outcome. For the longest time, we'd keep tucking this outcome field behind other fields, or behind an empty white square graphic and it would still manage to peek through.

Until, a colleague of mine found this hack online that leveraged the Control-CSS field and some simple jquery to make the field invisible. 

In the Control CSS field associated with the Task Outcome choice control, put in a unique class name.
```css
Control CSS = hidden-control
```

Switch over to the Form Settings, and in the Custom Javascript field, add in the following jquery snippet.
```jquery
NWF$(".hidden-control").hide();
```

<div class="breaker"></div>

## Linking multiple workflows

One of the workflow solutions I have been working on involves linking multiple workflows in sequence. The reason these had to be split was because of some rather complicated task assignment logic we've used in a couple of these workflows, and size limitations prevented us from combining all of these in one workflow. There are a couple of ways to achieve multiple workflows:

### Option 1. Firing off all workflows simultaneously on item creation, but having the other workflows wait for a certain field to change.

This worked great for a couple of reasons - the transition from one workflow ending to the other workflow beginning was very short and seamless, and all workflows were launched with the same initial permissions.

But the problem was if the user had to restart the workflow for any reason. The user would have to remember to fire off all the workflows, in the right order, and even then the "wait for field change" didn't always work.

### Option 2. Linking one workflow to the next using the 'Start workflow' action.

I quite thought I had found the holy grail with this solution - I could even do conditional branches and fire off different workflows depending on whether particular fields had been filled. It did require me to put in an admin user ID and password into the workflow action that launches a separate workflow, and getting the configurations filled out just right took some research as well. For more information on how to configure the 'Start workflow' action, see article: [Start a Workflow using NINTEX Workflow in SharePoint 2013 Online](http://www.c-sharpcorner.com/blogs/start-a-workflow-using-nintex-workflow-in-sharepoint-2013-online)

However, it turned out that the workflows launched correctly, and in sequence, only as long as the initial request was submitted by my account, the one with site administrator rights. When a user with lower permissions (Edit or Contribute) initiated the workflows, the first workflow kicked off without any problems, but the next linked workflow would fail and get suspended with the following error message:

```
Retrying last request. Next attempt scheduled after (date/time). 
Details of last request: HTTP NotFound to 
https://siteurl/sites/subsite/web/lists(guid'xxxx')/Items(n)? 
Correlation Id: xxxx Instance Id: xxxx

Item does not exist. It may have been deleted by another user.
```

I had encountered the 'Item does not exist' error before - it tended to appear when a user didn't have access to view that particular item. 

And since the workflows ran without problem when initiated from my account, I knew it had to be a permissions issue.

I went down the rabbit hole researching several possible solutions, all listed below including the final solution that works like a charm.

#1. Upgraded user permissions from Contribute to Edit - didn't work, same error message

#2. Considered elevating user permissions on the SharePoint List temporarily while one workflow transitions to the other, per this article [Set Item Permissions - Start Workflow Issue](https://community.nintex.com/message/15315) but it was a risky move to add more permissions temporarily since if anything failed, the user would basically see everyone else's requests and this was a no-no.

#3. Found a series of articles on using elevated workflow permissions to remedy the issue. One of the articles, [Workflow App Permissions](http://www.stuartroberts.net/index.php/2014/11/20/workflow-app-permissions/) suggested tricking SharePoint into thinking of the workflow as an App (i.e. a functioning widget or add-in like a Document Library or a List). This was an interesting approach, and definitely worth a try, until I found...

#4. An article on using an App Step, a Nintex feature that can leverage higher permissions than the rest of the workflow, per this article [We use Nintex online with SharePoint 2013...](https://community.nintex.com/message/35520), and this Nintex O365 documentation article for [App Step](http://help.nintex.com/en-US/O365/O365WorkFlow/Workflow%20Actions%20-%20STD/App%20Step.htm). 

I added an App Step to my workflow and when I clicked into the action to configure it, was greeted with this message. 

```
The required feature is not currently active.
 
To enable App Step, the following site feature must be activated:
Workflows can use app permissions
```

#5. The Nintex App Step documentation linked above also led to a SharePoint Dev center artice on how to [Create a workflow with elevated permissions by using the SharePoint 2013 Workflow platform](https://msdn.microsoft.com/en-us/library/office/jj822159(v=office.15).aspx). This article in conjunction with another helpful article [How to enable usage of App Step](https://community.nintex.com/thread/4793) led me to the Site setting that allows workflows to use app permissions.

While setting up an App Step seemed like the best solution of all of the above, it still felt like a lot of added weight to the workflow. I wondered for a moment if simply enabling this setting might allow the workflow to run with elevated permissions, and this was certainly worth a try.

#6. (SOLUTION THAT WORKED) So, I went into Site Settings > Site Actions > Manage site features:
<div class="center"><img src="https://github.com/aannasw/aannasw.github.io/blob/master/assets/images/posts/nintex/siteactions.PNG?raw=true" /></div>

And enabled the 'Workflows can use app permissions' setting.
<div class="center"><img src="https://github.com/aannasw/aannasw.github.io/blob/master/assets/images/posts/nintex/workflowapp.png?raw=true" /></div> 

I tentatively kicked off a workflow from a test user account with lower permissions, and .... it worked! 

However, as I mentioned earlier, kicking off a new workflow from an existing workflow seems to take Nintex a good 15-20 minutes to slowly work its way through. This can be fairly awkward during live demo sessions, but shouldn't be a problem during normal live usage.

<div class="breaker"></div>

Stay tuned for more notes..


