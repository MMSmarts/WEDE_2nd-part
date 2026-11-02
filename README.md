# INNO-MAC JHB Website

A multi-page website for INNO-MAC JHB, an independent Land Rover, Range Rover and Jaguar specialist workshop in
Kya Sands, Randburg (Johannesburg). This document explains the website, the work done for Part 3 (JavaScript,
SEO, forms and deployment), the changelog and the references used.

- **GitHub repository:** https://github.com/MMSmarts/WEDE_2nd-part

## Contents

1. [Pages](#pages)
2. [How to view the website](#how-to-view-the-website)
3. [Folder structure](#folder-structure)
4. [Technologies used](#technologies-used)
5. [Part 3: Enhancing functionality and SEO](#part-3-enhancing-functionality-and-seo)
6. [Changelog](#changelog)
7. [References](#references)

## Pages

| File | Page | Main features |
| --- | --- | --- |
| `index.html` | Home | Introduction, popular services (loaded with JavaScript), vehicles we service |
| `about.html` | About Us | Company information and a photo gallery with a lightbox |
| `services.html` | Services & Prices | Service list with search, filter and sort, vehicle tabs and an FAQ accordion |
| `enquiry.html` | Enquiry | Booking/quote form with validation, cost estimate, availability and AJAX submission |
| `contact.html` | Contact Us | Contact details, interactive map and a message form that compiles an email |
| `sitemap.html` | Site Map | Links to every page and its main sections |

## How to view the website

- **On your own computer:** download or clone the repository and open `index.html` in Chrome, Edge or Firefox.
  An internet connection is needed for the map, the FAQ accordion (jQuery) and sending the enquiry form,
  because these load from other websites. The "How far am I?" button on the Contact page only works on the
  live (HTTPS) website, because browsers only share a visitor's location with secure websites.

## Folder structure

```text
WEDE_2nd-part/
├── index.html, about.html, services.html,
│   enquiry.html, contact.html, sitemap.html   The six web pages
├── styles.css                                 One stylesheet shared by every page
├── js/
│   ├── main.js            Every page: mobile menu, scroll animations, back-to-top button, share links
│   ├── services.js        The list of services and prices, and the search/filter/sort code
│   ├── tabs-accordion.js  Services page: vehicle tabs and the FAQ accordion (jQuery)
│   ├── gallery.js         About page: photo gallery lightbox
│   ├── map.js             Contact page: Leaflet map and "How far am I?" button
│   └── forms.js           Enquiry and Contact forms: validation, estimate, AJAX and email
├── assets/images/         Photos and logo (compressed)
│   └── thumbs/            Small versions of the photos for cards and the gallery
├── robots.txt             Instructions for search engine crawlers
├── sitemap.xml            List of pages for search engines
├── .nojekyll              Tells GitHub Pages to publish the files exactly as they are
├── README.md              This document
└── wireframes.md          Page wireframes from Part 2
```

## Technologies used

- HTML5, CSS3 and JavaScript (no build tools are needed)
- jQuery 3.7.1 - used for the FAQ accordion
- Leaflet 1.9.4 with OpenStreetMap - used for the interactive map
- JSONPlaceholder - a free test server that receives the enquiry form data (AJAX)
- GitHub Pages - free hosting for the live website

---

## Part 3: Enhancing functionality and SEO

### 1. JavaScript functionality

#### 1.1 Interactive elements

| Feature | Page | File | What it does |
| --- | --- | --- | --- |
| Accordion (FAQ) | Services | `js/tabs-accordion.js` | Clicking a question slides its answer open and closes any other open answer. Built with jQuery. |
| Tabs | Services | `js/tabs-accordion.js` | Land Rover / Range Rover / Jaguar buttons show one vehicle panel at a time. Built with plain JavaScript. |
| Lightbox gallery (modal) | About | `js/gallery.js` | Clicking a photo opens it in a large view over a dark background, with previous, next and close buttons. |
| Interactive map | Contact | `js/map.js` | Shows the workshop on a map with a pop-up, a "How far am I?" button and a directions link. |
| Mobile menu | All pages | `js/main.js` | On small screens the navigation hides behind a "Menu" button that turns into an X when open. |
| Back-to-top button | All pages | `js/main.js` | Appears after scrolling down and smoothly scrolls back to the top. |

**Accordion.** The FAQ accordion uses jQuery's `.slideToggle()` method. The jQuery documentation explains that
this method will "[d]isplay or hide the matched elements with a sliding motion" [1]. The code also updates the
`aria-expanded` attribute so screen readers know whether an answer is open or closed.

**Tabs.** When a tab is clicked, the code first hides every panel and un-selects every tab, and then shows only
the panel that belongs to the clicked tab. Without JavaScript all three panels are simply shown one below the
other, so no information is lost.

**Lightbox gallery.** The lightbox is created with JavaScript and added to the page. Each thumbnail is a normal
link to the full-size photo, so the photos still open without JavaScript. With JavaScript, the Escape key closes
the lightbox, the arrow keys move between photos, and keyboard focus returns to the thumbnail afterwards.

**Interactive map (location-based feature).** The map was built with the Leaflet library, following its API
reference for creating a map, adding a tile layer and adding a marker with a pop-up [2]. The map pictures come
from OpenStreetMap, which allows anyone to use its data on condition that OpenStreetMap and its contributors are
credited [3]. For this reason the map shows the "© OpenStreetMap contributors" notice in its corner. The
"How far am I?" button uses the browser's Geolocation API. According to MDN, this API "allows the user to provide
their location to web applications if they so desire", and the user is asked for permission first [4]. The code
then places a marker on the visitor's position and works out the straight-line distance to the workshop.

**Animations and transitions.**

- *CSS animations:* the home page heading, text and buttons slide up one after another when the page loads, and
  the lightbox and result panels fade in.
- *CSS transitions:* buttons lift slightly, service cards rise with a shadow, gallery photos zoom and the menu
  icon turns into an X.
- *JavaScript scroll animations:* sections fade in as they scroll onto the screen. This uses the Intersection
  Observer API, which "provides a way to asynchronously observe changes in the intersection of a target element
  with an ancestor element or with a top-level document's viewport" [5]. In simpler words, the browser tells
  the code when a section becomes visible, and the code then adds the `visible` class to it.
- *Reduced motion:* visitors who have set their device to reduce motion do not see the animations.

**DOM manipulation techniques used**

| Technique | Where it is used |
| --- | --- |
| `document.createElement()` and `append()` | Service cards, the lightbox, the back-to-top button and the result panels are built in JavaScript |
| `table.insertRow()` / `insertCell()` | The cost table in the enquiry estimate |
| `classList.add()`, `remove()`, `toggle()` | Scroll animations, open mobile menu, red/green borders on form fields |
| `setAttribute()` | `aria-expanded`, `aria-selected` and `aria-invalid` for accessibility |
| The `hidden` property | Tabs, the "no results" message and the result panels |
| `replaceChildren()` | Clearing the service list before showing new search results |
| `URLSearchParams` | Reading `?service=...` from the address so the enquiry form pre-selects a service |
| `textContent` (not `innerHTML`) | All text added by JavaScript, to keep the site safe (see 2.3 Security) |

#### 1.2 Dynamic content

All services and prices are stored in **one** JavaScript array in `js/services.js`. Each service is an object
with a name, category, price, time needed, description and picture. This one list is used in three places:

1. **Home page** - the code keeps only the services marked as `popular` and builds a card for each.
2. **Services page** - every service is shown, with a **search box**, a **category filter** and a
   **sort** drop-down (name A to Z, price low to high, price high to low).
3. **Enquiry page** - `js/forms.js` looks up the prices in the same list to work out the estimate.

Every time the visitor types or changes a drop-down, the `showServices()` function runs three steps:

1. **Filter:** keep only the services whose name or description contains the search words and that are in the
   chosen category.
2. **Sort:** put the results in the chosen order.
3. **Show:** remove the old cards, build new cards and update the "Showing 4 of 10 services" text. If nothing
   matches, a message with a "Clear search" button appears.

Each card has an "Enquire now" button that links to, for example, `enquiry.html?service=diagnostics`, so the
enquiry form opens with that service already chosen.

---

### 2. Search Engine Optimisation (SEO)

Google's *Search Engine Optimization (SEO) Starter Guide* [6] was the main guide used for the on-page SEO work.

#### 2.1 On-page SEO

**Keyword research.** Google advises website owners to "[t]hink about the words that a user might search for to
find a piece of your content" and points out that experts and beginners may search with different words [6].
The keywords were therefore chosen by combining the vehicle brands the workshop works on, the services it
offers and the areas it serves, the way a customer would type them. Both short keywords
(e.g. "Land Rover specialist Johannesburg") and longer, more specific phrases
(e.g. "Range Rover air suspension repair") were used.

| Page | Main keyword | Other keywords used in the content |
| --- | --- | --- |
| Home | Land Rover specialist Johannesburg | Range Rover service Johannesburg, Jaguar repairs Johannesburg, independent Land Rover workshop |
| About | Land Rover workshop Randburg | RMI accredited workshop, Land Rover specialist Kya Sands |
| Services | Land Rover service Johannesburg | Range Rover air suspension repair, Land Rover diagnostics, Jaguar service Randburg |
| Enquiry | Book Land Rover service | Land Rover service quote, Range Rover service cost |
| Contact | Land Rover workshop Kya Sands | Contact Land Rover specialist Randburg, Jaguar mechanic Johannesburg |

The keywords appear in each page's title, meta description, `<h1>` heading, headings and body text, and are also
listed in a `<meta name="keywords">` tag.

**Title tags and meta descriptions.** Every page has its own title (under 60 characters, main keyword first,
business name last) and its own meta description (between 135 and 160 characters). Google advises that
"[a] good meta description is short, unique to one particular page, and includes the most relevant points of
the page" [6].

| Page | Title tag |
| --- | --- |
| Home | Land Rover & Jaguar Specialist Johannesburg \| INNO-MAC JHB |
| About | About Our Land Rover Workshop in Randburg \| INNO-MAC JHB |
| Services | Land Rover, Range Rover & Jaguar Services \| INNO-MAC JHB |
| Enquiry | Book a Land Rover Service or Get a Quote \| INNO-MAC JHB |
| Contact | Contact Our Kya Sands Land Rover Workshop \| INNO-MAC JHB |
| Site Map | Site Map \| INNO-MAC JHB Land Rover Specialist |

Each page also has a `<link rel="canonical">` tag that tells search engines the official address of the page.

**Header tags.** Every page has exactly one `<h1>` that includes the main keyword (for example "Land Rover,
Range Rover & Jaguar Specialists in Johannesburg" on the home page). Page sections use `<h2>` and items inside a
section use `<h3>`. The footer headings were changed from `<h3>` to `<h2>` so that no heading level is skipped.

**Image optimisation.**

- *Descriptive file names:* for example `service-range-rover.jpg` and `diagnostics-obd-scanner.jpg`.
- *Alt text:* every image has alt text that describes the picture and how it relates to the page. Google
  describes alt text as "a short, but descriptive piece of text that explains the relationship between the image
  and your content" [6].
- *Smaller files:* all photos were resized and compressed (from about 2.2 MB to 1.1 MB in total), and the logo
  went from 192 KB to 47 KB. Small 600-pixel thumbnails are used for cards and the gallery.
- *Lazy loading:* images further down the page have `loading="lazy"`. As web.dev explains, the `loading`
  attribute can lazy-load images "without the need to write custom lazy-loading code or use a separate JavaScript
  library" [7]. The large home page photo is not lazy-loaded because it is visible straight away.
- Every image has `width` and `height` attributes, so the page does not jump while images load.

**URL structure.** The Part 2 file names `About.html`, `Services.html`, `Enquiry.html` and `Contact Us.html` were
renamed to `about.html`, `services.html`, `enquiry.html` and `contact.html`. The old contact page address
contained a space, which appeared as `Contact%20Us.html`. Google notes that parts of a URL can be shown in search
results as breadcrumbs, and recommends to "[t]ry to include words in the URL that may be useful for users" [6].

**Internal linking.** Google explains that "[l]inks are a great way to connect your users and search engines to
other parts of your site" [6]. Internal links on this website include:

- the main navigation, which highlights the current page;
- a breadcrumb trail (e.g. Home › Services) at the top of every inner page;
- the same footer on every page, with quick links and a link to the Site Map;
- links inside the text (e.g. from the diagnostics section to the Services page);
- "Enquire now" buttons on each service card that open the enquiry form with the service chosen; and
- the Site Map page, which links to every page and its main sections.

**Mobile-friendliness.** Google states that it "uses the mobile version of a site's content, crawled with the
smartphone agent, for indexing and ranking" [8], so the mobile version of a website is very important. The
website:

- uses the `viewport` meta tag;
- uses CSS Grid layouts that change to one column on small screens;
- has a "Menu" button on small screens instead of a long row of links;
- has large, easy-to-tap buttons and form fields; and
- was tested at a phone width of 375 pixels with no sideways scrolling.

#### 2.2 Off-page SEO

Off-page SEO happens on *other* websites, so it cannot be done completely in code. This section explains what
was built into the website and what the business should do next.

**Backlinks.** Google notes that "the vast majority of the new pages Google finds every day are through links"
[6], so links from other trustworthy websites help search engines find and trust this website. The plan for
building good backlinks is:

1. List the workshop on Google Business Profile with a link to the website.
2. Ask industry associations the workshop belongs to (for example the RMI) to link to the website from their
   member listings.
3. List the business in South African online business and motoring directories.
4. Take part in Land Rover and 4x4 owners' clubs and forums, linking to useful pages such as the FAQ.
5. Exchange links with partner businesses such as tyre fitment centres and panel beaters.

**Social media.**

- Every page has "Share This Page" links in the footer (Facebook, WhatsApp, X and LinkedIn). `js/main.js` adds the
  page's address and title to each link.
- Every page has Open Graph tags (`og:title`, `og:description`, `og:image` and others). According to its official
  website, the Open Graph protocol "enables any web page to become a rich object in a social graph" [9]. In
  practice, this means a shared link shows a proper title, description and picture instead of a plain link.

**Local SEO.**

- The Home and Contact pages contain **structured data** (JSON-LD) of the type `AutoRepair`. It includes the
  business name, address, map coordinates, phone number, email and opening hours. Google explains that when
  people search for businesses on Google Search or Maps, the results may show a knowledge panel with the details
  of a matching business, and that local business structured data can be used to tell Google about details such
  as business hours [10].
- The business name, address and phone number are written in exactly the same way in the footer of every page.
- The Contact page has a map of the workshop and a directions link.
- Local place names (Johannesburg, Randburg, Kya Sands) are used in titles, headings and text.

#### 2.3 Additional requests

**robots.txt.** Google explains that "[a] robots.txt file tells search engine crawlers which URLs the crawler can
access on your site" [11]. The file `robots.txt`:

- allows all crawlers (`User-agent: *`) to visit all pages (`Allow: /`);
- keeps project documents such as `README.md` out of search results (`Disallow: /*.md$` and `Disallow: /*.txt$`);
  and
- gives the address of the sitemap.

Search engines only read `robots.txt` from the main folder (root) of a website address. On a GitHub Pages project
site the file is inside the repository's folder, so it will only take full effect if the website is moved to its
own domain name.

**sitemap.xml.** Google describes a sitemap as "a file where you provide information about the pages, videos,
and other files on your site, and the relationships between them" [12]. The file `sitemap.xml` lists every page
with its last-changed date (`lastmod`), how often it changes (`changefreq`) and how important it is
(`priority`). The visitor-friendly version of this list is `sitemap.html`.

**Page speed.**

- Photos were compressed and resized, with small thumbnails for cards and the gallery (see Image optimisation).
- Images further down the page are lazy-loaded [7].
- All scripts use `defer`, so the page shows before the JavaScript runs.
- jQuery is only loaded on the Services page and Leaflet only on the Contact page.
- The Contact page uses `<link rel="preconnect">` to connect to the map server early.
- No large frameworks are used; all pages share one CSS file.

**Security.**

- *Content Security Policy (CSP):* MDN describes CSP as "a feature that helps to prevent or minimize the risk of
  certain types of security threats" [13]. Every page has a CSP meta tag. It only allows scripts, styles and
  images from this website and the few trusted websites that are needed (jQuery, Leaflet, OpenStreetMap and
  JSONPlaceholder), and it blocks plug-ins such as Flash (`object-src 'none'`).
- *Subresource Integrity (SRI):* jQuery and Leaflet are loaded with an `integrity` hash. MDN explains that SRI
  lets browsers check that files they download, for example from a CDN, "are delivered without unexpected
  manipulation" [14]. If anyone changed those files, the browser would refuse to run them.
- *Protection against cross-site scripting (XSS):* all text that JavaScript adds to the page is added with
  `textContent`, never `innerHTML`. OWASP recommends that "[w]hen displaying text with JavaScript, assign it to
  the textContent property of an ordinary element" [15]. Text typed into the forms is therefore always shown as
  plain text and can never run as code.
- *Safe external links:* links that open in a new tab use `rel="noopener noreferrer"`, and a referrer policy
  limits what is shared with other websites.
- *Form protection:* every field has a maximum length, all input is checked (see section 3), and a hidden
  "honeypot" field catches spam robots. MDN warns that "client-side validation should not be considered an
  exhaustive security measure" [16], so a real booking system would check the data again on its server.
- *HTTPS:* GitHub Pages serves the live website over HTTPS.

---

### 3. Forms and validation

#### 3.1 Two forms with different purposes

| | Enquiry form (`enquiry.html`) | Contact form (`contact.html`) |
| --- | --- | --- |
| **Purpose** | Ask about a specific service and get a price and availability | Send a general message (question, compliment, complaint, partnership) |
| **Fields** | Name, email, phone, vehicle model, year, service, preferred date, extras, message, consent | Name, email, phone (optional), type of message, subject, message |
| **After validation** | Shows an estimated cost, the usual time needed and availability, and sends the enquiry with AJAX | Compiles the details into an email and shows a "Send email" button |
| **`action` attribute** | `https://jsonplaceholder.typicode.com/posts` | `mailto:info@innomac-jhb.co.za` |

#### 3.2 Form elements used

- `<input>` of type `text`, `email`, `tel`, `number`, `date`, `search` and `checkbox`
- `<select>` drop-downs, with `<optgroup>` to group vehicles by brand and services by category
- `<textarea>` for messages, with a live character counter
- `<fieldset>` and `<legend>` to group the optional extras
- `<label>` for every field, and `<button type="submit">`

#### 3.3 Validation

MDN explains that "[c]lient-side validation is an initial check and an important feature of good user
experience" [16], because the visitor can fix mistakes straight away. Validation happens in two layers:

1. **HTML5 attributes** in the HTML: `required`, `minlength`, `maxlength`, `min`, `max`, `pattern`,
   `type="email"` and `type="tel"`.
2. **JavaScript** in `js/forms.js`: the code switches off the browser's own pop-up messages
   (`form.noValidate = true`) and checks every field itself. This allows clear messages under each field and
   checks that HTML cannot do on its own, such as making sure a date is not in the past.

| Field | Rule |
| --- | --- |
| Full name | Required, at least 2 characters, only letters, spaces, hyphens and apostrophes |
| Email | Required, must look like `name@example.com` |
| Phone | South African format: `0` or `+27` followed by 9 digits (spaces allowed). Required on the enquiry form, optional on the contact form |
| Vehicle model / service / type of message | A choice must be made |
| Year | A whole number from 1990 to next year |
| Preferred date | Not in the past and not more than 3 months ahead (the date picker also blocks these dates) |
| Subject | 5 to 80 characters |
| Message | Enquiry: optional, up to 500 characters. Contact: 20 to 1000 characters |
| Consent | Must be ticked on the enquiry form |

#### 3.4 Error handling

- A clear message appears under each field with a problem, and the field gets a red border.
- Keyboard focus moves to the first field with a problem.
- A field is checked again when the visitor leaves it, and the error disappears as soon as it is fixed.
- `aria-invalid` and `aria-describedby` let screen readers read out the error message.
- If the enquiry cannot be sent (for example, there is no internet connection), the visitor still sees the
  estimate and is asked to phone the workshop.

#### 3.5 AJAX form submission (Enquiry form)

The enquiry form is sent with the Fetch API. MDN describes this as "a JavaScript interface for making HTTP
requests and processing the responses" [17]. The steps in `js/forms.js` are:

1. `event.preventDefault()` stops the browser from leaving the page.
2. The form is validated. If anything is wrong, the code stops here.
3. The details are collected into an object, and the estimated cost and availability are worked out.
4. `fetch()` sends the object as JSON to the address in the form's `action` attribute, while the button shows
   "Sending...".
5. When the server replies, a result panel shows a reference number, a table of costs, the usual time needed and
   the availability for the chosen date.

The form is sent to JSONPlaceholder, a free online REST API made for testing. Its guide explains that a new
resource "is not really created on the server, but the response is faked as if" it was [18]. This shows that
the AJAX code works without needing a real booking database. A real business would replace the `action`
address with its own server or a form service.

#### 3.6 Compiling the email (Contact form)

After validation, `js/forms.js` builds:

- a **subject**, for example `[Complaint] Car not ready on time`; and
- a **body** containing the name, email, phone, type of message and the message itself.

These are turned into a `mailto:` link to the recipient written in the code (`RECIPIENT_EMAIL`, which is
`info@innomac-jhb.co.za`). `encodeURIComponent()` makes spaces, line breaks and symbols safe inside the link. The
visitor sees a preview of the email and a "Send email" button that opens their email app with everything already
filled in.

---

### 4. Deployment

The website is published with GitHub Pages, following GitHub's documentation [19]:

1. Push the latest changes to the `master` branch on GitHub.
2. On GitHub, open the repository and click **Settings**, then **Pages**.
3. Under "Build and deployment", set **Source** to **Deploy from a branch**.
4. Choose the `master` branch and the `/ (root)` folder, then click **Save**.
5. After a few minutes the website is live.

Once the site is live, the sitemap can be submitted to Google Search Console so that Google finds every page.

### 5. Testing

- Every page was opened in Chrome on a computer screen and at a phone width of 375 pixels: there were no
  JavaScript errors and no sideways scrolling.
- All internal links and `#section` links were checked.
- Both forms were tested with empty fields, wrong values (bad email, wrong phone number, past date) and correct
  values, and the enquiry form with a weekday, a weekend date and the "Other / not sure" service.
- The honeypot field was tested to make sure robot submissions are ignored.

---

## Changelog

### Version 2.0 - 2 November 2026 (Part 3)

#### Changes made based on the Part 2 feedback

- **File names / URLs:** renamed `About.html`, `Services.html`, `Enquiry.html` and `Contact Us.html` to
  lowercase names without spaces (`about.html`, `services.html`, `enquiry.html`, `contact.html`) and updated
  every link.
- **README:** the page list pointed to a `part 2/Website/` folder that does not exist. The paths were corrected
  and the "No JavaScript is used" statement was removed.
- **Changelog:** moved from the separate `CHANGELOG.md` file into this README, as required.
- **Footer:** the footers were different on each page (the home page was missing the Services link and the Site
  Map page had almost no footer). Every page now has the same footer. The heading "Navigations" was corrected to
  "Quick Links", and the footer headings were changed from `<h3>` to `<h2>` so the heading order is correct.
- **Copyright year:** most pages showed 2024 and the home page showed 2026. JavaScript now shows the current year
  on every page.
- **Contact page:** added the contact form, which was missing (Part 1 required a form on both the Enquiry and
  Contact pages).
- **Enquiry form:** the form used `action="#"` and had almost no validation. It now has proper field types,
  validation, error messages, a response for the visitor and a working `action` address.
- **Layout:** the Part 2 wireframes showed text next to images, but the CSS placed them one below the other.
  Two-column layouts were added, and the vehicle cards are now shown in a grid.
- **CSS:** buttons were styled with fragile selectors such as `a[href="Enquiry.html"]`, which break when a file
  is renamed. These were replaced with a `.btn` class, and `styles.css` was organised into numbered sections.
- **Content:** corrected the sentence "latest technology for accurate diagnostic equipment" to "latest diagnostic
  technology for accurate fault finding".
- **Unused file:** removed `Page template.html`, a starter file with broken links that was not part of the
  website.
- **Images:** the photos were very large (up to 464 KB each), so they were resized and compressed.

#### New features (Part 3)

- **JavaScript (all pages):** mobile menu button, scroll fade-in animations, back-to-top button, automatic
  copyright year and "Share This Page" social media links (`js/main.js`).
- **Dynamic content:** services and prices stored in one JavaScript list (`js/services.js`). The home page shows
  popular services, and the Services page has search, category filter and sort.
- **Interactive elements:** vehicle tabs and a jQuery FAQ accordion on the Services page; a photo gallery with a
  lightbox on the About page; a Leaflet map with "How far am I?" on the Contact page.
- **Forms:** JavaScript validation with error messages on both forms. The enquiry form gives a cost estimate and
  availability and sends the data with AJAX. The contact form compiles an email. Both forms have character
  counters and spam protection.
- **On-page SEO:** keyword research, unique titles and meta descriptions, canonical links, one `<h1>` per page,
  breadcrumbs, descriptive alt text, lazy loading and more internal links.
- **Off-page and local SEO:** Open Graph tags, share links, `AutoRepair` structured data and a backlink plan.
- **Additional SEO files:** `robots.txt`, `sitemap.xml` and `.nojekyll`.
- **Page speed:** compressed images, thumbnails, `defer` on scripts and libraries loaded only where needed.
- **Security:** Content Security Policy, Subresource Integrity, `textContent` instead of `innerHTML`,
  `rel="noopener noreferrer"`, a referrer policy and a honeypot field.
- **Accessibility:** "Skip to main content" link, visible keyboard focus, ARIA attributes on the menu, tabs,
  accordion and form errors, and support for the "reduce motion" setting.
- **Documentation:** this README was updated with the Part 3 work, the changelog and the references.

### Version 1.1 - 17 September 2026

- Added a shared `styles.css` file for all website pages.
- Added simple mobile responsive layouts.
- Added hover states for navigation links and buttons.
- Added a sitemap page.
- Added GitHub project documentation.
- Added text-based wireframes for the main pages.

### Version 1.0

- Created the INNO-MAC JHB multi-page website.
- Added Home, About, Services, Enquiry and Contact Us pages.
- Added workshop images and basic navigation.
- Added the enquiry form.

---

## References

[1] OpenJS Foundation, ".slideToggle()," *jQuery API Documentation*. Accessed: Nov. 2, 2026. [Online].
Available: https://api.jquery.com/slideToggle/

[2] Leaflet, "Leaflet API reference (version 1.9.4)," *Leaflet*. Accessed: Nov. 2, 2026. [Online].
Available: https://leafletjs.com/reference-1.9.4.html

[3] OpenStreetMap Foundation, "Copyright and License," *OpenStreetMap*. Accessed: Nov. 2, 2026. [Online].
Available: https://www.openstreetmap.org/copyright

[4] Mozilla, "Geolocation API," *MDN Web Docs*. Accessed: Nov. 2, 2026. [Online].
Available: https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API

[5] Mozilla, "Intersection Observer API," *MDN Web Docs*. Accessed: Nov. 2, 2026. [Online].
Available: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

[6] Google, "Search Engine Optimization (SEO) Starter Guide," *Google Search Central*. Accessed: Nov. 2, 2026.
[Online]. Available: https://developers.google.com/search/docs/fundamentals/seo-starter-guide

[7] A. Osmani, H. Djirdeh, M. Bynens, and B. Pollard, "Browser-level image lazy loading for the web," *web.dev*.
Accessed: Nov. 2, 2026. [Online]. Available: https://web.dev/articles/browser-level-image-lazy-loading

[8] Google, "Mobile site and mobile-first indexing best practices," *Google Search Central*. Accessed: Nov. 2,
2026. [Online]. Available: https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing

[9] "The Open Graph protocol," *ogp.me*. Accessed: Nov. 2, 2026. [Online]. Available: https://ogp.me/

[10] Google, "Local business (LocalBusiness) structured data," *Google Search Central*. Accessed: Nov. 2, 2026.
[Online]. Available: https://developers.google.com/search/docs/appearance/structured-data/local-business

[11] Google, "Introduction to robots.txt," *Google Search Central*. Accessed: Nov. 2, 2026. [Online].
Available: https://developers.google.com/search/docs/crawling-indexing/robots/intro

[12] Google, "Learn about sitemaps," *Google Search Central*. Accessed: Nov. 2, 2026. [Online].
Available: https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview

[13] Mozilla, "Content Security Policy (CSP)," *MDN Web Docs*. Accessed: Nov. 2, 2026. [Online].
Available: https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CSP

[14] Mozilla, "Subresource Integrity," *MDN Web Docs*. Accessed: Nov. 2, 2026. [Online].
Available: https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity

[15] OWASP Foundation, "Cross Site Scripting Prevention Cheat Sheet," *OWASP Cheat Sheet Series*. Accessed: Nov.
2, 2026. [Online]. Available: https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html

[16] Mozilla, "Client-side form validation," *MDN Web Docs*. Accessed: Nov. 2, 2026. [Online].
Available: https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation

[17] Mozilla, "Using the Fetch API," *MDN Web Docs*. Accessed: Nov. 2, 2026. [Online].
Available: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

[18] Typicode, "JSONPlaceholder - Free Fake REST API," *JSONPlaceholder*. Accessed: Nov. 2, 2026. [Online].
Available: https://jsonplaceholder.typicode.com/

[19] GitHub, "Configuring a publishing source for your GitHub Pages site," *GitHub Docs*. Accessed: Nov. 2, 2026.
[Online]. Available: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
