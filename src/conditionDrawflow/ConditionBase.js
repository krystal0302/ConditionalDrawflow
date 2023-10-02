import $ from 'jquery';
window.$ = $;
import 'bootstrap';

import 'admin-lte/plugins/fontawesome-free/css/all.min.css'
import 'admin-lte/dist/css/adminlte.min.css'

export class ConditionBase {
	constructor(isCustomMode=false) {
        this.isCustomMode = isCustomMode;
		this.conditionDrawFlowData = {
            currentDataSetting: {
                items: [],
                conditions: {},
            },
            currentSavedData: {},
            drawFlowUIData: undefined,
            haveUnSaveChange: false
        };

        this.currentSelectedNode = {
            node_id: undefined,
            nodType: 'normal'
        };

        // this.drawflowEditor = new ConditionDrawflow(this, targetElementID, this.isCustomMode);
	}

    setSetCustomAttribute() {
        this.conditionDrawFlowData.currentFleet = "default";
        this.conditionDrawFlowData.currentDataSetting.agents = [];
        this.conditionDrawFlowData.currentDataSetting.artifacts = [];
        this.conditionDrawFlowData.currentDataSetting.maps = {};
        this.conditionDrawFlowData.currentDataSetting.artifactsTemplates = {};

        this.conditionDrawFlowData.currentFlowType = {
            type: "",
            start_time: '',
            end_time: '',
            interval: ''
        };

        this.conditionDrawFlowData.langTemplateObj_ = {};

        this.saveData = {
            nodeId: '',
            roleName: '',
            behavior: '',
            error_handle: {
                error_type: '',
                failure_timeout: '',
                retry_limit: ''
            }
        }

        this.conditionSaveData = {
            nodeId: '',
            roleName: '',
            behavior: '',
            error_handle: {
                error_type: '',
                failure_timeout: '',
                retry_limit: ''
            },
            conditions: {}
        }
    }

    setUnSaveChange(haveUnSaveData=false) {
        this.conditionDrawFlowData.haveUnSaveChange = haveUnSaveData;
    }

    testLog() {
        return 'f'
    }
}