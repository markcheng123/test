## BACKEND

[Vert.x REST API Project](https://github.com/markcheng123/test/tree/main/backend/vert.x)

This project uses Vert.x framework to create Http server and exposed several end-points to create/update/read data. The project uses:

- log4j library to log info/error/debug messages
- JUnit/Vertx-unit libraries for unit testing
- JSON-Java library to convert JSON to Xml

The end-points exposed are as below:

| Method | Path | Payload Example | Returns |
| ----------- | ----------- | ----------- | ----------- |
| POST | /addRetrospective | Payload 1 | 201, 400, 409 |
| POST | /addFeedback | Payload 2 | 201, 400, 404, 409 |
| PUT | /updateFeedback | Payload 2 | 200, 400, 404 |
| GET | /searchRetrospective?currentPage=1&pageSize=5 |  | 200, 400 |
| GET | /searchRetrospectiveByDate?date=27/07/2022&currentPage=a&pageSize=2 | currentPage and pageSize are optional | 200, 400 |

Payload 1:
```json
{
  "name": "Retrospective 1",
  "summary": "Post release retrospective",
  "date": "28/07/2022",
  "participants": [
    "Viktor",
    "Gareth",
    "Mike"
  ]
}
```
Payload 2:
```json
{
  "retroName": "Retrospective 1",
  "name": "Gareth",
  "body": "Sprint objective met",
  "type": "Positive"
}
```

```json
{
  "retroName": "Retrospective 1",
  "name": "Viktor",
  "body": "Too many items piled up in the awaiting QA",
  "type": "Negative"
}
```

```json
{
  "retroName": "Retrospective 1",
  "name": "Mike",
  "body": "We should be looking to start using VS2015",
  "type": "Idea"
}
```
> Start the project
1. Run `mvn package`
2. Run `mvn exec:java -Dlog4j.configurationFile=src/conf/profile-log4j2.xml`
   <br/><br/>
---
<br/>

## FRONTEND

[React UI Project](https://github.com/markcheng123/test/tree/main/frontend/react-ui)

This project uses React and Redux Toolkit to build the single-page application. The dummy product data is downloaded from [dummyJSON](https://dummyjson.com/). The project uses

- Bootstrap for styling
- React Bootstrap components for user interaction

![alt text](https://raw.githubusercontent.com/markcheng123/test/main/frontend/react-ui/Screenshot.png)

> Start the project
1. Run `npm install`
2. Run `npm start`
   <br/><br/>
