Sudoku Solver
=============

Sudoku Solver was developeed using the Intel(R) XDK (http://software.intel.com/en-us/html5). As such, it is a hybrid app written in javascript, CSS and HTML5.
Most testing and debugging was done with the Chrome browser on Windows 10. Final testing was done on an iPad using the Intel App Preview app.

Indeed, you can download the www directory onto your PC or Mac and point your browser to it. eg. file:///C:/Users/Owner/Documents/Sudoku/www/index.html.
Performance is much better on a PC than on an iPad (not surprising). Indeed on a PC the algorithm runs one of the harder problems that 
Peter Norvig describes (http://norvig.com/sudoku.html):

hard_puzzle = '.....6....59.....82....8....45........3........6..3.54...325..6..................'

in just under 170 seconds vs 188 seconds for Norvig's solver.

Sudoku Solver was created using [Intel App Framework](https://github.com/01org/appframework), which is a free and open source Javascript framework targeted at 
HTML5 Mobile browsers with a blazingly fast query selector library and Mobile UI framework for creating app with native like UI and performance.

The App Framework has UI themes which look and feel similar to iPhone, iPad, Android, Windows Phone, Blackberry 10 and Tizen, the UI theme will be 
automatically applied by default when opened on these devices. 

How to install Sudoku Solver on an iPad or iPhone
-------------------------------------------------
 
Given the Intel XDK approach, to publish as an app on the iPad I would need to become an Apple Developer which costs $119 dollars. So instead please using the
Intel App Preview app to test:

- On your iPad or iPhone find the "Intel Preview App" in the Apple App store and install (its a free app)
- Launch the app and login as me (username: fowlerp, password: qlik1234!)
- Choose the Sudoku app (only app in the app list). The Preview app is actually downloading the Sudoku Solver code from an Intel server so you need to have a network path to the Internet.
- Run it 
- Enjoy. You can enter digits in cells use the vertical digit strip on the left hand side or you can load one of 95 hard puzzles (from Peter Norvig's site)
- To exit the preview use a three finger tap

How to install Sudoku Solver on an Android device
-------------------------------------------------

Have not tried it but should be straightforward.

Design
------

sudoku.js is the solver itself. This code has nothing to do with UI. It defines a Puzzle class that contains methods you might expect: 

- constructor: takes an 81 character string in the form that Norvig users (digits 1 through 9. "." represents a blank cell). Internally this constructor is also used to clone puzzle objects
- solve: solve the puzzle. Can even try to solve a solved puzzle which of course is trivially done
- solved: returns true if the puzzle is solved (each cell contains a digit)
- toString: returns a string representation of the puzzle (Norvig's string form)
- print: prints puzzle to the DevTools console
- timeToSolve: time in milliseconds taken to solve the puzzle (if it is a solved puzzle) 
- check: used for testing)

sudoku.js has code for testing: solves 95 hard puzzles and for each solution runs a check to ensure the resulting puzzle is
is a valid solution.

suodu-ui.js handles all of the UI (using jQuery) and uses sudoku.js to solve the puzzle provided by the user.

Device Resolution
-----------------

Screen resolution differences are handled via CSS using the @media construct. See sudoku.css.

Bugs and Deficiencies
---------------------

At time of writing the busy indicator (spinner) presented while the app is solving a program does not actually spin within the Intel App Preview.
Does spin within Chrome on Windows 10.

CSS Styling in general could be improved. 

Resolution handling on various devices and modes (landscape vs portrait) is incomplete/incorrect on the iphone 5.

App Framework (formerly jQ.Mobi)
-----------------------------------------------------------------------------
** Sudoku Solver uses App Framework 2.2. The latest version is App Framework 3.0.**

* source:  https://github.com/01org/appframework
* license: https://github.com/01org/appframework/blob/master/license.txt

