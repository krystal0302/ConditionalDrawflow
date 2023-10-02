const templateHTML = {
    drawflowStartNode: `
    <div id="start">
      <div class="title-box" style="padding-left: 0px;">
        <div class="col-12" style="text-align: center;">Start</div>
      </div>
    </div>`,
    drawflowFinishNode: `
    <div id="finish">
      <div class="title-box" style="padding-left: 0px;">
        <div class="col-12" style="text-align: center;">Finish</div>
      </div>
    </div>`,
    drawflowNode: `
    <div class="drawflow-role-node">
      <div class="col-12 task-priority-tag">
        <select class="form-select drawflow-task-priority-select" aria-label="Task priority select">
          <option value="5">Highest</option>
          <option value="4">High</option>
          <option value="3" selected>Normal</option>
          <option value="2">Low</option>
          <option value="1">Lowest</option>
        </select>
      </div>
      <div class="title-box">
        <div class="col-12">
          <span class="normal-node-text"></span>
          <button type="button" class="btn btn-primary dropdown-toggle more-info" data-toggle="dropdown"><i
              class="fas fa-ellipsis-v"></i></button>
          <div class="dropdown-menu more-info-menu">
            <a class="dropdown-item more-info-edit" href="#">Edit</a>
            <a class="dropdown-item more-info-delete" href="#">Delete</a>
          </div>
        </div>
      </div>
      <div class="box">
        <div class="col-12 ">
          <span class="vehicle-info" data-robot-id="">Vehicle: Auto</span>
          <input type="text" class="form-control annotation-input" placeholder="Annotation">
        </div>
        <div class="col-12 collapse behavior-list">
        </div>
      </div>
      <div class="footer-box">
        <div class="col-12">
          <div class="row">
            <div class="col-1 drawflow-behavior-undefind-info">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                class="bi bi-info-circle" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path
                  d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>
            </div>
            <div class="col-11 drawflow-behavior-col">
              <a class="drawflow-show-behavior-list-info" data-bs-toggle="collapse" href="#" role="button">
                Link with href
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>`,
    drawflowIfConditionNode: `
    <div class="drawflow-if-condition-node">
    <div class="title-box">
      <button type="button" class="btn btn-primary dropdown-toggle more-info" data-toggle="dropdown"><i
          class="fas fa-ellipsis-v"></i></button>
      <div class="dropdown-menu more-info-menu">
        <a class="dropdown-item more-info-edit" href="#">Edit</a>
        <a class="dropdown-item more-info-delete" href="#">Delete</a>
      </div>
    </div>
    <div class="box">
      <div class="if-condition-group">
        <div class="input-group input-group-sm condition-group">
          <div class="input-group-prepend">
            <span class="input-group-text condition-span">if</span>
          </div>
          <input type="text" class="form-control condition-input" aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-sm" value="Condition 1" disabled="disabled">
          <div class="col-1 drawflow-behavior-undefind-info" style="transform: translate(-90%, 25%);">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
              class="bi bi-info-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
              <path
                d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
          </div>
        </div>

        <button type="button" class="btn btn-primary add-condition"><i class="fas fa-plus"></i></button>
      </div>
      <div class="if-condition-else">
        <div class="input-group input-group-sm else-condition-group">
          <div class="input-group-prepend">
            <span class="input-group-text else-condition-span">else</span>
          </div>
          <input type="text" class="form-control else-condition-input" aria-label="Sizing example input"
            aria-describedby="inputGroup-sizing-sm" value="Do" disabled="disabled">
        </div>
      </div>
    </div>
  </div>`,
  behaviorListItem: `
    <div class="col-12 behavior-list-item">
      <span>00 Moving</span>
    </div>
  `
}

export function getConditionNodeTemplate (requestTemplate) {
    const template = document.createElement("template");
    template.innerHTML = templateHTML[requestTemplate];
    return template
}