# [KTM.JS](developers-nepal.github.io/ktmjs)
### Kathmandu Javascript user group.

>Try to be a rainbow in someone's cloud. - Maya Angelou


## Admin Panel
- schedule an upcoming meetup, 
- add speakers, sponsors and organizations info
- add post-meetup documents, presentations and images (for contribution)

#### How do i run admin panel?
```
$ git@github.com:developers-nepal/ktmjs.git
$ cd site-admin
$ npm install
$ node ktm.js 
```


## Contributing
Please refer issues (marked as community responsibility) for contribution.
#### How do I contribute?

- fork our ktmjs repository.
- run the admin interface
```
$ git@github.com:developers-nepal/ktmjs.git
$ cd site-admin
$ npm install
$ node ktm.js
```
- develop / code / fix the issues
- make a Pull Request

## Publishing a meetup
Follow these steps to publish a meetup. 

```
1. run admin panel
	$ git@github.com:developers-nepal/ktmjs.git
	$ cd site-admin
	$ npm install
	$ node ktmjs 
	
	/* it opens a browser, you can also open it in any browser on http://localhost:3000/meetups */

2. add meetup information
	- start adding people and organizations info
	- add episodes info
	- click on publish button

3. commit your changes
	- git add  
	- git commit 
	- git push origin master
	
4. copy css file to dist folder
	$ cp assets/site/css/index.css dist/css/

5. in dist folder, you will see list of html files
	- rename upcoming meetup as index.html

6. deploy to gh-pages
	$ npm deploy 
```

