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

  static count_pieces(board) {
    const black_count = board.flat().filter(piece => piece === 'B').length;
    const white_count = board.flat().filter(piece => piece === 'W').length;
    return [black_count, white_count];
  }
}
