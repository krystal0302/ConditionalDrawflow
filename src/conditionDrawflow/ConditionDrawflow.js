import $ from 'jquery';
import * as bootstrap from 'bootstrap';
window.bootstrap = bootstrap;

import Drawflow from 'drawflow';

import { MainLayout } from '@MAINCOMPONENTS/ConditionMainLayout';
import { getConditionNodeTemplate } from '@MAINCOMPONENTS/ConditionTemplates';
import { getConditionItemOptionTemplate } from '@MAINCOMPONENTS/ConditionItemOptionTemplate';
import {
    translateToNodeDrawFlowID,
    translateToNodeElementID,
    adjustTextMaxLength,
    adjustNumberDisplayText
} from './Utils'

import '@MAINSTYLE/conditionDrawflowStyle.css';

import { ConditionBase } from './ConditionBase';

export class ConditionDrawflow extends ConditionBase {
	constructor(targetElementID, isCustomMode=false) {
        super(isCustomMode);
        // this.conditionDrawFlowData = conditionDrawFlowData;
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
        this.interactEvent();

        this.setDrawFlowWithData();
    }

    defaultDrawFlowData() {
        let defaultDrawflowData =
        {
            "drawflow": {
                "Home": {
                    "data": {
                        "2": {
                            "id": 2,
                            "name": "start",
                            "data": {},
                            "class": "start",
                            "html": "",
                            "typenode": false,
                            "inputs": {},
                            "outputs": {
                                "output_1": {
                                    "connections": []
                                }
                            },
                            "pos_x": 59,
                            "pos_y": 304
                        },
                        "3": {
                            "id": 3,
                            "name": "finish",
                            "data": {},
                            "class": "finish",
                            "html": "",
                            "typenode": false,
                            "inputs": {
                                "input_1": {
                                    "connections": []
                                }
                            },
                            "outputs": {},
                            "pos_x": 632,
                            "pos_y": 300
                        }
                    }
                }
            }
        };

        const startNodeHTML = getConditionNodeTemplate('drawflowStartNode').innerHTML;
        const finishNodeHTML = getConditionNodeTemplate('drawflowFinishNode').innerHTML;

        defaultDrawflowData.drawflow.Home.data[2].html = startNodeHTML;
        defaultDrawflowData.drawflow.Home.data[3].html = finishNodeHTML;

        return defaultDrawflowData
    }

    setDrawFlowWithData () {
        console.log("Init DrawFlow")
        const initData = this.conditionDrawFlowData.drawFlowUIData === undefined? this.defaultDrawFlowData(): this.conditionDrawFlowData.drawFlowUIData;

        this.drawflowEditor.clear();
        this.drawflowEditor.import(initData);

        const optionData = this.conditionDrawFlowData.currentDataSetting.items;
        this.updateDrawFlowOption(optionData);
        this.adjustIfConditionLayout();
    }

    resetPanel() {
        if (!confirm('Clear the current flow draft?')) { return; }

        this.resetConditionDrawFlowSavedData();
        this.setDrawFlowWithData();
    }

    drawflowItemDragStart() {
        const CONDITION_DRAW_FLOW = this;
        $(document).on('dragstart', '.drag-drawflow', function(event){
            console.log(event)
            if (event.type === "touchstart") {
                CONDITION_DRAW_FLOW.mobile_item_selec = event.target.closest(".drag-drawflow").getAttribute('data-node');
            } else {
                event.originalEvent.dataTransfer.setData("node", event.target.getAttribute('data-node'));
            }
        })
    }

    drawflowBoardDrop() {
        const CONDITION_DRAW_FLOW = this;
        $(document).on('drop', '#drawflow', function(event){
            if (event.type === "touchend") {
                var parentdrawflow = document.elementFromPoint(CONDITION_DRAW_FLOW.mobile_last_move.touches[0].clientX, CONDITION_DRAW_FLOW.mobile_last_move.touches[0].clientY).closest("#drawflow");
                if(parentdrawflow != null) {
                    CONDITION_DRAW_FLOW.addNodeToDrawFlow(CONDITION_DRAW_FLOW.mobile_item_selec, CONDITION_DRAW_FLOW.mobile_last_move.touches[0].clientX, CONDITION_DRAW_FLOW.mobile_last_move.touches[0].clientY);
                }
                CONDITION_DRAW_FLOW.mobile_item_selec = '';
            } else {
                event.preventDefault();
                var data = event.originalEvent.dataTransfer.getData("node");
                CONDITION_DRAW_FLOW.addNodeToDrawFlow(data, event.clientX, event.clientY);
            }
        })
    }

