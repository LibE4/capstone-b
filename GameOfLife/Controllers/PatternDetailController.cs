using GameOfLife.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace GameOfLife.Controllers
{
    public class PatternDetailController : ApiController
    {
        private ApplicationDbContext _context;

        //Use Dependency Injection instead
        public PatternDetailController()
        {
            _context = new ApplicationDbContext();
        }

        [Route("api/patterndetail/{id}")]
        public List<PatternDetail> GetOne(int id)
        {
            return _context.PatternDetails.Where(x => x.PatternId == id).ToList();
        }

        [Route("api/patterndetail")]
        public List<PatternDetail> GetAll()
        {
            return _context.PatternDetails.ToList();
        }

        [Route("api/patterndetail")]
        [HttpPost]
        public void Add(PatternDetail newPatternDetail)
        {
            _context.PatternDetails.Add(newPatternDetail);
            _context.SaveChanges();
        }

        [Route("api/patterndetail/{id}")]
        [HttpDelete]
        public void Delete(int id)
        {
            List<PatternDetail> x = GetOne(id);
            _context.PatternDetails.RemoveRange(x);
            _context.SaveChanges();
        }

        [Route("api/edit")]
        [HttpPut]
        public void Edit(PatternDetail item)
        {
            PatternDetail w = _context.PatternDetails.Find(item.Id);
            w.Coordinate = item.Coordinate;
            _context.Entry(w).State = EntityState.Modified;
            _context.SaveChanges();
        }
    }
}
