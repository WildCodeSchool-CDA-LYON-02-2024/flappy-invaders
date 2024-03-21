import { Drawable } from "./Drawable.js";
import { Explosion } from "./Explosion.js";
import { FlappyEnnemy } from "./FlappyEnnemy.js";
import { Laser } from "./Laser.js";
import { collision } from "./utils.js";

class GameEngine {
    player = null;
    canvas = null;
    context = null;
    items = [];
    lasers = [];
    explosions = [];
    life = 5;
    passThrough = 0;
    isGameOVer = false;
    isPause = false;

    keys = {
        up: false,
        down: false,
        left: false,
        right: false,
        space: false
    };

    speed = 5;

    constructor() {
        this.canvas = document.getElementById('game');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = 840;
        this.canvas.height = 650;        
    }

    run() {
        console.log('RUN')
        this.init();

        let count = 0;
        for (let item of this.items) {
            item.loaded(() => {
                if (++count === this.items.length) {
                    this.gameLoop();
                }
            })
        }
    }

    init() {
        console.log('INIT')
        // la vie n'est visible ni sur l'écran d'accueil, si sur les écrans de victoire ou de défaite, il faut donc la rendre visible à l'initialisation 
        document.getElementById('life').classList.add('show');

        this.life = 5;
        this.items = [];

        this.player = new Drawable(665, 262.5, 'assets/spaceship/ship-rotated.png');
        this.initKeyboardEvent();

        const xMin = -800;
        const xMax = 0;
        const yMin = 0;
        const yMax = this.canvas.height - 80;

        const randomEnnemyPosition = (min, max) => {
            return Math.floor(Math.random() * (max - min) + min)
        }

        const maxAttempts = 100; // Nombre maximal de tentatives pour trouver une position sans collision
        let attempts = 0; // Nombre de tentatives effectuées

        while (this.items.length < 10 && attempts < maxAttempts) {
            let newX = randomEnnemyPosition(xMin, xMax);
            let newY = randomEnnemyPosition(yMin, yMax);

            // Vérifie s'il y a une collision avec les ennemis existants
            let hasCreationCollision = false;
            
            for (let existingEnnemy of this.items) {
                let potentialEnnemy = {x: newX, y: newY, getImg :() => ({width: 100, height: 80})};

                if (collision(potentialEnnemy, existingEnnemy)) {
                    hasCreationCollision = true;
                    break;
                }
            }

            // en Js, continue permet d'arrêter l'exécution des instructions d'une boucle, et on va passer à l'itération suivante
            if (hasCreationCollision) {
                attempts++; // Incrémente le nombre de tentatives
                continue;
            }

            const newEnnemy = new FlappyEnnemy(newX, newY);
            this.items.push(newEnnemy);
            attempts = 0; // Réinitialise le nombre de tentatives après chaque ajout réussi
        }
    }

    createLaserSound() {
        const laserSound = new Audio('assets/sounds/laser.wav')
        return laserSound.play();
    }

    createBlastSound() {
        const blastSound = new Audio('assets/sounds/blast.wav')
        return blastSound.play();
    }

    createVasselSound() {
        const vasselSound = new Audio('assets/sounds/explosion.wav')
        return vasselSound.play();
    }

    draw() {        
        // on réinitialise le contenu du canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // on itère sur le tableau d'items (contenant les ennemis), afin de les dessiner dans le canvas
        for (let item of this.items) {
            this.context.drawImage(item.getImg(), item.x, item.y, 100, 80);
            item.getImg().width = 100;
            item.getImg().height = 80;
        }

        // on dessine notre player : l'image étant trop grande pour le canvas, on doit redimensionner l'élément mis dans le canvas, mais il faut aussi redimensionner l'image directement, sinon le getImg().width donnera la largeur originale de l'image (alors qu'on voit bien le canvas avec la bonne taille)
        this.context.drawImage(this.player.getImg(), this.player.x, this.player.y, 175, 125);
        this.player.getImg().width = 175;
        this.player.getImg().height = 125;

        document.getElementsByClassName('life-content')[0].innerHTML = `Life : ${this.life}`;

        // on dessine les lasers par itération
        for (let laser of this.lasers) {
            this.context.drawImage(laser.getImg(), laser.x, laser.y);
        }

        for (let explosion of this.explosions) {
            this.context.drawImage(explosion.getImg(), explosion.x, explosion.y);
        }
    }

    gameLoop() {
        if (!this.isPause) {
            this.draw();
            this.update();
        }

        window.requestAnimationFrame(() => {
            this.gameLoop();
        })
    }

    initKeyboardEvent() {
        window.addEventListener('keydown', (event) => {
            switch (event.key) {
                case 'ArrowUp': 
                    this.keys.up = true;
                    break;
                case 'ArrowDown': 
                    this.keys.down = true;
                    break;
                case 'ArrowLeft': 
                    this.keys.left = true;
                    break;
                case 'ArrowRight': 
                    this.keys.right = true;
                    break;
            }
        });

        window.addEventListener('keyup', (event) => {
            switch (event.key) {
                case 'ArrowUp': 
                    this.keys.up = false;
                    break;
                case 'ArrowDown': 
                    this.keys.down = false;
                    break;
                case 'ArrowLeft': 
                    this.keys.left = false;
                    break;
                case 'ArrowRight': 
                    this.keys.right = false;
                    break;
                case 'p':
                    this.isPause = !this.isPause;
                    if (this.isPause) {
                        this.pauseScreen()
                    } else {
                        document.getElementById('pause').classList.remove('show');
                    }
                    break;
                case ' ': 
                    if (!this.isPause) {
                        const laser = new Laser(null, null);
                        laser.x = (this.player.  x - laser.getImg().width) + 20;
                        laser.y = this.player.y;
                        this.lasers.push(laser);
                        this.createLaserSound();
                    }
                    break;
            }
        });
    }

