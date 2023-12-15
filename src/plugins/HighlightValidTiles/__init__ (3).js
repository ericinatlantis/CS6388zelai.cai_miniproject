// Setup a logger
const logger = {
  debug: console.log,
  info: console.log,
  warn: console.warn,
  error: console.error
};

class PluginBase {
  constructor() {
    this.active_node = null; // You may need to define this accordingly
    this.core = null; // You may need to define this accordingly
    this.namespace = null;
    this.META = {}; // You may need to define this accordingly
    this.logger = logger;
  }

  main() {
    const active_node = this.active_node;
    const core = this.core;
    const META = this.META;

    this.logger.debug(`path: ${core.get_path(active_node)}`);
    this.logger.info(`name: ${core.get_attribute(active_node, 'name')}`);
    this.logger.warn(`pos : ${core.get_registry(active_node, 'position')}`);
    this.logger.error(`guid: ${core.get_guid(active_node)}`);

    const nodesList = core.load_sub_tree(active_node);
    const nodes = {};
    for (const node of nodesList) {
      nodes[core.get_path(node)] = node;
      if (core.is_instance_of(node, META['GameState'])) {
        this.logger.info(core.get_attribute(node, 'name'));
      }
    }
  }

  is_valid_move(board, currentPlayer, currentMove) {
    const [row, col] = currentMove;
    if (board[row][col] !== "none") {
      return false;
    }

    const directions = [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
      [1, 1],
      [-1, -1],
      [1, -1],
      [-1, 1]
    ];

    for (const direction of directions) {
      let found_opponent = false;
      const [d_row, d_col] = direction;
      let lat_row = row + d_row;
      let lat_col = col + d_col;

      while (lat_row >= 0 && lat_row < 8 && lat_col >= 0 && lat_col < 8) {
        if (board[lat_row][lat_col] === "none") {
          if (found_opponent) {
            return true;
          } else {
            break;
          }
        }
        if (board[lat_row][lat_col] === currentPlayer) {
          break;
        } else {
          found_opponent = true;
        }
        lat_row += d_row;
        lat_col += d_col;
      }
    }

    console.log("ERROR: no valid tiles to flip.");
    return false;
  }
}
