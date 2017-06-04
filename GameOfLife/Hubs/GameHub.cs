using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace GameOfLife.Hubs
{
    public class GameHub : Hub
    {
        [HubMethodName("StartGame")]
        public void StartGame(string[] pattern)
        {
            new World(pattern);
        }
    }
}