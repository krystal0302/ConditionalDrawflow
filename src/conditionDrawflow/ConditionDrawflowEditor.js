import $ from 'jquery';

import Drawflow from 'drawflow';

import { MainLayout } from './components/ConditionMainLayout';
import { getConditionNodeTemplate } from './components/ConditionTemplates';
import { translateToNodeElementID } from './Utils'

import './css/conditionDrawflowStyle.css';

export class ConditionDrawflowEditor {
	constructor(flowPageObj, targetElementID) {
        this.flowPageObj = flowPageObj;
        this.drawflowEditor = undefined;

        this.mobile_item_selec = '';
        this.mobile_last_move = null;

        this.initLayout(targetElementID);
        this.initDrawFlow();
	}

    initLayout (targetElementID) {
        console.log('init initLayout')
        const insertTarget = document.getElementById(targetElementID);
        insertTarget.insertAdjacentHTML('afterbegin', MainLayout);
    }

    initDrawFlow () {
        console.log('init drawflow')
        const id = document.getElementById("drawflow");
        const editor = new Drawflow(id);
        editor.reroute = true;
        editor.reroute_fix_curvature = true;
        editor.force_first_input = false;
        this.drawflowEditor = editor;

        this.drawflowEditor.start();

        window.editor = this.drawflowEditor;
        this.drawflowBoardAllowDrop();
        this.drawflowBoardDrop();
        this.drawflowItemDragStart();
        this.drawflowInteractiveEvent();
    }

    drawflowItemDragStart() {
        const ConditionEditor = this;
        $(document).on('dragstart', '.drag-drawflow', function(event){
            console.log(event)
            if (event.type === "touchstart") {
                ConditionEditor.mobile_item_selec = event.target.closest(".drag-drawflow").getAttribute('data-node');
            } else {
                event.originalEvent.dataTransfer.setData("node", event.target.getAttribute('data-node'));
            }
        })
    }

    drawflowBoardDrop() {
        const ConditionEditor = this;
        $(document).on('drop', '#drawflow', function(event){
            if (event.type === "touchend") {
                var parentdrawflow = document.elementFromPoint(ConditionEditor.mobile_last_move.touches[0].clientX, ConditionEditor.mobile_last_move.touches[0].clientY).closest("#drawflow");
                if(parentdrawflow != null) {
                    ConditionEditor.addNodeToDrawFlow(ConditionEditor.mobile_item_selec, ConditionEditor.mobile_last_move.touches[0].clientX, ConditionEditor.mobile_last_move.touches[0].clientY);
                }
                ConditionEditor.mobile_item_selec = '';
            } else {
                event.preventDefault();
                var data = event.originalEvent.dataTransfer.getData("node");
                ConditionEditor.addNodeToDrawFlow(data, event.clientX, event.clientY);
            }
        })
    }

    drawflowBoardAllowDrop() {
        $(document).on('dragover', '#drawflow', function(event){
            event.preventDefault();
        })
    }

    drawflowInteractiveEvent() {
        const ConditionEditor = this;
        let DRAWFLOW_EDITOR = this.drawflowEditor;

        DRAWFLOW_EDITOR.on('zoom', function(zoom) {
            console.log("zoom " + zoom);
            setTimeout(() => {
                ConditionEditor.adjustIfConditionLayout()
            }, 500);
        })

        DRAWFLOW_EDITOR.on('nodeMoved', function(id) {
            console.log("Node moved " + id);
            // setCurrentSelectedNode(id);
            ConditionEditor.flowPageObj.setUnSaveChange(true);
        })

        DRAWFLOW_EDITOR.on('nodeSelected', function(id) {
            console.log("Node selected " + id);
            ConditionEditor.setCurrentSelectedNode(id);
            ConditionEditor.flowPageObj.setUnSaveChange(true);
        })

        DRAWFLOW_EDITOR.on('nodeUnselected', function(nodeUnselect) {
            console.log("Node unselected " + nodeUnselect);
            ConditionEditor.resetCurrentSelectedNode();
        })

        DRAWFLOW_EDITOR.on('nodeRemoved', function(removeNodeId) {
            console.log("Node Removed " + removeNodeId);
            deleteNodeDataInCurrentSavedData(`node-${removeNodeId}`);
            resetCurrentSelectedNodeWhenRemove();
            closeFlowSidebar();
        })

        DRAWFLOW_EDITOR.on('mouseMove', function(position) {
            // console.log('Position mouse x:' + position.x + ' y:'+ position.y);
            // console.log(editor)
        })

        DRAWFLOW_EDITOR.on('connectionCreated', function(output_id, input_id, output_class, input_class) {
            console.log(output_id, input_id, output_class, input_class)
        })
    }

