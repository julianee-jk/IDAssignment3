# SneakerZone #
A mockup Sneaker E-Commerce website that is engaging and interactive for users.
This project aims to encourage and rewards users for being active in the website.
Updated as of: (07/02/2021)
# Introduction #
This website/mobile application is made to allow anybody, Customers or even Sneaker Enthusiasts to check out the new upcoming sneakers. If luck comes their way, they might even get a chance to purchase their preferred sneaker. Users can also 

This project makes use of Draftbit's E-Commerce Sneaker API to retrieve and gather information like Brand, Name, Cost etc.. of various sneakers.

We initially decided to come up with an E-Commerce website. Our goal was to make shopping experiences fun, exciting and simple. Not only that, we also have an interest in sneakers so we decided to fuse our passion & ideas to eventually come up with SneakerZone. Overall, we try to explore different ways to increase customer engagement and interactivity as well as improve customer experiences.
## Design Process ##
* **Customers**
    * Customers will be able to check out a wide variety of sneakers & also purchase them.
    * Customers can login everyday to collect their daily game coupons. With these game coupons, they will be able to play the games like Spin N Win or Coin Flip to stand a chance to earn more money to their account.

* **Sneaker Enthusiasts**
    * Sneaker Enthusiasts can search up and stay updated with what is available in the market.
    * Sneaker Enthusiasts will also be able to look up the retail prices of certain sneakers.

Click [here](https://julianee-jk.github.io/IDAssignment3/) to view GitHub Page.
Click [here](https://drive.google.com/drive/folders/1IcL7KOWMJAyCx89rF3M2u-kz5Ym3ynNT?usp=sharing) to view Wireframe.

## Features ##
These are the current features and pages of my website as well as the additional features I plan to add in the future.
### Existing Features ###
* **General**
    * Navigation bar w/ Logo, Shopping Bag Icon & Login
    * Login & Create Account Modal
    * Footer with Copyright
    * URL Modification Prevention **(If user tries to access account.html by modifying the URL, they will be redirected to index page.)**

* **Index**:
    * Featured Carousel
    * Trending Product Cards **(Clickable)**
    * Latest Product Cards **(Clickable)**
    * Generation of Latest cards

* **Explore**:
    * Search bar
    * Product Cards **(Clickable)**
    * Filter by category
    * Pagination

* **Product**:
    * Product Card Info
        * Brand, Name, Cost, Release Date, Category, Size, Quantity, Add to Bag.

* **Shoppingbag**:
    * Shopping Bag Table (Auto-Update)
        * Delete feature
    * Total Item Cost **(Only displayed if there's item in bag)**
    * Shipping Form **(Only displayed if there's item in bag)**

* **Account**:
    * User greeting message **(Hi, Name)**
    * View Account Balance
        * Add Account Balance
    * Game Coupons
    * Account Settings
        * Change Account Password
        * Add Account Balance
    * Logout button
    
* **Games**:
    * Spin N Win Game
        * Toggle ON/OFF when game expire
        * Wheel Spinning Animation
    * Coin Flip Game
        * Toggle ON/OFF when game expire
        * Coin Flipping Animation
    * Alternating Countdown Timers
    * Pay to play functionality

* **Contact**:
    * Developer Contact Details
        * Social media links
        * Email
    * Contact Form

### Features Left to Implement ###
* **General**
    * Add more Footer content
    * Mobile Responsiveness

* **Index**:
    * Slider functionality
    * Generation of Trending cards

* **Explore**:
    * Display Trending products
    * Back to top button

* **Account**:
    * Dashboard of Account Statistics
    * Account Settings
        * View Account Purchase History

## Technologies Used ##
These are all the tools and languages which we used to construct this project.
### Tools ###
* [Visual Studio Code](https://code.visualstudio.com/) → Integrated Development Environment (IDE) used.
* [Adobe XD](https://www.adobe.com/sea/products/xd.html) → To make the wireframes of the website. (Desktop & Mobile).
* [Bootstrap](https://getbootstrap.com/) → To make the responsive navigation bar, icons and more.
* [RestDB](https://restdb.io/) → To contain account-info, contact-form info, shipping-info.
* [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) → Property used to store & retrieve temporary data.
* [VSC LiveShare Extension](https://marketplace.visualstudio.com/items?itemName=MS-vsliveshare.vsliveshare-pack) → Used for real-time code editing.
### Languages ###
* [Hypertext Markup Language (HTML)](https://html.spec.whatwg.org/) → To create the content of the website.
* [Cascading Style Sheets (CSS)](https://www.w3.org/Style/CSS/Overview.en.html) → To style the content of the website.
* [JavaScript](https://www.javascript.com/) → To make the webpage much more interactive.
* [JQuery](https://jquery.com/) → To help simplify the use of JavaScript, HTML manipulation and Event handling.
## Testing ##
### Browsers Tested ###
* [Brave](https://brave.com/)
### Mobile Devices Tested ###
- Will update soon...

### Validators ###
- Will update soon...

## Credits ##
### Content ###
- [Draftbit API](https://example-data.draftbit.com/) → Sneaker data API.
- [Winwheel JS Library](http://dougtesting.net/winwheel/docs) → Used for Spin Wheel Game.
- [Spin Wheel](http://dougtesting.net/winwheel/examples/basic_code_wheel) → Simple Spin Wheel code.
- [Coin Flip](https://codepen.io/le0864/pen/pbmoVQ) → Simple Coin Flip code.

### Media ###
**Images**
* [Index Carousel](https://hypebeast.com/)

**Icons**
* [Shopping Bag](https://icons.getbootstrap.com/icons/bag/)
* [Arrow Down](https://www.w3schools.com/charsets/ref_utf_arrows.asp)
* [Plus Symbol](https://www.compart.com/en/unicode/U+FF0B)

### Acknowledgements ###
1. [Draftbit API](https://example-data.draftbit.com/) → This API has allowed us to gather information of a wide variety of sneakers for our website as well as having proper documentation on how to make use of the API.
1. [Hover Animation](https://ianlunn.github.io/Hover/) → This website was used for cool button hover animations.
1. [Spin Wheel GitHub](https://github.com/zarocknz/javascript-winwheel) → This GitHub page was used to better understand about WinWheel JS Library and how to properlly make use of it.
1. [QTY Button Function](https://css-tricks.com/number-increment-buttons/) → Helped us with onclick button increment & decrement code.
1. [W3School](https://www.w3schools.com/) → Helped us with commands that we had trouble with and also taught us many ways to create interesting HTML, CSS & JavaScript content.
1. [Bootstrap](https://getbootstrap.com/) → Made use of bootstrap templates & icons for web development.
1. [RestDB](https://restdb.io/) → Made use of RestDB to store data.
1. [Hypebeast](https://hypebeast.com/) → Used website images as placeholder images.