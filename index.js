const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.rotation = 0;

    const image = new Image();
    image.src = "./images/spaceship.png";
    image.onload = () => {
      const scale = 0.15;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20,
      };
    };
  }

  draw() {
    // ctx.fillStyle = 'red'
    // ctx.fillRect(this.position.x, this. position.y, this.width, this.height)

    // making a screen snapshoot for rotation
    ctx.save();
    ctx.translate(
      player1.position.x + player1.width / 2,
      player1.position.y + player1.height / 2
    );

    ctx.rotate(this.rotation);

    // restoring the screen
    ctx.translate(
      -player1.position.x - player1.width / 2,
      -player1.position.y - player1.height / 2
    );

    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );

    ctx.restore();
  }

  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }
}

class Projectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    // size of a projectile
    this.radius = 4;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);

    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Particle {
  constructor({ position, velocity, radius, color, fades }) {
    this.position = position;
    this.velocity = velocity;
    // size of a particle
    this.radius = radius;
    this.color = color;
    this.opacity = 1;
    this.fades = fades;
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
    ctx.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.fades) this.opacity -= 0.01;
  }
}

class InvaderProjectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    // size of a projectile
    this.width = 3;
    this.height = 10;
  }

  draw() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}

class Invader {
  constructor({ position }) {
    this.velocity = {
      x: 0,
      y: 0,
    };

    const image = new Image();
    image.src = "./images/invader.png";
    image.onload = () => {
      const scale = 1;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: position.x,
        y: position.y,
      };
    };
  }

  draw() {
    // ctx.fillStyle = 'red'
    // ctx.fillRect(this.position.x, this. position.y, this.width, this.height)

    ctx.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update({ velocity }) {
    if (this.image) {
      this.draw();
      // adding horizontal movement
      this.position.x += velocity.x;
      // adding vertical movement
      this.position.y += velocity.y;
    }
  }

  shoot(invaderProjectiles) {
    invaderProjectiles.push(
      new InvaderProjectile({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height,
        },

        velocity: {
          x: 0,
          y: 5,
        },
      })
    );
  }
}

class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };

    this.velocity = {
      x: 3,
      y: 0,
    };

    // creating a grid array of invaders
    this.invaders = [];

    const columns = Math.floor(Math.random() * 10 + 5);
    const rows = Math.floor(Math.random() * 5 + 2);

    this.width = columns * 30;

    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        this.invaders.push(
          new Invader({
            position: {
              x: x * 30,
              y: y * 30,
            },
          })
        );
      }
    }
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.position.y;

    this.velocity.y = 0;

    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x;
      this.velocity.y = 30;
    }
  }
}

const player1 = new Player();

const projectiles = [];

const grids = [];

const invaderProjectiles = [];

const particles = [];

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  q: {
    pressed: false,
  },
};

let frames = 0;

// creating invaders at random intervals
let randomInterval = Math.floor(Math.random() * 500) + 500;

// creating movable stars
for (let i = 0; i < 100; i++) {
  particles.push(
    new Particle({
      position: {
        // positioning stars
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      },
      velocity: {
        // moving downwards the y-axis
        x: 0,
        y: 0.3,
      },
      radius: Math.random() * 2,
      // or operator for the customized players colors
      color: "white",
    })
  );
}

// creating multiple particles
function createParticles({ object, color, fades }) {
  for (let i = 0; i < 15; i++) {
    particles.push(
      new Particle({
        position: {
          x: object.position.x + object.width / 2,
          y: object.position.y + object.height / 2,
        },
        velocity: {
          // with - 0.5 adding directions
          x: (Math.random() - 0.5) * 3,
          y: (Math.random() - 0.5) * 3,
        },
        radius: Math.random() * 3,
        // or operator for the customized players colors
        color: color || "#BAA0DE",
        fades: true
      })
    );
  }
}

