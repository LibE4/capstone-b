using GameOfLife.Models;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Web.Http;

namespace GameOfLife.Controllers
{
  
    public class PatternController : ApiController
    {
        private ApplicationDbContext _context;

        //Use Dependency Injection instead
        public PatternController()
        {
            _context = new ApplicationDbContext();
        }
        [Route("api/pattern/{id}")]
        [HttpGet]
        public Pattern GetOne(int id)
        {
            return _context.Patterns.Find(id);
        }

        [Route("api/pattern")]
        [HttpGet]
        public List<Pattern> GetAll()
        {
            return _context.Patterns.ToList();
        }

        [Route("api/pattern")]
        [HttpPost]
        public void Add([FromBody]dynamic value)
        {
            Pattern newPattern = new Pattern
            {
                Name = value.Name.Value, // JToken
                UID = User.Identity.GetUserId()
            };
            _context.Patterns.Add(newPattern);
            _context.SaveChanges();
        }

        [Route("api/delete/{id}")]
        [HttpPost]
        public void Delete(int id)
        {
            Pattern x = _context.Patterns.Find(id);
            _context.Patterns.Remove(x);
            _context.SaveChanges();
        }

        [Route("api/edit")]
        [HttpPut]
        public void Edit(Pattern item)
        {
            Pattern x = _context.Patterns.Find(item.Id);
            x.Name = item.Name;
            _context.Entry(x).State = EntityState.Modified;
            _context.SaveChanges();
        }
    }
}
