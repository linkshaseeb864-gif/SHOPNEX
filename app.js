
const DEFAULT_PRODUCTS = [
  {id:"1",name:"Classic Leather Sneakers",category:"Shoes",price:3499,image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=80",tag:"Trending",desc:"Clean everyday sneakers."},
  {id:"2",name:"Signature Oud Perfume",category:"Perfumes",price:4299,image:"https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=700&q=80",tag:"Best Seller",desc:"Warm, elegant fragrance."},
  {id:"3",name:"Minimal Steel Watch",category:"Watches",price:5499,image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=700&q=80",tag:"New In",desc:"Minimal everyday timepiece."},
  {id:"4",name:"Premium Leather Wallet",category:"Wallets",price:2499,image:"https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=700&q=80",tag:"New In",desc:"Slim everyday wallet."},
  {id:"5",name:"Everyday Cotton Shirt",category:"Clothing",price:2199,image:"https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=700&q=80",tag:"Trending",desc:"Easy everyday comfort."},
  {id:"6",name:"Classic Sunglasses",category:"Accessories",price:1899,image:"https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=700&q=80",tag:"Trending",desc:"Classic everyday shades."},
  {id:"7",name:"Soft Home Bedsheet Set",category:"Home",price:2999,image:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=700&q=80",tag:"New In",desc:"Soft and comfortable home essential."},
  {id:"8",name:"Premium Casual Loafers",category:"Shoes",price:3899,image:"https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=700&q=80",tag:"Best Seller",desc:"Smart casual loafers."}
];
const money=n=>"Rs. "+Number(n).toLocaleString("en-PK");
function getProducts(){
  const saved=JSON.parse(localStorage.getItem("shopnexProducts")||"null");
  if(!saved){localStorage.setItem("shopnexProducts",JSON.stringify(DEFAULT_PRODUCTS));return DEFAULT_PRODUCTS}
  return saved;
}
const products=getProducts();
function cart(){return JSON.parse(localStorage.getItem("shopnexCart")||"[]")}
function render(){
  const g=document.querySelector("#products");
  if(g){
    const cat=new URLSearchParams(location.search).get("cat");
    const list=cat?products.filter(p=>p.category.toLowerCase()===cat.toLowerCase() ||
      (cat==="Men"&&["Shoes","Watches","Wallets"].includes(p.category)) ||
      (cat==="Women"&&["Perfumes","Clothing","Accessories"].includes(p.category))):products;
    g.innerHTML=list.map(p=>`<article class="product"><div class="pimg" style="background-image:url('${p.image}')"></div><div class="pbody"><small>${p.category}</small><h3>${p.name}</h3><b>${money(p.price)}</b><button class="add" onclick="add('${p.id}')">Add to cart</button></div></article>`).join("");
    if(cat){const t=document.querySelector("#title"),b=document.querySelector("#crumb");if(t)t.textContent=cat;if(b)b.textContent=cat}
  }
  document.querySelectorAll("#cartCount").forEach(x=>x.textContent=cart().length);
  const s=document.querySelector("#summary");
  if(s){
    const c=cart();
    s.innerHTML=c.length?c.map(p=>`<div class="sum"><span>${p.name}</span><b>${money(p.price)}</b></div>`).join(""):"<p>Your cart is empty.</p>";
    const total=document.querySelector("#total"); if(total) total.textContent=money(c.reduce((a,p)=>a+Number(p.price),0));
  }
}
function add(id){const p=products.find(x=>x.id===id);if(!p)return;const c=cart();c.push(p);localStorage.setItem("shopnexCart",JSON.stringify(c));alert("Added to cart");render()}
render();

/* SHOPNEX: render the same catalog used by Admin */
(function(){
 const KEY="shopnexProducts";
 const get=()=>{try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch(e){return[]}};
 const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
 const money=n=>"PKR "+Number(n||0).toLocaleString();
 const render=()=>{
  const ps=get();
  document.querySelectorAll("[data-shopnex-products]").forEach(el=>{
   let list=ps, type=el.dataset.shopnexProducts;
   if(type==="trending")list=ps.filter(p=>p.tag==="Trending"||p.tag==="Best Seller");
   if(type==="new")list=ps.filter(p=>p.tag==="New In");
   if(type==="exclusive")list=ps.filter(p=>p.tag==="Exclusive");
   const cat=el.dataset.category;if(cat)list=list.filter(p=>String(p.category).toLowerCase()===cat.toLowerCase());
   el.innerHTML=list.length?list.map(p=>{
    const price=p.sale&&p.sale<p.price?p.sale:p.price;
    return `<article class="product-card"><a href="product.html?id=${encodeURIComponent(p.id)}"><img class="product-image" src="${esc(p.image||(p.images&&p.images[0])||"")}" alt="${esc(p.name)}"></a><div class="product-info"><small>${esc(p.category||"")}</small><h3>${esc(p.name)}</h3><b>${money(price)}</b><button class="add-to-cart" onclick="shopnexAddToCart('${esc(p.id)}');return false">Add to cart</button></div></article>`;
   }).join(""):`<div class="empty-products">No products added yet.</div>`;
  });
 };
 window.shopnexAddToCart=id=>{const p=get().find(x=>String(x.id)===String(id));if(!p)return;let c=[];try{c=JSON.parse(localStorage.getItem("shopnexCart")||"[]")}catch(e){};let x=c.find(y=>String(y.id)===String(id));if(x)x.qty=(x.qty||1)+1;else c.push({...p,qty:1});localStorage.setItem("shopnexCart",JSON.stringify(c));alert("Added to cart")};
 window.addEventListener("storage",render);document.addEventListener("DOMContentLoaded",render);setTimeout(render,50);
})();
