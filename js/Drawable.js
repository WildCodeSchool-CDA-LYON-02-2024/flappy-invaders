class Drawable {
    images = [];
    x = 0;
    y = 0;
    onDestroy = false;

    constructor(x, y, ...sources) {
        this.x = x;
        this.y = y;
        this.index = 0;
        this.images = sources.map(src => {
            const image = new Image();
            image.src = src;
            return image;
        })
    }

    getImg() {
        return this.images[this.index];
    }

    loaded(callback) {
        let count = 0;
        for (let image of this.images) {
            image.onload = () => {
                if (++count === this.images.length) {
                    callback();
                }
            }
        }
    }
}

export { Drawable };