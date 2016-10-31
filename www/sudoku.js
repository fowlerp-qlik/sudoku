/* General approach is to mimic what a human does: look for empty cells where the number of 
   possible values is one: possible values are eliminated by removing existing values in the same
   row, column or sub-grid of nine cells. Such cells are called "easy cells". 
   For each easy cell, fill it in and recalculate possibilites for each neighbor cell:
   hopefully more cells will become easy cells in the process!   
   
   Do this until no more easy cells. Then pick the cell 
   with the least number of possibilites and for each possibility create a new
   puzzle (current puzzle + filled in possibile value) and try to solve that puzzle. 
*/

function Puzzle(arg) {		
	// create empty easyCells set. easyCells are those that have exactly one possible value .. hence easyCells
	// are very easy to fill in! Great to have some easy cells to make easy progress with
	this.easyCells = new Array();
	this.timeToSolve  = null;
	
	// input could be a 81 character string consisting of digits 1..9 and period. Period means cell is not filled in 
    if (typeof arg === 'string') {	        
	    this.numDefinedCells = 0;
		var d = new Date();
		this.timeStarted = d.getTime();
 	
		// create empty puzzle (2d array) with each cell having 1..9 possibilities, all cells are "undefined"
		this.cells = new Array(9);
		for (var i = 0; i < 9; i++) {
			this.cells[i] = new Array(9);
			for (var j = 0; j < 9; j++) {       
				this.cells[i][j] = {possibilities: new Set([1,2,3,4,5,6,7,8,9]), value: null};              
			}
		}
		
        var c;
        for (var i = 0; i < arg.length; i++) {
            c = arg[i];
            if (c >= '0' && c <= '9') {
                this.fillInCell({xCoord: Math.floor(i/9), yCoord: i%9}, parseInt(c)); 
            }
        }
    } 
	
	// input may be a puzzle in which case we clone that puzzle
	if (typeof arg === 'object') {
		this.timeStarted = arg.timeStarted;      // set all puzzles to start at the same time
	    this.numDefinedCells = arg.numDefinedCells;
		
        this.cells = new Array(9);
		for (var i = 0; i < 9; i++) {
			this.cells[i] = new Array(9);
			for (var j = 0; j < 9; j++) {       
				this.cells[i][j] = {possibilities: new Set(arg.cells[i][j].possibilities), value: arg.cells[i][j].value};              
			}
		} 
	}
}

