
import React from 'react'
import { createRoot } from 'react-dom/client';
import CustomButton from '@/components/CustomButton';
import CustomAnchor from '@/components/CustomAnchor';

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite5!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
    <div id="wrapper" />
  </div>
`

function ComponentRoot() {
  const links = {
    vis: '/visNetworkTest.html',
    drawflow: '/drawflowTest.html'
  }

  return (
    <div className='row'>{
      Object.entries(links).map(([linktext, linkherf]) => (
        <CustomAnchor key={`anchor-${linktext}`} link={linkherf} text={linktext}/>
      ))
    }</div>
  )
}

const root = createRoot(document.getElementById('wrapper'));
root.render(<ComponentRoot />);

setupCounter(document.querySelector('#counter'))
