About
-----------------

For a given medication name, medication search will utilize fuzzy search to return both the brand name and associated generic name of the medication along with strengths.  

The brand name is the name given by the company for marketing, sales purpose.

The generic name is the active ingredient. 

This is a short guide about the service, setting up the system and environment dependencies required for the application to run.  

How does the search service work
-----------------

Search supports partial searching (i.e "lipi") and spelling mistakes (i.e "lipitore")  

The results returned are ordered by highest matching score.  

This is a react front end with a node/express backend.   

Runs on http://localhost:4000/ 
 
Limitations
-----------------

Due to the nuances of the FDA dataset (some I have yet to uncover), this service will be regularly updated to accommodate those nuances.  

Fuzzy search has limitations and therefore might be migrated to an alternative search. 

This is a react and express application built in one and uses a proxy to server data requests, therefore this is not an optimal solution for production use. 

Data Source
-----------------

The medication list /data/medications.json was created by scrubbing FDA dataset to remove erroneous characters, duplicate records and medications withdrawn, the medication dataset is from Jan 2019  

* [FDA](https://www.fda.gov/drugs/drug-approvals-and-databases/drugsfda-data-files) - FDA data set  

Project Structure
-----------------

**react front end**  

/src   
/public   
 

**express application**

/Server

--server/routes         - API layer, configued to run on default port **3000**    
--server/controller     - Manages the request to find medications    
--server/data           - Medication data file  
--server/tests          - Unit tests for api 


Node Library Dependencies
-------------------------

The dependencies for the service application should be downloaded using the
`npm install` or `yarn`  

You must run this from the top level of the project, so ``npm`` has access to
the **package.json** file where the dependencies are.

Start Service
---------------------

To start both client and server , the command is ``npm run start``

To start the server service in debug, the command is ``npm run start-server:debug``

Run Unit Tests
---------------------

To run server side unit tests, the command is ``npm run test-server``  
To run server side unit tests in debug, the command is ``npm run test-server:debug``

Postman 
---------------------

GET  
http://localhost:3000/api/search/?q=lipitor  
'Content-Type: application/json'   

Curl
---------------------

curl --location --request GET 'http://localhost:3000/api/search/?q=lipitor' \
--header 'Content-Type: application/json' 

## Built With

* [express](https://expressjs.com/) - web framework
* [helmet](https://helmetjs.github.io/) - Helmet helps secure Express apps by setting various HTTP headers
* [nodemon](https://nodemon.io/) - monitor for any changes in source and automatically restart your server
* [fuse.js](https://fusejs.io/) - lightweight fuzzy-search library
* [winston](https://www.npmjs.com/package/winston) - logger
* [morgan](https://www.npmjs.com/package/morgan) - HTTP request logger middleware for node.js
* [jest](https://jestjs.io/) - testing framework
* [supertest](https://github.com/visionmedia/supertest#readme) - high-level abstraction for testing HTTP
* [react](https://reactjs.org/) - React JS library




