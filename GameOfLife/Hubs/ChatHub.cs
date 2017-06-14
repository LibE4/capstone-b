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
        public void NewChatMessage(string message)
        {
            string fromUserId = Context.ConnectionId;
            var fromUser = loggedInUsers.FirstOrDefault(x => x.ConnectionId == fromUserId);
            Clients.All.RecievingPrivateMessage(fromUser.name, fromUserId, message);
        }


        static List<user> loggedInUsers = new List<user>();
        public void Login(string name)
        {
            var users = loggedInUsers.ToArray();
            var len = users.Length;
            if (len == 0)
            {
                var user = new user { name = name, ConnectionId = Context.ConnectionId, status = "Online" };
                loggedInUsers.Add(user);
                Clients.Others.newOnlineUser(user);
            }
            else
            {
                for (int i = 0; i < len; i++)
                {
                    if (users[i].ConnectionId == Context.ConnectionId) break;
                    if (i == len - 1)
                    {
                        var user = new user { name = name, ConnectionId = Context.ConnectionId, status = "Online" };
                        loggedInUsers.Add(user);
                        Clients.Others.newOnlineUser(user);
                    }
                }
            }
            var oSerializer = new System.Web.Script.Serialization.JavaScriptSerializer();
            string sJSON = oSerializer.Serialize(loggedInUsers);
            Clients.Caller.getOnlineUsers(sJSON);
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