namespace GameOfLife.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class patterndetail : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.PatternDetails", "Coordinate", c => c.String());
            DropColumn("dbo.PatternDetails", "X");
            DropColumn("dbo.PatternDetails", "Y");
        }
        
        public override void Down()
        {
            AddColumn("dbo.PatternDetails", "Y", c => c.Int(nullable: false));
            AddColumn("dbo.PatternDetails", "X", c => c.Int(nullable: false));
            DropColumn("dbo.PatternDetails", "Coordinate");
        }
    }
}
