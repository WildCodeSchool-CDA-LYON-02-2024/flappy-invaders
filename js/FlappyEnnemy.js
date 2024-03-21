import { Drawable } from "./Drawable.js";

class FlappyEnnemy extends Drawable {
    constructor(x, y) {
        super(x, y, 'assets/ennemies/flappy/frame-1.png', 'assets/ennemies/flappy/frame-2.png', 'assets/ennemies/flappy/frame-3.png', 'assets/ennemies/flappy/frame-4.png');
        // this.frame = 0;
        // pour les désynchroniser au niveau du battement des ailes : random au niveau de la frame de démarrage
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

    // getImg2() {
    //     if (this.dateFrame + 200 < Date.now()) {
          
    //       if (this.frame < 4) {
    //             ++this.frame;
    //             this.dateFrame = Date.now();
    //         }
    //         else {
    //             this.frame = 0
    //         }
    //     }
    //     switch (this.frame) {
    //         case 1:
    //             return this.images[0];
    //         case 2: 
    //             return this.images[1];
    //         case 3:
    //             return this.images[2];
    //         case 4:
    //             return this.images[3];
    //         default: 
    //             return this.images[0];
    //     }
    // }
}

export { FlappyEnnemy };