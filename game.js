// 写一个贪食蛇的游戏

// 1. 创建一个蛇
// 2. 创建一个食物
// 3. 创建一个游戏界面
// 4. 让蛇移动
// 5. 让蛇吃食物
// 6. 让蛇长大
// 7. 让蛇死亡

console.log("游戏脚本已加载");

window.onload = function() {
  console.log("页面已完全加载");
  const canvas = document.getElementById('gameCanvas');
  if (canvas) {
    console.log("Canvas 元素已找到");
    const ctx = canvas.getContext('2d');
    if (ctx) {
      console.log("Canvas 上下文已创建");
      // 绘制一个测试矩形
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, 50, 50);
    } else {
      console.error("无法创建 Canvas 上下文");
    }
  } else {
    console.error("找不到 Canvas 元素");
  }
  const game = new Game();
  game.start();
}

// 游戏配置
const config = {
    canvasWidth: window.innerWidth,
    canvasHeight: window.innerHeight,
    gridSize: Math.floor(Math.min(window.innerWidth, window.innerHeight) / 20),
    snakeColor: '#4CAF50',
    foodColor: '#FF5722'
  };

// 蛇类
class Snake {
  constructor() {
    this.body = [{x: 5, y: 5}];
    this.direction = 'right';
  }

  move() {
    const head = {...this.body[0]};
    switch(this.direction) {
      case 'up': head.y--; break;
      case 'down': head.y++; break;
      case 'left': head.x--; break;
      case 'right': head.x++; break;
    }
    this.body.unshift(head);
    this.body.pop();
  }

  grow() {
    const tail = {...this.body[this.body.length - 1]};
    this.body.push(tail);
  }

  changeDirection(newDirection) {
    const opposites = {up: 'down', down: 'up', left: 'right', right: 'left'};
    if (newDirection !== opposites[this.direction]) {
      this.direction = newDirection;
    }
  }

  checkCollision() {
    const head = this.body[0];
    return (
      head.x < 0 || head.x >= config.canvasWidth / config.gridSize ||
      head.y < 0 || head.y >= config.canvasHeight / config.gridSize ||
      this.body.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    );
  }
}

// 食物类
class Food {
  constructor() {
    this.position = this.getRandomPosition();
  }

  getRandomPosition() {
    return {
      x: Math.floor(Math.random() * (config.canvasWidth / config.gridSize)),
      y: Math.floor(Math.random() * (config.canvasHeight / config.gridSize))
    };
  }
}


// 游戏类
class Game {
  constructor() {
    this.snake = new Snake();
    this.food = new Food();
    this.score = 0;
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = config.canvasWidth;
    this.canvas.height = config.canvasHeight;
    this.bindKeyEvents();
  }

  bindKeyEvents() {
    document.addEventListener('keydown', (e) => {
      const keyMap = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right'
      };
      if (keyMap[e.key]) {
        this.snake.changeDirection(keyMap[e.key]);
      }
    });
  }

  update() {
    this.snake.move();

    if (this.snake.checkCollision()) {
      this.gameOver();
      return;
    }

    if (this.snake.body[0].x === this.food.position.x && this.snake.body[0].y === this.food.position.y) {
      this.snake.grow();
      this.food = new Food();
      this.score++;
    }

    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 绘制蛇
    this.ctx.fillStyle = config.snakeColor;
    this.snake.body.forEach(segment => {
      this.ctx.fillRect(segment.x * config.gridSize, segment.y * config.gridSize, config.gridSize, config.gridSize);
    });

    // 绘制食物
    this.ctx.fillStyle = config.foodColor;
    this.ctx.fillRect(this.food.position.x * config.gridSize, this.food.position.y * config.gridSize, config.gridSize, config.gridSize);

    // 绘制分数
    this.ctx.fillStyle = 'black';
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`分数: ${this.score}`, 10, 30);
  }

  gameOver() {
    alert(`游戏结束！你的得分是: ${this.score}`);
    this.snake = new Snake();
    this.food = new Food();
    this.score = 0;
  }

  start() {
    setInterval(() => this.update(), 200);
  }
}

// 启动游戏

