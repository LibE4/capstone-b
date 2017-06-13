using GameOfLife.DAL;
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
        readonly IPatternRepository _repo;
        private ApplicationDbContext _context;
        public PatternController()
        {
            _context = new ApplicationDbContext();
            _repo = new PatternRepository();
        }
        public PatternController(IPatternRepository repo)
        {
            _repo = repo;
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
            var uid = User.Identity.GetUserId();
            return _context.Patterns.Where(x => x.UID == uid).ToList();
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
            StaticValues.newPatternDetail = value.newPatternDetail.ToObject<string[]>();
            _repo.Save(newPattern);
        }

        [Route("api/pattern/{id}")]
        [HttpDelete]
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
