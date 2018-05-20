//----------------------------------------
// ソーシャルフォースモデル　シミュレーション
//----------------------------------------

//設定値
HUMANSIZE = 10;  //人のサイズ
DELAYDURATION = 0;  //1ステップの時間(ミリ秒)
MAXSTEP = 20000000;  //最大ステップ数
MAXSPEED = 0.5;  //人間の最大の移動距離
SOCIALLENGTH = 20; //対人の抵抗を感じる基底距離
SOCIALPOWER =0.2;  //対人の抵抗の強さ
WALLREFLECTION = 0.1;  //境界からの反発
BLOCKREFLECTION = 0.1; //壁からの反発
PREDICTIONPOWER = 1; //衝突予測による抵抗係数
PREDICTIONMAXSTEP = 5; //人との衝突予測できる最大ステップ
PREDICTIONMAXDISTANCE = 50; //人との衝突予測する最大距離
BLOCKPREDICTIONFACTOR = 0.3; //障害物との衝突予測する最大距離
HOLEPOWER = 5; //壁に当たった時に隙間に向かおうとする力
MESH  = 2; //メッシュ
WIDTH = 512;  //横幅
HEIGHT = 512;  //立幅
GOALRANGE = 30;  //ゴールの大きさ
BORNSTEP = 150000000;  //人が生み出されるステップ間隔
initial_pos = [ //人の配置
[ 30  , 20  ],
[ 30  , 41  ],
[ 30  , 62  ],
[ 30  , 83  ],
[ 30  , 104 ],
[ 30  , 125 ],
[ 30  , 146 ],
[ 30  , 167 ],
[ 30  , 188 ],
[ 30  , 209 ],
[ 30  , 230 ],
[ 30  , 251 ],
[ 51  , 20  ],
[ 51  , 41  ],
[ 51  , 62  ],
[ 51  , 83  ],
[ 51  , 104 ],
[ 51  , 125 ],
[ 51  , 146 ],
[ 51  , 167 ],
[ 51  , 188 ],
[ 51  , 209 ],
[ 51  , 230 ],
[ 51  , 251 ],
[ 72  , 20  ],
[ 72  , 41  ],
[ 72  , 62  ],
[ 72  , 83  ],
[ 72  , 104 ],
[ 72  , 125 ],
[ 72  , 146 ],
[ 72  , 167 ],
[ 72  , 188 ],
[ 72  , 209 ],
[ 72  , 230 ],
[ 72  , 251 ],
[ 83  , 20  ],
[ 83  , 41  ],
[ 83  , 62  ],
[ 83  , 83  ],
[ 83  , 104 ],
[ 83  , 125 ],
[ 83  , 146 ],
[ 83  , 167 ],
[ 83  , 188 ],
[ 83  , 209 ],
[ 83  , 230 ],
[ 83  , 251 ],
[ 94  , 20  ],
[ 94  , 41  ],
[ 94  , 62  ],
[ 94  , 83  ],
[ 94  , 104 ],
[ 94  , 125 ],
[ 94  , 146 ],
[ 94  , 167 ],
[ 94  , 188 ],
[ 94  , 209 ],
[ 94  , 230 ],
[ 94  , 251 ],
];
initial_born = [ //人が生み出される位置の配置
[ 50  , 50  ],
[ 50  , 250  ],
[ 50  , 450  ],
];

dest_pos =[800,200]; //目的地の配置
blocks =  [ //ブロックの配置
//柱1
//[200,40,250,110],
//[200,190,250,260],
//[200,340,250,410],

//ゲート
//[400,0,410,50],
//[400,100,410,512],

//柱2
//[500,40,550,110],
//[500,190,550,260],
//[500,340,550,410],
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
      end_flag = 0;
    ctx.beginPath();
    ctx.fillStyle =  'rgba(41, 128, 177, 1)';
    ctx.arc(human[i].pos[0], human[i].pos[1], HUMANSIZE, 0, Math.PI*2, false);

    ctx.fill();
    human[i].move();
  }

//障害物の配置
  for (var i = 0; i < blocks.length; i++) {
    ctx.beginPath();
    ctx.rect(blocks[i][0],blocks[i][1],blocks[i][2]-blocks[i][0],blocks[i][3]-blocks[i][1])
    ctx.fillStyle =  'rgba(44, 62, 80, 1)';
    ctx.fill();
  }

//目的地の配置
//  ctx.beginPath();
//  ctx.fillStyle =  'rgba(231, 76, 60, 1)';
//  ctx.arc(dest_pos[0], dest_pos[1], GOALRANGE, 0, Math.PI*2, false);

//  ctx.fill();

//step数の表示
ctx.fillStyle = "gray";
 ctx.font = "30px serif";
 ctx.textAlign = "end";
