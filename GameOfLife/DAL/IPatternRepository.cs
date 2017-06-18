using GameOfLife.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameOfLife.DAL
{
    public interface IPatternRepository
    {
        void Save(Pattern newPattern);
        Pattern GetOne(int id);
    }
}
