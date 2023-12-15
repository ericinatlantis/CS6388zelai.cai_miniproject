const logger = {
  error: console.error
};

class CreateGame extends PluginBase {
  main() {
    const core = this.core;
    const root_node = this.root_node;
    const active_node = this.active_node; // the context should be the games folder
    const META = this.META;
    let max_index = -1;
    let index = 0;

    logger.error('inside the code');
    logger.error(active_node);
    for (const child of core.load_children(active_node)) {
      const name = core.get_attribute(child, 'name');
      if (name.split('-').length > 1) {
        index = parseInt(name.split('-')[1]);
      }
      if (index > max_index) {
        max_index = index;
      }
    }
    const new_game = core.create_node({
      parent: active_node,
      base: META['TicTacToeGame']
    });
    core.set_attribute(new_game, 'name', `game-${(max_index + 1).toString().padStart(3, '0')}`);

    // As the ticatactoegame prototype already has everything setup we do not need
    // to do anything further.
    this.util.save(root_node, this.commit_hash, 'master', 'created a new game object which should be renamed');
    this.create_message(active_node, core.get_path(new_game));
  }
}
