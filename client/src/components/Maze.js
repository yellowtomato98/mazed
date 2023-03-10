import React, { useState, useEffect } from "react";
import { cold } from "react-hot-loader";

const Maze = () => {
  const [render, setRender] = useState(true);
  const [maze, setMaze] = useState(<div>No maze yet!</div>);

  const n = 25;

  // using randomized kruskal's
  const generateMaze = (dim) => {
    const n = Math.floor((dim + 1) / 2);
    const sz = Array(n * n);
    for (let i = 0; i < n * n; i++) {
      sz[i] = -1;
    }

    const get = (a) => {
      return sz[a] < 0 ? a : (sz[a] = get(sz[a]));
    };

    const unite = (a, b) => {
      a = get(a);
      b = get(b);
      if (a === b) return false;
      if (sz[a] < sz[b]) {
        [a, b] = [b, a];
      }
      sz[b] += sz[a];
      sz[a] = b;
      return true;
    };

    // fisher-yates
    const shuffle = (a) => {
      for (let i = a.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
    };

    const edges = [];
    for (var i = 0; i < n * n; i++) {
      var col = i % n;
      var row = Math.floor((i - col) / n);
      if (row != n - 1) {
        edges.push([
          [row, col],
          [row + 1, col],
        ]);
      }
      if (col != n - 1) {
        edges.push([
          [row, col],
          [row, col + 1],
        ]);
      }
    }
    // console.log(edges);
    shuffle(edges);
    let connectors = [];
    while (connectors.length < n * n - 1) {
      let edge = edges.pop();
      let x = unite(edge[0][0] * n + edge[0][1], edge[1][0] * n + edge[1][1]);
      if (x) {
        let new_connector;
        new_connector = [edge[0][0] + edge[1][0], edge[0][1] + edge[1][1]];
        connectors.push(new_connector);
      }
    }

    // return all traversible squares
    const traversible = Array(dim);
    for (let i = 0; i < dim; i++) {
      traversible[i] = Array(dim);
      for (let j = 0; j < dim; j++) {
        traversible[i][j] = 0;
      }
    }

    for (let row = 0; row < dim; row++) {
      for (let col = 0; col < dim; col++) {
        if (row % 2 === 0 && col % 2 === 0) {
          traversible[row][col] = 1;
          continue;
        }
        for (let k = 0; k < connectors.length; k++) {
          if (connectors[k][0] === row && connectors[k][1] === col) {
            traversible[row][col] = 1;
          }
        }
      }
    }
    return traversible;
  };

  // get neighbors helper function for generateBarriers
  const get_neighbors = (r, c, dim, traversible) => {
    let neighbors = [];
    let dx = [-1, 0, 1, 0];
    let dy = [0, 1, 0, -1];
    for (let i = 0; i < 4; i++) {
      let [dr, dc] = [dx[i], dy[i]];
      if (
        r + dr < dim &&
        r + dr >= 0 &&
        c + dc < dim &&
        c + dc >= 0 &&
        traversible[r + dr][c + dc]
      ) {
        neighbors.push([r + dr, c + dc]);
      }
    }
    return neighbors;
  };

  // generate barriers by traversing the maze (bfs)
  const generateBarriers = (dim, traversible) => {
    let d = 1;
    let sp = 1;
    let last_d = 1;
    let start = [0, 0];

    let maze = Array(dim);
    let seen = Array(dim);
    for (let i = 0; i < dim; i++) {
      seen[i] = Array(dim);
      maze[i] = Array(dim);
      for (let j = 0; j < dim; j++) {
        seen[i][j] = 0;
        maze[i][j] = traversible[i][j];
      }
    }

    let queue = [start];
    while (queue.length !== 0) {
      for (let i = 0; i < queue.length; i++) {
        let [r, c] = queue[0];
        seen[r][c] = 1;
        queue.shift();

        if (r === dim - 1 && c === dim - 1) {
          sp = d;
        }

        let cnt = 0;
        for (let n of get_neighbors(r, c, dim, traversible)) {
          if (!seen[n[0]][n[1]]) {
            cnt++;
            queue.push(n);
          }
        }
        if (cnt > 1 && d - last_d > 3) {
          maze[r][c] = 2;
          last_d = d;
        }
      }
      d++;
    }

    return maze;
  };

  const generateBorders = (dim, maze) => {
    let full_maze = Array(dim + 5);
    for (let i = 0; i < dim + 5; i++) {
      full_maze[i] = Array(dim + 5);
      if (i < 3) {
        for (let j = 0; j < dim + 5; j++) {
          if (j < 3) full_maze[i][j] = 1;
          else full_maze[i][j] = 0;
        }
      } else if (i >= 3 && i < dim + 3) {
        for (let j = 0; j < dim + 5; j++) {
          if (j < 3 || j >= dim + 3) full_maze[i][j] = 0;
          else full_maze[i][j] = maze[i - 3][j - 3];
        }
      } else {
        for (let j = 0; j < dim + 5; j++) full_maze[i][j] = 0;
      }
    }
    full_maze[3][2] = 1;
    full_maze[2][3] = 1;
    return full_maze;
  };

  const renderMaze = () => {
    console.log("n", n);
    // let connectors = generateMaze(n);
    let traversible = generateMaze(n);
    let maze = generateBarriers(n, traversible);
    let full_maze = generateBorders(n, maze);
    let maze_container = [];
    for (let i = 0; i < 3 * (n + 5); i++) {
      for (let j = 0; j < 3 * (n + 5); j++) {
        let row = Math.floor(i / 3);
        let col = Math.floor(j / 3);
        let maze_cell;
        if (full_maze[row][col] === 0) {
          maze_cell = (
            <div className="maze-cell black" key={row * n + col}>
              {row * n + col + 1}
            </div>
          );
        } else if (full_maze[row][col] === 2) {
          maze_cell = (
            <div className="maze-cell red" key={row * n + col}>
              {row * n + col + 1}
            </div>
          );
        } else {
          maze_cell = (
            <div className="maze-cell white" key={row * n + col}>
              {row * n + col + 1}
            </div>
          );
        }
        // let maze_cell =
        //   traversible[row][col] === 1 ? (
        //     <div className="maze-cell white" key={row * n + col}>
        //       {row * n + col + 1}
        //     </div>
        //   ) : (
        //     <div className="maze-cell black" key={row * n + col}>
        //       {row * n + col + 1}
        //     </div>
        //   );
        maze_container.push(maze_cell);
      }
    }
    generateBarriers(n, traversible);
    return maze_container;
  };

  useEffect(() => {
    setMaze(renderMaze());
  }, [render]);

  useEffect(() => {
    setMaze(<div>No Maze Yet</div>);
  }, []);

  const toggleMaze = () => {
    setRender(!render);
  };

  return (
    <>
      <div className="maze-container">
        <div className="grid-container">{maze}</div>
      </div>
      <button onClick={toggleMaze} className="toggle-button">
        Re-render Maze
      </button>
    </>
  );
};

export default Maze;