ctx.fillText(step, WIDTH-10, 30);

  step++;
  //BORNSTEPごとに人間を生みだす
 // if( (step % BORNSTEP) == 0 ){
 //   for (var i = 0; i < initial_born.length; i++) {
 //     humanBorn(initial_born[i][0],initial_born[i][1]);
 //   }
 // }
  
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
  vel_angle = random.nextInt(0,360)/360*2*Math.PI;
  this.vel = [Math.cos(vel_angle),Math.sin(vel_angle)];
  this.accel = [0,0];
  this.goal_flag = 0;
}

//移動量を計算
Human.prototype.move = function(){
  block_flag = this.checkBlockFunc();//blockや境界との衝突を検知
  if (block_flag ==0){
  //衝突がない時はそれ以外の力を計算
 // forceFromBlockPrediction = this.forceFromBlockPredictionFunc(); //目的地の引力（途中に障害物があったら穴の方向に進む）
 // forceFromHuman = this.forceFromHumanFunc(); //人から受ける斥力
  forceFromHumanPrediction = this.forceFromHumanPredictionFunc(); //人から受ける斥力
  this.accel[0] = forceFromHumanPrediction[0];
  this.accel[1] = forceFromHumanPrediction[1];
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
//  this.goalCheckFunc()
}


//ゴールしていないかチェック
Human.prototype.goalCheckFunc = function(){
  distance = distanceFunc(this.pos,dest_pos);
  if(distance < GOALRANGE){
    this.goal_flag = 1;

  }

}


//人から受ける斥力
Human.prototype.forceFromHumanFunc = function(){
  accel = [0,0]
  for (var i = 0; i < human.length; i++) {
    if (human[i].id != this.id){
      diff_pos = [human[i].pos[0] - this.pos[0],human[i].pos[1] - this.pos[1]];
      diff_length = Math.sqrt( Math.pow(diff_pos[0],2) + Math.pow(diff_pos[1],2) );
 //     accel[0] += -Math.exp((SOCIALLENGTH-diff_length)/SOCIALPOWER) * diff_pos[0] / diff_length;
 //     accel[1] += -Math.exp((SOCIALLENGTH-diff_length)/SOCIALPOWER) * diff_pos[1] / diff_length;
    }
  }

  return accel;
}



//人とぶつからないように速度を制御
Human.prototype.avoidFromHumanFunc = function(){
  accel = [0,0];
  speed = Math.sqrt(this.vel[0]*this.vel[0]+this.vel[1]*this.vel[1]);
  for (var i = 0; i < human.length; i++) {
        if (human[i].id != this.id　&& distanceFunc(this.pos,human[i].pos) <SOCIALLENGTH){
      diff_pos = [human[i].pos[0] - this.pos[0],human[i].pos[1] - this.pos[1]];
      diff_length = Math.sqrt( Math.pow(diff_pos[0],2) + Math.pow(diff_pos[1],2) );

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
            accel[0] += PREDICTIONPOWER/(t*t)*(human[id].vel[0] - this.vel[0]);
            accel[1] += PREDICTIONPOWER/(t*t)*(human[id].vel[1] - this.vel[1]);
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
    if(future_blockX <= 0 || future_blockX >= WIDTH/MESH || future_blockY <= 0 || future_blockY >= HEIGHT/MESH ){
      break;
    }
    if( space[future_blockX][future_blockY] == 1 ){
      for (var i = 0; i <WIDTH; i++) {
      
        if( space[future_blockX][blockY-i] == 0 ){
          future_blockLength = Math.sqrt(future_blockX*future_blockX+blockY*blockY);
          accel[0] = (future_blockX-blockX)* MESH / future_blockLength * BLOCKPREDICTIONFACTOR;
          accel[1] =  -i * MESH / future_blockLength;
          return accel;
        }
        else if( space[future_blockX][blockY+i] == 0 ){
          future_blockLength = Math.sqrt(future_blockX*future_blockX+blockY*blockY);
          accel[0] = (future_blockX-blockX)  * MESH / future_blockLength * BLOCKPREDICTIONFACTOR;
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





//----------------------------------------
// 乱数生成関数
//----------------------------------------

class Random {
  constructor(seed = 88675123) {
    this.x = 123456789;
    this.y = 362436069;
    this.z = 521288629;
    this.w = seed;
  }
  
  // XorShift
  next() {
    let t;

    t = this.x ^ (this.x << 11);
    this.x = this.y; this.y = this.z; this.z = this.w;
    return this.w = (this.w ^ (this.w >>> 19)) ^ (t ^ (t >>> 8)); 
  }
  
  // min以上max以下の乱数を生成する
  nextInt(min, max) {
    const r = Math.abs(this.next());
    return min + (r % (max + 1 - min));
  }
}
const seed = 1;
const random = new Random(seed);