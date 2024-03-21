import { Drawable } from "./Drawable.js"

class Explosion extends Drawable {
    isFinished = false;
    currentFrameIndex = 0;
    
    constructor(x, y) {
        super(x, y, 
            'assets/fireball/exploding/Fireball_Effect_06.png', 
            'assets/fireball/exploding/Fireball_Effect_07.png', 
            'assets/fireball/exploding/Fireball_Effect_08.png', 
            'assets/fireball/exploding/Fireball_Effect_09.png', 
            'assets/fireball/exploding/Fireball_Effect_10.png',
            'assets/fireball/exploding/Fireball_Effect_11.png',
            'assets/fireball/exploding/Fireball_Effect_12.png',
            'assets/fireball/exploding/Fireball_Effect_13.png',
            'assets/fireball/exploding/Fireball_Effect_14.png',
            'assets/fireball/exploding/Fireball_Effect_15.png',
            'assets/fireball/exploding/Fireball_Effect_16.png',
            'assets/fireball/exploding/Fireball_Effect_17.png',
            'assets/fireball/exploding/Fireball_Effect_18.png',
            'assets/fireball/exploding/Fireball_Effect_19.png',
            'assets/fireball/exploding/Fireball_Effect_20.png',
            'assets/fireball/exploding/Fireball_Effect_21.png',
            'assets/fireball/exploding/Fireball_Effect_22.png',
            'assets/fireball/exploding/Fireball_Effect_23.png',
            'assets/fireball/exploding/Fireball_Effect_24.png',
            'assets/fireball/exploding/Fireball_Effect_25.png',
            );

        this.frame = Math.floor(Math.random() * (this.images.length - 1));
        this.refresh = 100;
        this.dateFrame = Date.now() + this.refresh;
    }

    getImg() {
        if (this.dateFrame < Date.now()) {            
            this.dateFrame = Date.now() + this.refresh;
            if (++this.frame > this.images.length - 1) {
                this.frame = 0
            }
        }
        return this.images[this.frame];
    }
}

export { Explosion };