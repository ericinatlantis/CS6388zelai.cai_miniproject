"""
This is where the implementation of the plugin code goes.
The -class is imported from both run_plugin.py and run_debug.py
"""
import sys
import logging
from webgme_bindings import PluginBase

# Setup a logger
logger = logging.getLogger('')
logger.setLevel(logging.INFO)
handler = logging.StreamHandler(sys.stdout)  # By default it logs to stderr..
handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
logger.addHandler(handler)


class undefined(PluginBase):
  def main(self):
    active_node = self.active_node
    core = self.core
    logger = self.logger
    self.namespace = None
    META = self.META
    logger.debug('path: {0}'.format(core.get_path(active_node)))
    logger.info('name: {0}'.format(core.get_attribute(active_node, 'name')))
    logger.warn('pos : {0}'.format(core.get_registry(active_node, 'position')))
    logger.error('guid: {0}'.format(core.get_guid(active_node)))
    nodesList = core.load_sub_tree(active_node)
    nodes = {}
    for node in nodesList:
      nodes[core.get_path(node)] = node
      if (core.is_instance_of(node, META['GameState'])):
        logger.info(core.get_attribute(node, 'name'))
        
  def is_valid_move(board, currentPlayer, currentMove):
  #Since it can move to that place, some opponents will get flipped definitely.
  #Homework 6:The board is set below to be located here.
    row, col = currentMove
    if board[row][col] != "none":
        return False

    directions = [(0, 1), (1, 0), (0, -1), (-1, 0), (1, 1), (-1, -1), (1, -1), (-1, 1)]

    for direction in directions:
        found_opponent = False
        d_row, d_col = direction
        lat_row, lat_col = row + d_row, col + d_col
        
        while 0 <= lat_row < 8 and 0 <= lat_col < 8:
            if board[lat_row][lat_col] == "none":
                if found_opponent == True:
                    return True
                else:
                  break
            if board[lat_row][lat_col] == currentPlayer:
                break
            else:
                found_opponent = True
            lat_row += d_row
            lat_col += d_col

    print("ERROR: no valid tiles to flip.")
    return False
