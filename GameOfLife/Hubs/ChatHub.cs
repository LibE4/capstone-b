using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GameOfLife.Hubs
{
    public class ChatHub : Hub
    {
        [HubMethodName("ChatMessage")]
        public void NewChatMessage(string name, string message)
        {
            Clients.All.addNewMessageToPage(name, message);
        }
    }
}