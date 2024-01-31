window.requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) { window.setTomiout(callback, 17); }
})();
game = {
	canvas: null,
	ctx: null,
    title_img:true,
    score:0,
    enemy_img:null,
    enemy_arr: new Array(),
    goal:15,

    shot_color: "blue",
    shot_arr: new Array(),
    player_img: new Image(),
    end_game:false,
    game1:false,
    
    shot_sound:null,
    boing:null,
}
player = {
    x:0,
    y:0,
    speed:Math.PI,
    size:0
}
function Shot(x, y, w) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.draw = function () {
        //Dibujar la bala
        game.ctx.save();
        game.ctx.fillStyle = game.shot_color;
        game.ctx.fillRect(this.x, this.y, this.w, this.w);
        this.y=this.y-4;
        game.ctx.restore();
     };

     this.disparar = function () {
       game.ctx.save();
       game.ctx.fillStyle = game.shot_color;
       game.ctx.fillRect(this.x, this.y, this.w, this.w);
       this.y = this.y + 6;
       game.ctx.restore();
   };
}

function Player(x){
    this.x = x;
    this.y = game.canvas.height -40;
    this.draw = function (x){
        this.x =  x
        game.ctx.drawImage(game.player_img, this.x,this.y,45,60);
    };
}
function Enemy(x,y){
    this.x = x;
    this.y = y;
    this.w = 35;
    this.veces = 0;
    this.dx = 5;
    this.ciclos = 0;
    this.num = 14;
    this.figura = true;
    this.vive = true;
    this.draw = function () { 
        //Retraso
        if(this.ciclos > 15){
            //saltitos
            if(this.veces>this.num){
                this.dx *= -1;
                this.veces = 0;
                this.num = 28;
                this.y += 20;
                this.dx = (this.dx>0)?this.dx++:this.dx--;
            }else{
                this.x += this.dx;
            }
            this.veces++;
            this.ciclos=0;
            this.figura = !this.figura;

        }else{
            this.ciclos++;
        }
        if(this.figura){
            game.ctx.drawImage(game.enemy_img,0,0,45,30 ,this.x,this.y,35,30); 
        }else{
            game.ctx.drawImage(game.enemy_img, 50, 0, 35, 30, this.x, this.y, 35, 30);

        }
    };
}
function imprimir(texto) {
    console.log(texto);
  }
const title_img = () => {
    game.title_img = false;
    let delay_in_milis = 3500;
    game.player_img.src = "img/astr1.png";
        let img = new Image();
        img.src = "img/titles/title1.png";
        img.onload = () => {
            game.ctx.drawImage(img,0,0);
        }
    setTimeout(() => {
        img.src = "img/titles/title2.png";
        img.onload = () => {
            game.ctx.drawImage(img,0,0);
        }
        setTimeout(() => {
            img.src = "img/titles/title3.png";
            img.onload = () => {
                game.ctx.drawImage(img,0,0);
            }
            setTimeout(() => {
                img.src = "img/titles/title4.png";
                img.onload = () => {
                    game.ctx.drawImage(img,0,0);
                }
                setTimeout(() => {
                    img.src = "img/titles/title5.png";
                    img.onload = () => {
                        game.ctx.drawImage(img,0,0);
                    }
                    setTimeout(() => {
                        game.title_img = true;
                        img.src = "img/titles/title6.png";
                        img.onload = () => {
                            game.ctx.drawImage(img,0,0);
                        }
                    }, delay_in_milis);
                }, delay_in_milis);
            }, delay_in_milis);
        }, delay_in_milis);
    }, delay_in_milis);
    
}
//Mouse actions
// click 
const click_manager = (e) => {
    if (game.title_img) {
        inicio_game_1();
        animate();
    }
    if(game.game1){
        game.shot_arr.push(new Shot(game.player.x + 12 , game.player.y-3 , 5));
        game.shot_sound.play();
    }
    if(game.end_game){
        delay_in_milis =  3000
        game.game1 = false;
        game.end_game = false;
        //cambiosaqui
        setTimeout(() => {
            inicio_game_1();
            animate();
        }, delay_in_milis);
    }
}