    update() {
        // load ennemies at the beginning of the game
        this.moveEnnemies();

        if (this.keys.down) {
            this.player.y += this.speed;
        }
        if (this.keys.up) {
            this.player.y -= this.speed;
        }
        if (this.keys.right) {
            this.player.x += this.speed;
        }
        if (this.keys.left) {
            this.player.x -= this.speed;
        }

        this.collisionBorder();
        this.collisionShipEnnemy();
        this.collisionLaser();

        // ici, on filtre les lasers qui sortent de l'écran pour les retirer du tableau
        // puis on itère sur les lasers toujours présents pour les faire avancer vers l'ennemi (donc on décrémente le x)
        this.lasers = this.lasers.filter(laser => laser.y < this.canvas.width && !laser.onDestroy);
        this.lasers.forEach(laser => laser.x -= 10);
        this.items = this.items.filter(item => !item.onDestroy);
    
        // je n'appelle ma fonction de victoire qu'à la fin de l'update : comme l'update est appelé constamment (plusieurs dizaines de fois par secondes), on pourra savoir si l'on est toujours en vie ou non à la fin de chaque action effectuée
        !this.isGameOVer ? this.win() : null;

        for (let explosion of this.explosions) {
            if (!explosion.isFinished) {
                explosion.currentFrameIndex++;

                if(explosion.currentFrameIndex >= explosion.images.length) {
                    explosion.isFinished = true;
                }
            }
        }

        this.explosions = this.explosions.filter(explosion => {
            return !explosion.isFinished;
        })
    }

    /* moveEnnemies() :
        fonction qui permet de faire avancer les ennemis sur l'écran
        permet également de filtrer les ennemis qui sont toujours sur l'écran et qui touchent l'écran :
        si un ennemi touche le bord de droite de l'écran, alors on perd un point de vie et l'ennemi est retiré de la liste des items
    */
    moveEnnemies() {
        this.items.forEach((item) => {
            item.x += 1;
        });

        // lorsqu'un ennemi touche le bord droit de l'écran : on l'a laissé passé donc on perd une vie
        this.items = this.items.filter(passedEnnemy => {
            if (passedEnnemy.x >= this.canvas.width) {
                this.life -= 1;
            }
            return passedEnnemy.x < this.canvas.width
        });
    }

    collisionBorder() {
        if (this.player.x < 0) {
            this.player.x = 0;
        }
        if (this.player.y < 0) {
            this.player.y = 0;
        }
        if (this.player.x + this.player.getImg().width > this.canvas.width) {
            this.player.x = this.canvas.width - this.player.getImg().width;
        }
        if (this.player.y + this.player.getImg().height > this.canvas.height) {
            this.player.y = this.canvas.height - this.player.getImg().height;
        }
    }

    /**
     * collisionShipEnnemy():
     * fonction qui permet de vérifier s'il y a ou non collision entre l'ennemi et le vaisseau
     * si collision, l'ennemi est retiré du tableau grâce à un splice et on perd un point de vie
     * @returns boolean
     */
    collisionShipEnnemy() {
        this.items.filter(laser => !laser.onDestroy);
        for (let item of this.items) {
            if (collision(this.player, item) && this.life > 0) {
                this.life -= 1;
                const destroyedItemIndex = this.items.indexOf(item);
                this.items.splice(destroyedItemIndex, 1);
                this.createVasselSound(); 
                this.createEnnemyExplosion(item);
                return true;
            }
        } 
        return false;
    }

    collisionLaser() {
        for (let laser of this.lasers) {
            for (let item of this.items) {
                if (collision(laser, item)) {
                    laser.onDestroy = true;
                    item.onDestroy = true;
                    this.createBlastSound(); 
                    this.createEnnemyExplosion(item);
                }
            }
        }
    }

    createEnnemyExplosion(item) {
        const explosion = new Explosion(null, null);
        explosion.x = item.x;
        explosion.y = item.y;
        this.explosions.push(explosion);
    }

    pauseScreen() {
        const pause = document.getElementById('pause');
        pause.classList.add('show');
        pause.innerHTML = `<h1>PAUSE</h1>
            <h2>Press p again to continue</h2>`;
    }

    win() {
        if (this.life > 0 && this.items.length === 0 ) {
            this.isGameOVer = true;
            document.getElementById('life').classList.remove('show');
            const gameOver = document.getElementById('menu');
            gameOver.classList.add('show', 'victory');
            gameOver.getElementsByTagName('h1')[0].innerText = 'You Won !!';
            gameOver.getElementsByTagName('h2')[0].innerText = 'Congratulations, you saved the world';
        } else if (this.life === 0) {
            this.isGameOVer = true;
            document.getElementById('life').classList.remove('show');
            const gameOver = document.getElementById('menu');
            gameOver.classList.add('show', 'failure');
            gameOver.getElementsByTagName('h1')[0].innerText = 'Loser ...';
            gameOver.getElementsByTagName('h2')[0].innerText = 'We are all dead because of you';
        }
    }
}

export { GameEngine };