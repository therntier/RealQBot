/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    stateEndpoint: process.env.BotStateEndpoint,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;

// Main dialog with LUIS

var respGreeting = ["What?","Hey."];
var respHowIsQ = ["Meh","I haven't killed myself.","Alive.","One day closer."];
var respHowIsPoker = ["So fucked.  I get three outted on the river every fucking time.  So sick.",
"Shitty.",
"I hate poker.",
"Meh"];


var recognizer = new builder.LuisRecognizer(LuisModelUrl);
var intents = new builder.IntentDialog({ recognizers: [recognizer] })

bot.recognizer(recognizer);

bot.dialog('Greeting', [
    function (session, args, next) {
        session.send(respGreeting[Math.floor(Math.random()*respGreeting.length)]);
    }
]).triggerAction({
    matches : 'Greeting'
});

bot.dialog('howIsQ', [
    function (session, args, next) {
        session.send(respHowIsQ[Math.floor(Math.random()*respHowIsQ.length)]);
    }
]).triggerAction({
    matches : 'howIsQ'
});
    
bot.dialog('howIsPoker', [
    function (session, args, next) {
        session.send(respHowIsPoker[Math.floor(Math.random()*respHowIsPoker.length)]);
    }
]).triggerAction({
    matches : 'howIsPoker'
});

bot.dialog('goSomeplace', [
    function (session,args,next)  {
        var intent = args.intent;
        var placeEntity = builder.EntityRecognizer.findEntity(intent.entities, 'Place');
    session.send("Why would I want to go to " +  placeEntity.entity);
    }
]).triggerAction({
    matches : 'goSomeplace'
});

bot.dialog('/', intents);    

