/*
*  游戏类
* @ctx 画笔
* @bird 鸟的实例
* @pipe 管子的实例
* @land 背景的实例
* @mountaion 背景的实例
*
* */
function Game(ctx, bird, pipe, land, mountain) {
    this.ctx = ctx;
    this.bird = bird;
    this.pipeArr = [pipe];
    this.land = land;
    this.mountain = mountain;
    // 定义定时器
    this.timer = null;
    // 定义帧
    this.iframe = 0;
    // 初始化
    this.init();
}

// 初始化方法
Game.prototype.init = function () {
    this.start();
    this.bindEvent();
};

// 渲染背景
Game.prototype.renderMountain = function () {
    var img = this.mountain.img;
    this.mountain.x -= this.mountain.step;
    // 判断图片移动的位置
    if (this.mountain.x < -img.width) {
        this.mountain.x = 0;
    }
    // 绘制山图片
    this.ctx.drawImage(img, this.mountain.x, this.mountain.y);
    this.ctx.drawImage(img, this.mountain.x + img.width, this.mountain.y);
    this.ctx.drawImage(img, this.mountain.x + img.width * 2, this.mountain.y);
};

// 渲染地面
Game.prototype.renderLand = function () {
    var img = this.land.img;
    this.land.x -= this.land.step;
    // 判断图片移动的位置
    if (this.land.x < -img.width) {
        this.land.x = 0;
    }
    // 绘制地面图片
    this.ctx.drawImage(img, this.land.x, this.land.y);
    this.ctx.drawImage(img, this.land.x + img.width, this.land.y);
    this.ctx.drawImage(img, this.land.x + img.width * 2, this.land.y);
};


// 渲染鸟
Game.prototype.renderBird = function () {
    var img = this.bird.img;
    // 保存状态
    this.ctx.save();
    // 平移坐标轴
    this.ctx.translate(this.bird.x, this.bird.y);
    // 判断鸟的状态 下降让鸟顺时针旋转 上升逆时针旋转
    var deg = this.bird.state === 'D' ? Math.PI / 180 * this.bird.speed : -Math.PI / 180 * this.bird.speed;
    // 旋转
    this.ctx.rotate(deg);
    // 绘制图片
    this.ctx.drawImage(img, -img.width / 2, -img.height / 2);
    // 恢复状态
    this.ctx.restore();
};

// 游戏开始
Game.prototype.start = function () {
    // 缓存this
    var that = this;
    this.timer = setInterval(function () {
        // 帧++
        that.iframe++;
        // 清屏
        that.clear();
        // 渲染背景山
        that.renderMountain();
        // 渲染地面
        that.renderLand();
        // 渲染管子
        that.renderPipe();
        // 移动管子
        that.movePipe();
        // 渲染鸟 新图形压盖旧图形 鸟要放在管子后面
        that.renderBird();
        // 渲染鸟上的4个点
        that.renderBirdPoints();
        // 渲染管子上的8个点
        that.renderPipePoints();
        // 鸟飞翔
        if (!(that.iframe % 10)) {  // 改变震动翅膀的频率
            that.bird.fly();
        }
        // 鸟下降
        that.bird.flawDown();
        // 每iframe65次时，创建一根管子
        if (!(that.iframe % 65)) {
            // 创建管子
            that.createPipe();
        }
        // 清除管子
        that.clearPipe();
        // 检测碰撞
        that.checkPipe();
    }, 20)
};

// 清屏方法
Game.prototype.clear = function () {
    this.ctx.clearRect(0, 0, 360, 512);
};

// 为canvas添加点击事件
Game.prototype.bindEvent = function () {
    // 缓存this
    var that = this;
    this.ctx.canvas.onclick = function () {
        // 调用鸟上升的方法
        that.bird.goUp();
    }
};

