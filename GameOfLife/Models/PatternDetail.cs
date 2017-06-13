using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace GameOfLife.Models
{
    public class PatternDetail
    {
        [Key]
        public int Id { get; set; }
        public string Coordinate { get; set; }
        public int PatternId { get; set; }
    }
}