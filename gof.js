/* global Crafty*/
'use strict';

function Cell(map,x,y,size,alive){
  var self = this;

  self.map = map;
  self.x = x;
  self.y = y;
  self.life = alive;
  self.nextLife = false;
  self.entity = Crafty.e('2D, Canvas, Color').attr({
    x: self.x*size,
    y: self.y*size,
    w: size,
    h: size
  }).color( self.life?'#000':'#fff');

}

Cell.prototype.update = function (){
  var self = this;
  self.entity.color(self.life?'#000':'#fff');
  this.life = this.nextLife;

};

Cell.prototype.nextRound = function(){
  var self = this;
  var n = self.map.getNeighbors(self);

  if( self.life ){
    if(n===2||n===3 ){
      self.nextLife = true;
    }
    else{
      self.nextLife = false;
    }
  }else{
    if(n===3){
      self.nextLife = true;
    }
  }

};


function Map(mapSize,cellSize){
  var self = this;
  var n = Math.floor(mapSize/cellSize);

  if(n<5){
    throw new Error('map is too small');
  }

  self.cellSize = cellSize;
  self.mapSize = cellSize*n;
  self.n= n;
  self.cells = [];
  Crafty.init(self.mapSize, self.mapSize, document.getElementById('game'));
  for(var row=0;row<n;row += 1){
    for(var col=0;col<n;col += 1){
      var life  = Math.random()>0.5 ;
      self.cells.push(new Cell(self,row,col,self.cellSize, life ));
    }
  }
}

var dirs =[
  [ 0, 1],
  [ 0,-1],
  [ 1, 0],
  [-1, 0],
  [ 1, 1],
  [-1, 1],
  [-1,-1],
  [ 1,-1]
];

Map.prototype.getCell = function (x,y){
  var self = this;
  if( x<0 || x>=self.n || y<0 || y>=self.n){
    throw new Error('wrong cordinate for cell ( ' +x + ',' +y +')');
  }
  return self.cells[x*self.n + y];
};

Map.prototype.getNeighbors = function (cell){

  var x = cell.x, y = cell.y;
  var self = this;
  var res = dirs.map(function(dir){
    return [dir[0]+x,dir[1]+y];
  })
  .filter(function(cor){
    return cor[0]>=0&&cor[1]>=0&&cor[0]<self.n&&cor[1]<self.n;
  })
  .reduce(function(prev,curCor){
     return  prev + (self.getCell(curCor[0],curCor[1]).life?1:0);
  },0);

  return res;
};

Map.prototype.update = function(){
  var self = this;
  self.cells.forEach(function(cell){
    cell.update();
  });

};

Map.prototype.nextRound = function (){
  var self = this;

  self.cells.forEach(function(cell){
    cell.nextRound();
  });

};

Map.prototype.life = function(x,y){
  var self = this;
  self.getCell(x,y).life = true;
  return self;
};

var map = new Map(500,10);

var game = setInterval(function(){
  map.nextRound();
  map.update();
}, 1000);

function stop(){
  clearInterval(game);
}


