## How to setup Faveo Client Form Vue PWA

This Vue PWA app has been compiled and contains all the required assets to serve the webpage as PWA. To successfully host and serve this app you must follow the below steps.

- Upload the **vueapp** directory on the server.
- Set `vueapp/dist` as Document root directory for your virtual host or domain host.
- Ensure the SSL certificates are installed on the server and app is served with "https"
- Edit `vueapp/public/config.js` as directed
  - 'apiBaseURL' : Set URL where Faveo is running on other domain or subdomain
  - 'theme' : Basic bootstrap theme class name as string
  - 'color' : Used as color of buttons and other elements on the page HEX color code
  - 'defaultRequester' : Allows to decide whether users should be able to create requester or not. If you do not want to provide users with option to create requester then pass an integer ID of a user from Faveo. App will create tickets under that user in Faveo.
- **Important!** If Faveo is on different domain than the app then the browsers will throw CORS errors. In that case you must update Faveo server configuration to allow cross origin access. There are different ways to allow CORS on different servers. Use appropriate method based on your Apache or Nginx server.

> Note: While enabling CORS always open access for selected domain (in this case domain of the Vue app) to ensure the security risks are low.

### Server Specification
- PHP 8.1
- Apache/NGINX/IIS web server

### Form using PHP Mail function:
- This form emails the field filled to support email address
- There is no response to this form, as it sends form data over via email. So the ticket id for the generated ticket is not shown on the screen

  [Click here to check how to use PHP APP](phpapp/README.md)

### Form using Faveo Create ticket API:
- The form is the same replica of the form, which shows on your Faveo support portal
- The content/design of the form comes from your support portal form
- on submission of the form, ticket id is shown on the screen, and the option to print the same

  [Click here to check how to use Vue APP](vueapp/README.md)

### Technical specifications
Both these forms are built on Core PHP, HTML, CSS, JS, and PWA
