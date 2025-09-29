import React, { useEffect, useRef, useState } from 'react'
import { suggest } from '../api/search'

export default function SearchBar({ placeholder='Search…', onSearch }){
  const [q, setQ] = useState('')
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const box = useRef(null)
  useEffect(()=>{
    const id = setTimeout(async ()=>{
      if (!q) { setItems([]); return }
      try{
        const s = await suggest(q)
        const flat = [
          ...s.tickets.map(v=>({ group:'Tickets', value:v })),
          ...s.areas.map(v=>({ group:'Areas', value:v })),
          ...s.projects.map(v=>({ group:'Projects', value:v })),
          ...s.inspectors.map(v=>({ group:'Inspectors', value:v }))
        ]
        setItems(flat.slice(0,8)); setOpen(true)
      }catch{ /* ignore */ }
    }, 200)
    return ()=>clearTimeout(id)
  },[q])

  useEffect(()=>{
    const onDoc = (e)=>{ if (box.current && !box.current.contains(e.target)) setOpen(false) }
    document.addEventListener('click', onDoc)
    return ()=>document.removeEventListener('click', onDoc)
  },[])

  const choose = (v)=>{ setQ(v); setOpen(false); onSearch && onSearch(v) }
  const submit = (e)=>{ e.preventDefault(); onSearch && onSearch(q) }

  return (
    <form className="position-relative" ref={box} onSubmit={submit} style={{minWidth:260}}>
      <input className="form-control" value={q} onChange={e=>setQ(e.target.value)} placeholder={placeholder} />
      {open && items.length>0 &&
        <div className="position-absolute bg-white border rounded shadow-sm w-100 mt-1" style={{zIndex:1000, maxHeight:220, overflowY:'auto'}}>
          {items.map((it,i)=>(
            <div key={i} className="px-2 py-1 hover-bg-light" onClick={()=>choose(it.value)}>
              <span className="badge text-bg-light me-2">{it.group}</span>{it.value}
            </div>
          ))}
        </div>
      }
    </form>
  )
}
