using GameOfLife.Models;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Threading.Tasks;
using System.Diagnostics;

namespace GameOfLife.Hubs
{
    public class ChatHub : Hub
    {
        [Authorize]
        [HubMethodName("ChatMessage")]
        public void NewChatMessage(string name, string message)
        {
            Clients.All.addNewMessageToPage(name, message);
        }


        static readonly HashSet<string> Rooms = new HashSet<string>();
        static List<user> loggedInUsers = new List<user>();
        public string Login(string name)
        {
            var user = new user { name = name, ConnectionId = Context.ConnectionId, status = "Online" };
            Clients.Caller.rooms(Rooms.ToArray());
            Clients.Caller.setInitial(Context.ConnectionId, name);
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
            string sJSON = oSerializer.Serialize(loggedInUsers);
            Clients.Caller.getOnlineUsers(sJSON);
            loggedInUsers.Add(user);
            Clients.Others.newOnlineUser(user);
            return name;
        }

        public void SendPrivateMessage(string toUserId, string message)
        {
            string fromUserId = Context.ConnectionId;
            var toUser = loggedInUsers.FirstOrDefault(x => x.ConnectionId == toUserId);
            var fromUser = loggedInUsers.FirstOrDefault(x => x.ConnectionId == fromUserId);
            if (toUser != null && fromUser != null)
            {
                Clients.Client(toUserId).RecievingPrivateMessage(fromUser.name, fromUserId, message);
                Clients.Caller.RecievingPrivateMessage(fromUser.name, fromUserId, message);
            }
        }
        public void UpdateStatus(string status)
        {
            string userId = Context.ConnectionId;
            loggedInUsers.FirstOrDefault(x => x.ConnectionId == userId).status = status;
            Clients.Others.statusChanged(userId, status);

        }
        public void UserTyping(string connectionId, string msg)
        {
            var id = Context.ConnectionId;
            Clients.Others.isTyping(id, msg);
        }
        public override System.Threading.Tasks.Task OnDisconnected(bool stopCalled)
        {
            var item = loggedInUsers.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            if (item != null)
            {
                loggedInUsers.Remove(item); // list = 
                var id = Context.ConnectionId;
                Clients.Others.newOfflineUser(item);
            }
            return base.OnDisconnected(true);
        }
        public void Connect(string userName)
        {
            var id = Context.ConnectionId;

            if (loggedInUsers.Count(x => x.ConnectionId == id) == 0)
            {
                loggedInUsers.Add(new user { ConnectionId = id, name = userName });
                Clients.Caller.onConnected(id, userName, loggedInUsers);
                Clients.AllExcept(id).onNewUserConnected(id, userName);
            }
        }
    }
}