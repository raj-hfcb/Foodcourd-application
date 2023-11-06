     
let buttonsElements=[];
let cart=[];
const cartItems=document.querySelector('.cart-items')
const cartOverlay = document.querySelector(".cart-overlay");
const cartWindowClose = document.querySelector(".btn-close-cart");
const clearCartBtn = document.querySelector(".btn-clear-cart");

const cartContent = document.querySelector(".cart-content");


//to get data from server and store into local storage when the page load 

document.addEventListener('DOMContentLoaded',()=>{
    fetch("https://www.app.tutorjoes.in/mobile/getAllFood").then(data=>data.json()).then((data)=>{localStorage.setItem("products",JSON.stringify(data.items)) } ).then(()=>{
        let products=JSON.parse(localStorage.getItem("products"))
       loadLatestProducts(products);
    //    console.log(products);
    })
    const navbar_container=document.querySelector(".navbar")

    //Menubar coding
navbar_container.addEventListener("click",
    (event)=>{
        if(event.target.classList.contains("menu")){
        let selectedMenu=event.target.id

        let products=JSON.parse(localStorage.getItem('products'))
        
            if(selectedMenu=="Latest")
            {
                loadLatestProducts(products)
            }
            else if(selectedMenu=="Favourite"){
                loadFavProducts(products)
            }
            else 
            {
                loadProductsByType(products,selectedMenu)
            }
        }
    }
)
//favitem choose
const product_Container=document.querySelector('.product-container')

product_Container.addEventListener("click",
    (event)=>{
        if(event.target.classList.contains('heart'))
        {
            let selectButton=event.target
            // console.log(selectButton.id);

            if(selectButton.classList.contains('active'))
            {
                selectButton.classList.remove('active')
                // console.log('remove favourite');
                removeFav(selectButton.id)
            }
            else{
                addFav(selectButton.id)
                selectButton.classList.add('active')
            
                // console.log('add fav');
            }
        }
        else if(event.target.classList.contains('addbtn'))
        {

            addcartbtn=event.target
            // console.log(addcartbtn.id);
        }
    }   
)
})
function loadLatestProducts(products)
{
    let latestProducts=products.filter(product=>product.LATEST=='Yes')
    loadProducts(latestProducts,"Latest Products")
}
function loadProductsByType(products,type)
{
    let selectedProducts=products.filter(product=>product.FTYPE==type)
    loadProducts(selectedProducts,type)
}
function loadFavProducts(products)
{
    let favids=getFavLocal()
    let favProducts=products.filter(item=>{
        if(favids.includes(JSON.stringify(item.ID)))
        {
            return item.ID
        }
       
    })
    loadProducts(favProducts,"Favourite")
}

function loadProducts(products,title)
{

    // console.log(products)
    let cardbox=""
    products.map((item)=>{
        cardbox+=`
              <div class="card box" >
                        
                        <img src="https://www.app.tutorjoes.in/img/food/${item.PIC}" class="card-img-top" alt="" style="height: 100px;">
                        <div class="card-body text-center p-1" >
                            <h4 class=" m-0" style="font-size: smaller;">${item.NAME}</h4>
                            <h4 class=" m-0" style="font-size: smaller;">${item.SHOP}</h4>
                        </div>
                        <div class="card-footer  d-flex justify-content-between p-0 " style="font-size: small;background-color: navy;">
                            <span style="color: aliceblue;">${item.FTYPE} </span>
                            <span style="color: orange;">Rs.${item.AMT}</span>
                        </div>
                        <div class="card-img-overlay">
                            <div class="shopicon">
                            <button class="  btn-sm addbtn" id=${item.ID}  style="border: none;" ><i class="bi bi-cart4 "></i>Add To Cart</button>
                        </div>
                            <span class=" heart bi bi-heart-fill" id=${item.ID}></span>
                        </div>                      
                     
                </div>`

    })
    // product cart
    let btnAddCArt=document.querySelectorAll('addbtn')

    const productContainer=document.getElementById('product-container')
    const foodTitle=document.querySelector('.food-title')
    foodTitle.innerHTML=title
    productContainer.innerHTML=cardbox
       
}

