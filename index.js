const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight

class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0
    }

    this.rotation = 0

    const image = new Image()
    image.src = './images/spaceship.png'
    image.onload = () => {
      const scale = 0.15
      this.image = image
      this.width = image.width * scale
      this.height = image.height * scale
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20
      }
    }
  }

  draw() {
    // context.fillStyle = 'red'
    // context.fillRect(this.position.x, this. position.y, this.width, this.height)

    // making a screen snapshot for rotation
    context.save()
    context.translate(
      player1.position.x + player1.width / 2, player1.position.y + player1.height / 2
    )

    context.rotate(this.rotation)

    // restoring the screen
    context.translate(
      -player1.position.x - player1.width / 2, -player1.position.y - player1.height / 2
    )

    context.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )

    context.restore()
  }

  update() {
    if (this.image) {
      this.draw()
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
    }
  }
}

class Projectile {
  constructor({ position, velocity }) {
    this.position = position
    this.velocity = velocity
    this.radius = 3
  }

  draw() {
    context.beginPath()
    context.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2
    )

    context.fillStyle = 'red'
    context.fill()
    context.closePath()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}

class Invader {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0
    }

    const image = new Image()
    image.src = './images/invader.png'
    image.onload = () => {
      const scale = 1
      this.image = image
      this.width = image.width * scale
      this.height = image.height * scale
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height / 2
      }
    }
  }

  draw() {
    // context.fillStyle = 'red'
    // context.fillRect(this.position.x, this. position.y, this.width, this.height)

    context.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )
  }

  update() {
    if (this.image) {
      this.draw()
      // adding horizontal movement
      this.position.x += this.velocity.x
      // adding vertical movement
      this.position.y += this.velocity.y
    }
  }
}

const player1 = new Player()

const projectiles = [
  ]

const invader = new Invader()

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  w: {
    pressed: false
  },
  s: {
    pressed: false
  },
  q: {
    pressed: false
  }
}

function animate() {
  requestAnimationFrame(animate)
  context.fillStyle = 'black'
  context.fillRect(0, 0, canvas.width, canvas.height)
  invader.update()
  player1.update()
  projectiles.forEach((projectile, i) => {
    // deleting projectiles that are out of the screen from the game
    if (projectile.position.y + projectile.radius <= 0) {
      // preventing bug with projectiles flashing
    setTimeout(() => {
      projectiles.splice(i, 1)
    }, 0)
    } else {
      projectile.update()
    }
  })

  // movement: limited to fit the canvas, keyup & keydown and mini rotation of the image
  if (keys.a.pressed && player1.position.x >= 0) {
    player1.velocity.x = -5
    player1.rotation = -0.15
  } else if (keys.d.pressed && player1.position.x +player1.width <= canvas.width) {
    player1.velocity.x = 5
    player1.rotation = 0.15
  } else {
    player1.velocity.x = 0
    player1.rotation = 0
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
}

animate()

addEventListener('keydown', ({key}) => {
  switch (key) {
    case 'a':
      console.log('left')
      // player1.velocity.x = -5
      keys.a.pressed = true
      break
    case 'd':
      // console.log('right')
      // player1.velocity.x = 5
      keys.d.pressed = true
      break
    case 'w':
      // console.log('up')
      player1.velocity.y = -5
      keys.w.pressed = true
      break
    case 's':
      // console.log('down')
      player1.velocity.y = 5
      keys.s.pressed = true
      break
    case 'q':
      // console.log('shot')
      projectiles.push(new Projectile({
        position: {
          x: player1.position.x + player1.width / 2,
          y: player1.position.y
        },

        velocity: {
          x: 0,
          y: -10
        }
      }))
      keys.q.pressed = true
      break
  }
})

addEventListener('keyup', ({key}) => {
  switch (key) {
    case 'a':
      console.log('left')
      player1.velocity.x = -5
      keys.a.pressed = false
      break
    case 'd':
      console.log('right')
      player1.velocity.x = 5
      keys.d.pressed = false
      break
    case 'w':
      console.log('up')
      player1.velocity.y = -5
      keys.w.pressed = false
      break
    case 's':
      console.log('down')
      player1.velocity.y = 5
      keys.s.pressed = false
      break
    case 'q':
      console.log('shot')
      keys.q.pressed = false
      break
  }
})
