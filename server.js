const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');
var express = require('express');
var bodyparser = require('body-parser');
var cors = require('cors')
var app = express();

const PROJECT_ID = 'chatbot-nfey'; //https://dialogflow.com/docs/agents#settings

//middle ware
app.use(cors());
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

const sessionId = uuid.v4();
const PORT = process.env.PORT || 8081;

app.get('*', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/api', (req, res) => {
  runSample(req.body.message).then(data => {
    res.send({ "bot": data });
  })
});

async function runSample(query, projectId = PROJECT_ID) {
  // Create a new session
  const sessionClient = new dialogflow.SessionsClient({
    keyFilename: "chatbot-nfey-2722497a4fe0.json"
  });
  const sessionPath = sessionClient.projectAgentSessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // The query to send to the dialogflow agent
        text: query,
        // The language used by the client (en-US)
        languageCode: 'en-US',
      },
    },
  };
  const res =  await sessionClient.detectIntent(request).then(responses => {
    console.log('Detected intent');
    const result = responses[0].queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
      console.log(`  Intent: ${result.intent.displayName}`);
    } else {
      console.log(`  No intent matched.`);
    }
    return result.fulfillmentText;
  });
return res;
}

app.listen(PORT, function () {
  console.log(`Server running at port ${PORT}`);
})

