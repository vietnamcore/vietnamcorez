import React from 'react';
export default function Toggle({checked=false, onChange}){
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={e=>onChange(e.target.checked)} />
      <span className="slider" />
    </label>
  );
}
