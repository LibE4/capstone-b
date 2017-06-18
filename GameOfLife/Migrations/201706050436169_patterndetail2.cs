namespace GameOfLife.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class patterndetail2 : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.PatternDetails", "Pattern_Id", "dbo.Patterns");
            DropIndex("dbo.PatternDetails", new[] { "Pattern_Id" });
            AddColumn("dbo.PatternDetails", "PatternId", c => c.Int(nullable: false));
            DropColumn("dbo.PatternDetails", "Pattern_Id");
        }
        
        public override void Down()
        {
            AddColumn("dbo.PatternDetails", "Pattern_Id", c => c.Int());
            DropColumn("dbo.PatternDetails", "PatternId");
            CreateIndex("dbo.PatternDetails", "Pattern_Id");
            AddForeignKey("dbo.PatternDetails", "Pattern_Id", "dbo.Patterns", "Id");
        }
    }
}
