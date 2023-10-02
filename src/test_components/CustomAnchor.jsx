import React from 'react';

function CustomAnchor(props) {
  const { link, text } = { ...props }
  console.log(`go to ${link}`)

  return (
    <div className='col-12'>
      <a href={link}>{text}</a>
    </div>
  );
}

export default CustomAnchor;
