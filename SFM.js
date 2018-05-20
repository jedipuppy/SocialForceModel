//----------------------------------------
// ソーシャルフォースモデル　シミュレーション
//----------------------------------------

//設定値
HUMANSIZE = 10;  //人のサイズ
DELAYDURATION = 10;  //1ステップの時間(ミリ秒)
MAXSTEP = 2000;  //最大ステップ数
MAXSPEED = 1;  //人間の最大の移動距離
SOCIALLENGTH = 21; //対人の抵抗を感じる基底距離
SOCIALPOWER =1;  //対人の抵抗の強さ
WALLREFLECTION = 1;  //境界からの反発
BLOCKREFLECTION = 0.1; //壁からの反発
PREDICTIONPOWER = 1; //衝突予測による抵抗係数
PREDICTIONMAXSTEP = 10; //人との衝突予測できる最大ステップ
PREDICTIONMAXDISTANCE = 50; //人との衝突予測する最大距離
BLOCKPREDICTIONLENGTH = 200; //障害物との衝突予測する最大距離
HOLEPOWER = 1; //壁に当たった時に隙間に向かおうとする力
MESH  = 2; //メッシュ
WIDTH = 1024;  //横幅
HEIGHT = 512;  //立幅
GOALRANGE = 30;  //ゴールの大きさ
BORNSTEP = 150000;  //人が生み出されるステップ間隔
initial_pos = [ //人の配置
[ 30  , 30  ],
[ 30  , 60  ],
[ 30  , 90  ],
[ 30  , 120 ],
[ 30  , 150 ],
[ 30  , 180 ],
[ 30  , 210 ],
[ 30  , 240 ],
[ 30  , 270 ],
[ 30  , 300 ],
[ 30  , 330 ],
[ 30  , 360 ],
[ 30  , 390 ],
[ 30  , 420 ],
[ 30  , 450 ],
[ 30  , 480 ],
[ 30  , 510 ],
[ 30  , 540 ],
[ 30  , 570 ],
[ 30  , 600 ],
[ 40  , 30  ],
[ 40  , 51  ],
[ 40  , 72  ],
[ 40  , 93  ],
[ 40  , 114 ],
[ 40  , 135 ],
[ 40  , 156 ],
[ 40  , 177 ],
[ 40  , 198 ],
[ 40  , 219 ],
[ 40  , 240 ],
[ 40  , 261 ],
[ 40  , 282 ],
[ 40  , 303 ],
[ 40  , 324 ],
[ 40  , 345 ],
[ 40  , 366 ],
[ 40  , 387 ],
[ 40  , 408 ],
[ 40  , 429 ],
[ 50  , 30  ],
[ 50  , 51  ],
[ 50  , 72  ],
[ 50  , 93  ],
[ 50  , 114 ],
[ 50  , 135 ],
[ 50  , 156 ],
[ 50  , 177 ],
[ 50  , 198 ],
[ 50  , 219 ],
[ 50  , 240 ],
[ 50  , 261 ],
[ 50  , 282 ],
[ 50  , 303 ],
[ 50  , 324 ],
[ 50  , 345 ],
[ 50  , 366 ],
[ 50  , 387 ],
[ 50  , 408 ],
[ 50  , 429 ],



];
initial_born = [ //人が生み出される位置の配置
[ 50  , 50  ],
[ 50  , 250  ],
[ 50  , 450  ],
];

dest_pos =[800,200]; //目的地の配置
blocks =  [ //ブロックの配置
//柱2
[200,40,250,110],
[200,190,250,260],
[200,340,250,410],
//ゲート
[400,0,440,275],
[400,300,440,512],

//柱2
[500,40,550,110],
[500,190,550,260],
[500,340,550,410],
]


//障害物を配置するスペースを定義（0がフリー、１が障害物）
space = new Array(Math.floor(WIDTH/MESH));
for(let y = 0; y < Math.floor(WIDTH/MESH); y++) {
  space[y] = new Array(Math.floor(HEIGHT/MESH)).fill(0);
}