const inicio_game_1 = () => {
    game.score = 0;
    game.shot_arr = new Array();
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    game.title_img = false;
    game.player = new Player(0);
    player.x = game.canvas.width/2;
    game.player.draw(player.x);
    
    game.enemy_img = new Image();
    game.enemy_img.src = "img/invader.fw.png";
    game.enemy_img.onload=function(){
        game.enemy_arr =  new Array();
        for(var i=0 ; i<5;i++){
            for (var j = 0; j < 10; j++) {
                game.enemy_arr.push(new Enemy(100+40*j , 30+45*i));

            }

        }

    }
    setTimeout(function() {
        game.game1 = true;    
        
    }, 500);
    
    
}

const move_player_auto = () => {
    player.x -= player.speed;
    if(player.x > game.canvas.width){
        player.speed *= -1;
    }
    if(player.x < 0){
        player.speed *= -1;
    }
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    game.player.draw(player.x);
}
const move_enemys_auto = () => {
    
    for(var i=0;i<game.enemy_arr.length;i++){
        if(game.enemy_arr[i] !=null){
                game.enemy_arr[i].draw();
        }
        
    }
}
const move_bullets = () => {
    for(var i=0;i<game.shot_arr.length;i++){
        if(game.shot_arr[i]!=null){
            game.shot_arr[i].draw();
            if(game.shot_arr[i].y < 0){
                game.disparo = false;
                game.shot_arr.splice(i, i);
            } 
        }
        if(game.shot_arr[i]==null){
            game.shot_arr.splice(i, i);
        }
    }
}
const colision_logic = () => {
    let enemigo , bala;
    console.log(game.score)
    if(game.score >= game.goal){
        gameOver()
    }

    for(var i=0;i<game.enemy_arr.length;i++){
        for(var j = 0;  j< game.shot_arr.length; j++){
            enemigo = game.enemy_arr[i];
            bala = game.shot_arr[j];

            if(enemigo !=null && bala !=null){
                if((bala.x>enemigo.x) &&
                    (bala.x<enemigo.x+enemigo.w) &&
                    (bala.y > enemigo.y) &&
                    (bala.y <enemigo.y+enemigo.w)){
                        enemigo.vive=false;
                        game.enemy_arr[i] = null;
                        game.shot_arr[j] = null;
                        game.score +=1;
                        game.boing.play();
                    }

            }

        }

    }
}
const animate = () =>{
    if(game.end_game==false){
        requestAnimationFrame(animate);
        move_player_auto();
        move_bullets();
        move_enemys_auto();
        colision_logic();
        score();
    }
}
const score=()=>{

    game.ctx.save();
    game.ctx.fillStyle = "white";
    game.ctx.font = "bold 20px Courier";
    game.ctx.drawImage(game.enemy_img, 95, 0, 35, 30, 10, 10, 35, 30);
    game.ctx.fillText("Vaquitas: " + game.score, 50, 30);
    game.ctx.restore();	



}
const iniciar_juego1 = () => {
    player.y = game.canvas.height -10;
    player.x = 10;
    player.size = 10
    game.end_game = false;
    
    var fondo = new Image();
    fondo.src = "img/fondo_game1.png";
    game.ctx.drawImage(fondo,0,0,fondo.width,fondo.height);
}




window.onload = function() {
	game.canvas = document.getElementById("canvas");
	if(game.canvas && game.canvas.getContext){
		game.ctx = canvas.getContext("2d");
		if (game.ctx) {
            game.boing = document.getElementById("boing");
            game.shot_sound = document.getElementById("disparo");

              
            title_img()
            game.canvas.addEventListener("click", click_manager, false);
		} else{
			alert("NO cuentas con CANVAS")
		};
	}
}

const gameOver=()=>{
    game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
    game.end_game = true;
    mensaje("Lo conseguiste" ,100,60);
    mensaje("rescataste "+game.goal+" vaquitas" ,170,60);
}

const mensaje=(cadena,y,tamano=40)=>{
    let medio =(game.canvas.width)/2;
    game.ctx.save();
    game.ctx.fillStyle = "green";
    game.ctx.strokeStyle = "blue";
    game.ctx.textBaseline = "top";
    game.ctx.font = "bold " + tamano + "px Courier";
    game.ctx.textAlign = "center";
    game.ctx.fillText(cadena, medio, y);
    game.ctx.restore();	
}
