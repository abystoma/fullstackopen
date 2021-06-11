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
        User clicks "submit"
        end note
        Browser->Server: HTTP POST https://studies.cs.helsinki.fi/exampleapp/new_note (form="name")
        Browser-> Server: HTTP Get https://studies.cs.helsinki.fi/exampleapp/notes
        Server-->Browser: HTML code
        note over Browser:
        Styling 
        end note
        Browser->Server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.css
        Server-->Browser: main.css
        note over Browser:
        js file
        end note
        Browser->Server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.js
        Server-->Browser: main.js
        note over Browser:
        js executes
        end note
        Browser->Server: HTTP GET /exampleapp/data.json
        note over Server
        Waits until response status is 200 and parses data into list
        end note
        Server-->Browser: "notes" element appended with the data
        ```
    - Diagram </br>
        ![Diagram](https://i.imgur.com/u31FWsq.png)

## Single page app
The situation where the user goes to the single page app version of the notes app at `https://studies.cs.helsinki.fi/exampleapp/spa`

- Text 
    ```
    Browser-> Server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/spa
    Server-->Browser: HTML code
    note over Browser:
    Styling 
    end note
    Browser->Server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/main.css
    Server-->Browser: main.css
    note over Browser:
    js file
    end note
    Browser->Server: HTTP GET https://studies.cs.helsinki.fi/exampleapp/spa.js
    Server-->Browser: main.js
    note over Browser:
    js executes
    end note
    Browser->Server: HTTP GET /exampleapp/data.json
    Server-->Browser: Contents as json object
    note over Browser
    Browser renders contents into list
    end note
    ```
- Diagram </br>
    ![Diagram](https://i.imgur.com/9bp77Nl.png)

## New note

The situation where the user creates a new note using the single page version of the app.

- Text 
    ```
    Server->Browser: HTTP POST /exampleapp/new_note_spa
    Browser-->Server: Status code 201 : created
    note over Server
    Event handler pushes "notes_form" content into array and renders to browser
    end note 
    ```
- Diagram </br>
    ![Diagram](https://i.imgur.com/iomu7ks.png)