export function getConditionItemOptionTemplate() {
    const Option = `
      <div class="drag-drawflow" draggable="true" data-node="">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmark-fill"
          viewBox="0 0 16 16">
          <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z" />
        </svg>
        <span class="drag-option-text" data-rolename=""></span>
      </div>
    `
    const template = document.createElement("template");
    template.innerHTML = Option;
    return template
    return template
}