Puzzle.prototype = {	
	toString: function() {
		var str = "";
		
		for (var i = 0; i < 9; i++) {
			for (var j = 0; j < 9; j++) {
				if(this.cells[i][j].value === null) {
					str += ".";
				} else {
					str += this.cells[i][j].value.toString();;
				}
			}
		} 
		return str;
	},
        
    printRow: function(y) {
		var str = "|";
		for(var x=0; x < 3; x++) {
			str += this.cells[x][y].value ? this.cells[x][y].value : " ";
		}
		str += "|";
	    
		for(var x=3; x < 6; x++) {
			str += this.cells[x][y].value ? this.cells[x][y].value : " ";
		}
		str += "|";
		
		for(var x=6; x < 9; x++) {
			str += this.cells[x][y].value ? this.cells[x][y].value : " ";
		}
		str += "|";
		console.log(str);
	}, 
	
    print: function () {
		console.log("-------------");
		this.printRow(0);
		this.printRow(1);
		this.printRow(2);
		console.log("-------------");
		this.printRow(3);
		this.printRow(4);
		this.printRow(5);
		console.log("-------------");
		this.printRow(6);
		this.printRow(7);
		this.printRow(8);
		console.log("-------------");
    },

    solved: function() {		
        return this.numDefinedCells === 81;
    },
	
	getTimeToSolve: function() {
		return this.timeToSolve;
	},

    // return false if a cell's possibilities shrinks to the empty set. Means puzzle is not solvable
    // if neighbor's possibilities set size becomes 1 then add to the easyCells list
    updatePossibilities: function(location, digit) {
        if(this.cells[location.xCoord][location.yCoord].value === null) {
            var wasPresent = this.cells[location.xCoord][location.yCoord].possibilities.delete(digit);
			
			if(wasPresent) {					
				if(this.cells[location.xCoord][location.yCoord].possibilities.size === 0) {
					return false;
				}	
					
				if(this.cells[location.xCoord][location.yCoord].possibilities.size === 1) {
					this.easyCells.push(location);
				}  
			}
        }
        
        return true;
    },
	
    // fill in a cell and update the possibilities sets of each of its undefined neighbor cells
	// cell1 and cell2 are neighbors is they are on the same row, column or smaller grid/square of 
	// nine cells.
    // return false if the puzzle is found to be unsolvable, true otherwise
    fillInCell: function(location, digit) {
		if(this.cells[location.xCoord][location.yCoord].value !== null) return true;  // nothing to do
		
        this.cells[location.xCoord][location.yCoord].value = digit;
        this.numDefinedCells++;

		// update possibilities array of each undefined cell neighbor. 
        for(var y=0; y<9; y++) {
            if(!this.updatePossibilities({xCoord: location.xCoord, yCoord: y}, digit)) return false;
        }
        
        for(var x=0; x<9; x++) {
            if(!this.updatePossibilities({xCoord: x, yCoord: location.yCoord}, digit)) return false;
        }
        
        for(var x=location.xCoord-location.xCoord%3; x < location.xCoord-location.xCoord%3+3; x++) {
              for(var y=location.yCoord-location.yCoord%3; y < location.yCoord-location.yCoord%3+3; y++) {
                  if(!this.updatePossibilities({xCoord: x, yCoord: y}, digit)) return false;
              }
        }
        
        return true;
    }, 

    // create a new puzzle by adding digit to a given cell then try to solve the result.
    solveNewPuzzle: function(location, digit) {
		var newPuzzle = new Puzzle(this);
		
        if(!newPuzzle.fillInCell(location, digit)) return null;   
        return newPuzzle.solve();
    },

    solve: function() {		
	    var solvedPuzzle = null;
	
		// might as well do the really easy work: processing the easy cells since they only have one possible value
		var setIter;
        var location = this.easyCells.pop();
        while (location != null) {			
			setIter = this.cells[location.xCoord][location.yCoord].possibilities.values();
			
            if(!this.fillInCell(location, setIter.next().value)) {
                return null;
            }
            var location = this.easyCells.pop();
        }

        if(this.solved()) {				
			solvedPuzzle = this;
        } else {
            // if not solved yet then need to do some hard work now (recursion)
            // find cell with least number of possibilities
            // create a new puzzle for each of the cell's possibilities and try to solve it 
            // returning first non-null puzzle
			var bestx, besty, location;
			var possibilitiesLength  = 10;
			for (var x = 0; x < 9; x++) {
                for (var y = 0; y < 9; y++) {       
                    if(this.cells[x][y].possibilities.size < possibilitiesLength && this.cells[x][y].value === null) {
						possibilitiesLength = this.cells[x][y].possibilities.size;
						bestx = x;
						besty = y;
					}              
                }
            }
			
			var self = this;
			
			this.cells[bestx][besty].possibilities.forEach(function(digit) {
				if(!solvedPuzzle) {    // give other things a change to run
					solvedPuzzle = self.solveNewPuzzle({xCoord: bestx, yCoord: besty}, digit);
				}
			});
        }
		
		if(solvedPuzzle && !solvedPuzzle.timeToSolve) {
			var d = new Date();
			solvedPuzzle.timeToSolve = d.getTime() - solvedPuzzle.timeStarted;
		}
		
		return solvedPuzzle;
    },
	
	// for testing. Checks validity of a complete puzzle
	check: function() {
		if(!this.solved()) return false;    // supposed to be complete 
		
		for (var i = 0; i < 9; i++) {
			for (var j = 0; j < 9; j++) {       
				if(this.cells[i][j].value == null) {
					return false;  // supposed to be complete              
				}
				
				// check against its neighbors
				for(var y=0; y<9; y++) {
					if(this.cells[i][j].value == this.cells[i][y].value && j!==y) {
						return false;
					}	
				}
				
				for(var x=0; x<9; x++) {
					if(this.cells[i][j].value == this.cells[x][j].value && i!==x) {
						return false;
					}	
				}
				
				for(var x=i-i%3; x < i-i%3+3; x++) {
					for(var y=j-j%3; y < j-j%3+3; y++) {
						if(this.cells[i][j].value == this.cells[x][y].value && (i!==x || j!=y)) {
							return false;
						}	
					}
				}
			}
		}
		return true;
	}
};

function testSolver() {
	var puzzle;
	var solvedPuzzle;
	for (var i=0; i< hardPuzzles.length; i++) {
		puzzle = new Puzzle(puzzleStr);
		var solvedPuzzle = puzzle.solve();
		if(solvedPuzzle == null) {
			console.log("Puzzle solution for puzzle " + i + " is not complete");
			return false;				
		}
		
		if(!solvedPuzzle.check()) {
			console.log("Puzzle solution for puzzle " + i + " is not valid");
			solvedPuzzle.print();
			return false;
		}	
		console.log("Took " + solvedPuzzle.getTimeToSolve() + " to solve puzzle " + i);
	}
	return true;
};

