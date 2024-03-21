import { Drawable } from "./Drawable.js";

class Laser extends Drawable {
    constructor(x, y) {
        super(x, y, 'assets/fireball/moving/Fireball_Effect_01.png', 'assets/fireball/moving/Fireball_Effect_02.png', 'assets/fireball/moving/Fireball_Effect_03.png', 'assets/fireball/moving/Fireball_Effect_04.png', 'assets/fireball/moving/Fireball_Effect_05.png');

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

export { Laser };