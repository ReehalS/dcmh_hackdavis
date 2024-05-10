# CommunityCache
## Inspiration
We were inspired by Davis Community Meals and Housing's (DCMH) passion and dedication to supporting low-income and unhoused individuals. We understood their problem of not having an inventory tracking system and a transparent way of asking for highly needed donations. To contribute to their mission, we wanted to create an app that helps DCMH organize their inventory and get more donations from community members. 
## What it does
Public users or donors see a home page where they can choose to make an online, monetary donation or an in-person, items donation. Types of in-person donations that donors can make are shown in filtered tables because it is important that the shelter does not get too much of one donation and they have enough space to store the donations. The table specifies the item name, the amount still needed, and a link to choose how many items you want to donate to DCMH.

Admin users or DCMH volunteers have a separate page where they can track the inventory of the items at the center and the stock of their inventory is shown to users so they can know exactly how much of each item DCMH needs. Admin also can notify users through email when there are items with a large amount of need.
## How we built it
We used MongoDB, Express.js, and Node.js for the backend and React.js and Material UI for the frontend.
## Challenges we ran into
We had challenges with thinking of a project idea and streamlining user and admin workflows.
## Accomplishments that we're proud of
We're proud that one of our teammates redesigned a logo for DCMH and we were able to make and deploy a working prototype of our app. 
## What we learned
We learned that delegating work, communicating, and staying organized is important.
## What's next for DCMH Inventory Tracker
Next, we would like to work on adding an about page so donors know who they are donating to, making our page easier to understand for first-time users, and adapting our app to mobile devices. 




# Run Frontend

`cd frontend` 

`npm install` // if packages not installed or first time

`npm start`

# Run Backend

`cd server`

`npm install`   // if packages not installed or first time

`npm run dev`  // runs nodemon