//Favourite item actions
function getFavLocal()
{
    const favIds=JSON.parse(localStorage.getItem('fav-ids'))
    return favIds===null?[]:favIds
}

function addFav(id)
{
    const fids=getFavLocal()
    if(fids.indexOf(id)!==-1)
    {
        alert('Already added')
    }
    else{
        localStorage.setItem('fav-ids',JSON.stringify([...fids,id]))
    }
}

function removeFav(fid)
{
    const fids=getFavLocal()
    localStorage.setItem('fav-ids',JSON.stringify(fids.filter(id=>id!==fid)))
}

//cart Action
function cartAction() {
    let buttons = [...document.querySelectorAll(".btn-item")];
    buttonsElements = buttons;
    //console.log(buttonsElements);
    buttons.forEach(button => {
      let id = button.id;
      //console.log(id);
      let inCart = cart.find(item => item.ID === id);
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }

      button.addEventListener("click", event => {
        // disable button
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        // add to cart
        let cartItem = { ...getProductById(id), QTY: 1 };
        cart = [...cart, cartItem];
        saveCart(cart);
        setCartValues(cart);
        addCartItem(cartItem);
        showCart();
      });

    });
  }

  function setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map(item => {
      tempTotal += item.AMT * item.QTY;
      itemsTotal += item.QTY;
    });

    const cartItems = document.querySelector(".cart-items");
    const cartTotal = document.querySelector(".cart-total");

    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
  }


  function addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<!-- cart item -->
            <!-- item image -->
            <img src=https://www.app.tutorjoes.in/img/food/${item.PIC} alt="product" />
            <!-- item info -->
            <div>
              <h4>${item.NAME}</h4>
              <h5>Rs.${item.AMT}</h5>
              <span class="remove-item" data-id=${item.ID}>remove</span>
            </div>
            <!-- item functionality -->
            <div>
                <i class="fa fa-plus" data-id=${item.ID}></i>
              <p class="item-amount">
                ${item.QTY}
              </p>
                <i class="fa fa-minus" data-id=${item.ID}></i>
            </div>
          <!-- cart item -->
    `;
    cartContent.appendChild(div);
  }

 function showCart() {
    cartOverlay.classList.add("cart-overlay-show");
  }

  function init() {
    clearCartBtn.addEventListener("click", () => {
      clearCart();
    });

    cartItems.addEventListener('click', () => {
      cartOverlay.classList.add("cart-overlay-show");
    });

    cartWindowClose.addEventListener('click', () => {
      cartOverlay.classList.remove("cart-overlay-show");
    });

    cartContent.addEventListener("click", event => {
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cartContent.removeChild(removeItem.parentElement.parentElement);
        // remove item
        removeItem(id);
      } else if (event.target.classList.contains("bi-plus")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find(item => item.ID === id);
        tempItem.QTY = tempItem.QTY + 1;
        saveCart(cart);
        setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.QTY;
      } else if (event.target.classList.contains("bi-dash")) {
        let lowerAmount = event.target;
        let id = lowerAmount.id;
        let tempItem = cart.find(item => item.ID === id);
        tempItem.QTY = tempItem.QTY - 1;
        if (tempItem.QTY > 0) {
          saveCart(cart);
          setCartValues(cart);
          lowerAmount.previousElementSibling.innerText = tempItem.QTY;
        } else {
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          removeItem(id);
        }
      }
    });

  }

 function clearCart() {
    // console.log(this);
    let cartItems = cart.map(item => item.ID);
    //console.log(cartItems);
    cartItems.forEach(ID => this.removeItem(ID));
    //console.log(cartContent.children.length);
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    cartOverlay.classList.remove("cart-overlay-show");
  }


  function removeItem(id) {
    cart = cart.filter(item => item.ID !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fa fa-shopping-cart"></i> Add To Cart`;

  }
  function getSingleButton(id) {
    return buttonsElements.find(button => button.dataset.id === id);
  }