    drawflowBoardAllowDrop() {
        $(document).on('dragover', '#drawflow', function(event){
            event.preventDefault();
        })
    }

    drawflowInteractiveEvent() {
        const CONDITION_DRAW_FLOW = this;
        let DRAWFLOW_EDITOR = CONDITION_DRAW_FLOW.drawflowEditor;

        DRAWFLOW_EDITOR.on('zoom', function(zoom) {
            console.log("zoom " + zoom);
            setTimeout(() => {
                CONDITION_DRAW_FLOW.adjustIfConditionLayout()
            }, 500);
        })

        DRAWFLOW_EDITOR.on('nodeMoved', function(id) {
            console.log("Node moved " + id);
            // setCurrentSelectedNode(id);
            CONDITION_DRAW_FLOW.setUnSaveChange(true);
        })

        DRAWFLOW_EDITOR.on('nodeSelected', function(id) {
            console.log("Node selected " + id);
            CONDITION_DRAW_FLOW.setCurrentSelectedNode(id);
            CONDITION_DRAW_FLOW.setUnSaveChange(true);
        })

        DRAWFLOW_EDITOR.on('nodeUnselected', function(nodeUnselect) {
            console.log("Node unselected " + nodeUnselect);
            CONDITION_DRAW_FLOW.resetCurrentSelectedNode();
        })

        DRAWFLOW_EDITOR.on('nodeRemoved', function(removeNodeId) {
            console.log("Node Removed " + removeNodeId);
            CONDITION_DRAW_FLOW.deleteNodeDataInCurrentSavedData(`node-${removeNodeId}`);
            CONDITION_DRAW_FLOW.resetCurrentSelectedNodeWhenRemove();
            // Event dispatch here
            // closeFlowSidebar();
        })

        DRAWFLOW_EDITOR.on('mouseMove', function(position) {
            // console.log('Position mouse x:' + position.x + ' y:'+ position.y);
        })

        DRAWFLOW_EDITOR.on('connectionCreated', function(output_id, input_id, output_class, input_class) {
            console.log(output_id, input_id, output_class, input_class)
        })
    }

    updateDrawFlowOption(itemOptions) {
        console.log("Update DrawFlow Options")
        $('#Task').empty();

        const optionTemplate = getConditionItemOptionTemplate();
        const items = Object.keys(itemOptions);
        // console.log(roles)

        items.forEach(item => {
            let node = document.importNode(optionTemplate.content, true);
            let span = node.querySelector('span');
            let div = node.querySelector('.drag-drawflow');

            span.textContent = item;
            div.dataset.node = item;

            $('#Task').append(node)
        });

        this.conditionDrawFlowData.currentDataSetting.items = itemOptions;
    }

    addNodeToDrawFlow(name, pos_x, pos_y) {
        const CONDITION_DRAW_FLOW = this;
        let CONDITION_FLOW_DATA = CONDITION_DRAW_FLOW.conditionDrawFlowData;
        let DRAWFLOW_EDITOR = CONDITION_DRAW_FLOW.drawflowEditor;

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
            // let behaviorItem = document.getElementById("behaviorListItem");
            let behaviorItem = getConditionNodeTemplate('behaviorListItem');
            let behaviorCollapseDiv = node.querySelector('.behavior-list');
            let behaviors = CONDITION_FLOW_DATA.currentDataSetting.items[name];

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
        this.setUnSaveChange(true);
    }

