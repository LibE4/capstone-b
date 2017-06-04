using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace GameOfLife.Models
{
    public class Pattern
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        [Required]
        public string UID { get; set; }
    }
}