document.addEventListener('DOMContentLoaded', () => {
    
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll(".grid div"))
    const scoreDisplay = document.querySelector("#score")
    const startBtn = document.querySelector("#start-button");
    let music = new Audio ("sounds/Tetris.mp3");
    const width = 10;
    let nextRandom = 0;
    let timerId;
    let score = 0;
    let level = 1;
    var colors = [
        'radial-gradient(circle, rgb(57, 184, 198), rgb(57, 184, 198), #28848b)',
        'radial-gradient(circle, rgb(100, 100, 100), rgb(100, 100, 100), #464646)',
        'radial-gradient(circle, rgb(74, 111, 165), rgb(74, 111, 165), #345b74)',
        'radial-gradient(circle, rgb(223, 52, 57), rgb(223, 52, 57), #9c242b)',
        'radial-gradient(circle, rgb(174, 31, 36), rgb(174, 31, 36), #7a161b)',
        'radial-gradient(circle, rgb(149, 172, 207), rgb(149, 172, 207), #688291)',
        'radial-gradient(circle, rgb(230, 123, 222), rgb(230, 123, 222), #8f56a1)'
    ]
    loadDoc();
    hiScore();
    
    //The tetriminos
    const lTetrimino = [
        [1, width + 1, width * 2 + 1, 2], 
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ];
  
    const rLTetrimino = [
      [0,  1, width + 1, width * 2 + 1],
      [width, width + 1, width + 2, 2],
      [width * 2 + 2, 1, width + 1, width * 2 + 1],
      [width, width + 1, width + 2, width * 2]
    ];
  
    const zTetrimino = [
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1]
    ];
  
    const rZTetrimino = [
      [0, 1, width + 1, width + 2],
      [1, width, width + 1, width * 2],
      [0, 1, width + 1, width + 2],
      [1, width, width + 1, width * 2]
    ];
  
    const tTetrimino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ];
  
    const oTetrimino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
    ];
  
    const iTetrimino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ];
  
    const theTetriminos = [lTetrimino, rLTetrimino, zTetrimino, rZTetrimino, tTetrimino, oTetrimino, iTetrimino];
  
    let currentPosition = 4;
    let currentRotation = 0;
  
    //select random tetriminos
    let random = Math.floor(Math.random()*theTetriminos.length);
    //console.log(random);
    let current = theTetriminos[random][currentRotation];
  
    //draw the tetrimino
    function draw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetrimino')
            squares[currentPosition + index].style.backgroundImage = colors[random]
        })
    };
  
    //undraw the tetrimino
    function undraw(){
        current.forEach(index => {
            squares[currentPosition + index].classList.remove("tetrimino")
            squares[currentPosition + index].style.backgroundImage = ''
  
        })
    }
  
  
    //make the tetriminos move down
    //timerId = setInterval(moveDown, 300);
  
    //assign keycodes
    function control(e){
        if(e.keyCode === 37){
            moveLeft()
        }
        else if(e.keyCode === 68){
            rotateR();
        }
        else if(e.keyCode === 65){
            rotateL();
        }
        else if(e.keyCode === 39){
            moveRight();
        }
        // else if(e.keyCode === 40){
        //     moveDown();
        // }
    }
    document.addEventListener('keyup', control);
    function control2(e){
        if(e.keyCode === 40){
            moveDown();
        }
    }
    document.addEventListener('keydown', control2);
  
    // move down the block
    function moveDown(){
        undraw();
        currentPosition += width;
        draw()
        freeze()
    }
  
    //freeze function
    function freeze(){
      
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //start a new one falling
            random = nextRandom;
            nextRandom = Math.floor(Math.random() * theTetriminos.length)
            current = theTetriminos[random][currentRotation]
            currentPosition = 4
            
            displayShape();
            addScore();
            draw();
            gameOver();
        }
    }
  
    //move left and such unless it is at the end
    function moveLeft(){
        undraw();
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
  
        if(!isAtLeftEdge) currentPosition -= 1;
  
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition += 1;
        }
        draw()
    }
  
    function moveRight(){
        undraw();
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
  
        if(!isAtRightEdge) currentPosition += 1;
  
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            currentPosition -= 1;
        }
        draw()
    }
  
    //rotate
    function checkRLLE(CR){ //rotate left, left edge
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
        if((CR.some(index => (currentPosition + index) % width === 0)) && isAtRightEdge){
            //document.getElementById("throwError").innerHTML = "Error 1";
            rotateR()
            moveRight()
            rotateL()
        }
    }

    function checkRRLE(CR){ //rotate right, left edge
            const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
            if((CR.some(index => (currentPosition + index) % width === 0)) && isAtRightEdge){
                //document.getElementById("throwError").innerHTML = "Error 1";
                rotateL()
                moveRight()
                rotateR()
            }
        }

    function checkRLRE(CR){ //rotate left, right edge
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if((CR.some(index => (currentPosition + index + 1) % width === 0)) && isAtLeftEdge){
            //document.getElementById("throwError").innerHTML = "Error 1";
            rotateR()
            moveLeft()
            rotateL()
        }
    }

    function checkRLRELong(CR){ //rotate left, right edge, long
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if((CR.some(index => (currentPosition + index + 1) % width === 0)) && isAtLeftEdge){
            //document.getElementById("throwError").innerHTML = "Error 1";
            rotateR()
            moveLeft()
            moveLeft()
            rotateL()
        }
    }

    
    
    function checkRRRE(CR){ //rotate right, right edge
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if((CR.some(index => (currentPosition + index + 1) % width === 0)) && isAtLeftEdge){
            //document.getElementById("throwError").innerHTML = "Error 2";
            rotateL()
            moveLeft()
            rotateR()
        }
    }

    function checkRRRELong(CR){ //rotate right, right edge, long
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if((CR.some(index => (currentPosition + index + 1) % width === 0)) && isAtLeftEdge){
            //document.getElementById("throwError").innerHTML = "Error 2";
            rotateL()
            moveLeft()
            moveLeft()
            rotateR()
        }
    }

    function rotateL(){
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
        undraw();
        currentRotation--;
        if(currentRotation === -1){
            currentRotation = current.length - 1; 
        }
        current = theTetriminos[random][currentRotation]
        

        if(isAtRightEdge && (current == theTetriminos[6][1] || current == theTetriminos[6][3])){
            checkRLRELong(current) //rotate left, right edge, Long
        }
        else if(isAtLeftEdge){
            //document.getElementById("throwError").innerHTML = "Error 4";
            checkRLLE(current) //rotate left, left edge
        }
        else if(isAtRightEdge){
            //document.getElementById("throwError").innerHTML = "Error 3";
            checkRLRE(current) //rotate left, right edge
        }
        draw()
    }
    
    function rotateR(){
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
        undraw();
        currentRotation++;
        if(currentRotation === current.length){
            currentRotation = 0; 
        }
        current = theTetriminos[random][currentRotation]
        
        if(isAtRightEdge && (current == theTetriminos[6][1] || current == theTetriminos[6][3])){
            checkRRRELong(current) //rotate right, right edge, Long
        }
        else if(isAtLeftEdge){
            checkRRLE(current) //rotate right, left edge
        }
        else if(isAtRightEdge){
            checkRRRE(current) //rotate right, right edge
        }
        draw()
    }
  
    //show next tetrimino
    const displaySquares = document.querySelectorAll(".mini-grid div");
    const displayWidth = 4;
    let displayIndex = 0;
  
    //the tetriminos w/o rotations
    const nextUpTetriminos = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], //L
        [displayWidth, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //RL
        [displayWidth + 1, displayWidth + 2, displayWidth * 2, displayWidth * 2 + 1], //z
        [0, 1, displayWidth + 1, displayWidth + 2], //Rz
        [1, displayWidth, displayWidth + 1, displayWidth + 2], //t
        [0, 1, displayWidth, displayWidth + 1],//o
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] //i
    ]
  
    //display the shape in the mini grid
    function displayShape(){
        displaySquares.forEach(square => {
            square.classList.remove('tetrimino')
            square.style.backgroundImage = ''
        })
        nextUpTetriminos[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetrimino')
            displaySquares[displayIndex + index].style.backgroundImage = colors[nextRandom]
        })
    }
  
    //add functionality to the button

    startBtn.addEventListener('click', () => {
        if(timerId){
            musicFunction(false);
            clearInterval(timerId)
            timerId = null;
        }
        else{//==============================================================================================
            musicFunction(true);
            draw();
            speedLevel();
            nextRandom = Math.floor(Math.random() * theTetriminos.length)
            displayShape()
        } 
    })
  
    //add score
    function addScore(){
        for (let i = 0; i < 199; i += width){
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]
  
            if(row.every(index => squares[index].classList.contains('taken'))){
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetrimino')
                    squares[index].style.backgroundImage = ''
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell));
                clearInterval(timerId);
                speedLevel();
            }
        }
    }
  
    //game over function
    function gameOver(){
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
            scoreDisplay.innerHTML = ' game over';
            clearInterval(timerId);
            leaderboard()
            
        }
    }

    function topScore(){
      let today = new Date();
      let day = today.getDate();
      let month = today.getMonth() + 1;
      let year = today.getFullYear();
      let date = (month + "/" + day + "/" + year)
      let init1 = prompt("Your score was: " + score + "\nenter your initials: ")
      let data = [init1, score, date];
      
      console.log(data);
  
      var rankings = {
          "initials":data[0],
          "score":data[1],
          "date":data[2]
      };
  
      var formData = new FormData();
        formData.append("rankings", JSON.stringify(rankings));
      
      var xhttp = new XMLHttpRequest();
      
      xhttp.open("POST", "https://script.google.com/macros/s/AKfycbzM1VIjSQXt56ajS3rB4zg92mIWAk_W1GWlFE5Y_LfZ08wS2YfobPSB837t8pfZBMWe/exec", true);
      //xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhttp.send(formData);
  
      loadDoc();
    }
  
    function loadDoc() {
      const xhttp = new XMLHttpRequest();
      xhttp.open("GET", "https://script.google.com/macros/s/AKfycbzse2ZEHKXYMDdQAzzuw-_liGz6BZtEO1nXJGx-WT9a0b1Am_xSPGnW_X-Hak7S4rnR/exec");
      xhttp.responseType = "json";
      xhttp.send();
  
      xhttp.onload = function() {
          let sheet = xhttp.response;
          //console.log(sheet.rankings[4].score)
  
          document.getElementById("initial2").innerHTML = sheet.rankings[0].initial;
          document.getElementById("initial3").innerHTML = sheet.rankings[1].initial;
          document.getElementById("initial4").innerHTML = sheet.rankings[2].initial;
          document.getElementById("initial5").innerHTML = sheet.rankings[3].initial;
          document.getElementById("initial6").innerHTML = sheet.rankings[4].initial;
  
          document.getElementById("score2").innerHTML = sheet.rankings[0].score;
          document.getElementById("score3").innerHTML = sheet.rankings[1].score;
          document.getElementById("score4").innerHTML = sheet.rankings[2].score;
          document.getElementById("score5").innerHTML = sheet.rankings[3].score;
          document.getElementById("score6").innerHTML = sheet.rankings[4].score;
  
          document.getElementById("date2").innerHTML = sheet.rankings[0].date;
          document.getElementById("date3").innerHTML = sheet.rankings[1].date;
          document.getElementById("date4").innerHTML = sheet.rankings[2].date;
          document.getElementById("date5").innerHTML = sheet.rankings[3].date;
          document.getElementById("date6").innerHTML = sheet.rankings[4].date;
        };
    }
  
    
    function leaderboard(){
      const xhttp = new XMLHttpRequest();
      xhttp.open("GET", "https://script.google.com/macros/s/AKfycbzse2ZEHKXYMDdQAzzuw-_liGz6BZtEO1nXJGx-WT9a0b1Am_xSPGnW_X-Hak7S4rnR/exec");
      xhttp.responseType = "json";
      xhttp.send();
  
      xhttp.onload = function() {
          let sheet = xhttp.response;
          if(sheet.rankings[4].score < score){
              topScore();
              setInterval(lbOpen, 1500);
          }
          else{ 
              lbOpen();
          }
  
      }
  }
  
      function hiScore(){
          const xhttp = new XMLHttpRequest();
          xhttp.open("GET", "https://script.google.com/macros/s/AKfycbzse2ZEHKXYMDdQAzzuw-_liGz6BZtEO1nXJGx-WT9a0b1Am_xSPGnW_X-Hak7S4rnR/exec");
          xhttp.responseType = "json";
          xhttp.send();
  
          xhttp.onload = function() {
              let sheet = xhttp.response;
              document.getElementById("hscore").innerHTML = sheet.rankings[0].score;
              
              }
          }
  
      function lbOpen(){
          window.open("leaderboard4.html", "_self");
      }
  
      function speedLevel(){
          if (score <= 50){  //level1
              timerId = setInterval(moveDown, 350);
              level = 1;
              document.getElementById("level").innerHTML = level;
          }
          else if(score > 50 && score <= 100){  //level2
              timerId = setInterval(moveDown, 300);
              level = 2;
              document.getElementById("level").innerHTML = level;
          }
          else if(score > 100 && score <= 150){  //level3
              timerId = setInterval(moveDown, 250);
              level = 3;
              document.getElementById("level").innerHTML = level;
          }
          else if(score > 150 && score <= 200){  //level4
              timerId = setInterval(moveDown, 220);
              level = 4;
              document.getElementById("level").innerHTML = level;
          }
          else if(score > 200 && score <= 250){  //level5
              timerId = setInterval(moveDown, 200);
              level = 5;
              document.getElementById("level").innerHTML = level;
          }
          else if(score > 250 && score <= 350){  //level6
              timerId = setInterval(moveDown, 180);
              level = 6;
              document.getElementById("level").innerHTML = level;
          }
            else if(score > 350){  //level7
                timerId = setInterval(moveDown, 150);
                level = 7;
                document.getElementById("level").innerHTML = level;
            }
          else{
              timerId = setInterval(moveDown, 350);
              document.getElementById("level").innerHTML = level;
          }
      }
      function musicFunction(tOrF) {
        // Get the checkbox
        var checkBox = document.getElementById("myCheck");
        

        if(checkBox.checked == true && tOrF == true){
            music.loop = true;
            music.play();
        }
        else if(tOrF == false){
            music.pause();
        }
        else{
            music.pause();
        }
      }   
  })