//障害物を配置する
for(let blockID = 0; blockID < blocks.length; blockID++) {
  for (var x = Math.floor(blocks[blockID][0]/MESH); x < Math.floor(blocks[blockID][2]/MESH); x++) {
    for (var y = Math.floor(blocks[blockID][1]/MESH); y < Math.floor(blocks[blockID][3]/MESH); y++) {
      space[x][y] = 1;
    }
  }
}
//----------------------------------------
// パラメータを線源
//----------------------------------------
human = [];
humanCtx = [];
step = 0;



//----------------------------------------
// 起動時にinitを呼び出し、drawで動作を開始する
//----------------------------------------
onload = function() {
  init();
  
  draw();
};

//----------------------------------------
// 初期設定
//----------------------------------------
function init() {
  canvas = document.getElementById('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  //人のオブジェクトを作成する
  if ( ! canvas || ! canvas.getContext ) { return false; }
  for (var i = 0; i < initial_pos.length; i++) {
    human[i] = new Human(i,initial_pos[i]);
  }

  ctx = canvas.getContext('2d');

}


//----------------------------------------
// 描画
//----------------------------------------
function draw() {
  ctx.fillStyle =  'rgba(236, 240, 241, 1)';
  ctx.rect(0, 0, WIDTH, HEIGHT); //画面をクリアする
  ctx.fill();

//人の配置
  end_flag =1;
  for (var i = 0; i < human.length; i++) {
    if (human[i].goal_flag == 1){
      human.splice(i, 1)
    }
    else{
      end_flag = 0;
    
    ctx.beginPath();
    ctx.fillStyle =  'rgba(41, 128, 177, 1)';
    ctx.arc(human[i].pos[0], human[i].pos[1], HUMANSIZE, 0, Math.PI*2, false);
    ctx.stroke();
    ctx.fill();
    human[i].move();
    }
  }

//障害物の配置
  for (var i = 0; i < blocks.length; i++) {
    ctx.beginPath();
    ctx.rect(blocks[i][0],blocks[i][1],blocks[i][2]-blocks[i][0],blocks[i][3]-blocks[i][1])
    ctx.fillStyle =  'rgba(44, 62, 80, 1)';
    ctx.fill();
  }

//目的地の配置
  ctx.beginPath();
  ctx.fillStyle =  'rgba(231, 76, 60, 1)';
  ctx.arc(dest_pos[0], dest_pos[1], GOALRANGE, 0, Math.PI*2, false);

  ctx.fill();

//step数の表示
ctx.fillStyle = "gray";
 ctx.font = "30px serif";
 ctx.textAlign = "end";
ctx.fillText(step, WIDTH-10, 30);

  step++;
  //BORNSTEPごとに人間を生みだす
  if( (step % BORNSTEP) == 0 ){
    for (var i = 0; i < initial_born.length; i++) {
      humanBorn(initial_born[i][0],initial_born[i][1]);
    }
  }
  
 //step数がMAZSTEP以下で、まだ移動中の人がいたらループを続ける 
  if (step <MAXSTEP && end_flag == 0){
   setTimeout("draw()", DELAYDURATION); 
 }


}
//----------------------------------------
// Humanクラス
//----------------------------------------
function Human(id,initial_pos) {
  this.id = id;
  this.pos = initial_pos;
  this.vel = [0,0];
  this.accel = [0,0];
  this.goal_flag = 0;
}

//移動量を計算
Human.prototype.move = function(){
  block_flag = this.checkBlockFunc();//blockや境界との衝突を検知
  if (block_flag ==0){
  //衝突がない時はそれ以外の力を計算
  forceFromBlockPrediction = this.forceFromBlockPredictionFunc(); //目的地の引力（途中に障害物があったら穴の方向に進む）
  forceFromHumanPrediction = this.forceFromHumanPredictionFunc(); //人から受ける斥力

  this.accel[0] = forceFromBlockPrediction[0]+forceFromHumanPrediction[0];
  this.accel[1] = forceFromBlockPrediction[1]+forceFromHumanPrediction[1];
  //速度を計算
  this.vel[0] += this.accel[0];
  this.vel[1] += this.accel[1];
  }

  //速さが最大以下になるように調整
  speed = Math.sqrt(this.vel[0]*this.vel[0]+this.vel[1]*this.vel[1]);
  if (speed > MAXSPEED){
    this.vel[0] *=MAXSPEED/speed;
    this.vel[1] *=MAXSPEED/speed;
  }
  this.avoidFromHumanFunc();
  //位置を計算
  this.pos[0] += this.vel[0];
  this.pos[1] += this.vel[1];
   //ゴールしていないかチェック
  this.goalCheckFunc()
}


//ゴールしていないかチェック
Human.prototype.goalCheckFunc = function(){
  distance = distanceFunc(this.pos,dest_pos);
  if(distance < GOALRANGE){
    this.goal_flag = 1;

  }

}


//人とぶつからないように速度を制御
Human.prototype.avoidFromHumanFunc = function(){
  accel = [0,0];
  next_pos = [0,0];
  speed = Math.sqrt(this.vel[0]*this.vel[0]+this.vel[1]*this.vel[1]);
  for (var i = 0; i < human.length; i++) {
      next_pos[0] = this.pos[0] + this.vel[0];
      next_pos[1] = this.pos[1] + this.vel[1];      
        if (human[i].id != this.id　&& distanceFunc(human[i].pos,next_pos) <SOCIALLENGTH){
      diff_pos = [human[i].pos[0] - this.pos[0],human[i].pos[1] - this.pos[1]];
      diff_length = Math.sqrt( Math.pow(diff_pos[0],2) + Math.pow(diff_pos[1],2) );
console.log(distanceFunc(this.pos,next_pos));

        this.vel[0] -= diff_pos[0]/diff_length*speed;
        this.vel[1] -= diff_pos[1]/diff_length*speed;         
    }
  }
}

//人との衝突予測から受ける斥力
Human.prototype.forceFromHumanPredictionFunc = function(){
  accel = [0,0]
  for (var id = 0; id < human.length; id++) {
    if (human[id].id != this.id && distanceFunc(this.pos,human[id].pos) <PREDICTIONMAXDISTANCE){
      temp_distance = WIDTH;
      for (var t = 0; t <PREDICTIONMAXSTEP; t++) {
        next_pos_this = [this.pos[0]+this.vel[0]*t , this.pos[1]+this.vel[1]*t];
        next_pos_human = [human[id].pos[0]+human[id].vel[0]*t , human[id].pos[1]+human[id].vel[1]*t];
        next_distance = distanceFunc(next_pos_human,next_pos_this);
        if(next_distance > temp_distance ){
          if(t != 1){
            accel[0] += PREDICTIONPOWER*Math.exp(-t)*(human[id].vel[0] - this.vel[0]);
            accel[1] += PREDICTIONPOWER*Math.exp(-t)*(human[id].vel[1] - this.vel[1]);
          }
          break;
        }
        else{
          temp_distance = next_distance;
        }
      }
    }
  }
  return accel;
}


//障害物との衝突予測から受ける斥力
Human.prototype.forceFromBlockPredictionFunc = function(){
  accel = [0,0]
  speed = Math.sqrt(this.vel[0]*this.vel[0]+this.vel[1]*this.vel[1]);
  blockX = Math.round((this.pos[0])/MESH);
  blockY = Math.round((this.pos[1])/MESH);
  if ( speed != 0 ){


  for (var t = 0; t <WIDTH; t++) {
    future_blockX = Math.round((this.pos[0]+this.vel[0]/speed*t)/MESH);
    future_blockY = Math.round((this.pos[1]+this.vel[1]/speed*t)/MESH);
    if(future_blockX <= 0 || future_blockX >= WIDTH/MESH || future_blockY <= 0 || future_blockY >= HEIGHT/MESH  || t > BLOCKPREDICTIONLENGTH){
      break;
    }
    if( space[future_blockX][future_blockY] == 1 ){
      for (var i = 0; i <WIDTH; i++) {
      
        if( space[future_blockX][blockY-i] == 0 ){
          future_blockLength = Math.sqrt(future_blockX*future_blockX+blockY*blockY);
          accel[0] = (future_blockX-blockX)* MESH / future_blockLength;
          accel[1] =  -i * MESH / future_blockLength;
          return accel;
        }
        else if( space[future_blockX][blockY+i] == 0 ){
          future_blockLength = Math.sqrt(future_blockX*future_blockX+blockY*blockY);
          accel[0] = (future_blockX-blockX)  * MESH / future_blockLength;
          accel[1] = i * MESH / future_blockLength;
          return accel;
        }

      }
      break;
    }
  }
  }
    return this.forceForDestinationFunc();
  }


//目的地の引力
Human.prototype.forceForDestinationFunc = function(){
  accel = [0,0];
  diff_pos_arb = [0,0];

  diff_pos = [dest_pos[0] - this.pos[0],dest_pos[1] - this.pos[1]];
  diff_length = Math.sqrt( Math.pow(diff_pos[0],2) + Math.pow(diff_pos[1],2) );
  diff_pos_arb[0] = diff_pos[0] /diff_length *MAXSPEED;
  diff_pos_arb[1] = diff_pos[1] /diff_length *MAXSPEED;
  accel[0] +=  (diff_pos_arb[0] - this.vel[0] );
  accel[1] +=  (diff_pos_arb[1] - this.vel[1] );
  return accel
}


//壁や境界との衝突をチェック
Human.prototype.checkBlockFunc = function(){




//境界との衝突チェック
boundary_flag = 0;
if (this.pos[0] < HUMANSIZE*2){
  this.vel[0] = WALLREFLECTION;
  boundary_flag = 1;
}
else if(this.pos[1] < HUMANSIZE*2){
  this.vel[1] = WALLREFLECTION;
  boundary_flag = 1;
}
else if (this.pos[0] > WIDTH - HUMANSIZE*2){
  this.vel[0] = -WALLREFLECTION;
  boundary_flag = 1;
}
else if(this.pos[1] > HEIGHT - HUMANSIZE*2){
  this.vel[1] = -WALLREFLECTION;
  boundary_flag = 1;
}

if (boundary_flag == 1){
  return 1;
}


blockX = Math.round(this.pos[0]/MESH);
blockY = Math.round(this.pos[1]/MESH); 

//ブロック内にいないかチェック
    if ( space[blockX][blockY] == 1  ){
       for (var i = 0; i < WIDTH; i++) {     
        if (space[blockX+i][blockY] == 0){
          this.vel[0] = BLOCKREFLECTION;           

          return 2;
        }
        else if (space[blockX-i][blockY] == 0){
          this.vel[0] = -BLOCKREFLECTION;           
 
          return 2;
        }
        else if (space[blockX][blockY+i] == 0){
       
          this.vel[1] = BLOCKREFLECTION; 
          return 2;
        }
        else if (space[blockX][blockY+i] == 0){
          
          this.vel[1] = -BLOCKREFLECTION; 
          return 2;
        }
      }        
}
//ブロックに近づいていないかチェック

  block_boundary_flag = 0;
  for (var direction = -1; direction <= 1; direction+=2) {
    for (var length = 1; length <HUMANSIZE*2/MESH; length++){
    //x方向をチェック
    if ( space[blockX+direction*length][blockY] == 1  ){
      block_boundary_flag = 1;
      this.vel[0] = 0;
      //目的地に向かうための隙間を探す
      for (var i = 0; i < HEIGHT; i++) {
        if (space[blockX+direction*length][blockY-i] == 0){
          this.vel[1] -= HOLEPOWER; 
          return 2;
        }
        else if (space[blockX+direction*length][blockY+i] == 0){ 
          this.vel[1] += HOLEPOWER; 
          return 2;
        }
      }
    }

    //y方向をチェック
    if ( space[blockX][blockY+direction] == 1  ){
    block_boundary_flag = 1;
      this.vel[0] += HOLEPOWER;
      this.vel[1] = 0;

    }
}
  }

  if (block_boundary_flag ==1){
    return 3;
  }
  return 0;
}

//----------------------------------------
//二つの 位置から距離を計算して返す
//----------------------------------------
function distanceFunc(posA,posB){
  distance = Math.sqrt((posA[0]-posB[0])*(posA[0]-posB[0]) + (posA[1]-posB[1])*(posA[1]-posB[1]));
  return distance;
}

//----------------------------------------
//指定した位置近辺から人間を生み出す
//----------------------------------------
function humanBorn(x,y){
      newHuman = new Human(human.length,[x+(Math.random()-0.5)*5,y+(Math.random()-0.5)*5]);
      human.push(newHuman);
}