// 渲染管子
Game.prototype.renderPipe = function () {
    var that = this;
    // 多个管子，循环渲染
    this.pipeArr.forEach(function (value, index) {
        // 绘制上管子
        var img = value.pipe_up;
        // 图片上的值
        var img_x = 0;
        // y = 图片的高度 - 上管子的高度
        var img_y = img.height - value.up_height;
        var img_w = img.width;
        // 上管子的高
        var img_h = value.up_height;
        // canvas 上的值
        // x = canvas宽度 - 管子步长 * 计数器
        var canvas_x = that.ctx.canvas.width - value.step * value.count;
        var canvas_y = 0;
        var canvas_w = img.width;
        // 上管子的高
        var canvas_h = value.up_height;
        // 绘制上管子
        that.ctx.drawImage(img, img_x, img_y, img_w, img_h, canvas_x, canvas_y, canvas_w, canvas_h);


        // 绘制下管子
        var img_down = value.pipe_down;
        // 图片上的值
        var img_down_x = 0;
        var img_down_y = 0;
        var img_down_w = img_down.width;
        // 下管子的高
        var img_down_h = value.down_height;
        // canvas上的值
        var canvas_down_x = that.ctx.canvas.width - value.step * value.count;
        // y = 上管子的高度 + 开口距高150
        var canvas_down_y = value.up_height + 150;
        var canvas_down_w = img_down.width;
        var canvas_down_h = 250 - value.up_height;
        // 绘制下管子
        that.ctx.drawImage(img_down, img_down_x, img_down_y, img_down_w, img_down_h, canvas_down_x, canvas_down_y, canvas_down_w, canvas_down_h);
    })
};

// 移动管子
Game.prototype.movePipe = function () {
    this.pipeArr.forEach(function (value, index) {
        // 计数器++
        value.count++;
    })
};


// 创建管子
Game.prototype.createPipe = function () {
    // pipeArr中有一个管子实例对象，通过调用原型中创建管子的方法创建新管子
    var pipe = this.pipeArr[0].createPipe();
    // 将新创建的管子添加到数组中
    this.pipeArr.push(pipe);
};

// 清除管子
Game.prototype.clearPipe = function () {
    // 遍历pipeArr管子数组
    for (var i = 0; i < this.pipeArr.length; i++) {
        var pipe = this.pipeArr[i];
        // 判断管子是否从canvas画布中出去
        if (pipe.x - pipe.step * pipe.count < -pipe.pipe_up.width) {
            // 移除已经出去的管子
            this.pipeArr.splice(i, 1);
            return;
        }
    }
};

// 绘制鸟上的4个点
Game.prototype.renderBirdPoints = function () {
    // 鸟的左上角A点
    var Bird_A = {
        x: -this.bird.img.width / 2 + 6 + this.bird.x,
        y: -this.bird.img.height / 2 + 6 + this.bird.y
    };
    // 鸟的右上角B点
    var Bird_B = {
        x: Bird_A.x + this.bird.img.width - 12,
        y: Bird_A.y
    };
    // 鸟的左下角C点
    var Bird_C = {
        x: Bird_A.x,
        y: Bird_A.y + this.bird.img.height - 12
    };
    // 鸟的右下角D点
    var Bird_D = {
        x: Bird_B.x,
        y: Bird_C.y
    };

    // 开启路径
    this.ctx.beginPath();
    // 绘制路径  A->B->D->C
    this.ctx.moveTo(Bird_A.x, Bird_A.y);
    this.ctx.lineTo(Bird_B.x, Bird_B.y);
    this.ctx.lineTo(Bird_D.x, Bird_D.y);
    this.ctx.lineTo(Bird_C.x, Bird_C.y);
    // 关闭路径
    this.ctx.closePath();
    // this.ctx.strokeStyle = 'blue';
    // this.ctx.stroke();
};

