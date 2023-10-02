import React from 'react';
import ReactDOMServer from "react-dom/server";

function ConditionMainLayout() {
    return `
    <div class="card border-light col-lg-12" id="flow-deck"
        style="border-radius: 15px;background-color: #353941;min-height:500px; padding: 0;">
        <div class="tab-content" id="flow-myTabContent">
        <div class="tab-pane fade show active" id="flow-home" role="tabpanel" aria-labelledby="flow-home-tab">
            <div class="card-body" style="width:100%;">
            <div class="row">
                <div class="col-3" style="margin-top: 40px;width:300px;">
                <ul class="nav nav-tabs" id="myTab" role="tablist">
                    <li class="nav-item">
                    <a class="nav-link active" id="home-tab" data-bs-toggle="tab" href="#Task" role="tab"
                        aria-controls="home" aria-selected="true">
                        <span>Item</span>
                    </a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" id="profile-tab" data-bs-toggle="tab" href="#Logical" role="tab"
                        aria-controls="profile" aria-selected="false">Logical</a>
                    </li>
                </ul>
                <div class="tab-content" id="myTabContent">
                    <div class="tab-pane fade show active" id="Task" role="tabpanel" aria-labelledby="home-tab">
                    <div class="drag-drawflow" draggable="true" data-node="start"
                        style="display: none;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-play-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path
                            d="M6.271 5.055a.5.5 0 0 1 .52.038l3.5 2.5a.5.5 0 0 1 0 .814l-3.5 2.5A.5.5 0 0 1 6 10.5v-5a.5.5 0 0 1 .271-.445z" />
                        </svg>
                        <span> Start</span>
                    </div>
                    <div class="drag-drawflow" draggable="true" data-node="finish"
                        style="display: none;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-record-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                        <path d="M11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                        </svg>
                        <span> Finish</span>
                    </div>
                    </div>
                    <div class="tab-pane fade" id="Logical" role="tabpanel" aria-labelledby="profile-tab">
                    <div class="drag-drawflow" draggable="true" data-node="logical_if">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-hand-thumbs-up" viewBox="0 0 16 16">
                        <path
                            d="M8.864.046C7.908-.193 7.02.53 6.956 1.466c-.072 1.051-.23 2.016-.428 2.59-.125.36-.479 1.013-1.04 1.639-.557.623-1.282 1.178-2.131 1.41C2.685 7.288 2 7.87 2 8.72v4.001c0 .845.682 1.464 1.448 1.545 1.07.114 1.564.415 2.068.723l.048.03c.272.165.578.348.97.484.397.136.861.217 1.466.217h3.5c.937 0 1.599-.477 1.934-1.064a1.86 1.86 0 0 0 .254-.912c0-.152-.023-.312-.077-.464.201-.263.38-.578.488-.901.11-.33.172-.762.004-1.149.069-.13.12-.269.159-.403.077-.27.113-.568.113-.857 0-.288-.036-.585-.113-.856a2.144 2.144 0 0 0-.138-.362 1.9 1.9 0 0 0 .234-1.734c-.206-.592-.682-1.1-1.2-1.272-.847-.282-1.803-.276-2.516-.211a9.84 9.84 0 0 0-.443.05 9.365 9.365 0 0 0-.062-4.509A1.38 1.38 0 0 0 9.125.111L8.864.046zM11.5 14.721H8c-.51 0-.863-.069-1.14-.164-.281-.097-.506-.228-.776-.393l-.04-.024c-.555-.339-1.198-.731-2.49-.868-.333-.036-.554-.29-.554-.55V8.72c0-.254.226-.543.62-.65 1.095-.3 1.977-.996 2.614-1.708.635-.71 1.064-1.475 1.238-1.978.243-.7.407-1.768.482-2.85.025-.362.36-.594.667-.518l.262.066c.16.04.258.143.288.255a8.34 8.34 0 0 1-.145 4.725.5.5 0 0 0 .595.644l.003-.001.014-.003.058-.014a8.908 8.908 0 0 1 1.036-.157c.663-.06 1.457-.054 2.11.164.175.058.45.3.57.65.107.308.087.67-.266 1.022l-.353.353.353.354c.043.043.105.141.154.315.048.167.075.37.075.581 0 .212-.027.414-.075.582-.05.174-.111.272-.154.315l-.353.353.353.354c.047.047.109.177.005.488a2.224 2.224 0 0 1-.505.805l-.353.353.353.354c.006.005.041.05.041.17a.866.866 0 0 1-.121.416c-.165.288-.503.56-1.066.56z" />
                        </svg>
                        <span> If</span>
                    </div>
                    </div>
                </div>
                </div>
                <div class="col-9">
                <div class="wrapper" style="height: 800px;">
                    <div id="drawflow">
                    <div class="btn-clear" onclick="init_panel();">
                        <span>Clear Panel</span>
                    </div>
                    <div class="btn-delete" onclick="deleteSelectedItem()" style="display: none;">Delete</div>
                    <div class="btn-lock">
                        <i id="lock" class="fas fa-lock" onclick="editor.editor_mode='fixed'; changeMode('lock');"></i>
                        <i id="unlock" class="fas fa-lock-open" onclick="editor.editor_mode='edit'; changeMode('unlock');"
                        style="display:none;"></i>
                    </div>
                    <div class="bar-zoom">
                        <i class="fas fa-search-minus" onclick="editor.zoom_out()"></i>
                        <i class="fas fa-search" onclick="editor.zoom_reset()"></i>
                        <i class="fas fa-search-plus" onclick="editor.zoom_in()"></i>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
    `
}

export const MainLayout = ConditionMainLayout()