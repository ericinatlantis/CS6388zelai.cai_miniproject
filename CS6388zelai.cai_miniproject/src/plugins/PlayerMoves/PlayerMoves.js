define([
    'plugin/PluginConfig',
    'text!./metadata.json',
    'plugin/PluginBase',
    'mic-react-viz/constants',
    'mic-react-viz/utils'
], function (
    PluginConfig,
    pluginMetadata,
    PluginBase,
    CONSTANTS,
    UTILS) {
    'use strict';

    pluginMetadata = JSON.parse(pluginMetadata);

    /**
     * Initializes a new instance of PlayerMoves.
     * @class
     * @augments {PluginBase}
     * @classdesc This class represents the plugin PlayerMoves.
     * @constructor
     */
    function PlayerMoves() {
        // Call base class' constructor.
        PluginBase.call(this);
        this.pluginMetadata = pluginMetadata;
    }

    /**
     * Metadata associated with the plugin. Contains id, name, version, description, icon, configStructure etc.
     * This is also available at the instance at this.pluginMetadata.
     * @type {object}
     */
    PlayerMoves.metadata = pluginMetadata;

    // Prototypical inheritance from PluginBase.
    PlayerMoves.prototype = Object.create(PluginBase.prototype);
    PlayerMoves.prototype.constructor = PlayerMoves;

    /**
     * Main function for the plugin to execute. This will perform the execution.
     * Notes:
     * - Always log with the provided logger.[error,warning,info,debug].
     * - Do NOT put any user interaction logic UI, etc. inside this method.
     * - callback always has to be called even if error happened.
     *
     * @param {function(Error|null, plugin.PluginResult)} callback - the result callback
     */
    PlayerMoves.prototype.main = function (callback) {
        // Use this to access core, project, result, logger etc from PluginBase.
        const {core, activeNode, META, result} = this;
        const config = this.getCurrentConfig();

        const nodeHash = {};
        const players = {};
        const currentPlayerPath = core.getPointerPath(activeNode,'current');
        let nextPlayerPath = currentPlayerPath;
        let pos2path = {};

        core.loadSubTree(activeNode)
        .then(nodes => {
            nodes.forEach(node => {
                nodeHash[core.getPath(node)] = node;
            });

            const currentPieceNode = core.getAttribute(nodeHash[currentPlayerPath], 'name') === 'PlayerX' ?
                META.TicTacToe_X : META.TicTacToe_O;
            core.getChildrenPaths(activeNode).forEach(path => {
                if(core.isInstanceOf(nodeHash[path], META.Player) && path !== currentPlayerPath) {
                    nextPlayerPath = path;
                } else if (core.isInstanceOf(nodeHash[path], META.TicTacToeBoard)) {
                    pos2path = UTILS.getPositionHash(core, nodeHash[path], nodeHash);
                }
            });

            core.createNode({
                parent: nodeHash[pos2path[config.position]],
                base: currentPieceNode
            });
            return this.invokePlugin('CheckWinCondition',{pluginConfig:{}});
        })
        .then(innerResult => {
            console.log(innerResult);
            const win = JSON.parse(innerResult.messages[0].message);
            if(!win) {
                core.setPointer(activeNode, 'current',nodeHash[nextPlayerPath]);
            }

            return this.save('Player moved to position [' + (config.position+1) + '].');
        })
        .then(() => {
            result.setSuccess(true);
            callback(null, result);
        })
        .catch(error => {
            callback(error, null);
        })

    };

    return PlayerMoves;
});