// yes a repeat of what is in sudoku-ui .. but better to have the test data "close" to the
// code being tested so a UI is not necessary for testing
var hardPuzzles = [
    "4.....8.5.3..........7......2.....6.....8.4......1.......6.3.7.5..2.....1.4......",
	"52...6.........7.13...........4..8..6......5...........418.........3..2...87.....",
	"6.....8.3.4.7.................5.4.7.3..2.....1.6.......2.....5.....8.6......1....",
	"48.3............71.2.......7.5....6....2..8.............1.76...3.....4......5....",
	"....14....3....2...7..........9...3.6.1.............8.2.....1.4....5.6.....7.8...",	
	"6.2.5.........3.4..........43...8....1....2........7..5..27...........81...6.....",
	".524.........7.1..............8.2...3.....6...9.5.....1.6.3...........897........",
	"6.2.5.........4.3..........43...8....1....2........7..5..27...........81...6.....",
	".923.........8.1...........1.7.4...........658.........6.5.2...4.....7.....9.....",
	"6..3.2....5.....1..........7.26............543.........8.15........4.2........7..",
	".6.5.1.9.1...9..539....7....4.8...7.......5.8.817.5.3.....5.2............76..8...",
	"..5...987.4..5...1..7......2...48....9.1.....6..2.....3..6..2.......9.7.......5..",
	"3.6.7...........518.........1.4.5...7.....6.....2......2.....4.....8.3.....5.....",
	"1.....3.8.7.4..............2.3.1...........958.........5.6...7.....8.2...4.......",
	"6..3.2....4.....1..........7.26............543.........8.15........4.2........7..",
	"....3..9....2....1.5.9..............1.2.8.4.6.8.5...2..75......4.1..6..3.....4.6.",
	"......52..8.4......3...9...5.1...6..2..7........3.....6...1..........7.4.......3.",
	"45.....3....8.1....9...........5..9.2..7.....8.........1..4..........7.2...6..8..",
	".237....68...6.59.9.....7......4.97.3.7.96..2.........5..47.........2....8.......",
	"..84...3....3.....9....157479...8........7..514.....2...9.6...2.5....4......9..56",
	".98.1....2......6.............3.2.5..84.........6.........4.8.93..5...........1..",
	"..247..58..............1.4.....2...9528.9.4....9...1.........3.3....75..685..2...",
	"4.....8.5.3..........7......2.....6.....5.4......1.......6.3.7.5..2.....1.9......",
	".2.3......63.....58.......15....9.3....7........1....8.879..26......6.7...6..7..4",
	"1.....7.9.4...72..8.........7..1..6.3.......5.6..4..2.........8..53...7.7.2....46",
	"4.....3.....8.2......7........1...8734.......6........5...6........1.4...82......",
	".......71.2.8........4.3...7...6..5....2..3..9........6...7.....8....4......5....",
	"6..3.2....4.....8..........7.26............543.........8.15........8.2........7..",
	".47.8...1............6..7..6....357......5....1..6....28..4.....9.1...4.....2.69.",
	"......8.17..2........5.6......7...5..1....3...8.......5......2..4..8....6...3....",
	"38.6.......9.......2..3.51......5....3..1..6....4......17.5..8.......9.......7.32",
	"...5...........5.697.....2...48.2...25.1...3..8..3.........4.7..13.5..9..2...31..",
	".2.......3.5.62..9.68...3...5..........64.8.2..47..9....3.....1.....6...17.43....",
	".8..4....3......1........2...5...4.69..1..8..2...........3.9....6....5.....2.....",
	"..8.9.1...6.5...2......6....3.1.7.5.........9..4...3...5....2...7...3.8.2..7....4",
	"4.....5.8.3..........7......2.....6.....5.8......1.......6.3.7.5..2.....1.8......",
	"1.....3.8.6.4..............2.3.1...........958.........5.6...7.....8.2...4.......",
	"1....6.8..64..........4...7....9.6...7.4..5..5...7.1...5....32.3....8...4........",
	"249.6...3.3....2..8.......5.....6......2......1..4.82..9.5..7....4.....1.7...3...",
	"...8....9.873...4.6..7.......85..97...........43..75.......3....3...145.4....2..1",
	"...5.1....9....8...6.......4.1..........7..9........3.8.....1.5...2..4.....36....",
	"......8.16..2........7.5......6...2..1....3...8.......2......7..3..8....5...4....",
	".476...5.8.3.....2.....9......8.5..6...1.....6.24......78...51...6....4..9...4..7",
	".....7.95.....1...86..2.....2..73..85......6...3..49..3.5...41724................",
	".4.5.....8...9..3..76.2.....146..........9..7.....36....1..4.5..6......3..71..2..",
	".834.........7..5...........4.1.8..........27...3.....2.6.5....5.....8........1..",
	"..9.....3.....9...7.....5.6..65..4.....3......28......3..75.6..6...........12.3.8",
	".26.39......6....19.....7.......4..9.5....2....85.....3..2..9..4....762.........4",
	"2.3.8....8..7...........1...6.5.7...4......3....1............82.5....6...1.......",
	"6..3.2....1.....5..........7.26............843.........8.15........8.2........7..",
	"1.....9...64..1.7..7..4.......3.....3.89..5....7....2.....6.7.9.....4.1....129.3.",
	".........9......84.623...5....6...453...1...6...9...7....1.....4.5..2....3.8....9",
	".2....5938..5..46.94..6...8..2.3.....6..8.73.7..2.........4.38..7....6..........5",
	"9.4..5...25.6..1..31......8.7...9...4..26......147....7.......2...3..8.6.4.....9.",
	"...52.....9...3..4......7...1.....4..8..453..6...1...87.2........8....32.4..8..1.",
	"53..2.9...24.3..5...9..........1.827...7.........981.............64....91.2.5.43.",
	"1....786...7..8.1.8..2....9........24...1......9..5...6.8..........5.9.......93.4",
	"....5...11......7..6.....8......4.....9.1.3.....596.2..8..62..7..7......3.5.7.2..",
	".47.2....8....1....3....9.2.....5...6..81..5.....4.....7....3.4...9...1.4..27.8..",
	"......94.....9...53....5.7..8.4..1..463...........7.8.8..7.....7......28.5.26....",
	".2......6....41.....78....1......7....37.....6..412....1..74..5..8.5..7......39..",
	"1.....3.8.6.4..............2.3.1...........758.........7.5...6.....8.2...4.......",
	"2....1.9..1..3.7..9..8...2.......85..6.4.........7...3.2.3...6....5.....1.9...2.5",
	"..7..8.....6.2.3...3......9.1..5..6.....1.....7.9....2........4.83..4...26....51.",
	"...36....85.......9.4..8........68.........17..9..45...1.5...6.4....9..2.....3...",
	"34.6.......7.......2..8.57......5....7..1..2....4......36.2..1.......9.......7.82",
	"......4.18..2........6.7......8...6..4....3...1.......6......2..5..1....7...3....",
	".4..5..67...1...4....2.....1..8..3........2...6...........4..5.3.....8..2........",
	".......4...2..4..1.7..5..9...3..7....4..6....6..1..8...2....1..85.9...6.....8...3",
	"8..7....4.5....6............3.97...8....43..5....2.9....6......2...6...7.71..83.2",
	".8...4.5....7..3............1..85...6.....2......4....3.26............417........",
	"....7..8...6...5...2...3.61.1...7..2..8..534.2..9.......2......58...6.3.4...1....",
	"......8.16..2........7.5......6...2..1....3...8.......2......7..4..8....5...3....",
	".2..........6....3.74.8.........3..2.8..4..1.6..5.........1.78.5....9..........4.",
	".52..68.......7.2.......6....48..9..2..41......1.....8..61..38.....9...63..6..1.9",
	"....1.78.5....9..........4..2..........6....3.74.8.........3..2.8..4..1.6..5.....",
	"1.......3.6.3..7...7...5..121.7...9...7........8.1..2....8.64....9.2..6....4.....",
	"4...7.1....19.46.5.....1......7....2..2.3....847..6....14...8.6.2....3..6...9....",
	"......8.17..2........5.6......7...5..1....3...8.......5......2..3..8....6...4....",
	"963......1....8......2.5....4.8......1....7......3..257......3...9.2.4.7......9..",
	"15.3......7..4.2....4.72.....8.........9..1.8.1..8.79......38...........6....7423",
	"..........5724...98....947...9..3...5..9..12...3.1.9...6....25....56.....7......6",
	"....75....1..2.....4...3...5.....3.2...8...1.......6.....1..48.2........7........",
	"6.....7.3.4.8.................5.4.8.7..2.....1.3.......2.....5.....7.9......1....",
	"....6...4..6.3....1..4..5.77.....8.5...8.....6.8....9...2.9....4....32....97..1..",
	".32.....58..3.....9.428...1...4...39...6...5.....1.....2...67.8.....4....95....6.",
	"...5.3.......6.7..5.8....1636..2.......4.1.......3...567....2.8..4.7.......2..5..",
	".5.3.7.4.1.........3.......5.8.3.61....8..5.9.6..1........4...6...6927....2...9..",
	"..5..8..18......9.......78....4.....64....9......53..2.6.........138..5....9.714.",
	"..........72.6.1....51...82.8...13..4.........37.9..1.....238..5.4..9.........79.",
	"...658.....4......12............96.7...3..5....2.8...3..19..8..3.6.....4....473..",
	".2.3.......6..8.9.83.5........2...8.7.9..5........6..4.......1...1...4.22..7..8.9",
	".5..9....1.....6.....3.8.....8.4...9514.......3....2..........4.8...6..77..15..6.",
	".....2.......7...17..3...9.8..7......2.89.6...13..6....9..5.824.....891..........",
	"3...8.......7....51..............36...2..4....7...........6.13..452...........8.."
];