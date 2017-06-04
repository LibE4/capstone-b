namespace GameOfLife.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class pattern1 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Patterns", "UID", c => c.String(nullable: false));
            DropColumn("dbo.Patterns", "UserId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Patterns", "UserId", c => c.Int(nullable: false));
            DropColumn("dbo.Patterns", "UID");
        }
    }
}
