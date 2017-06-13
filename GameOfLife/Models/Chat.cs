using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace GameOfLife.Models
{
    public class user
    {
        public string ConnectionId { get; set; }
        public int id { get; set; }
        public string name { get; set; }
        public string status { get; set; }
    }
}