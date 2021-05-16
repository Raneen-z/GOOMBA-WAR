
var score = 0;
var gameStatus = true;//to know that game is over
$('.gamePlay').toggle();
$(".helpPage").toggle();//hide these two screens just show home
var home = false;//to know user is playing or in homepage/restart
var music = document.createElement('audio'); //adding audio elemnt to HTML document
music.src = "./audio/bgMusic.mp3";
var ending = document.createElement('audio');
ending.src = "./audio/gameover.wav";
var win = document.createElement('audio');
win.src = "./audio/win.wav";
var hit = document.createElement('audio');
hit.src = "./audio/hit.mp3";
$(document).ready(function () {

    $("#startBtn").on('click', () => {
        $(".startPage").toggle();
        $('.gamePlay').toggle();
        gameStatus = true;
        startGame();
    });

    $("#helpBtn").on('click', () => {
        $(".startPage").toggle();
        $('.helpPage').toggle();
    });

    $("#backBtn").on('click', () => {
        $(".helpPage").toggle();
        $('.startPage').toggle();
    });

    $('#homeBtn').on('click', () => {
        $('.gamePlay').toggle();
        $(".startPage").toggle();
        music.pause();
        music.currentTime = 0;
        gameStatus = false;
        home = true;

    })

    $('#restart').on('click', () => {
        home = true
        music.pause();
        music.currentTime = 0;
        startGame();
    });


});

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function checkCollision(item1, item2) {
    var x1 = item1.offset().left;
    var y1 = item1.offset().top;
    var h1 = item1.outerHeight(true);
    var w1 = item1.outerWidth(true);
    var b1 = y1 + h1;
    var r1 = x1 + w1;
    var x2 = item2.offset().left;
    var y2 = item2.offset().top;
    var h2 = item2.outerHeight(true);
    var w2 = item2.outerWidth(true);
    var b2 = y2 + h2;
    var r2 = x2 + w2;

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false; //no touch between the two 
    return true;
}




function startGame() {

    $('#stars').empty();
    $('#lives').empty();
    $('#hide').css('visibility', 'hidden');
    $('.item').empty()
    $('.item').remove()
    score = 0;
    home = false;
    gameStatus = true

    var interval_id = window.setInterval("", 9999); // Get a reference to the last
    // interval +1
    for (var i = 1; i < interval_id; i++)
        window.clearInterval(i);

    $('.score').text('00')
    music.play();

    $('#block1').remove()
    $('#block2').remove()
    $('#message').text("GAME OVER")
    var block1 = $("<div/>", {
        class: "block",
        id: "block1",
        style: "width:" + 37 + "px; height:" + 37 + "px; top:" + (Math.floor(Math.random() * 200) + 50) + "px; left:" + Math.floor(Math.random() * 600) + "px; "
    });
    block1.css({ 'background': 'url(./images/block.png)', 'background-size': 'contain', 'background-repeat': 'no-repeat' });
    $(".canvas").append(block1)

    var block2 = $("<div/>", {
        class: "block",
        id: "block2",
        style: "width:" + 37 + "px; height:" + 37 + "px; top:" + (Math.floor(Math.random() * 200) + 50) + "px; left:" + Math.floor(Math.random() * 600) + "px; "
    });
    block2.css({ 'background': 'url(./images/block.png)', 'background-size': 'contain', 'background-repeat': 'no-repeat' });
    $(".canvas").append(block2)

    $mario = $("#moveCharacter");
    $(document).keydown(function (e) {
        var marioPosition = $mario.position();
        if (gameStatus)
            switch (e.which) {
                case 37://left
                    if (marioPosition.left > 16)
                        $mario.css('left', marioPosition.left - 20 + 'px')
                    break;
                case 39://right
                    if (marioPosition.left < 610)
                        $mario.css('left', marioPosition.left + 20 + 'px')
                    break;
                case 32://fire 
                    var velocity = 5000;
                    var item = $("<div/>", {
                        class: "fire",
                        style: "width:" + 26 + "px; height:" + 37 + "px; top:" + (marioPosition.top - 25) + "px; left:" + (marioPosition.left + 40) + "px; transition: transform " + velocity + "ms linear;"
                    });
                    item.css({ 'background': 'url(./images/fire.png)', 'background-size': 'contain', 'background-repeat': 'no-repeat' });
                    $(".canvas").append(item)
                    var move = setTimeout(function () {
                        item.addClass("moveUp");
                    }, (1, 2));

                    //remove this item when animation is over
                    item.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
                        function (event) {

                            $(this).remove();

                        });
                    break;

            }
    });

    var falling = setInterval(function () {
        if (home || !gameStatus) clearInterval(falling)//if the user wanted to go back home stop this interval immediately
        for (var i = 0; i < 4; i++) {

            if (home) break;
            if (gameStatus) fallingItem();

        }

    }, 2000);// falling 2 items every 4 sec



    function fallingItem() {

        if (home) return; //stop thrwoing items 

        var length = random(50, ($(".canvas").width() - 50));
        var velocity = 8000;
        var size = 45
        var item = $("<div/>", {
            class: "item",
            style: "width:" + size + "px; height:" + size + "px; left:" + length + "px; transition: transform " + velocity + "ms linear;"
        });

        item.css({ 'background': 'url(./images/goomba.png)', 'background-size': 'contain', 'background-repeat': 'no-repeat' });



        var check = setInterval(() => {
            if (home || !gameStatus) clearInterval(check)//if the user wanted to go back home stop this interval immediately
            else {
                if (checkCollision($mario, item)) {

                    item.remove();//remove goomba when mario touch it and lose the game
                    gameStatus = false;
                    ending.play();
                    $('#hide').css('visibility', 'visible');

                }

                if (checkCollision(item, block1) || checkCollision(item, block2)) {
                    item.remove()
                }

                for (let i = 0; i < $(".fire").length; i++) {
                    if (checkCollision($($(".fire")[i]), block1) || checkCollision($($(".fire")[i]), block2)) {
                        $($(".fire")[i]).remove()
                    }
                    else if (checkCollision($($(".fire")[i]), item)) {
                        hit.play()
                        item.remove();//remove goomba when fire touch it and increase score
                        $($(".fire")[i]).remove();
                        score++;
                        $('.score').text(score)
                        if (score == 10) {
                            $('#stars').append(`<img class="star" src="./images/star.png" alt="">`)
                        }
                        if (score == 30) {
                            $('#stars').append(`<img class="star" src="./images/star.png" alt="">`)
                        }
                        if (score == 50) {
                            $('#stars').append(`<img class="star" src="./images/star.png" alt="">`)
                            $('#message').text("YOU WON")
                            $('#hide').css('visibility', 'visible');
                            win.play()
                            gameStatus = false
                        }
                    }
                }

            }
        }, 20); //it check for collision every 20ms



        //draw the item

        $(".canvas").append(item);
        var exit = setInterval(() => {
            if (home) {
                item.remove()
                $('.item').empty()
                clearInterval(exit)//if the user wanted to go back home stop this interval immediately
            }

            if (!gameStatus) {

                music.pause();
                item.remove();
                clearInterval(exit)

            }
        }, 10);

        //random start for animation
        var move = setTimeout(function () {
            if (home) {
                item.remove()
                $('.item').empty()
                clearInterval(move)//if the user wanted to go back home stop this interval immediately
            }
            item.addClass("moveDown");
        }, random(0, 4000));

        //remove this item when animation is over
        item.one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
            function (event) {

                $(this).remove();

            });
    }


}
