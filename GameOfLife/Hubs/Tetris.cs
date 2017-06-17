using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Timers;
using System.Web;

namespace GameOfLife.Hubs
{
    public class Tetris
    {
        static int nGridX = 10, nGridY = 20;
        static int[][][] available_layouts = {
            new int[][] {
            new int[] { 0, 1, 0},
            new int[] { 1, 1, 1 }
            },
            new int[][] {
            new int[] { 0, 0, 1},
            new int[] { 1, 1, 1 }
            },
            new int[][] {
            new int[] { 1, 0, 0},
            new int[] { 1, 1, 1 }
            },
            new int[][] {
            new int[] { 0, 1, 1},
            new int[] { 1, 1, 0 }
            },
            new int[][] {
            new int[] { 1, 1, 0},
            new int[] { 0, 1, 1 }
            },
            new int[][] {
            new int[] { 1, 1, 1, 1}
            },
            new int[][] {
            new int[] { 1, 1},
            new int[] { 1, 1 }
            }
        };
        static string[] available_colors = { "cyan", "blue", "orange", "yellow", "green", "purple", "red" };
        // for storage of all drawBlocks info
        string[][] gameArea;

        int lineOfMerge = nGridY - 1, rowBuildup = nGridY - 1, totalLines = 0, totalShapes = 0;
        int gapToNextLevel = 2;
        int randomNum = (new Random()).Next(1, 7);
        Shape currentShape { get; set; }
        public List<string> keyboardAction = new List<string>();

        private readonly IHubContext _hubContext;
        private string _userConnectonId;
        public System.Timers.Timer aTimer { get; set; }

        public Tetris()
        {
        }
        public Tetris(string userConnectonId, string sendTo)
        {
            gameArea = new string[nGridY][];
            for (int r = 0; r < nGridY; r++)
            {
                gameArea[r] = new string[nGridX];
                for (int c = 0; c < nGridX; c++)
                {
                    gameArea[r][c] = null;
                }
            }
            currentShape = new Shape(3, 0, available_layouts[randomNum], available_colors[randomNum]);
            totalShapes = 1;
            _userConnectonId = userConnectonId;
            _hubContext = GlobalHost.ConnectionManager.GetHubContext<GameHub>();
            if (sendTo == "all")
            {
                aTimer = new System.Timers.Timer();
                aTimer.Elapsed += new ElapsedEventHandler(updateToAll);
                aTimer.Interval = 1000;
                aTimer.Enabled = true;
            }
            else
            {
                aTimer = new System.Timers.Timer();
                aTimer.Elapsed += new ElapsedEventHandler(updateToSelf);
                aTimer.Interval = 1000;
                aTimer.Enabled = true;
            }
        }

        public void updateToSelf(object sender, EventArgs e)
        {
            Tick();
            _hubContext.Clients.Client(_userConnectonId).updateTetrisInPage(currentShape, gameArea, rowBuildup, _userConnectonId);
        }

        public void updateToAll(object sender, EventArgs e)
        {
            Tick();
            _hubContext.Clients.All.updateTetrisInPage(currentShape, gameArea, rowBuildup, _userConnectonId);
        }

        public void Tick() // Passage of time
        {
            if (lineOfMerge == 0 || lineOfMerge == 1) aTimer.Enabled = false;
            handleEvent();
            currentShape.fallDown();
            if (!downClearance(currentShape, gameArea))
            {
                makeNewShape();
            }
        }

        // handle event
        public void handleEvent()
        {
            for (int e = 0; e < keyboardAction.Count; e++)
            {
                switch (keyboardAction[e])
                {
                    case "32": //spacebar
                        for (int i = currentShape.dy; i < nGridY - currentShape.dh; i++)
                        {
                            if (!downClearance(currentShape, gameArea))
                            {
                                break;
                            }
                            currentShape.dy += 1;
                        }
                        break;
                    case "37": //left arrow
                        if (leftClearance(currentShape, gameArea)) { currentShape.dx -= 1; }
                        break;
                    case "38": //up arrow
                        if ((currentShape.dy) > 1) { currentShape.dy -= 2; }
                        break;
                    case "39": //right arrow
                        if (rightClearance(currentShape, gameArea)) { currentShape.dx += 1; }
                        break;
                    case "40": //down arrow
                        if (downClearance(currentShape, gameArea))
                        {
                            currentShape.dy += 1;
                        }
                        break;
                    case "82": //r
                        if (rotateClearance(currentShape, gameArea)) { currentShape.angle = 90; setLayout(currentShape); }
                        break;
                    case "87": //w
                        if (rotateClearance(currentShape, gameArea)) { currentShape.angle = 270; setLayout(currentShape); }
                        break;
                }
                if (!downClearance(currentShape, gameArea))
                {
                    makeNewShape();
                    keyboardAction = new List<string>();
                    return;
                }
            }
            keyboardAction = new List<string>();
        }
        // gameArea manipulation methods
        public void mergeCurrentShape()
        {
            for (int r = 0; r < currentShape.dh; r++)
            {
                for (int c = 0; c < currentShape.dw; c++)
                {
                    if (currentShape.layout[r][c] == 1)
                    {
                        gameArea[(currentShape.dy + r)][(currentShape.dx + c)] = currentShape.color;
                    }
                }
            }
            lineOfMerge = currentShape.dy;
            rowBuildup = (rowBuildup >= currentShape.dy) ? currentShape.dy : rowBuildup;
        }