// 绘制管子上的8个点
Game.prototype.renderPipePoints = function () {
    // 多根管子 需要循环渲染
    for (var i = 0; i < this.pipeArr.length; i++) {
        // 获取一根管子
        var pipe = this.pipeArr[i];
        // 绘制上管子上的4个点
        // 上管子左上角A点
        var pipe_A = {
            x: pipe.x - pipe.step * pipe.count,
            y: 0
        };
        // 上管子右上角B点
        var pipe_B = {
            x: pipe_A.x + pipe.pipe_up.width,
            y: 0
        };
        // 上管子右下角C点
        var pipe_C = {
            x: pipe_B.x,
            y: pipe.up_height
        };
        // 上管子左下角D点
        var pipe_D = {
            x: pipe_A.x,
            y: pipe_C.y
        };

        // 开启路径
        this.ctx.beginPath();
        this.ctx.moveTo(pipe_A.x, pipe_A.y);
        this.ctx.lineTo(pipe_B.x, pipe_B.y);
        this.ctx.lineTo(pipe_C.x, pipe_C.y);
        this.ctx.lineTo(pipe_D.x, pipe_D.y);
        this.ctx.closePath();


        // 绘制下管子的4个点
        // 下管子右上角A点
        var pipe_down_A = {
            x: pipe.x - pipe.step * pipe.count,
            y: pipe.up_height + 150
        };
        // 下管子右上角B点
        var pipe_down_B = {
            x: pipe_down_A.x + pipe.pipe_up.width,
            y: pipe_down_A.y
        };
        // 下管子左下角C点
        var pipe_down_C = {
            x: pipe_down_A.x,
            y: 400
        };
        // 下管子右下角D点
        var pipe_down_D = {
            x: pipe_down_B.x,
            y: 400
        };

        // 开启路径
        this.ctx.beginPath();
        this.ctx.moveTo(pipe_down_A.x, pipe_down_A.y);
        this.ctx.lineTo(pipe_down_B.x, pipe_down_B.y);
        this.ctx.lineTo(pipe_down_D.x, pipe_down_D.y);
        this.ctx.lineTo(pipe_down_C.x, pipe_down_C.y);
        this.ctx.closePath();
    }
};


// 检测碰撞
Game.prototype.checkPipe = function () {
    for (var i = 0; i < this.pipeArr.length; i++) {
        var pipe = this.pipeArr[i];

        // 上管子左上角A点
        var pipe_A = {
            x: pipe.x - pipe.step * pipe.count,
            y: 0
        };
        // 上管子右上角B点
        var pipe_B = {
            x: pipe.x - pipe.step * pipe.count + pipe.pipe_up.width,
            y: 0
        };
        // 上管子左下角C点
        var pipe_C = {
            x: pipe_A.x,
            y: pipe.up_height
        };
        // 上管子右下角D点
        var pipe_D = {
            x: pipe_B.x,
            y: pipe_C.y
        };

        // 绘制下管子的4个点
        // 下管子右上角A点
        var pipe_down_A = {
            x: pipe.x - pipe.step * pipe.count,
            y: pipe.up_height + 150
        };
        // 下管子右上角B点
        var pipe_down_B = {
            x: pipe.x - pipe.step * pipe.count + pipe.pipe_up.width,
            y: pipe_down_A.y
        };
        // 下管子左下角C点
        var pipe_down_C = {
            x: pipe_down_A.x,
            y: 400
        };
        // 下管子右下角D点
        var pipe_down_D = {
            x: pipe_down_B.x,
            y: 400
        };
        // 鸟的左上角A点
        var Bird_A = {
            x: -this.bird.img.width / 2 + 6 + this.bird.x,
            y: -this.bird.img.height / 2 + 6 + this.bird.y
        };
        // 鸟的右上角B点
        var Bird_B = {
            x: Bird_A.x + this.bird.img.width - 12,
            y: Bird_A.y
        };
        // 鸟的右下角C点
        var Bird_C = {
            x: Bird_B.x,
            y: Bird_A.y + this.bird.img.height - 12
        };
        // 鸟的左下角D点
        var Bird_D = {
            x: Bird_A.x,
            y: Bird_C.y
        };

        // 鸟的C点与上管子的C点进行比较
        if (Bird_B.x >= pipe_C.x && Bird_B.y <= pipe_C.y && Bird_C.x <= pipe_D.x) {
            // 游戏结束
            this.gameOver();
        }

        // 鸟的D点与下管子的A点进行比较
        if (Bird_D.x >= pipe_down_A.x && Bird_D.y >= pipe_down_A.y && Bird_A.x <= pipe_down_B.x) {
            // 游戏结束
            this.gameOver();
        }
    }
};

// 游戏结束
Game.prototype.gameOver = function () {
    // 清理定时器;
    clearInterval(this.timer);
    alert('游戏结束');
    // console.log(123);
};