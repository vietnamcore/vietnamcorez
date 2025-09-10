import React, { useEffect, useState } from 'react';
import Toggle from './components/Toggle';
import Slider from './components/Slider';
import clsx from 'clsx';

const DEFAULT = {
  unlockToggle: true,
  nheTam: false,
  sensiTouch: true,
  cursor: 0.01,
  look: 0.01,
  drag: 0.01,
  touch: 0.01
};

const PRESETS = {
  'Mặc định': DEFAULT,
  'Galaxy VIP': { unlockToggle:true, nheTam:true, sensiTouch:true, cursor:0.6, look:0.8, drag:0.5, touch:0.7 },
  'Siêu Nhanh': { unlockToggle:true, nheTam:false, sensiTouch:true, cursor:1.6, look:1.7, drag:1.4, touch:1.5 }
};

export default function App(){
  const [state, setState] = useState(DEFAULT);
  const [theme, setTheme] = useState('galaxy');

  useEffect(()=>{
    const raw = localStorage.getItem('ff_ui_state');
    if(raw){
      try{ setState(JSON.parse(raw)); } catch(e){ setState(DEFAULT); }
    }
  }, []);

  useEffect(()=> localStorage.setItem('ff_ui_state', JSON.stringify(state)), [state]);

  const update = (k, v) => setState(prev => ({...prev, [k]: v}));

  const saveToFile = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `menu-settings-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  const importFromFile = (file) => {
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target.result);
        setState({...DEFAULT, ...parsed});
        alert('Đã nhập cấu hình.');
      } catch(e){ alert('File JSON không hợp lệ'); }
    };
    reader.readAsText(file);
  };

  const applyPreset = (name) => {
    const p = PRESETS[name];
    if(p) { setState(p); alert(`Áp dụng preset: ${name}`); }
  };

  const reset = () => {
    if(window.confirm('Reset về mặc định?')) {
      setState(DEFAULT); localStorage.removeItem('ff_ui_state');
    }
  };

  return (
    <div className={clsx('app', theme)}>
      <header className="top">
        <div className="left">
          <div className="time">11:11 ♥</div>
          <div className="title">Unlock Trợ Năng</div>
          <div className="subtitle">Hoạt Động iOS 15 - 18.6</div>
        </div>
        <div className="right">
          <div className="theme-switch">
            <button onClick={()=>setTheme(theme==='galaxy'?'clean':'galaxy')} className="small-btn">
              Theme: {theme==='galaxy'?'Galaxy':'Clean'}
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        <section className="card">
          <div className="row">
            <div>
              <div className="h">Unlock Trợ Năng</div>
              <div className="muted">Hoạt Động iOS 15 - 18.6</div>
            </div>
            <Toggle checked={state.unlockToggle} onChange={v=>update('unlockToggle', v)} />
          </div>

          <div className="row small">
            <div>
              <div className="h">Nhẹ Tâm</div>
            </div>
            <Toggle checked={state.nheTam} onChange={v=>update('nheTam', v)} />
          </div>

          <div className="row small">
            <div>
              <div className="h">Sensi Touch</div>
            </div>
            <Toggle checked={state.sensiTouch} onChange={v=>update('sensiTouch', v)} />
          </div>
        </section>

        <section className="card">
          <div className="card-title">Độ Nhạy</div>
          <Slider label="Tốc Độ Con Trỏ" min={0.01} max={2} step={0.01} value={state.cursor} onChange={v=>update('cursor', v)} />
          <Slider label="Nhìn Xung Quanh" min={0.01} max={2} step={0.01} value={state.look} onChange={v=>update('look', v)} />
          <Slider label="Độ Nhạy Drag" min={0.01} max={2} step={0.01} value={state.drag} onChange={v=>update('drag', v)} />
          <Slider label="Tốc Độ Cảm Ứng" min={0.01} max={2} step={0.01} value={state.touch} onChange={v=>update('touch', v)} />
        </section>

        <section className="card actions">
          <div className="buttons">
            <button className="btn primary" onClick={()=>{ localStorage.setItem('ff_ui_state', JSON.stringify(state)); alert('Đã lưu cài đặt.'); }}>Lưu Cài Đặt</button>
            <button className="btn" onClick={saveToFile}>Xuất JSON</button>
            <label className="btn file">
              Nhập JSON
              <input type="file" accept=".json,application/json" style={{display:'none'}} onChange={e=>importFromFile(e.target.files[0])} />
            </label>
          </div>

          <div className="preset-row">
            <select className="select" defaultValue="" onChange={e=>applyPreset(e.target.value)}>
              <option value="">— Chọn preset —</option>
              {Object.keys(PRESETS).map(k=> <option key={k} value={k}>{k}</option>)}
            </select>
            <button className="btn outline" onClick={reset}>Reset</button>
          </div>
        </section>
      </main>

      <footer className="footer">Demo UI — Chỉ dùng làm giao diện • iosclub.rf.gd</footer>
    </div>
  );
}