function animate() {
  requestAnimationFrame(animate);
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  player1.update();
  particles.forEach((particle, i) => {

    // respawning stars in random places after old ones have left the screen
    if (particle.position.y - particle.radius >= canvas.height) {
      particle.position.x = Math.random() * canvas.width;
      particle.position.y = -particle.radius;
    }

    // countering globalAlpha and removing the particles
    if (particle.opacity <= 0) {
      setTimeout(() => {
        particles.splice(i, 1);
      }, 0);
    } else {
      particle.update();
    }
  });

  // invaders projectiles
  invaderProjectiles.forEach((invaderProjectile, i) => {
    // removing projectiles that went off screen
    if (
      invaderProjectile.position.y + invaderProjectile.height >=
      canvas.height
    ) {
      setTimeout(() => {
        invaderProjectiles.splice(i, 1);
      }, 0);
    } else invaderProjectile.update();

    // projectile collides with player1 -> && player2
    if (
      invaderProjectile.position.y + invaderProjectile.height >=
        player1.position.y &&
      invaderProjectile.position.x + invaderProjectile.width >=
        player1.position.x &&
      invaderProjectile.position.x <= player1.position.x + player1.width
    ) {
      // removing projectile after collision
      setTimeout(() => {
        invaderProjectiles.splice(i, 1);
      }, 0);
      console.log("you lose");
      createParticles({
        object: player1,
        color: "white",
        fades: true
      });
    }
  });

  // player1 projectiles
  projectiles.forEach((projectile, i) => {
    // deleting projectiles that are out of the screen from the game
    if (projectile.position.y + projectile.radius <= 0) {
      // preventing bug with projectiles flashing
      setTimeout(() => {
        projectiles.splice(i, 1);
      }, 0);
    } else {
      projectile.update();
    }
  });

  grids.forEach((grid, gridIndex) => {
    grid.update();
    // spawning projectiles
    if (frames % 100 === 0 && grid.invaders.length > 0) {
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
        invaderProjectiles
      );
    }
    // added index i
    grid.invaders.forEach((invader, i) => {
      invader.update({ velocity: grid.velocity });

      // projectiles hit invaders, added index p
      projectiles.forEach((projectile, p) => {
        // checking for collision and removing the invader
        if (
          projectile.position.y - projectile.radius <=
            invader.position.y + invader.height &&
          projectile.position.x + projectile.radius >= invader.position.x &&
          projectile.position.x - projectile.radius <=
            invader.position.x + invader.width &&
          projectile.position.y + projectile.radius >= invader.position.y
        ) {
          // splicing out the invader & the projectile (hit)
          setTimeout(() => {
            // testing if the correct invader was found by a projectile
            const invaderFound = grid.invaders.find(
              (invaderF) => invaderF === invader
            );

            const projectileFound = projectiles.find(
              (projectileF) => projectileF === projectile
            );

            // remove invader and projectile
            if (invaderFound && projectileFound) {
              createParticles({
                object: invader,
                fades: true
              });

              grid.invaders.splice(i, 1);
              projectiles.splice(p, 1);

              if (grid.invaders.length > 0) {
                const firstInvader = grid.invaders[0];
                const lastInvader = grid.invaders[grid.invaders.length - 1];

                grid.width =
                  lastInvader.position.x -
                  firstInvader.position.x +
                  lastInvader.width;

                grid.position.x = firstInvader.position.x;
              } else {
                grids.splice(gridIndex, 1);
              }
            }
          }, 0);
        }
      });
    });
  });

  // movement: limited to fit the canvas, keyup & keydown and mini rotation of the image
  if (keys.a.pressed && player1.position.x >= 0) {
    player1.velocity.x = -5;
    player1.rotation = -0.15;
  } else if (
    keys.d.pressed &&
    player1.position.x + player1.width <= canvas.width
  ) {
    player1.velocity.x = 5;
    player1.rotation = 0.15;
  } else {
    player1.velocity.x = 0;
    player1.rotation = 0;
  }

  // if (keys.d.pressed) {
  //   player1.velocity.x = 5
  // } else {
  //   player1.velocity.x = 0
  // }

  // if (keys.w.pressed) {
  //   player1.velocity.y = -5
  // } else {
  //   player1.velocity.y = 0
  // }

  // if (keys.s.pressed) {
  //   player1.velocity.x = 5
  // } else {
  //   player1.velocity.x = 0
  // }

  // spawning invaders
  if (frames % randomInterval === 0) {
    grids.push(new Grid());
    randomInterval = Math.floor(Math.random() * 500) + 500;
    frames = 0;
  }

  frames++;
}

animate();

addEventListener("keydown", ({ key }) => {
  switch (key) {
    case "a":
      console.log("left");
      // player1.velocity.x = -5
      keys.a.pressed = true;
      break;
    case "d":
      // console.log('right')
      // player1.velocity.x = 5
      keys.d.pressed = true;
      break;
    case "w":
      // console.log('up')
      player1.velocity.y = -5;
      keys.w.pressed = true;
      break;
    case "s":
      // console.log('down')
      player1.velocity.y = 5;
      keys.s.pressed = true;
      break;
    case "q":
      // console.log('shoot')
      projectiles.push(
        new Projectile({
          position: {
            x: player1.position.x + player1.width / 2,
            y: player1.position.y,
          },

          velocity: {
            x: 0,
            y: -10,
          },
        })
      );
      keys.q.pressed = true;
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "a":
      console.log("left");
      player1.velocity.x = -5;
      keys.a.pressed = false;
      break;
    case "d":
      console.log("right");
      player1.velocity.x = 5;
      keys.d.pressed = false;
      break;
    case "w":
      console.log("up");
      player1.velocity.y = -5;
      keys.w.pressed = false;
      break;
    case "s":
      console.log("down");
      player1.velocity.y = 5;
      keys.s.pressed = false;
      break;
    case "q":
      console.log("shoot");
      keys.q.pressed = false;
      break;
  }
});