        public void checkLineFilled()
        {
            for (int r = 0; r < currentShape.dh; r++)
            {
                bool lineFilled = true;
                for (int c = 0; c < nGridX; c++)
                {
                    if (gameArea[(currentShape.dy + r)][c] == null)
                    {
                        lineFilled = false;
                        break;
                    }
                }
                if (lineFilled)
                {
                    totalLines++;
                    // increase game speed
                    if ((totalLines + 1) % gapToNextLevel == 0) aTimer.Interval *= 0.9;
                    string[] line = new string[nGridX];
                    for (int c = 0; c < nGridX; c++)
                    {
                        line[c] = null;
                    }
                    List<string[]> l = gameArea.ToList();
                    l.RemoveAt(currentShape.dy + r);
                    l.Insert(0, line);
                    gameArea = l.ToArray();
                }
            }
        }

        public void makeNewShape()
        {
            mergeCurrentShape();
            checkLineFilled();
            if (lineOfMerge != 0 && lineOfMerge != 1)
            {
                totalShapes++;
                randomNum = (new Random()).Next(1, 7);
                currentShape.dx = 3;
                currentShape.dy = 0;
                currentShape.layout = available_layouts[randomNum];
                currentShape.dh = available_layouts[randomNum].Count();
                currentShape.dw = available_layouts[randomNum][0].Count();
                currentShape.color = available_colors[randomNum];
                currentShape.angle = 0;
            }
        }

        // clearance
        public void setLayout(Shape currentShape)
        {
            // rotate cw
            if (currentShape.angle == 0)
            {
                return;
            }
            else
            {
                currentShape.dw = currentShape.layout.Count();
                currentShape.dh = currentShape.layout[0].Count();
            }
            int[][] newLayout = new int[currentShape.dh][];
            for (int r = 0; r < currentShape.dh; r++)
            {
                newLayout[r] = new int[currentShape.dw];
                for (int c = 0; c < currentShape.dw; c++)
                {
                    switch (currentShape.angle)
                    {
                        case 90:
                            newLayout[r][c] = currentShape.layout[currentShape.dw - c - 1][r];
                            break;
                        case 270:
                            newLayout[r][c] = currentShape.layout[c][currentShape.dh - r - 1];
                            break;
                    }
                }
            }
            currentShape.layout = newLayout;
            currentShape.angle = 0;
        }

        public bool leftClearance(Shape currentShape, string[][] gameArea)
        {
            if (currentShape.dx <= 0)
            {
                return false;
            }
            else
            {
                for (int r = 0; r < currentShape.dh; r++)
                {
                    for (int c = 0; c < currentShape.dw; c++)
                    {
                        if ((currentShape.layout[r][c] == 1) && (gameArea[(currentShape.dy + r)][(currentShape.dx + c - 1)] != null))
                        {
                            return false;
                        }
                    }
                }
            }
            return true;
        }

        public bool rightClearance(Shape currentShape, string[][] gameArea)
        {
            if (currentShape.dx + currentShape.dw >= nGridX)
            {
                return false;
            }
            else
            {
                for (int r = 0; r < currentShape.dh; r++)
                {
                    for (int c = 0; c < currentShape.dw; c++)
                    {
                        if ((currentShape.layout[r][c] == 1) && (gameArea[(currentShape.dy + r)][(currentShape.dx + c + 1)] != null))
                        {
                            return false;
                        }
                    }
                }
            }
            return true;
        }

        public bool downClearance(Shape currentShape, string[][] gameArea)
        {
            if (currentShape.dy + currentShape.dh >= nGridY)
            {
                return false;
            }
            else
            {
                for (int r = 0; r < currentShape.dh; r++)
                {
                    for (int c = 0; c < currentShape.dw; c++)
                    {
                        if ((currentShape.layout[r][c] == 1) && (gameArea[(currentShape.dy + r + 1)][(currentShape.dx + c)] != null))
                        {
                            return false;
                        }
                    }
                }
            }
            return true;
        }

        public bool rotateClearance(Shape currentShape, string[][] gameArea)
        {
            if ((currentShape.dx + currentShape.dh > nGridX) || (currentShape.dy + currentShape.dw > nGridY))
            {
                return false;
            }
            else
            {
                //check if vertical layout has room to fit
                for (int r = 0; r < currentShape.dw; r++)
                {
                    for (int c = 0; c < currentShape.dh; c++)
                    {
                        if (gameArea[(currentShape.dy + r)][(currentShape.dx + c)] != null)
                        {
                            return false;
                        }
                    }
                }
            }
            return true;
        }

    }

    public class Shape
    {
        public int[][] layout { get; set; }
        public int dh { get; set; }
        public int dw  { get; set; }
        public string color { get; set; }
        public int dx { get; set; }
        public int dy { get; set; }
        public int angle { get; set; }
        public Shape(int dxArg, int dyArg, int[][] layoutArg, string colorArg)
        {
            layout = layoutArg;
            dh = layoutArg.Count();
            dw = layoutArg[0].Count();
            color = colorArg;
            dx = dxArg;
            dy = dyArg;
            angle = 0;
        }
        public void fallDown()
        {
            dy += 1;
        }
    }

}