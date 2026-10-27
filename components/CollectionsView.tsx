"use client";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/data";
import { COLOUR_FAMILIES, familyForColour, isPrinted } from "@/lib/colour";
import ProductCard from "@/components/ProductCard";
type Props = { PRODUCTS: Product[]; CATS: string[]; OCC: string[]; initialCategory?: string; initialOccasion?: string; initialColour?: string; initialSize?: string; initialSort?: string };
export default function CollectionsView({ PRODUCTS, CATS, OCC, initialCategory="All", initialOccasion="Any", initialColour="Any", initialSize="Any", initialSort="featured" }: Props) {
 const [cat,setCat]=useState(initialCategory),[occ,setOcc]=useState(initialOccasion),[col,setCol]=useState(initialColour),[size,setSize]=useState(initialSize),[q,setQ]=useState(""),[sort,setSort]=useState(initialSort),[filters,setFilters]=useState(false);
 const families=useMemo(()=>COLOUR_FAMILIES.filter(f=>PRODUCTS.some(p=>p.variants.some(v=>f==="Prints"?isPrinted(v.colour+" "+p.name):familyForColour(v.colour,v.hex,p.name)===f))),[PRODUCTS]);
 let L=PRODUCTS.filter(p=>(cat==="All"||p.cat===cat)&&(occ==="Any"||p.occasion.includes(occ))&&(col==="Any"||p.variants.some(v=>col==="Prints"?isPrinted(v.colour+" "+p.name):col==="Solid"?!isPrinted(v.colour+" "+p.name):familyForColour(v.colour,v.hex,p.name)===col))&&(size==="Any"||p.sizes.includes(size))&&(p.name+p.variants.map(v=>v.colour).join()+p.fabric).toLowerCase().includes(q.toLowerCase()));
 const price=(p:Product)=>Math.min(...p.variants.map(v=>v.price||p.price));
 if(sort==="featured")L=[...L].sort((a,b)=>(b.featured?1:0)-(a.featured?1:0)); if(sort==="low")L=[...L].sort((a,b)=>price(a)-price(b)); if(sort==="high")L=[...L].sort((a,b)=>price(b)-price(a));
 return <div className="sec"><h1 className="st">Collections</h1><div className="tools"><input placeholder="Search by name, colour or fabric" value={q} onChange={e=>setQ(e.target.value)}/><select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></div>
 <div className="chips category-chips">{["All",...CATS].map(c=><button key={c} className={cat===c?"on":""} onClick={()=>setCat(c)}>{c}</button>)}</div>
 <button className="filter-toggle" aria-expanded={filters} onClick={()=>setFilters(!filters)}>Filters {filters?"-":"+"}</button><div className={`collection-filters ${filters?"show":""}`}>
 <div className="chips sm"><span>Occasion</span>{["Any",...OCC].map(c=><button key={c} className={occ===c?"on":""} onClick={()=>setOcc(c)}>{c}</button>)}</div>
 <div className="chips sm"><span>Colour</span>{["Any",...families.filter(f=>f!=="Prints"),"Solid",...(families.includes("Prints")?["Prints"]:[])].map(c=><button key={c} className={col===c?"on":""} onClick={()=>setCol(c)}>{c}</button>)}</div>
 <div className="chips sm"><span>Size</span>{["Any",...Array.from(new Set(PRODUCTS.flatMap(p=>p.sizes)))].map(c=><button key={c} className={size===c?"on":""} onClick={()=>setSize(c)}>{c}</button>)}</div></div>
 <p className="count">{L.length} {L.length===1?"piece":"pieces"}</p>{L.length?<div className="grid">{L.map(p=><ProductCard key={p.slug} p={p}/>)}</div>:<p className="empty">Nothing matches those filters. Clear the search or choose Any occasion.</p>}</div>;
}
