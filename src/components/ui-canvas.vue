<template>
    <div class="c-ui-canvas">
        <div id='w'>
            <canvas id="space" ref="space"></canvas>
        </div>
    </div>
</template>
<style lang="stylus">
    html,body{
        height:100%;
        max-width:100%;
        margin:0;
        overflow:hidden;
        /*background:rgba(0,10,20,1) url('../assets/login2.jpg') no-repeat;*/
        /*background:url('../assets/login2.jpg') no-repeat;*/
        background-size:cover;
        image-rendering: pixelated;
        font-family:sans-serif
    }
    #space{
        width:100%;
        display: block;
        -moz-opacity:0.7; /* For older FF versions */
        -khtml-opacity:0.7;
        opacity:0.7;
     //   filter:alpha(opacity=20);
    }
    #warp{
        position:absolute;
        z-index:9;
        bottom:0;
        left:0;
        right:0;
        margin:20px auto;
        color:rgba(209, 255, 255,1);
        border:2px solid;
        padding:1em;
        width:10em;
        text-align:center;
        font-weight:700;
        font-size:1.2em;
        display:inline-block;
        text-decoration:none;
        background:rgba(0,0,0,0.8)}
    /* follow me @nodws */
    #btn-twtr{
        clear:both;
        color:#fff;
        border:2px solid;
        border-radius:3px;
        text-align:center;
        text-decoration:none;
        display:block;
        font-family:sans-serif;
        font-size:14px;
        width:13em;
        padding:5px 10px;
        font-weight:600;
        position:absolute;
        top:0;
        right:10%;
        margin:90vh 0;
        background:rgba(0,0,0,0.2);
        box-shadow:0 0 0px 3px rgba(0,0,0,0.2);
        opacity:0.3
    }
    #btn-twtr:hover{color:#fff;opacity:1}
</style>
<script>
    export default {
        data() {
            return {
                canvas:"",
                c:"",
                numStars:0,
                radius:"",
                focalLength:"",
                warp:0,
                centerX:"",
                centeY:"",
                i:"",
                stars:[],
                star:"",
                animate:true,
            }
        },
        mounted(){
            window.requestAnimFrame = (function(){   return  window.requestAnimationFrame})();
            this.canvas = this.$refs.space;
            this.c = this.canvas.getContext("2d");
            this.numStars = 1900;
            this.radius = '0.'+Math.floor(Math.random() * 9) + 1  ;
            this.focalLength = this.canvas.width *2;

            this.initializeStars();
            this.executeFrame();
        },
        methods:{
            executeFrame(){
                if(this.animate)
                    requestAnimFrame(this.executeFrame);
                this.moveStars();
                this.drawStars();
            },
            initializeStars(){
                this.centerX = this.canvas.width / 2;
                this.centerY = this.canvas.height / 2;

                this.stars = [];
                for(this.i = 0; this.i < this.numStars; this.i++){
                    this.star = {
                        x: Math.random() * this.canvas.width,
                        y: Math.random() * this.canvas.height,
                        z: Math.random() * this.canvas.width,
                        o: '0.'+Math.floor(Math.random() * 99) + 1
                    };
                    this.stars.push(this.star);
                }
            },
            moveStars(){
                for(this.i = 0; this.i < this.numStars; this.i++){
                    this.star = this.stars[this.i];
                    this.star.z--;

                    if(this.star.z <= 0){
                        this.star.z = this.canvas.width;
                    }
                }
            },
            drawStars(){
                let pixelX, pixelY, pixelRadius;

                // Resize to the screen
                if(this.canvas.width != window.innerWidth || this.canvas.width != window.innerWidth){
                    this.canvas.width = window.innerWidth;
                    this.canvas.height = window.innerHeight;
                    this.initializeStars();
                }
                if(this.warp==0)
                {this.c.fillStyle = "rgba(0,10,20,1)";
                    this.c.fillRect(0,0, this.canvas.width, this.canvas.height);}
                this.c.fillStyle = "rgba(209, 255, 255, "+this.radius+")";
                for(this.i = 0; this.i < this.numStars; this.i++){
                    this.star = this.stars[this.i];

                    pixelX = (this.star.x - this.centerX) * (this.focalLength / this.star.z);
                    pixelX += this.centerX;
                    pixelY = (this.star.y - this.centerY) * (this.focalLength / this.star.z);
                    pixelY += this.centerY;
                    pixelRadius = 1 * (this.focalLength / this.star.z);

                    this.c.fillRect(pixelX, pixelY, pixelRadius, pixelRadius);
                    this.c.fillStyle = "rgba(209, 255, 255, "+this.star.o+")";
                    //c.fill();
                }
            }

        },
        components: {}
    }
</script>