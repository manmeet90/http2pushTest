## Steps to run this demo

- clone the repo.
- run `npm install`
- run `npm start`
- Go to `https://localhost:3000/`

I was thinking from a long time to write this article as I feel as a web developer(specially mobile web developer) it's very important to tackle performance related issues to grab more users in market like India, Africa and SE Asia where the internet speed is not that good compared to western world.

According to research done by Google few months back the next billion users who are going to be part of internet community will be from these markets only.
The average internet users in these markets have mostly low or mid range devices in terms of hardware, plus the mobile data cost in these countries are way higher for people to afford.Hence one can assume the user won't have always the mobile data enabled.
On top of over this users in these regions have max 3G connection which makes it more difficult for us as a web developer to craete good performant web apps.
Thus creating web applications to grab user in these markets requires some extra efforts on performance side to make sure user does come back to your website next time.So how one can achieve such user experience.

## The Current state of mobile Web

According to one of the study currently the average loading time of mobile web apps is on an average 19seconds!!
This a hell lot of time considering the another study where it was found that a typical user leaves your website and never vists again if it takes more than 2 seconds to load on desktop or 5 seconds to load on mobile.
Fortunately the Web development world is changing fast and most importantly in a right direction.
With new features like `Service worker, Cache, link rel=preload and http2/push` we can improve the performance of web application upto 10x.

## What is a service Worker?

A service worker is a script that your browser runs in the background, separate from a web page.Since service workers are independent of web page they can run even after you close the tab which registers this service worker.
When service worker is not working it is inactive/sleep state, thus not consuming any hardware resources.When any of the service worker lifecycle events triggers the service worker wakes up and handles them accordingly.

### So how could service worker help us improve performance of our web applications?

Before understanding how service workers can help us improve the performance let's see a little about the problem statement we are trying to solve.
Whenever we request any webpage the request goes to the server which then responds with a html page (in context of web applications).Once the HTML page gets downloaded and parsed , if any other resources required by the page like javascript files, stylesheets the http requests made to server.Once these resources get downloaded they are parsed and executed.
A typical web application of today's world makes atleast 9-10 http requests on inital load thus taking around 10sec on an average on desktop and 19 secs on mobile on a regular 3G network.
More horrible situation is that average size of initial content downloaded by a typical web application today is around 25-35MB.
Now consider part of the world where mobile data is so costly and network bandwidth is also poor loading such a heavy content everytime user visit that particullar page is a very bad user experience.

So how service worker helps us handle this unnecessary download of these static resources everytime user visits the page even though the resources have not changed ?

Well Service workers can act as a proxy for all your network request made from your app.That is service worker can intercept the request initiated from your page (context in terms of service worker).This gives us the opportunity to cache the response or respond the request from cache if already cached.
We can cache all the static resources like stylesheets , images, javascript using service worker once the service worker is ready(when install event fires) so next time when browser request for the same resource service worker can respond to request from cache thus not making a network request at all.Even if there is no network (bad connection or airplane mode) it will work now.This pattern is generally called "CACHE FIRST" strategy and it fits perfect for our problem(For production make sure you use variant of cache first startegy where you parallely send request to server to check if content has changed and if replace the cache with the updated response/content).
Thus using Service Worker + Cache APIs we can improve the performace of our application for revisits.

Unfortunatelly the service workers are currently landed only in latest Chrome, opera and mozilla.IE Edge will make this available in first quarter of 2017, Safari Team have started looking into the specs and hopefully by end of 2017 will provide it.So untill then for users using those browsers may not be able to get this improved user experience for your web app.

## So service workers helps us improving the performance on repeated vists for users but what about the first visit.Though now we are able to load our application/page under 2 sec on poor netwrok conditions;we still taking the same old time for first load.So how to tackle this problem?

Well there is no one particullar approach that suits well for all scenarios so I will talk about few of them and scenarios where one can use them.

### HTTP2.0

