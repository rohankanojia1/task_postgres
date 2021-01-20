let reg_btn = document.getElementById('register')
let login_btn = document.getElementById('login')
let upload_btn = document.getElementById('file_upload')
let role_btn = document.getElementById('toggle_role')

let reg_form = document.getElementById('register_form')
let login_form = document.getElementById('login_form')
let upload_form = document.getElementById('upload_form')
let role_form = document.getElementById('role_form')

let reg_form_el = document.getElementById('reg_form_el')
let login_form_el = document.getElementById('login_form_el')
let upload_form_el = document.getElementById('upload_form_el')
let role_form_el = document.getElementById('role_form_el')

let form_action = '/register'

reg_btn.addEventListener('click',(e) => {
    e.preventDefault()
    form_action = '/register'
    reg_form.style.display = 'block'
    login_form.style.display = 'none'
    upload_form.style.display = 'none'
    role_form.style.display = 'none'
})

login_btn.addEventListener('click',(e) => {
    e.preventDefault()
    form_action = '/login'
    reg_form.style.display = 'none'
    login_form.style.display = 'block'
    upload_form.style.display = 'none'
    role_form.style.display = 'none'
})

upload_btn.addEventListener('click',(e) => {
    e.preventDefault()
    form_action = '/upload'
    reg_form.style.display = 'none'
    login_form.style.display = 'none'
    upload_form.style.display = 'block'
    role_form.style.display = 'none'
})

role_btn.addEventListener('click',async (e) => {
    e.preventDefault()
    let users = await fetchUsers()
    deleteChild()
    await createUsersEl(users)
    form_action = '/toggle/active'
    reg_form.style.display = 'none'
    login_form.style.display = 'none'
    upload_form.style.display = 'none'
    role_form.style.display = 'block'
})

reg_form_el.onsubmit = async (e) => {
    e.preventDefault()
    document.cookie = ''
    let response = await fetch(form_action,{
        method: 'POST',
        body: new FormData(reg_form_el)
    })
    let result = await response.json()
    if(result.error) alert(result.error)
    else{
        alert(result.msg)
    }    
}
login_form_el.onsubmit = async (e) => {
    e.preventDefault()
    document.cookie = ''
    let response = await fetch(form_action,{
        method: 'POST',
        body: new FormData(login_form_el)
    })
    let result = await response.json()
    if(result.error) alert(result.error)
    else{
        alert(result.msg)
    } 
}
upload_form_el.onsubmit = async (e) => {
    e.preventDefault()
    let response = await fetch(form_action,{
        method: 'POST',
        body: new FormData(upload_form_el)
    })
    let result = await response.json()
    if(result.error) alert(result.error)
    else{
        alert(result.msg)
    } 
}

role_form_el.onsubmit = async (e) => {
    e.preventDefault()
    let response = await fetch(form_action,{
        method: 'POST',
        body: new FormData(role_form_el)
    })
    let result = await response.json()
    if(result.error) alert(result.error)
    else{
        alert(result.msg)
    } 
}

async function fetchUsers(){
    let users = await fetch('/users')
    users = await users.json()
    return users
}

async function createUsersEl(users){
    let select = document.getElementById('user_list')
    users.forEach(user => {
        let user_el = document.createElement('option')
        user_el.value = user.email
        user_el.innerHTML = user.name
        select.appendChild(user_el)
    })
}

function deleteChild() { 
    let select = document.getElementById('user_list')
    var child = select.lastElementChild;  
    while (child) { 
        select.removeChild(child); 
        child = select.lastElementChild; 
    } 
}