    addNodeToDrawFlow(name, pos_x, pos_y) {
        let DRAWFLOW_EDITOR = this.drawflowEditor;
        if(DRAWFLOW_EDITOR.editor_mode === 'fixed') {
        return false;
        }
        pos_x = pos_x * ( DRAWFLOW_EDITOR.precanvas.clientWidth / (DRAWFLOW_EDITOR.precanvas.clientWidth * DRAWFLOW_EDITOR.zoom)) - (DRAWFLOW_EDITOR.precanvas.getBoundingClientRect().x * ( DRAWFLOW_EDITOR.precanvas.clientWidth / (DRAWFLOW_EDITOR.precanvas.clientWidth * DRAWFLOW_EDITOR.zoom)));
        pos_y = pos_y * ( DRAWFLOW_EDITOR.precanvas.clientHeight / (DRAWFLOW_EDITOR.precanvas.clientHeight * DRAWFLOW_EDITOR.zoom)) - (DRAWFLOW_EDITOR.precanvas.getBoundingClientRect().y * ( DRAWFLOW_EDITOR.precanvas.clientHeight / (DRAWFLOW_EDITOR.precanvas.clientHeight * DRAWFLOW_EDITOR.zoom)));

        console.log('ASDASDADASDASD')
        console.log(name)

        switch (name) {
            case 'logical_if':
                // let ifConditionNodeTemplate = document.getElementById("drawflowIfConditionNode");
                let ifConditionNodeTemplate = getConditionNodeTemplate('drawflowIfConditionNode');
                let if_id = DRAWFLOW_EDITOR.addNode('if-condition', 1, 2, pos_x, pos_y, 'if-condition', {}, ifConditionNodeTemplate.innerHTML );
            break;

            case 'logical_if_error_handle':
                let ifConditionErrorNodeTemplate = document.getElementById("drawflowIfConditionErrorHandleNode");
                let if_error_id = DRAWFLOW_EDITOR.addNode('if-condition-error-handle', 1, 2, pos_x, pos_y, 'if-condition', {}, ifConditionErrorNodeTemplate.innerHTML );
            break;

        default:
            // let normalNodeTemplate = document.getElementById("drawflowNode");
            let normalNodeTemplate = getConditionNodeTemplate('drawflowNode');
            let node = document.importNode(normalNodeTemplate.content, true);
            let span = node.querySelector('span');
            span.textContent = adjustTextMaxLength(name);
            span.title = name;
            span.dataset.rolename = name;
            var className = name.replace(/\s/g, '_');

            // add behavior info to drawflow
            let behaviorItem = document.getElementById("behaviorListItem");
            let behaviorCollapseDiv = node.querySelector('.behavior-list');
            let behaviors = flowPageData.currentFleetSetting.roles[name];

            behaviors.forEach((behaviorObj, behaviorIdx) => {
                const behaviorName = behaviorObj.title_name;
                let behaviorItemNode = document.importNode(behaviorItem.content, true);
                let behaviorItemSpan = behaviorItemNode.querySelector('span');
                let behaviorNumber = adjustNumberDisplayText(behaviorIdx+1);
                behaviorItemSpan.textContent = `${behaviorNumber}  ${behaviorName}`;
                behaviorCollapseDiv.appendChild(behaviorItemNode)
            });

            // change link text
            let behaviorTextLink = node.querySelector('.drawflow-show-behavior-list-info');
            behaviorTextLink.textContent = `Expand ${behaviors.length} Behaviors  ▾`

            var fake_div = document.createElement('div');
            fake_div.appendChild(node.cloneNode(true));

            let newNodeId = DRAWFLOW_EDITOR.addNode(name, 1, 2, pos_x, pos_y, className, {}, fake_div.innerHTML );

            // $(`#node-${newNodeId}`).parent().find(".outputs > .output_1").attr("title", "success");
            // $(`#node-${newNodeId}`).parent().find(".outputs > .output_2").attr("title", "failure");

            // console.log(DRAWFLOW_EDITOR)
            break;
        }

        this.adjustIfConditionLayout();
        this.flowPageObj.setUnSaveChange(true);
    }

