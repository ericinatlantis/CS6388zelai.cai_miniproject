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
     * Initializes a new instance of BuildDescriptor.
     * @class
     * @augments {PluginBase}
     * @classdesc This class represents the plugin BuildDescriptor.
     * @constructor
     */
    function BuildDescriptor() {
        // Call base class' constructor.
        PluginBase.call(this);
        this.pluginMetadata = pluginMetadata;
    }

    /**
     * Metadata associated with the plugin. Contains id, name, version, description, icon, configStructure etc.
     * This is also available at the instance at this.pluginMetadata.
     * @type {object}
     */
    BuildDescriptor.metadata = pluginMetadata;

    // Prototypical inheritance from PluginBase.
    BuildDescriptor.prototype = Object.create(PluginBase.prototype);
    BuildDescriptor.prototype.constructor = BuildDescriptor;

    /**
     * Main function for the plugin to execute. This will perform the execution.
     * Notes:
     * - Always log with the provided logger.[error,warning,info,debug].
     * - Do NOT put any user interaction logic UI, etc. inside this method.
     * - callback always has to be called even if error happened.
     *
     * @param {function(Error|null, plugin.PluginResult)} callback - the result callback
     */
    BuildDescriptor.prototype.main = function (callback) {
        const {core, logger, META, activeNode, result} = this;

        const descriptor = {player:CONSTANTS.PLAYER.O,board:[],position2path:{}};
        const nodeHash = {};


        core.loadSubTree(activeNode)
        .then(nodes=>{
            nodes.forEach(node => {
                nodeHash[core.getPath(node)] = node;
            });
            
            const currentPlayerPath = core.getPointerPath(activeNode,'current');
            if(core.getAttribute(nodeHash[currentPlayerPath], 'name') === 'PlayerO') {
                descriptor.player = CONSTANTS.PLAYER.O;
            } else {
                descriptor.player = CONSTANTS.PLAYER.X;
            }

            core.getChildrenPaths(activeNode).forEach(playerOrBoard => {
                const node = nodeHash[playerOrBoard];
                if(core.isInstanceOf(node,META.Board)) {
                    descriptor.boardPath = playerOrBoard;
                }
            });
            return this.invokePlugin('CheckWinCondition',{pluginConfig:{}});
        })
        .then(inner => {
            descriptor.win = JSON.parse(inner.messages[0].message);
            descriptor.board = UTILS.getBoardDescriptor(core, META, nodeHash[descriptor.boardPath], nodeHash);
            descriptor.position2path = UTILS.getPositionHash(core, nodeHash[descriptor.boardPath], nodeHash);
            this.createMessage(activeNode, JSON.stringify(descriptor));
            result.setSuccess(true);
            callback(null, result);
        })
        .catch(e=>{
            logger.error(e);
            result.setSuccess(false);
            callback(e, null);
        });
    };

    return BuildDescriptor;
});
