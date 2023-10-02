import $ from 'jquery';
window.$ = $;
import 'bootstrap';

import 'admin-lte/plugins/fontawesome-free/css/all.min.css'
import 'admin-lte/dist/css/adminlte.min.css'

import { ConditionDrawflowEditor } from './ConditionDrawflowEditor'

export class ConditionDrawflow {
	constructor(targetElementID) {
		this.flowPageData = {
            currentFleet: "default",
            currentFleetSetting: {
                agents: [],
                artifacts: [],
                maps: {},
                roles: [],
                conditions: {},
                artifactsTemplates: {}
            },
            currentSavedData: {},
            currentFlowType: {
                type: "",
                start_time: '',
                end_time: '',
                interval: ''
            },
            langTemplateObj_: {},
            drawFlowUIData: undefined,
            haveUnSaveChange: false
        };

        this.currentSelectedNode = {
            node_id: undefined,
            nodType: 'normal'
        };

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

        this.drawflowEditor = new ConditionDrawflowEditor(this, targetElementID);
	}

    setUnSaveChange(haveUnSaveData=false) {
        this.flowPageData.haveUnSaveChange = haveUnSaveData;
    }

    testLog() {
        return 'f'
    }
}