    adjustIfConditionLayout() {
        let DRAWFLOW_EDITOR = this.drawflowEditor;
        let ifNodes = document.getElementById('drawflow').querySelectorAll('.drawflow-node.if-condition');

        ifNodes.forEach(ifnode => {
            let outputs = ifnode.querySelectorAll('.output');
            let inputs = ifnode.querySelectorAll('.input');
            let conditions = ifnode.querySelectorAll('.condition-group');
            let elseCondition = ifnode.querySelectorAll('.else-condition-group');
            let addBtnActive = ifnode.querySelector('.add-condition').classList.contains('active');

            // css style value param
            const defaultConditionNumber = 1;
            const targetPositionType = 'absolute';
            const targetRight = '-10px';
            const titlebias = 50;
            const r = 7.5;
            const isExpand = addBtnActive? true: false;

            // for normal condition input
            inputs.forEach((condition, index) => {
                let input_idx = 1;
                let targetInput = ifnode.querySelector(`.input_${input_idx}`);

                const nodePading = window.getComputedStyle(ifnode.querySelector('.if-condition-group'), null).getPropertyValue('padding').replace('px', '') * 1;

                let newTop = (r + nodePading ) + (isExpand? titlebias: 0);

                targetInput.style.position = targetPositionType;
                targetInput.style.right = targetRight;
                targetInput.style.top = `${newTop}px`;
            });

            // for normal condition output
            conditions.forEach((condition, index) => {
                let output_idx = index + 1;
                let targetOutput = ifnode.querySelector(`.output_${output_idx}`);

                const deleteMargin = 3*(((index+1)-defaultConditionNumber) < 0? 0: (index+1)-defaultConditionNumber);
                const inputWidthbias = 30;

                const nodePading = window.getComputedStyle(ifnode.querySelector('.if-condition-group'), null).getPropertyValue('padding').replace('px', '') * 1;
                const conditionGroupMarginBottom = window.getComputedStyle(conditions[0], null).getPropertyValue('margin-bottom').replace('px', '') * 1;

                let valueBetween2Output = conditionGroupMarginBottom + inputWidthbias;
                let newTop = ((r + nodePading) + valueBetween2Output*index) + deleteMargin + (isExpand? titlebias: 0);

                targetOutput.style.position = targetPositionType;
                targetOutput.style.right = targetRight;
                targetOutput.style.top = `${newTop}px`;
            });

            // for else condition output
            elseCondition.forEach((condition, index) => {
                let output_idx = outputs.length;
                let targetOutput = ifnode.querySelector(`.output_${output_idx}`);

                const deleteMargin = 1.1*(conditions.length-defaultConditionNumber);
                const addBtnHeigh = 27;

                const nodePading = 0; //window.getComputedStyle(ifnode.querySelector('.if-condition-group'), null).getPropertyValue('padding').replace('px', '') * 1;
                const conditionGroupMarginBottom = 2; //window.getComputedStyle(conditions[0], null).getPropertyValue('margin-bottom').replace('px', '') * 1;
                const elseConditoinMarginTop = window.getComputedStyle(ifnode.querySelector('.if-condition-else'), null).getPropertyValue('margin-top').replace('px', '') * 1;

                let conditionPaddingBotton = nodePading;
                let elsePaddingTop = nodePading;
                let expandbias = titlebias + (addBtnHeigh + conditionPaddingBotton + elseConditoinMarginTop + elsePaddingTop);

                let valueBetween2Output = conditionGroupMarginBottom + 30;
                let newTop = ((r + nodePading) + valueBetween2Output*(output_idx-1)) + deleteMargin + (isExpand? expandbias: 0);

                targetOutput.style.position = targetPositionType;
                targetOutput.style.right = targetRight;
                targetOutput.style.top = `${newTop}px`;
            });

            DRAWFLOW_EDITOR.updateConnectionNodes(ifnode.id);
        });
    }

    setCurrentSelectedNode(id) {
        let DRAWFLOW_EDITOR = this.drawflowEditor;
        let CURRENT_SELECT_NODE = this.flowPageObj.currentSelectedNode;

        let nodeInfo = DRAWFLOW_EDITOR.getNodeFromId(id);
        // console.log(nodeInfo)
        CURRENT_SELECT_NODE.node_id = id;

        if (nodeInfo.class === 'if-condition') {
            CURRENT_SELECT_NODE.nodType = 'if-condition';
            const targetNodeID = translateToNodeElementID(id);

            // show add condition button
            let targetIfConditonNode = document.getElementById(targetNodeID);
            let addConditionBtn = targetIfConditonNode.querySelector(".add-condition");
            addConditionBtn.classList.add("active");

            let elseCondition = targetIfConditonNode.querySelector(".if-condition-else");
            elseCondition.style.marginTop = "10px";

            DRAWFLOW_EDITOR.updateConnectionNodes(targetNodeID);
        } else if (nodeInfo.class === 'start' || nodeInfo.class === 'finish') {
            CURRENT_SELECT_NODE.nodType = 'default';
        } else {
            CURRENT_SELECT_NODE.nodType = 'normal';
        }
        this.adjustIfConditionLayout();
    }

    resetCurrentSelectedNode() {
        let DRAWFLOW_EDITOR = this.drawflowEditor;
        let CURRENT_SELECT_NODE = this.flowPageObj.currentSelectedNode;

        if (CURRENT_SELECT_NODE.nodType === 'if-condition') {
            const targetNodeID = translateToNodeElementID(CURRENT_SELECT_NODE.node_id);
            let targetIfConditonNode = document.getElementById(targetNodeID);

            let addConditionBtn = targetIfConditonNode.querySelector(".add-condition");
            addConditionBtn.classList.remove("active");

            let elseCondition = targetIfConditonNode.querySelector(".if-condition-else");
            elseCondition.style.marginTop = "0px";

            DRAWFLOW_EDITOR.updateConnectionNodes(targetNodeID);
        }

        CURRENT_SELECT_NODE.node_id = undefined;
        CURRENT_SELECT_NODE.nodType = 'normal';
        this.adjustIfConditionLayout();
    }
}