    adjustIfConditionLayout() {
        const CONDITION_DRAW_FLOW = this;
        let DRAWFLOW_EDITOR = CONDITION_DRAW_FLOW.drawflowEditor;
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
        const CONDITION_DRAW_FLOW = this;
        let DRAWFLOW_EDITOR = CONDITION_DRAW_FLOW.drawflowEditor;
        let CURRENT_SELECT_NODE = CONDITION_DRAW_FLOW.currentSelectedNode;

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

    drawFlowUnselectNode(targetNode) {
        const CONDITION_DRAW_FLOW = this;
        let DRAWFLOW_EDITOR = CONDITION_DRAW_FLOW.drawflowEditor;
        let parent = targetNode.closest('.drawflow-node');

        // reset to unselect style
        parent.classList.remove('selected');
        DRAWFLOW_EDITOR.node_selected = null;
        CONDITION_DRAW_FLOW.resetCurrentSelectedNode();

        // rm other editing
        let otherEditingNodes = document.querySelectorAll('.drawflow-node.editing');
        otherEditingNodes.forEach(node => {
            node.classList.remove('editing');
        });
        // add editing
        parent.classList.add('editing');
    }

    resetCurrentSelectedNode() {
        const CONDITION_DRAW_FLOW = this;
        let DRAWFLOW_EDITOR = CONDITION_DRAW_FLOW.drawflowEditor;
        let CURRENT_SELECT_NODE = CONDITION_DRAW_FLOW.currentSelectedNode;

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

    resetCurrentSelectedNodeWhenRemove() {
        const CONDITION_DRAW_FLOW = this;
        let CURRENT_SELECT_NODE = CONDITION_DRAW_FLOW.currentSelectedNode;
        CURRENT_SELECT_NODE.node_id = undefined;
        CURRENT_SELECT_NODE.nodType = 'normal';
    }

    interactEvent() {
        const CONDITION_DRAW_FLOW = this;
        let DRAWFLOW_EDITOR = CONDITION_DRAW_FLOW.drawflowEditor;

        $(document).on('click', '.add-condition', function (e) {
            // Get condition template
            // let conditionTemplate = document.getElementById('conditionGroup');
            let conditionTemplate = getConditionNodeTemplate('conditionGroup');
            let condition = document.importNode(conditionTemplate.content, true);

            // target node
            const elementID = $(this).parent().closest('.drawflow-node').attr('id');
            const drawFlowNodeID = translateToNodeDrawFlowID(elementID);

            // Add Output
            DRAWFLOW_EDITOR.addNodeOutput(drawFlowNodeID);

            // Handle add condition
            let targetIfConditonNode = document.getElementById(elementID);
            let numberOfCondition = targetIfConditonNode.querySelectorAll(".condition-group").length;
            let refNode = targetIfConditonNode.querySelector(".add-condition")

            // change condition placeholder
            condition.querySelector('.condition-input').setAttribute('value',`Condition ${numberOfCondition+1}`);
            condition.querySelector('.condition-input').setAttribute('disabled', true);
            refNode.parentNode.insertBefore(condition, refNode);

            // update connection
            DRAWFLOW_EDITOR.updateConnectionNodes(elementID);

            // Update Drawwflow Content
            const tmpCpoy = targetIfConditonNode.cloneNode(true);
            let tmpNodePlaceholder = document.createElement("div");
            tmpNodePlaceholder.appendChild(tmpCpoy.querySelector('.drawflow_content_node'));

            // clear style and expand css
            let addConditionBtn = tmpNodePlaceholder.querySelector(".add-condition");
            addConditionBtn.classList.remove("active");
            let elseCondition = tmpNodePlaceholder.querySelector(".if-condition-else");
            elseCondition.style = null;

            DRAWFLOW_EDITOR.drawflow.drawflow.Home.data[drawFlowNodeID].html = tmpNodePlaceholder.firstChild.innerHTML;

            CONDITION_DRAW_FLOW.adjustIfConditionLayout()

            // check if  sidebar open
             // Event dispatch here
            // const sidebarDrawFlowNodeID = getCurrentSideBarSelectNode().node_id;
            // if (sidebarDrawFlowNodeID === undefined || `${sidebarDrawFlowNodeID.trim()}`.length === 0){
            //     // sidebar close
            // } else {
            //     // sidebar open
            //     if (sidebarDrawFlowNodeID === drawFlowNodeID) {
            //         const addConditionBtn = document.querySelector('.sidebar-add-condition');

            //         const eventObj = {
            //             isTriggerFromDrawflowAdd: true
            //         }
            //         $(addConditionBtn).trigger('click', eventObj);
            //     }
            // }
        });

        $(document).on('change', '.drawflow-task-priority-select', function (e) {
            let selected_val = $(this).val();
            const elementID = $(this).parent().closest('.drawflow-node').attr('id');
            const drawFlowNodeID = translateToNodeDrawFlowID(elementID);
            let component_html = DRAWFLOW_EDITOR.getNodeFromId(drawFlowNodeID).html;
            let component_select = $(component_html).find(".drawflow-task-priority-select");
            component_select.find("option").removeAttr('selected')
            component_select.find(`option[value="${selected_val}"]`).attr('selected', true);
            let backgroundColor = '#00284D';

            switch (`${selected_val}`) {
                case '5':
                    backgroundColor = '#0029FF';
                    break;
                case '4':
                    backgroundColor = '#0029FF';
                    break;
                default:
                    backgroundColor = '#00284D';
                    break;
            }
            // change html css color
            document.getElementById(elementID).getElementsByClassName("drawflow-task-priority-select")[0].setAttribute('style',`background-color: ${backgroundColor};`);

            const placeholder = document.createElement("div");
            placeholder.innerHTML = component_html;
            let node = placeholder.firstElementChild;
            let current_select = node
            current_select.getElementsByTagName('select')[0].innerHTML = component_select.html()
            current_select.getElementsByTagName('select')[0].setAttribute('style',`background-color: ${backgroundColor};`);
            // console.log(current_select.outerHTML)
            // console.log(component_html)
            DRAWFLOW_EDITOR.drawflow.drawflow.Home.data[drawFlowNodeID].html = current_select.outerHTML

            // change sidebar general setting if open
            let sidebarPrioritySelect = document.getElementsByClassName('general-setting-priority-select');
            if (sidebarPrioritySelect.length > 0) {
                const sidebarPrioritySelectVal = `${sidebarPrioritySelect[0].value}`;
                let sidebarPriorityOptions = sidebarPrioritySelect[0].querySelectorAll('option');
                sidebarPriorityOptions.forEach(option => {
                    if (selected_val === `${option.value}`) {
                        option.selected = true
                    } else {
                        option.selected = false
                    }
                });
            }
        });

        // edit behavior
        $(document).on("click", ".more-info-edit", (e) => {
            let currentEditInfo = e.currentTarget;
            let parent = currentEditInfo.closest('.drawflow-node');

            // Event dispatch here
            // openFlowSidebar();
            CONDITION_DRAW_FLOW.drawFlowUnselectNode(parent);
        })

        $(document).on("click", ".more-info-delete", (e) => {
            console.log(e)
            let anchor = e.currentTarget;
            let closestNode = anchor.closest('.drawflow-node');
            let nodeId= closestNode.id;
            DRAWFLOW_EDITOR.removeNodeId(nodeId);
        })

        // drawflow expand node behaviors
        $(document).on("click", ".drawflow-show-behavior-list-info", function () {
            let parentNode = this.closest('.drawflow-node');
            let nodeID = parentNode.id;

            let vehicleDiv = parentNode.getElementsByClassName('vehicle-info')[0];
            vehicleDiv.classList.toggle('active');
            let collapseDiv = parentNode.getElementsByClassName('collapse')[0];
            // $(collapseDiv).collapse('toggle');
            new bootstrap.Collapse(collapseDiv)
        })

        $(document).on('shown.bs.collapse', '.collapse.behavior-list', function () {
            let parentNode = this.closest('.drawflow-node');
            let nodeID = parentNode.id;

            DRAWFLOW_EDITOR.updateConnectionNodes(nodeID);
        })

        $(document).on('hidden.bs.collapse', '.collapse.behavior-list', function () {
            let parentNode = this.closest('.drawflow-node');
            let nodeID = parentNode.id;

            DRAWFLOW_EDITOR.updateConnectionNodes(nodeID);
        })

        $(document).on('input', '.annotation-input', function () {
            const parentNode = this.closest('.drawflow-node');
            const drawFlowNodeID = translateToNodeDrawFlowID(parentNode.id);

            let component_html = DRAWFLOW_EDITOR.getNodeFromId(drawFlowNodeID).html;
            const placeholder = document.createElement("div");
            placeholder.innerHTML = component_html;
            let node = placeholder.firstElementChild;
            let current_select = node;

            const drawflowAnnotation = current_select.querySelector('.annotation-input');
            drawflowAnnotation.setAttribute('value', $(this).val());

            DRAWFLOW_EDITOR.drawflow.drawflow.Home.data[drawFlowNodeID].html = current_select.outerHTML;
        })
    }
}



