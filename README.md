# [KTM.JS](http://developers-nepal.github.io/ktmjs) 
### Kathmandu Javascript user group. [![Build Status](https://travis-ci.org/developers-nepal/ktmjs.svg?branch=master)](https://travis-ci.org/developers-nepal/ktmjs) [![GitHub issues](https://img.shields.io/github/issues/developers-nepal/ktmjs.svg)](https://github.com/developers-nepal/ktmjs/issues) [![GitHub forks](https://img.shields.io/github/forks/developers-nepal/ktmjs.svg)](https://github.com/developers-nepal/ktmjs/network) [![GitHub stars](https://img.shields.io/github/stars/developers-nepal/ktmjs.svg)](https://github.com/developers-nepal/ktmjs/stargazers) [![GitHub license](https://img.shields.io/github/license/developers-nepal/ktmjs.svg)](https://github.com/developers-nepal/ktmjs/blob/develop/LICENSE) [![Twitter](https://img.shields.io/twitter/url/https/github.com/developers-nepal/ktmjs.svg?style=social)](https://twitter.com/intent/tweet?text=Wow:&url=https%3A%2F%2Fgithub.com%2Fdevelopers-nepal%2Fktmjs)

>Try to be a rainbow in someone's cloud. - Maya Angelou


## Admin Panel
- schedule an upcoming meetup,
- add speakers, sponsors and organizations info
- add post-meetup documents, presentations and images (for contribution)

#### How do i run admin panel?
```
fork our ktmjs repository.

$ git clone git@github.com:[your-github-id]/ktmjs.git
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
$ git@github.com:[your-github-id]/ktmjs.git
$ cd site-admin
$ npm install
$ node ktm.js
```
- develop / code / fix the issues
- make a Pull Request

## Publishing a meetup
Follow these steps to publish a meetup.

```
1. fork our ktmjs repository

2. run admin panel
	$ git clone git@github.com:[your-github-id]/ktmjs.git
	$ cd site-admin
	$ npm install
	$ node ktm.js

	/* it opens a browser, you can also open it in any browser on http://localhost:3000/meetups */

2. add meetup information
	- start adding people and organizations info
	- add episodes info
	- click on publish button

3. commit your changes
	- git add  
	- git commit
	- git push origin develop

4. get peer reviewed and merge to master

```

## Admin directory structure
```
/assets
  /admin/images/people 			: people images which are refrenced in website
  /admin/images/companies 		: organization images which are refrenced in website
  /admin/css					: css for admin interface
  /admin/js						: js for admin interface

  /site/css						: css for site
  /site/images					: images for site
/db 							: database location
/routes 						: express js routes for meetups, people ...
/templates
	/admin 						: admin templates
	/site 						: site templates
db.js 							: has database instance
utils.js 						: has utility functions
ktm.js 							: has express js configurations and server instance (main file)
package.json 					: npm file
```
## Maintainers
- [@rabishah](https://github.com/rabishah)
- [@sumn2u](https://github.com/sumn2u)

## Contributions
- [@jaisonjustus](https://github.com/jaisonjustus)
- [@parewa-punit](https://github.com/parewa-punit)
- [@parewa-ranjit](https://github.com/parewa-ranjit)
- [@prashishh](https://github.com/prashishh)
- [@developerPratik](https://github.com/developerPratik)
