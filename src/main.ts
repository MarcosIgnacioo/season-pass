import './style.css'
import p5 from 'p5'

const WIDTH = 800
const HEIGHT = 800
const slices_input = document.getElementById("slices") as HTMLInputElement
let SLICES = 3

slices_input?.addEventListener("input", () => {
  SLICES = parseInt(slices_input.value)
  console.log(SLICES);
})

interface Circle {
  x: number,
  y: number,
  radius: number,
}

const RADIUS = 50
const circles: Circle[] = [
  { x: WIDTH / 3, y: HEIGHT / 2, radius: RADIUS },
  { x: WIDTH / 3 + RADIUS * 2 + 20, y: HEIGHT / 2, radius: RADIUS },
  { x: WIDTH / 3 + RADIUS * 4 + 40, y: HEIGHT / 2, radius: RADIUS }
]


//const total_tiles = 8
//const tile_width = WIDTH / total_tiles

const sketch = (p: p5): any => {

  interface Vector2 {
    x: number;
    y: number;
  }

  interface Line {
    m: number;
    b: number;
  }

  p.setup = function() {
    p.createCanvas(WIDTH, HEIGHT);
  }

  function calculate_line(point_a: Vector2, point_b: Vector2): Line {
    // y = mx + b
    // y - mx  = b
    let dx = point_b.x - point_a.x;
    let dy = point_b.y - point_a.y;
    if (dx === 0) {
      dx = 1
    }
    const slope = (dy) / (dx)
    const ordered_to_origin = (point_a.y - slope * point_a.x);
    const line: Line = { m: slope, b: ordered_to_origin }
    return line;
  }

  function calculte_y(x: number, line: Line) {
    return line.m * x + line.b
  }


  function get_random_rgb(): number[] {
    return [Math.random() * 255, Math.random() * 255, Math.random() * 255]
  }

  // (2,4)
  // (4,8)
  // y1 = m*x1 + b;
  // y1 - m*x1 =  b;
  // y = mx + b 
  // y2 = m*x2 + y1 - m*x1
  // y2 = m*(x2 -x1) + y1
  // y2 - y1 = m*(x2 -x1)
  // (y2 - y1) / (x2 -x1) = m
  function draw_line_mx_b(point_a: Vector2, point_b: Vector2) {
    const line = calculate_line(point_a, point_b);
    if (point_a.x > point_b.x) {
      const tmp = point_a;
      point_a = point_b;
      point_b = tmp;
    }

    let y = 0
    if (point_a.x === point_b.x) {
      if (point_a.y > point_b.y) {
        const tmp = point_a;
        point_a = point_b;
        point_b = tmp;
      }
      const x = point_a.x;
      for (let y = point_a.y; y < point_b.y; y++) {
        p.stroke(get_random_rgb())
        p.strokeWeight(10)
        p.point(x, y)
      }
    } else {
      for (let x = point_a.x; x < point_b.x; x++) {
        y = calculte_y(x, line);
        p.stroke('black')
        p.strokeWeight(2)
        p.point(x, y)
      }
    }
  }

  function get_x_dist(degree: number, hip: number) {
    return Math.cos(degree) * hip
  }

  function get_y_dist(degree: number, hip: number) {
    return Math.sin(degree) * hip
  }

  p.draw = function() {
    let radian = (360 / SLICES) * Math.PI / 180
    this.stroke("pink")
    circles.forEach(circle => {
      this.circle(circle.x, circle.y, circle.radius * 2)
      for (let i = 0; i < SLICES; i++) {
        for (let i = 0; i < SLICES; i++) {
          this.line(
            circle.x,
            circle.y,
            circle.x + get_x_dist(radian, circle.radius),
            circle.y + get_y_dist(radian, circle.radius)
          )
          radian += (360 / SLICES) * Math.PI / 180
        }
      }
    })
  }


  p.mouseClicked = function() { }
}

new p5(sketch);
