using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Timers;
using System.Web;

namespace GameOfLife.Hubs
{
    public class GameHub : Hub
    {
        static private Dictionary<string, World> Worlds = new Dictionary<string, World>();

        [HubMethodName("StartSelfGame")]
        public void StartSelfGame(string[] pattern)
        {
            if (Worlds.ContainsKey(Context.ConnectionId)) Worlds[Context.ConnectionId].aTimer.Enabled = false;
            Worlds[Context.ConnectionId] = new World(pattern, Context.ConnectionId, "self");
        }

        [HubMethodName("StartAllGame")]
        public void StartAllGame(string[] pattern)
        {
            if (Worlds.ContainsKey(Context.ConnectionId)) Worlds[Context.ConnectionId].aTimer.Enabled = false;
            Worlds[Context.ConnectionId] = new World(pattern, Context.ConnectionId, "all");
        }

        [HubMethodName("PauseGame")]
        public void PauseGame()
        {
            if (Worlds.ContainsKey(Context.ConnectionId)) Worlds[Context.ConnectionId].aTimer.Enabled = !Worlds[Context.ConnectionId].aTimer.Enabled;
        }

        [HubMethodName("StopGame")]
        public void StopGame()
        {
            if (Worlds.ContainsKey(Context.ConnectionId)) Worlds[Context.ConnectionId].aTimer.Enabled = false;
        }
    }
}