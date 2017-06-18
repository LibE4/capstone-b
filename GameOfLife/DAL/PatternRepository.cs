using GameOfLife.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Web;
using Dapper;
using GameOfLife.Controllers;
using System.Configuration;
using System.Data.SqlClient;

namespace GameOfLife.DAL
{
    public class PatternRepository : IPatternRepository
    {
        readonly IDbConnection _dbConnection;
        public PatternRepository(IDbConnection connection)
        {
            _dbConnection = connection;
        }
        public PatternRepository()
        {
            _dbConnection = new SqlConnection(ConfigurationManager.ConnectionStrings["DefaultConnection"].ConnectionString);
        }
        public void Save(Pattern newPattern)
            {
                var sql = @"Insert into Patterns(name,UID)
                            Values(@name,@UID);
                            SELECT SCOPE_IDENTITY();";

                var newPatternId = Convert.ToInt32(_dbConnection.ExecuteScalar(sql, newPattern));
                for (int i = 0; i < StaticValues.newPatternDetail.Length; i++)
                {
                    PatternDetail newPatternDetail = new PatternDetail
                    {
                        Coordinate = StaticValues.newPatternDetail[i], // JToken
                        PatternId = newPatternId
                    };
                    new PatternDetailController().Add(newPatternDetail);
                }
                StaticValues.newPatternDetail = null;
            }

        public Pattern GetOne(int id)
        {
            var sql = @"select Id, Name, UID  from Patterns
                            where Id = @id;";

            return _dbConnection.QueryFirstOrDefault<Pattern>(sql, new { Id = id});
        }
    }
}