
menuCallBack = (e)=>{
    menu.classList.toggle("open")
    console.debug()
}

menu = document.querySelector('.burger-menu')
menu.addEventListener('click',menuCallBack)