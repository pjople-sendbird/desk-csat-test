# desk-csat-test
Simple test for Desk how to receive CSAT request

Key is to add a HANDLER for receiving messages
```
    var channelHandler = new sb.ChannelHandler();
    channelHandler.onMessageReceived = (channel, message) => {
        console.log("Message received", message);
    };
    sb.addChannelHandler("UNIQUE_HANDLER_ID", channelHandler);
```
For this simple demo, we're printing the messages in the console.

## Receiving a CSAT request
When you close the ticket
```
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
```
You will receive a new message (see screenshot below)

![Message obect](https://raw.githubusercontent.com/warodri-sendbird/desk-csat-test/main/img/message-object.png)

With all the CSAT information
```
{
  "type":"SENDBIRD_DESK_CUSTOMER_SATISFACTION",
    "body":{
      "customerSatisfactionScore":null,
      "customerSatisfactionComment":null,
      "status":"WAITING",
      "state":"WAITING",
      "ticketId":7673904
   }
}
```
In the ```message``` attribute you can find the text to show to your customers and defined in the Dashboard:

```
{
  ... 
  message: "How was your experience with us?"
  ...
}
```
