<template>
  <div class="dashboard-container">
      <div class="dashboard-text">欢迎使用个人博客后台</div>
<!--    <div class="dashboard-tips">-->
<!--      <i class="el-icon-warning"></i>-->
<!--      <p>-->
<!--        请注意，本系统为演示系统，所以请不要随意删除或者修改系统数据！！！-->
<!--      </p>-->
<!--    </div>-->
    <p class="dashboard-tips">请注意，本系统为演示系统，所以请不要随意删除或者修改系统数据！！！</p>
    <canvas ref='ref' class="dashboard-canvas"></canvas>
  </div>
</template>

<script>

export default {
  name: 'Dashboard',
  // computed: {
  //   ...mapGetters([
  //     'name'
  //   ])
  // }

    methods:{
      run(canvas) {
            // const canvas = ref.current;
            const ctx = canvas.getContext('2d', {
                willReadFrequently: true,
            });
            function initCanvasSize() {
                /* 代码 `canvas.width = window.innerWidth * devicePixelRatio; canvas.height = window.innerHeight *
                devicePixelRatio;`正在设置canvas元素的宽度和高度以匹配窗口的宽度和高度，乘以设备像素比率。 */
                // 用于解决清晰度问题
                canvas.width = window.innerWidth * devicePixelRatio;
                canvas.height = window.innerHeight * devicePixelRatio;
            }

            initCanvasSize();

            /**
             * getRandom 函数生成给定最小值和最大值之间的随机数。
             * @param min - 您希望随机数的最小值。
             * @param max - 随机数可以是的最大值。
             * @returns 作为参数提供的最小值和最大值之间的随机整数。
             */
            function getRandom(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }

            class Particle {
                constructor() {
                    const r = Math.min(canvas.width, canvas.height) / 2;
                    const cx = canvas.width / 2;
                    const cy = canvas.height / 2;
                    const rad = (getRandom(0, 360) * Math.PI) / 180;
                    this.x = cx + r * Math.cos(rad);
                    this.y = cy + r * Math.sin(rad);
                    this.size = getRandom(2 * devicePixelRatio, 7 * devicePixelRatio);
                }

                draw() {
                    ctx.beginPath();
                    ctx.fillStyle = '#33415480';
                    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
                    ctx.fill();
                }
                moveTo(tx, ty) {
                    // 控制每次 x, y 改变一点
                    const duration = 500; // 500 ms 的运动时间
                    const sx = this.x,
                        sy = this.y;
                    const xSpeed = (tx - sx) / duration;
                    const ySpeed = (ty - sy) / duration;
                    const startTime = Date.now();
                    const move = () => {
                        const t = Date.now() - startTime;
                        const x = sx + t * xSpeed;
                        const y = sy + t * ySpeed;
                        this.x = x;
                        this.y = y;
                        if (t >= duration) {
                            this.x = tx;
                            this.y = ty;
                            return;
                        }
                        requestAnimationFrame(move);
                        // requestIdleCallback(move)
                    };
                    move();
                }
            }

            const circles = [];
            let text = null;

            const getPoints = () => {
                const points = [];
                const gap = 6;
                const { height, width, data } = ctx.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height,
                );
                for (let i = 0; i < width; i += gap) {
                    for (let j = 0; j < height; j += gap) {
                        const index = (i + j * width) * 4;
                        const r = data[index];
                        const g = data[index + 1];
                        const b = data[index + 2];
                        const a = data[index + 3];
                        if (r === 0 && g === 0 && b === 0 && a === 255) {
                            points.push([i, j]);
                        }
                    }
                }
                return points;
            };

            function getText() {
                return new Date().toTimeString().substring(0, 8);
            }

            const clearText = () => ctx.clearRect(0, 0, canvas.width, canvas.height);

            function drawText() {
                const newText = getText();
                if (newText === text) {
                    return;
                }
                clearText();
                text = newText;
                const { width, height } = canvas;
                ctx.fillStyle = '#000';
                ctx.textBaseline = 'middle';
                ctx.font = `${200 * devicePixelRatio}px 'DS-Digital', sans-serif`;
                ctx.fillText(text, (width - ctx.measureText(text).width) / 2, height / 2);
                const points = getPoints();
                clearText();
                for (let i = 0; i < points.length; i++) {
                    let p = circles[i];
                    if (!p) {
                        p = new Particle();
                        circles.push(p);
                    }
                    const [x, y] = points[i];
                    p.moveTo(x, y);
                }
                if (points.length < circles.length) {
                    circles.splice(points.length);
                }
            }

            function createCircle() {
                clearText();
                drawText();
                circles.forEach((item) => item.draw());
                requestAnimationFrame(createCircle);
            }

            createCircle();
        }
    },
    mounted() {
        this.run(this.$refs.ref);
    }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
    width: 100%;
    height: 100%;
    position: relative;
    box-sizing: border-box;
  }
  &-text {
    font-size: 30px;
    line-height: 40px;
  }
  &-canvas{
    background: radial-gradient(#c1cbd880, #33415480);
    display: block;
    border-radius: 10px;
    margin: 30px auto 0px auto;
    display: block;
    width: 80%;
    height: 80%;
  }
  &-tips{
    color: red;
    font-size: 30px;
  }
  //&-tips{
  //  margin: 0;
  //  padding: 0;
  //  position: absolute;
  //  right: -970px;
  //  top: 0;
  //  display: flex;
  //  justify-content: center;
  //  align-items: center;
  //  border: 1px solid #ccc;
  //  width: 92%;
  //  font-size: 30px;
  //  color: red;
  //  box-sizing: border-box;
  //  transition: 0.5s ease-in;
  //  &>i{
  //    font-size: 60px;
  //    padding: 0px 30px;
  //  }
  //}
  //&-tips:hover{
  //  right: 30px;
  //}
}
</style>
