/*管子类*/
function Pipe(pipe_up, pipe_down, step, x) {
    // 上管子图片
    this.pipe_up = pipe_up;
    // 下管子图片
    this.pipe_down = pipe_down;
    // 定义上管子的长度 1-249中随机生成
    this.up_height = parseInt(Math.random() * 249 + 1);
    // 定义下管子的长度 250 - 上管子的长度
    this.down_height = 250 - this.up_height;
    // 步长
    this.step = step;
    // 图片的x值
    this.x = x;
    // 计数器
    this.count = 0;
}

// 创建管子
Pipe.prototype.createPipe = function () {
    return new Pipe(this.pipe_up, this.pipe_down, this.step, this.x);
};