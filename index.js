
document.getElementById("app").innerHTML = `
<h1>Hello Desk CSAT</h1>
<div>
  This script will 
  <ul>
    <li>Connect a user to Desk</li>
    <li>Add a HANDLER to listen for messages</li>
    <li>Creates a ticket</li>
    <li>Waits for 10 seconds</li>
    <li>Ticket is closed</li>
    <li>SDK receives CSAT request (via HANDLER)</li>
    <li>Shows the content on console</li>
  </ul>
</div>
`;

var APP_ID = "";
var USER_ID = "deskcustomer";
var ACCESS_TOKEN = null;

/////////////////////////////////////////////////////
// Implementing Sendbird SDK and SendBird Desk SDK
/////////////////////////////////////////////////////

var SELECTED_TICKET = null;

var sb;
sb = new SendBird({ appId: APP_ID });

sb.connect(USER_ID, ACCESS_TOKEN, (res, err) => {
    if (err) {
        console.log(err);
    } else {
        console.log('Connected to SendBird');
        addHandler();
        SendBirdDesk.init(SendBird);
        SendBirdDesk.authenticate(USER_ID, ACCESS_TOKEN, (res, err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Connected to SendBird Desk');
                createTicket();
            }
        });
    }
});

function addHandler() {
    var channelHandler = new sb.ChannelHandler();
    channelHandler.onMessageReceived = (channel, message) => {
        console.log("Message received", message);
    };
    sb.addChannelHandler("UNIQUE_HANDLER_ID", channelHandler);
}

function createTicket() {
    const title = "Sendbird test " + new Date();
    const message = "Sendbid test message";
    if (!title || !message) {
        alert("Please enter a ticket name and message");
        return;
    }
    SendBirdDesk.Ticket.create(title, USER_ID, (ticket, err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Ticket created", ticket);
            SELECTED_TICKET = ticket;
            sendTicketMessage();
        }
    });
}

function sendTicketMessage() {
    if (!SELECTED_TICKET) {
        console.log("No active ticket");
    } else {
        const message = 'First message';
        if (!message) {
            return;
        }
        if (!SELECTED_TICKET) {
            return;
        }
        SELECTED_TICKET.channel.sendUserMessage(message, (message, error) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Message sent to the ticket');
                waitAndCloseTicket();
            }
        })
    }
}

function waitAndCloseTicket() {
    if (!SELECTED_TICKET) {
        console.log("No active ticket");
    } else {
        setTimeout(() => {
            SELECTED_TICKET.close("Closing ticket", (ticket, error) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Ticket closed");
                }
            });
        }, 10 * 1000);
    }
}

function submitCSATfeedback() {
    if (!SELECTED_TICKET) {
        console.log("No active ticket");
    }
    const USER_MESSAGE = "This is my CSAT feedback";
    const SCORE = 3;
    const COMMENT = "This is my CSAT comment";
    SELECTED_TICKET.submitFeedback(
        USER_MESSAGE,
        SCORE,
        COMMENT,
        (ticket, error) => {
            if (error) {
                console.log(error);
            } else {
                console.log("CSAT feedback sent");
            }
        }
    );
}
