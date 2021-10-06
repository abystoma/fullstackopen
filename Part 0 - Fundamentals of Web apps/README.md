The diagrams were made using [websequencediagrams](https://www.websequencediagrams.com/) service.

## new Note
1. The chain of events caused by opening the page `https://studies.cs.helsinki.fi/exampleapp/notes`.

    - Text 
        ```
        browser->server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/notes
        server-->browser: HTML-code
        browser->server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.css
        server-->browser: main.css
        browser->server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.js
        server-->browser: main.js

        note over browser:
        browser starts executing js-code
        that requests JSON data from server 
        end note

        browser->server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/data.json
        server-->browser: [{ content: "HTML is easy", date: "2019-05-23" }, ...]

        note over browser:
        browser executes the event handler
        that renders notes to display
        end note 
        ```
    - Diagram </br>
        ![Diagram](https://i.imgur.com/Vy85v3w.png)

2. The situation where the user creates a new note on page `https://studies.cs.helsinki.fi/exampleapp/notes` by writing something into the text field and clicking the submit button.
    - Text 
        ```
        note over Browser:
        User writes something and clicks "submit"
        end note
        Browser->Server: HTTP POST https://studies.cs.helsinki.fi/exampleapp/new_note 
        Server-> Browser: HTTP 302 Redirect to https://studies.cs.helsinki.fi/exampleapp/notes
        Browser->Server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/notes 
        Server-> Browser: HTML-code
        Browser->Server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.css
        Server-->Browser: main.css
        Browser->Server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.js
        Server-->Browser: main.js
        note over Browser:
        Browser starts executing JS code that requests JSON data from the server 
        end note
        Browser->Server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/data.json
        Server->Browser: [{content: "HTML is easy", Date: "2021-06-11"},...]
        note over Browser
        Browser executes the event handler, that renders note to display. 
        Including that submitted note and any other notes submitted by 
        other users during this time interval.
        end note
        ```
    - Diagram </br>
        ![Diagram](https://i.imgur.com/LUG8kpg.png)

## Single page app
The situation where the user goes to the single page app version of the notes app at `https://studies.cs.helsinki.fi/exampleapp/spa`

- Text 
    ```
    Browser-> Server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/spa
    Server-->Browser: HTML-code

    Browser->Server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.css
    Server-->Browser: main.css

    Browser->Server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    Server-->Browser: spa.js
    note over Browser:
    Browser starts executing JS-code that requests JSON data from server
    end note
    Browser->Server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/data.json
    Server->Browser: [{content: "HTML is easy", Date: "2021-06-11"},...]
    note over Browser
    Browser executes the event handler that renders notes to display
    end note
    ```
- Diagram </br>
    ![Diagram](https://i.imgur.com/aLBE1yA.png)

## New note

The situation where the user creates a new note using the single page version of the app.

- Text 
    ```
    note over Browser:
    User writes something and clicks "submit"
    end note
    Server->Browser: HTTP POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    Browser-->Server:201 Created - Response: {"message":"note created"}
    note over Browser
    Browser uses the previously fetched Javascript to update the page content and 
    includes the new note. OR
    Event handler pushes "notes_form" content into array and renders to browser.
    end note 
    ```
- Diagram </br>
    ![Diagram](https://i.imgur.com/e9xBNQr.png)