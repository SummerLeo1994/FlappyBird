/*鸟类*/
function Bird(imgArr, x, y) {
    this.imgArr = imgArr;
    // 精确一张图片
    this.index = parseInt(Math.random() * imgArr.length);
    this.img = this.imgArr[this.index];
    // 图片的x,y属性
    this.x = x;
    this.y = y;
    // 定义鸟的状态
    this.state = 'D'; // Down 下降
    // 定义鸟上升/下降的速度
    this.speed = 0;
}

// 鸟飞翔,震动翅膀
Bird.prototype.fly = function () {
    // 改变索引值
    this.index++;
    if (this.index > this.imgArr.length - 1) {
        this.index = 0;
    }
    // 替换小鸟的图片
    this.img = this.imgArr[this.index];
};

// 鸟下降
Bird.prototype.flawDown = function () {
    // 如果鸟的状态为下降
    if (this.state === 'D') {
        this.speed++;
        // 改变鸟在canvas上的y坐标
        this.y += Math.sqrt(this.speed);
        if (this.y > 400) {
            this.y = 400;
        }
    } else { // 鸟的状态为上升
        this.speed--;
        // 如果speed为0 改变鸟的状态为下降
        if (this.speed === 0) {
            this.state = 'D';
            return
        }
        this.y -= Math.sqrt(this.speed);
        if (this.y < 0) {
            this.y = 0;
        }
    }
};

// 鸟上升
Bird.prototype.goUp = function () {
    this.state = 'U'; // Up 上升
    this.speed = 20;
};

