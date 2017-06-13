namespace GameOfLife.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class pattern : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Patterns", "Description", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Patterns", "Description");
        }
    }
}