Last year the W3C approved the new HTTP2.0 spec and all the browser vendors implemented it by last month(yes Safari and IE too finally released 100% support for HTTP2.0 features :) ).
The most exicting feature for developers in HTTP2.0 was request multiplexing over same TCP connection that is browsers can use same TCP connection to serve multiple request thus the latency time required for each TCP handshake can be avoided.On desktop or wired connection this latency wasn't much but for mobile web where your cell communicates via cellular network handshake latency becomes very considerable amount of time.

Thus simply using HTTP2.0 only will help you improve the initial load time a lot.

Still this doesn't fixes one major problem.As you all know all http requests are blocking by default i.e. HTML parsing or DOM painting gets blocked while the content is loading and parsed we are blocking the main execution thread.Now suppose if you are loading a very large font file or js file this could block your html from parsing and thus the first paint and thus the DOMContentLoaded event will gets unnecessarily delayed, thus affecting the `time to ready for first user interaction` for your page.

Luckily today we have options through which we can improve this behaviour.
You all might be using or may have atleast heard of new `async` and `defer` HTML5 attributes.

### ASYNC and DEFER attributes 

Basically when you apply "async" attribute to any other script, font or link tag you tell browser to start downloading and execution of the content parallely along with your HTML parsing.
Whereas "defer" attribute will start download in parallel but defer the excution untill the HTML parsing gets completed.
Thus using `defer` one can break the waterfall chart you might have seen while investigating for performance of your applications on chrome dev tools or any other ; or `async` in some cases where your content is independent of every other resource.

- use `async` for loading resources like stylesheets and fonts.
- use `defer` for loading your js assets files.

Well you think we have optimized enough for bad network conditions till now.but hold on we still have some exceution frames we are wasting.Can you guess?

The request for downloading a particullar resource will only initiate while parsing the HTML one will reach to that line of code right.What if we can prefetch such resources ahead of time which we know browsers gonna request for in near future like these static assets or may be some other assets too like images so that when browsers comes to point when it requires those resources we already have these assets downloaded and cached and thus ready for use immediately.

We can achieve this with `link rel=preload` or `HTTP2/push`

### link rel=preload

You can tell browser to prefetch any resource using link rel=preload tag thus when required you can simply use that content.E.g. suppose you have a js module person.js which you know browser will request for in near future.We can preload this file content and browser will keep that in cache so when requested later on it will serve the content immediately from cache.
You will find tons of e.g. and other use cases for preload over the innternet so I'm going to skip the details of usage.Feel free to check the internet for the same or reach out to me when free.

### HTTP2/Push

`HTTP2/Push` or `HTTP2 server push` is more or less similar to rel-preload where instead of you are asking browser to prefetch resources while HTML parsing is runnning, servers itself send other resources along with the response against your request which they think(i mean developer here just to be clear) browser may request for in near future.

Personally I feel HTTP2/push is a more flexible in terms of implementation and behaviour as you can change decision anytime while your app in production regarding which resources you should push along (may be based on some analytics data of usage of your application by users).
Also I don't have to change the way to load these resources also now I can have the same code as if it would have without HTTP2/push(regular http request to fetch this resource) but if resources has been already present in browser cache then browsers won't initiate any http request for the same.Cool right :)

Lastly regarding the broswer support link rel=preload currently ships in Chrome and Opera only so I think this leaves us with HTTP2/push only.However beware that though HTTP2 is supported by all browser vendors today they support over TLS only.So make sure have your application SSL secured.

## Conclusion
There are lots of other stuffs one can do to improve the performance and user experience of their web application which I leave for you to explore as those depends upon specific scenarios.
Web technologies are getting better everyday to make sure we as developers have right tools in our pocket to create good performant applications to reach these next billion users who are going to be online.
Hope this article will encourage you to think about your web apps from these new customers and market point of view so that you can tap more of them and make Intenet or Web a much better place.   





