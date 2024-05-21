# Privacy Network

<i> Design and Implementation of Security-Conscious,
Location-Sharing in a Geosocial Network </i>

[Link to the research paper](https://ieeexplore.ieee.org/abstract/document/9288801)

## Architecture

### One Instance Architecture

![](idea/high/one-instance-architecture-color2x.png)

### Managing the MongoDB and Postgres

![](idea/high/writethrough.png)

### Scalable Architecture

![](idea/high/architecture-with-bg.png)

<!-- ![](presentation/assets/architecture.png) -->

## Privacy Filtration Logic

![](idea/high/privacyfiltrationtable.png)

## Privacy Network API Documentation

_[Privacy Network API Docs](https://privacynetwork.onrender.com/docs)_

<!-- _![OpenAPI Swagger API Docs](./idea/high/openapi.png)_ -->

### OpenAPI Swagger API Docs

_![OpenAPI Swagger API Docs](./idea/high/swaggeruser.png)_

### OpenAPI Swagger Schemas

_![OpenAPI Swagger Schemas](./idea/high/swaggerschema.png)_

<!--
### A. Registration - <i> User </i>

![](presentation/assets/registration.png)

### B. Registration - <i> LSSNS </i>

![](presentation/assets/regnlssn.png)

### C. <i> mSON </i> user login, authentication and key generation

![](presentation/assets/auth.png)

### D. <i> LSSNS </i> login, authentication and key generation

![](presentation/assets/authlssns.png)

### E. Distance threshold registration

![](presentation/assets/distanceregistration.png)

### F. User location update

![](presentation/assets/updatelocation.png)

### G. Friend's location query

![](presentation/assets/queryfriend.png) -->

### Login Page

<!-- ![](presentation/assets/Login_Speed.gif) -->

![](idea/gifs/Auth2.gif)

### Landing Page

<!-- ![](presentation/assets/Landing_Speed.gif) -->

![](idea/gifs/Dashboard.gif)

<!-- ![](presentation/assets/FriendsPage_Speed.gif) -->

<!-- ![](presentation/assets/Map_Speed.gif) -->

### Map Page: Real-Time Location Updation

![](<idea/gifs/Location%20update%20wrt%20Query%20(Fixed%20Position).gif>)

![](<idea/gifs/Location%20update%20wrt%20Query%20(Movement).gif>)

### Map Page: Privacy Filtration

![](idea/gifs/Set%20Properties%20Simulation.gif)

### Map Page: Real-Time Location Sharing

![](idea/gifs/Privacy%20Network%20Final%20GIF.gif)

## Tech Stack

- TypeScript
- React with _Google Maps API_ and _Material UI_
- Node
- Express
- WebSockets
- MongoDB
- Postgres with PostGIS
- Swagger

<!-- ![](presentation/assets/techstack.png) -->

## Setting up locally

The codebase is organized as :

1. _ts-frontend_ - The react frontend
2. _backend/ts-backend_ - The primary express backend with mongoDB
3. _backend/loc_ - The secondary express backend with Postgres
4. _backend/ws_ - The websocket backend

- Clone the PrivacyNetwork repository

```bash
    git clone git@github.com:sanam2405/PrivacyNetwork.git
    cd PrivacyNetwork
```

- Run the frontend

```bash
    cd ts-frontend
    npm install
    npm run dev
```

- Run the express backend

```bash
    cd backend/ts-backend
    npm install
    npm run dev
```

- Run the loc backend

```bash
    cd backend/loc
    npm install
    npm run dev
```

- Run the websocket backend

```bash
    cd backend/ws
    npm install
    npm run build
    npm start
```

## Contributors

- `Manas Pratim Biswas` -
  [LinkedIn](https://www.linkedin.com/in/manas-pratim-biswas/)
- `Anumoy Nandy` -
  [LinkedIn](https://www.linkedin.com/in/anumoy-nandy-9b527b204/)
- `Kunal Pramanick` -
  [LinkedIn](https://www.linkedin.com/in/kunal-pramanick-9755061b0/)

## Mentor

- `Dr. Munmun Bhattacharya`
