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

  function draw_line_bresenham(point_a: Vector2, point_b: Vector2) {

    point_a.x = Math.round(point_a.x);
    point_a.y = Math.round(point_a.y);
    point_b.x = Math.round(point_b.x);
    point_b.y = Math.round(point_b.y);

    let dx = Math.abs(point_b.x - point_a.x);
    let dy = Math.abs(point_b.y - point_a.y);
    let sx = (point_a.x < point_b.x) ? 1 : -1;
    let sy = (point_a.y < point_b.y) ? 1 : -1;
    let err = dx - dy;

    while (true) {
      p.point(point_a.x, point_a.y);
      if (point_a.x === point_b.x && point_a.y === point_b.y) break;
      let e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        point_a.x += sx;
      }
      if (e2 < dx) {
        err += dx;
        point_a.y += sy;
      }
    }

  }

  function draw_line_dda(point_a: Vector2, point_b: Vector2) {
    p.stroke(0, 150, 255);
    p.strokeWeight(2);

    let dx = point_b.x - point_a.x;
    let dy = point_b.y - point_a.y;
    let steps = Math.max(Math.abs(dx), Math.abs(dy));

    let xInc = dx / steps;
    let yInc = dy / steps;

    let x = point_a.x;
    let y = point_a.y;

    for (let i = 0; i <= steps; i++) {
      p.point(x, y);
      x += xInc;
      y += yInc;
    }
  }

  function get_x_dist(degree: number, hip: number) {
    return Math.cos(degree) * hip
  }

  function get_y_dist(degree: number, hip: number) {
    return Math.sin(degree) * hip
  }

  function drawMidpointCircle(xc, yc, r) {
    let x = 0;
    let y = r;
    let p = 1 - r;

    drawCirclePoints(xc, yc, x, y);

    while (x <= y) {
        x++;

        if (p < 0) {
            p += 2 * x + 1;
        } else {
            y--;
            p += 2 * (x - y) + 1;
        }

        drawCirclePoints(xc, yc, x, y);
    }
}

function drawCirclePoints(xc, yc, x, y) {
    p.point(xc + x, yc + y);
    p.point(xc + y, yc + x);
    p.point(xc - x, yc + y);
    p.point(xc - y, yc + x);
    p.point(xc - x, yc - y);
    p.point(xc - y, yc - x);
    p.point(xc + x, yc - y);
    p.point(xc + y, yc - x);
}


  p.draw = function() {
    this.background(100)
    let radian = (360 / SLICES) * Math.PI / 180
    this.stroke("pink")
    circles.forEach(circle => {
    drawMidpointCircle(circle.x, circle.y, circle.radius)
      for (let i = 0; i < SLICES; i++) {
        for (let i = 0; i < SLICES; i++) {
          if (i % 2 == 0) {
            draw_line_mx_b(
              {
                x: circle.x,
                y: circle.y,
              },
              {
                x: circle.x + get_x_dist(radian, circle.radius),
                y: circle.y + get_y_dist(radian, circle.radius)
              }
            )
          } else if (i % 3 == 0) {
            draw_line_bresenham(
              {
                x: circle.x,
                y: circle.y,
              },
              {
                x: circle.x + get_x_dist(radian, circle.radius),
                y: circle.y + get_y_dist(radian, circle.radius)
              }
            )
          } else {
            draw_line_dda(
              {
                x: circle.x,
                y: circle.y,
              },
              {
                x: circle.x + get_x_dist(radian, circle.radius),
                y: circle.y + get_y_dist(radian, circle.radius)
              }
            )
          }
          radian += (360 / SLICES) * Math.PI / 180
        }
      }
    })
  }


  p.mouseClicked = function() { }
}

new p5(sketch);

